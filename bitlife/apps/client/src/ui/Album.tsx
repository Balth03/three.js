// Souvenir photo album (polaroids of the 3D diorama at key moments).
import { useState } from 'preact/hooks';
import type { Life } from '@bl/sim';
import { lang, modal } from '../state.ts';
import { loadAlbum, CAPTIONS, type Photo } from '../album.ts';
import { Sheet } from './common.tsx';

export function Album({ l }: { l: Life }) {
  const lg = lang.value;
  const photos = loadAlbum(l.id);
  const [big, setBig] = useState<Photo | null>(null);
  const cap = (p: Photo) => p.caption?.[lg] ?? CAPTIONS[p.kind]?.[lg] ?? p.kind;
  return (
    <Sheet title={lg === 'fr' ? 'Album souvenirs' : 'Photo album'} icon="📸" onClose={() => { modal.value = null; }} cls="wide">
      {!photos.length && <p class="muted center">{lg === 'fr' ? 'Pas encore de photos. Vis des trucs !' : 'No photos yet. Go live a little!'}</p>}
      <div class="album">
        {photos.map((p, i) => (
          <figure key={i} class="polaroid" style={{ transform: `rotate(${((i * 37) % 9) - 4}deg)` }} onClick={() => setBig(p)}>
            <img src={p.img} alt="" />
            <figcaption><b>{p.age} {lg === 'fr' ? 'ans' : 'y/o'}</b> · {cap(p)}</figcaption>
          </figure>
        ))}
      </div>
      {big && (
        <div class="album-big" onClick={() => setBig(null)}>
          <figure class="polaroid big"><img src={big.img} alt="" /><figcaption><b>{big.year} · {big.age} {lg === 'fr' ? 'ans' : 'y/o'}</b> — {cap(big)}</figcaption></figure>
        </div>
      )}
    </Sheet>
  );
}
