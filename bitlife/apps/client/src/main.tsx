import { render } from 'preact';
import '@fontsource-variable/fredoka';
import '@fontsource-variable/nunito';
import '@fontsource/opendyslexic/400.css';
import './styles.css';
import { Stage } from './three/stage.ts';
import { setStage, syncStage, getStage } from './game.ts';
import * as ctl from './game.ts';
import { App } from './ui/App.tsx';
import { applyDomSettings } from './ui/Modals.tsx';
import { settings, life, screen, rev } from './state.ts';
import { setVolumes } from './audio.ts';
import * as sim from '@bl/sim';
import { content } from '@bl/data';

const canvas = document.getElementById('stage') as HTMLCanvasElement;
const params = new URLSearchParams(location.search);
const s = settings.value;
const stage = new Stage(canvas);
const q = (params.get('q') as typeof s.quality) ?? s.quality;
stage.setQuality(q);
stage.reducedMotion = s.reducedMotion;
setStage(stage);
applyDomSettings(s);
setVolumes(s.music, s.sfx);

render(<App />, document.getElementById('app')!);
syncStage();

// ?shot: paused loop driven by tests (software GL is slow); otherwise run normally
if (!params.has('shot')) stage.start();

// Debug / test handle
(window as unknown as Record<string, unknown>).game = { stage: getStage(), life, screen, rev, sim, content, ctl, paused: params.has('shot') };
