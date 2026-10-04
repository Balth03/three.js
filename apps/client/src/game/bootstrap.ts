import * as THREE from 'three';
import { Renderer, type Quality } from '../render/Renderer';
import { Environment, type WeatherKind } from '../render/Environment';
import { LightField } from '../render/LightField';
import { G } from '../render/materials/common';
import { Physics } from '../physics/Physics';
import { City, WorldStreamer } from '../world/World';
import { Game } from './Game';
import { LoadingScreen } from '../ui/LoadingScreen';

export interface LaunchParams {
  city: string;
  quality: Quality;
  time: number | null;
  weather: WeatherKind | null;
  cam: number[] | null; // debug free camera x,y,z,yaw,pitch
  noCar: boolean;
  screenshot: boolean;
}

function parseParams(): LaunchParams {
  const p = new URLSearchParams(location.search);
  const num = (k: string) => (p.has(k) ? Number(p.get(k)) : null);
  return {
    city: p.get('city') ?? 'paris',
    quality: (p.get('q') as Quality) ?? (localStorage.getItem('taxi.quality') as Quality | null) ?? 'high',
    time: num('time'),
    weather: (p.get('weather') as WeatherKind) ?? null,
    cam: p.has('cam') ? p.get('cam')!.split(',').map(Number) : null,
    noCar: p.has('nocar'),
    screenshot: p.has('shot'),
  };
}

export async function bootstrap(): Promise<void> {
  const params = parseParams();
  const loading = new LoadingScreen(document.getElementById('ui')!);
  loading.set(0, 'Initialisation');
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const renderer = new Renderer(canvas, params.quality);
  const physics = await Physics.create();
  const city = await City.load(params.city, (p, l) => loading.set(p * 0.7, l));
  renderer.setGrade(city.config.id);
  const env = new Environment(renderer.renderer, renderer.scene);
  if (params.time !== null) env.time = params.time;
  if (params.weather) env.setWeather(params.weather, true);
  const lightField = new LightField(640, 1024);
  const world = new WorldStreamer(city, physics, renderer.quality.shadows);
  world.radius = renderer.quality.viewDistance;
  world.instances.treeDetailDistance = renderer.quality.treeDetailDistance;
  renderer.scene.add(world.group);
  physics.groundFallback = (x, z) => city.terrain.height(x, z);
  world.onTileLoaded = () => lightField.markLampsDirty();
  world.onTileUnloaded = () => lightField.markLampsDirty();
  const game = new Game({ renderer, env, physics, city, world, lightField, params, loading });
  (window as unknown as { game: Game }).game = game;
  void G; void THREE;
  await game.start();
}
