import * as THREE from 'three';
import { Sky } from './Sky';
import { G } from './materials/common';
import { clamp, smoothstep, lerp } from '@taxi/shared';

export type WeatherKind = 'clear' | 'cloudy' | 'rain' | 'storm' | 'fog';

export interface WeatherState {
  kind: WeatherKind;
  cloud: number; // 0..1
  rain: number; // 0..1 precipitation
  fog: number; // 0..1
  wind: number; // m/s
}

const WEATHER_TARGETS: Record<WeatherKind, Omit<WeatherState, 'kind'>> = {
  clear: { cloud: 0.12, rain: 0, fog: 0.05, wind: 2 },
  cloudy: { cloud: 0.7, rain: 0, fog: 0.15, wind: 4 },
  rain: { cloud: 0.92, rain: 0.65, fog: 0.35, wind: 5 },
  storm: { cloud: 1, rain: 1, fog: 0.5, wind: 9 },
  fog: { cloud: 0.5, rain: 0, fog: 1, wind: 1 },
};

/**
 * Time of day (real Paris sun path), weather, lighting, fog, exposure, and environment-map baking.
 */
export class Environment {
  readonly sky = new Sky();
  readonly sun = new THREE.DirectionalLight(0xffffff, 3);
  readonly hemi = new THREE.HemisphereLight(0xb8c8e0, 0x3a3530, 0.3);
  /** Hours 0..24 local clock. */
  time = 19.2;
  /** Real seconds per game hour. */
  secondsPerHour = 60;
  timeScale = 1;
  dayOfYear = 263; // late September
  latitude = 48.8566;
  longitude = 2.3522;
  utcOffset = 2;
  readonly weather: WeatherState = { kind: 'clear', ...WEATHER_TARGETS.clear };
  private targetWeather: WeatherKind = 'clear';
  wetness = 0;
  puddles = 0;
  exposure = 1;
  night = 0;
  readonly sunDir = new THREE.Vector3();
  readonly moonDir = new THREE.Vector3();
  readonly fog: THREE.FogExp2;
  private envScene = new THREE.Scene();
  private cubeRT: THREE.WebGLCubeRenderTarget;
  private cubeCam: THREE.CubeCamera;
  private pmrem: THREE.PMREMGenerator;
  private envRT: THREE.WebGLRenderTarget | null = null;
  private lastEnvSun = new THREE.Vector3(9, 9, 9);
  private lastEnvCloud = -1;
  private envTimer = 0;
  lightning = 0;
  private lightningTimer = 8;
  onThunder: ((delay: number, intensity: number) => void) | null = null;

  constructor(private renderer: THREE.WebGLRenderer, private scene: THREE.Scene) {
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera as THREE.OrthographicCamera;
    sc.left = -90; sc.right = 90; sc.top = 90; sc.bottom = -90; sc.near = 1; sc.far = 900;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.6;
    this.sun.shadow.radius = 2;
    scene.add(this.sun, this.sun.target, this.hemi);
    scene.add(this.sky.mesh);
    this.fog = new THREE.FogExp2(0x8899aa, 0.0012);
    scene.fog = this.fog;
    const skyClone = new THREE.Mesh(this.sky.mesh.geometry, this.sky.mesh.material);
    skyClone.scale.setScalar(100);
    this.envScene.add(skyClone);
    this.cubeRT = new THREE.WebGLCubeRenderTarget(128, { type: THREE.HalfFloatType });
    this.cubeCam = new THREE.CubeCamera(0.1, 1000, this.cubeRT);
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.pmrem.compileCubemapShader();
  }

  setWeather(kind: WeatherKind, immediate = false): void {
    this.targetWeather = kind;
    this.weather.kind = kind;
    if (immediate) {
      Object.assign(this.weather, WEATHER_TARGETS[kind]);
      if (kind === 'rain' || kind === 'storm') { this.wetness = 1; this.puddles = 0.8; }
    }
  }

  /** Sun direction from date/time/latitude (NOAA-like approximation). */
  private computeSun(): void {
    const decl = (23.44 * Math.PI / 180) * Math.sin((2 * Math.PI * (284 + this.dayOfYear)) / 365);
    const B = (2 * Math.PI * (this.dayOfYear - 81)) / 364;
    const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // minutes
    const solarTime = this.time - this.utcOffset + this.longitude / 15 + eot / 60;
    const H = ((solarTime - 12) * 15 * Math.PI) / 180;
    const lat = (this.latitude * Math.PI) / 180;
    const sinEl = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(H);
    const el = Math.asin(sinEl);
    const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(lat) - Math.tan(decl) * Math.cos(lat)); // from south, + west
    // world: x east, z south, y up. azimuth from south towards west -> direction to sun
    const ce = Math.cos(el);
    this.sunDir.set(-Math.sin(az) * ce, sinEl, Math.cos(az) * ce).normalize();
    // moon: roughly opposite, a bit higher (no lunar ephemeris yet)
    const mh = H + Math.PI * 0.92;
    const mSin = Math.sin(lat) * Math.sin(-decl * 0.6) + Math.cos(lat) * Math.cos(-decl * 0.6) * Math.cos(mh);
    const mel = Math.asin(mSin);
    const maz = Math.atan2(Math.sin(mh), Math.cos(mh) * Math.sin(lat) - Math.tan(-decl * 0.6) * Math.cos(lat));
    this.moonDir.set(-Math.sin(maz) * Math.cos(mel), mSin, Math.cos(maz) * Math.cos(mel)).normalize();
  }

  update(dt: number, focus: THREE.Vector3, camera: THREE.Camera): void {
    this.time = (this.time + (dt * this.timeScale) / this.secondsPerHour) % 24;
    this.computeSun();
    // weather easing
    const tw = WEATHER_TARGETS[this.targetWeather];
    const k = 1 - Math.exp(-dt * 0.08);
    this.weather.cloud = lerp(this.weather.cloud, tw.cloud, k);
    this.weather.rain = lerp(this.weather.rain, tw.rain, this.weather.rain < tw.rain ? k * 0.8 : k * 1.5);
    this.weather.fog = lerp(this.weather.fog, tw.fog, k);
    this.weather.wind = lerp(this.weather.wind, tw.wind, k);
    // wetness accumulates with rain, dries slowly
    const r = this.weather.rain;
    this.wetness = clamp(this.wetness + (r > 0.05 ? dt * 0.03 * (0.3 + r) : -dt * 0.004 * (1 + Math.max(0, this.sunDir.y) * 3)), 0, 1);
    this.puddles = clamp(this.puddles + (r > 0.2 ? dt * 0.008 * r : -dt * 0.002), 0, 1);

    const sh = this.sunDir.y;
    const day = smoothstep(-0.08, 0.25, sh);
    this.night = 1 - smoothstep(-0.14, 0.04, sh);
    const cloud = this.weather.cloud;
    // sun light: colour from elevation, intensity attenuated by clouds
    const warm = 1 - smoothstep(0.0, 0.35, sh);
    const sunCol = new THREE.Color().setRGB(1.0, lerp(0.96, 0.62, warm), lerp(0.9, 0.38, warm));
    const sunI = 3.2 * smoothstep(-0.02, 0.12, sh) * (1 - cloud * 0.82);
    const moonI = 0.12 * smoothstep(0.0, 0.2, this.moonDir.y) * this.night * (1 - cloud * 0.7);
    const useSun = sunI > moonI;
    const L = useSun ? this.sunDir : this.moonDir;
    this.sun.color.copy(useSun ? sunCol : new THREE.Color(0.6, 0.7, 1.0));
    this.sun.intensity = Math.max(sunI, moonI);
    this.sun.castShadow = this.sun.intensity > 0.05;
    // shadow camera follows the focus, snapped to texels for stability
    const sc = this.sun.shadow.camera as THREE.OrthographicCamera;
    const texel = (sc.right - sc.left) / this.sun.shadow.mapSize.x;
    const fx = Math.round(focus.x / texel) * texel, fz = Math.round(focus.z / texel) * texel;
    this.sun.target.position.set(fx, focus.y, fz);
    this.sun.position.set(fx + L.x * 400, focus.y + Math.max(0.05, L.y) * 400, fz + L.z * 400);
    // hemisphere ambient (env map provides most ambient)
    this.hemi.intensity = lerp(0.05, 0.25, day) * (1 + cloud * 0.5);
    this.hemi.color.setRGB(lerp(0.25, 0.7, day), lerp(0.3, 0.8, day), lerp(0.45, 0.95, day));
    // fog
    const fogDensity = (0.00032 + this.weather.fog * 0.0026 + r * 0.0012) * (1 - this.night * 0.35);
    this.fog.density = fogDensity;
    const fogDay = new THREE.Color().setRGB(lerp(0.62, 0.55, cloud), lerp(0.7, 0.58, cloud), lerp(0.82, 0.62, cloud));
    const fogSet = new THREE.Color(0.95, 0.62, 0.42);
    const fogNight = new THREE.Color(0.018, 0.017, 0.02).lerp(new THREE.Color(0.06, 0.04, 0.025), 0.4);
    const fc = fogNight.clone().lerp(fogSet, smoothstep(-0.1, 0.02, sh) * (1 - smoothstep(0.05, 0.3, sh)) * (1 - cloud));
    fc.lerp(fogDay, day);
    this.fog.color.copy(fc).multiplyScalar(1);
    // sky uniforms
    const su = this.sky.uniforms;
    su.uSunDir.value.copy(this.sunDir);
    su.uMoonDir.value.copy(this.moonDir);
    su.uCloudCover.value = cloud;
    su.uCloudDark.value = smoothstep(0.6, 1.0, cloud) * (0.4 + r * 0.6);
    su.uNight.value = this.night;
    su.uFog.value = this.weather.fog;
    su.uSunVisible.value = 1 - smoothstep(0.75, 0.95, cloud);
    su.uTime.value += dt;
    this.sky.mesh.position.copy(camera.position);
    // lightning (storm)
    this.lightning = Math.max(0, this.lightning - dt * 6);
    if (this.weather.kind === 'storm' && this.weather.rain > 0.6) {
      this.lightningTimer -= dt;
      if (this.lightningTimer < 0) {
        this.lightning = 1;
        this.lightningTimer = 6 + Math.random() * 18;
        this.onThunder?.(0.5 + Math.random() * 3, 0.5 + Math.random() * 0.5);
      }
    }
    // exposure: brighter at night so the lamp-lit city reads well (eye adaptation)
    const targetExposure = lerp(2.6, 1.0, day) * (1 + cloud * 0.25 * day);
    this.exposure = lerp(this.exposure, targetExposure, 1 - Math.exp(-dt * 0.8));
    // global shader uniforms
    G.uWet.value = this.wetness;
    G.uPuddles.value = this.puddles * this.wetness;
    G.uNight.value = this.night;
    const hour = this.time;
    // fraction of lit windows by hour: evening peak, late night few, early morning some
    const lit = hour >= 17 || hour < 2 ? 0.55 - Math.max(0, (hour < 12 ? hour + 24 : hour) - 21.5) * 0.09 : hour < 6 ? 0.1 : hour < 8.5 ? 0.3 : 0.15;
    G.uWindowLit.value = clamp(lit, 0.05, 0.6);
    G.uShopLit.value = (hour >= 7 && hour < 22.5) ? 1 : hour >= 22.5 || hour < 1.5 ? 0.35 : 0.08;
    G.uLightGain.value = smoothstep(0.15, 0.75, this.night + cloud * 0.25 * (1 - day));
    // environment map refresh when the sky changed noticeably
    this.envTimer -= dt;
    if (this.envTimer <= 0 && (this.lastEnvSun.distanceTo(this.sunDir) > 0.01 || Math.abs(this.lastEnvCloud - cloud) > 0.04)) {
      this.envTimer = 1.5;
      this.bakeEnv();
    }
    this.scene.environmentIntensity = lerp(0.35, 0.6, day) * (1 + cloud * 0.35) + this.lightning * 2;
  }

  bakeEnv(): void {
    this.lastEnvSun.copy(this.sunDir);
    this.lastEnvCloud = this.weather.cloud;
    this.sky.uniforms.uEnvPass.value = 1;
    this.cubeCam.update(this.renderer, this.envScene);
    this.sky.uniforms.uEnvPass.value = 0;
    const rt = this.pmrem.fromCubemap(this.cubeRT.texture);
    if (this.envRT) this.envRT.dispose();
    this.envRT = rt;
    this.scene.environment = rt.texture;
  }

  /** Human readable clock. */
  clock(): string {
    const h = Math.floor(this.time), m = Math.floor((this.time - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
}
