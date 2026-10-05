// Souvenir photo album: small JPEG snapshots of the 3D diorama at key moments, stored per life (outside the save).
export interface Photo { age: number; year: number; kind: string; img: string; caption?: { fr: string; en: string } }
const MAX_PER_LIFE = 24;
const MAX_LIVES = 4;
const key = (id: string) => `bl:album:${id}`;

export function loadAlbum(lifeId: string): Photo[] {
  try { return JSON.parse(localStorage.getItem(key(lifeId)) ?? '[]') as Photo[]; } catch { return []; }
}

export function addPhoto(lifeId: string, p: Photo) {
  try {
    const list = loadAlbum(lifeId);
    if (list.some((x) => x.kind === p.kind && x.age === p.age)) return;
    list.push(p);
    while (list.length > MAX_PER_LIFE) list.splice(1, 1); // keep the birth photo
    const idx = JSON.parse(localStorage.getItem('bl:albums') ?? '[]') as string[];
    if (!idx.includes(lifeId)) idx.push(lifeId);
    while (idx.length > MAX_LIVES) { const old = idx.shift()!; localStorage.removeItem(key(old)); }
    localStorage.setItem('bl:albums', JSON.stringify(idx));
    localStorage.setItem(key(lifeId), JSON.stringify(list));
  } catch { /* storage full or private mode: the album is best-effort */ }
}

/** Copies the album when a life continues under a new id (heir / reincarnation keep their own). */
export const CAPTIONS: Record<string, { fr: string; en: string }> = {
  birth: { fr: 'Naissance', en: 'Birth' }, wedding: { fr: 'Le mariage', en: 'The wedding' }, graduation: { fr: 'Diplômé·e !', en: 'Graduation!' },
  prison: { fr: 'Case prison', en: 'Jail time' }, death: { fr: 'La fin', en: 'The end' }, baby: { fr: 'Un bébé !', en: 'A baby!' },
  promotion: { fr: 'Promotion', en: 'Promotion' }, release: { fr: 'Libéré·e !', en: 'Released!' }, jackpot: { fr: 'Jackpot', en: 'Jackpot' },
};
