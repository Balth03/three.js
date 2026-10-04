import * as THREE from 'three';
import { NOISE_GLSL } from './materials/common';

/**
 * Procedural sky dome: day scattering gradient driven by sun elevation (golden hour, blue hour), sun disc + Mie glow,
 * moon, stars, a procedural cloud layer, city light pollution at night. Also used to bake the environment map.
 */
export class Sky {
  readonly mesh: THREE.Mesh;
  readonly uniforms = {
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
    uMoonDir: { value: new THREE.Vector3(0, -1, 0) },
    uCloudCover: { value: 0.35 },
    uCloudDark: { value: 0 },
    uTime: { value: 0 },
    uNight: { value: 0 },
    uFog: { value: 0 }, // haze
    uCityGlow: { value: new THREE.Color(0.9, 0.5, 0.25) },
    uSunVisible: { value: 1 },
    uGround: { value: new THREE.Color(0.08, 0.075, 0.07) },
    uEnvPass: { value: 0 },
  };

  constructor() {
    const geo = new THREE.SphereGeometry(1, 48, 24);
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main(){
          vDir = normalize(position);
          vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_Position = p.xyww;
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vDir;
        uniform vec3 uSunDir; uniform vec3 uMoonDir; uniform float uCloudCover; uniform float uCloudDark; uniform float uTime;
        uniform float uNight; uniform float uFog; uniform vec3 uCityGlow; uniform float uSunVisible; uniform vec3 uGround; uniform float uEnvPass;
        ${NOISE_GLSL}
        vec3 skyBase(vec3 d){
          float sh = uSunDir.y;
          float up = max(d.y, 0.0);
          float mu = dot(d, uSunDir);
          // day palette
          vec3 dayZen = vec3(0.10, 0.25, 0.62), dayHor = vec3(0.55, 0.68, 0.85);
          // golden hour palette
          vec3 setZen = vec3(0.16, 0.20, 0.42), setHor = vec3(1.15, 0.52, 0.22);
          // blue hour / night
          vec3 bluZen = vec3(0.03, 0.05, 0.13), bluHor = vec3(0.16, 0.13, 0.20);
          vec3 nZen = vec3(0.004, 0.006, 0.014), nHor = vec3(0.025, 0.022, 0.03);
          float tDay = smoothstep(-0.02, 0.35, sh);
          float tSet = smoothstep(-0.12, 0.02, sh) * (1.0 - smoothstep(0.05, 0.35, sh));
          float tBlue = smoothstep(-0.25, -0.05, sh);
          vec3 zen = mix(nZen, bluZen, tBlue); vec3 hor = mix(nHor, bluHor, tBlue);
          zen = mix(zen, setZen, tSet); hor = mix(hor, setHor, tSet);
          zen = mix(zen, dayZen, tDay); hor = mix(hor, dayHor, tDay);
          // sunset colour concentrated towards the sun azimuth
          float towardSun = pow(max(0.0, dot(normalize(vec2(d.x, d.z) + 1e-5), normalize(vec2(uSunDir.x, uSunDir.z) + 1e-5))) , 2.0);
          hor = mix(hor, hor * vec3(0.55, 0.6, 0.9), tSet * (1.0 - towardSun) * 0.7);
          float g = pow(1.0 - up, 4.0);
          vec3 c = mix(zen, hor, g);
          // Mie halo around the sun
          float mie = pow(max(mu, 0.0), 8.0) * 0.35 + pow(max(mu, 0.0), 64.0) * 1.2;
          vec3 sunCol = mix(vec3(1.4, 0.55, 0.2), vec3(1.2, 1.1, 0.95), smoothstep(0.0, 0.4, sh));
          c += sunCol * mie * smoothstep(-0.1, 0.05, sh) * (1.0 - uCloudCover * 0.6);
          // city light pollution near horizon at night (warm sodium glow over Paris)
          c += uCityGlow * 0.06 * pow(1.0 - up, 6.0) * uNight;
          // haze
          c = mix(c, hor * 0.9 + 0.02, uFog * 0.7 * (1.0 - up * 0.5));
          return c;
        }
        void main(){
          vec3 d = normalize(vDir);
          vec3 col;
          if (d.y < -0.0) {
            // below horizon: city ground tone for reflections/IBL, blends into horizon
            vec3 h = skyBase(vec3(d.x, 0.0, d.z));
            col = mix(h, uGround * (0.3 + 0.7 * max(uSunDir.y, 0.0)) + h * 0.15, smoothstep(0.0, 0.15, -d.y));
          } else {
            col = skyBase(d);
            // stars
            if (uNight > 0.01) {
              vec3 sd = d * 300.0;
              vec3 cell = floor(sd);
              float st = h21(cell.xy + cell.z * 17.0);
              vec3 fr = fract(sd) - 0.5;
              float star = smoothstep(0.08, 0.0, length(fr)) * step(0.985, st) * (0.5 + 0.5 * sin(uTime * 2.0 + st * 100.0));
              col += vec3(0.8, 0.85, 1.0) * star * uNight * (1.0 - uCloudCover) * smoothstep(0.0, 0.3, d.y) * 1.5;
            }
            // sun disc
            float mu = dot(d, uSunDir);
            float disc = smoothstep(0.9997, 0.99985, mu);
            vec3 sunC = mix(vec3(18.0, 6.0, 2.0), vec3(30.0, 28.0, 24.0), smoothstep(0.0, 0.3, uSunDir.y));
            col += sunC * disc * uSunVisible * (1.0 - uEnvPass);
            // moon disc
            float mm = dot(d, uMoonDir);
            float moon = smoothstep(0.99955, 0.9997, mm);
            col += vec3(1.6, 1.6, 1.5) * moon * uNight * (1.0 - uEnvPass * 0.8);
            col += vec3(0.05, 0.06, 0.08) * pow(max(mm, 0.0), 200.0) * uNight;
            // clouds: plane projection
            if (d.y > 0.0 && uCloudCover > 0.01) {
              vec2 uv = d.xz / (d.y + 0.08) * 1.4;
              uv += vec2(uTime * 0.004, uTime * 0.0015);
              float n = fbm(uv * 1.2) * 0.65 + fbm(uv * 4.3 + 7.0) * 0.35;
              float cov = smoothstep(1.0 - uCloudCover * 0.95 - 0.1, 1.0 - uCloudCover * 0.95 + 0.25, n);
              float sh = uSunDir.y;
              vec3 lit = mix(vec3(0.02, 0.025, 0.035), vec3(1.0, 0.98, 0.95), smoothstep(-0.15, 0.25, sh));
              lit = mix(lit, vec3(1.3, 0.6, 0.35), smoothstep(-0.12, 0.0, sh) * (1.0 - smoothstep(0.02, 0.3, sh)));
              float thick = smoothstep(0.4, 1.0, n);
              vec3 cc = lit * (1.0 - thick * 0.55) * mix(1.0, 0.35, uCloudDark);
              float sunEdge = pow(max(dot(d, uSunDir), 0.0), 12.0) * (1.0 - thick);
              cc += vec3(1.2, 0.9, 0.6) * sunEdge * smoothstep(-0.1, 0.1, sh);
              cc += uCityGlow * 0.05 * uNight * (0.5 + thick);
              col = mix(col, cc, cov * smoothstep(0.0, 0.08, d.y));
            }
          }
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -1000;
    this.mesh.scale.setScalar(5000);
  }
}
