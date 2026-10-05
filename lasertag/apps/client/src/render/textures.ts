import * as THREE from 'three';

/**
 * Neon text as a 2-channel texture: R = crisp glyphs, G = soft glow. Shaders tint both.
 * `aspect` is width / height of the text block.
 */
export function makeTextTexture(text: string, _color: string, height = 128): { texture: THREE.Texture; aspect: number } {
  const font = `700 ${Math.round(height * 0.72)}px "Chakra Petch", "Rajdhani", system-ui, sans-serif`;
  const measure = document.createElement('canvas').getContext('2d')!;
  measure.font = font;
  const pad = height * 0.35;
  const w = Math.ceil(measure.measureText(text).width + pad * 2);
  const h = Math.ceil(height + pad);
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const g = cv.getContext('2d')!;
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
  g.font = font;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.globalCompositeOperation = 'lighter';
  // glow in green
  g.shadowColor = 'rgb(0,255,0)';
  g.shadowBlur = height * 0.28;
  g.fillStyle = 'rgb(0,160,0)';
  g.fillText(text, w / 2, h / 2);
  g.shadowBlur = 0;
  // crisp in red
  g.fillStyle = 'rgb(255,0,0)';
  g.fillText(text, w / 2, h / 2);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 4;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return { texture: tex, aspect: w / h };
}
