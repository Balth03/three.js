import type { AssetDef, StockDef, SectorDef } from '@bl/sim';

const a = (id: string, kind: AssetDef['kind'], icon: string, fr: string, en: string, price: number, o: Partial<AssetDef> = {}): AssetDef => ({
  id, kind, icon, name: { fr, en }, price, upkeep: kind === 'house' ? 0.012 : kind === 'car' ? 0.06 : 0.03, growth: kind === 'house' ? 0.025 : kind === 'car' ? -0.13 : -0.04, happy: 5, ...o,
});

export const assets: AssetDef[] = [
  // ── Houses
  a('h_studio', 'house', '🏢', 'Studio miteux', 'Shabby studio', 70000, { happy: 3, home: 'apartment' }),
  a('h_flat', 'house', '🏬', 'Appartement 2 pièces', 'Two-room apartment', 160000, { happy: 6, home: 'apartment' }),
  a('h_loft', 'house', '🌆', 'Loft industriel', 'Industrial loft', 380000, { happy: 9, home: 'apartment', looks: 1 }),
  a('h_house', 'house', '🏡', 'Maison de banlieue', 'Suburban house', 280000, { happy: 9, home: 'home' }),
  a('h_farm', 'house', '🌾', 'Vieille ferme à rénover', 'Old farmhouse (fixer-upper)', 150000, { happy: 6, home: 'home', growth: 0.03 }),
  a('h_villa', 'house', '🏖️', 'Villa avec piscine', 'Villa with pool', 900000, { happy: 15, home: 'villa', fame: 2, looks: 2 }),
  a('h_beach', 'house', '🌴', 'Maison sur la plage', 'Beach house', 1400000, { happy: 16, home: 'beach', fame: 3 }),
  a('h_mansion', 'house', '🏰', 'Manoir', 'Mansion', 4500000, { happy: 20, home: 'mansion', fame: 6, looks: 3 }),
  a('h_castle', 'house', '🏯', 'Château', 'Castle', 12000000, { happy: 25, home: 'castle', fame: 12, upkeep: 0.02 }),
  a('h_bunker', 'house', '🕳️', 'Bunker anti-apocalypse', 'Doomsday bunker', 2200000, { happy: 8, home: 'home', rating: 1 }),
  // ── Cars
  a('c_wreck', 'car', '🚙', 'Épave rouillée', 'Rusty wreck', 1500, { happy: 2, growth: -0.2 }),
  a('c_twingo', 'car', '🚗', 'Citadine d\'occasion', 'Used city car', 7000, { happy: 4 }),
  a('c_family', 'car', '🚐', 'Monospace familial', 'Family minivan', 26000, { happy: 4 }),
  a('c_tesla', 'car', '⚡', 'Berline électrique', 'Electric sedan', 52000, { happy: 8, looks: 1 }),
  a('c_suv', 'car', '🚙', 'SUV de frimeur', 'Show-off SUV', 75000, { happy: 9, looks: 2 }),
  a('c_vintage', 'car', '🚘', 'Voiture de collection', 'Vintage classic', 110000, { happy: 11, growth: 0.04, looks: 2 }),
  a('c_porsche', 'car', '🏎️', 'Sportive allemande', 'German sports car', 160000, { happy: 14, looks: 4, fame: 1 }),
  a('c_lambo', 'car', '🏎️', 'Supercar italienne', 'Italian supercar', 420000, { happy: 18, looks: 6, fame: 3 }),
  a('c_hearse', 'car', '⚰️', 'Corbillard', 'Hearse', 18000, { happy: 6, rating: 1 }),
  a('c_tank', 'car', '🪖', 'Char d\'assaut démilitarisé', 'Demilitarised tank', 600000, { happy: 20, fame: 5, rating: 1, upkeep: 0.1 }),
  // ── Boats & aircraft
  a('b_kayak', 'boat', '🛶', 'Kayak gonflable', 'Inflatable kayak', 400, { happy: 2, minAge: 12 }),
  a('b_sail', 'boat', '⛵', 'Voilier', 'Sailboat', 90000, { happy: 10 }),
  a('b_yacht', 'boat', '🛥️', 'Yacht', 'Yacht', 3500000, { happy: 20, fame: 8, upkeep: 0.08 }),
  a('p_heli', 'aircraft', '🚁', 'Hélicoptère', 'Helicopter', 1800000, { happy: 18, fame: 6, upkeep: 0.07 }),
  a('p_jet', 'aircraft', '🛩️', 'Jet privé', 'Private jet', 25000000, { happy: 25, fame: 15, upkeep: 0.08 }),
  // ── Luxury
  a('l_watch', 'luxury', '⌚', 'Montre suisse', 'Swiss watch', 15000, { happy: 5, looks: 2, growth: 0.02 }),
  a('l_ring', 'luxury', '💎', 'Diamant énorme', 'Huge diamond', 60000, { happy: 7, growth: 0.01 }),
  a('l_art', 'luxury', '🖼️', 'Toile de maître', 'Old master painting', 800000, { happy: 8, growth: 0.06, fame: 3 }),
  a('l_horse', 'luxury', '🐎', 'Cheval de course', 'Racehorse', 250000, { happy: 10, growth: -0.05 }),
  a('l_guitar', 'luxury', '🎸', 'Guitare de rock star', 'Rock star\'s guitar', 120000, { happy: 7, growth: 0.04 }),
  a('l_nft', 'luxury', '🐵', 'NFT de singe moche', 'Ugly monkey NFT', 90000, { happy: 3, growth: -0.4 }),
  a('l_island', 'luxury', '🏝️', 'Île privée', 'Private island', 30000000, { happy: 30, fame: 20, growth: 0.03 }),
  a('l_toilet', 'luxury', '🚽', 'Toilettes en or massif', 'Solid gold toilet', 1200000, { happy: 12, fame: 4, growth: 0.02, rating: 1 }),
  a('l_skeleton', 'luxury', '💀', 'Squelette de dinosaure', 'Dinosaur skeleton', 5000000, { happy: 15, fame: 8, growth: 0.03 }),
];

export const stocks: StockDef[] = [
  { id: 'POMM', name: 'Pomme Inc.', icon: '🍎', kind: 'stock', price: 180, vol: 0.22, drift: 0.06 },
  { id: 'MCRM', name: 'MicroMou', icon: '🪟', kind: 'stock', price: 320, vol: 0.2, drift: 0.06 },
  { id: 'TSLO', name: 'Teslo Motors', icon: '⚡', kind: 'stock', price: 240, vol: 0.5, drift: 0.04 },
  { id: 'AMZN', name: 'Amazonie', icon: '📦', kind: 'stock', price: 150, vol: 0.28, drift: 0.05 },
  { id: 'BAGT', name: 'Baguette & Fils', icon: '🥖', kind: 'stock', price: 45, vol: 0.12, drift: 0.03 },
  { id: 'LVMH', name: 'Luxe Vuitton', icon: '👜', kind: 'stock', price: 700, vol: 0.2, drift: 0.05 },
  { id: 'NUKE', name: 'Atomix Énergie', icon: '☢️', kind: 'stock', price: 30, vol: 0.35, drift: 0.02 },
  { id: 'BURG', name: 'McBurger', icon: '🍔', kind: 'stock', price: 270, vol: 0.15, drift: 0.04 },
  { id: 'GAME', name: 'GameStore', icon: '🎮', kind: 'stock', price: 20, vol: 0.8, drift: 0.0 },
  { id: 'PHAR', name: 'Pharmaxx', icon: '💊', kind: 'stock', price: 90, vol: 0.3, drift: 0.05 },
  { id: 'BTC', name: 'BitKoin', icon: '🪙', kind: 'crypto', price: 40000, vol: 0.7, drift: 0.08 },
  { id: 'ETH', name: 'Etherium', icon: '💠', kind: 'crypto', price: 2500, vol: 0.8, drift: 0.07 },
  { id: 'DOGE', name: 'DogeKoin', icon: '🐕', kind: 'crypto', price: 0.1, vol: 1.2, drift: 0.04 },
  { id: 'MOON', name: 'MoonRugPull', icon: '🌝', kind: 'crypto', price: 0.002, vol: 1.6, drift: -0.05 },
];

export const sectors: SectorDef[] = [
  { id: 'food', icon: '🍕', name: { fr: 'Food truck', en: 'Food truck' }, cost: 25000, margin: 0.12, risk: 0.5 },
  { id: 'bakery', icon: '🥐', name: { fr: 'Boulangerie', en: 'Bakery' }, cost: 80000, margin: 0.1, risk: 0.3 },
  { id: 'bar', icon: '🍸', name: { fr: 'Bar à cocktails', en: 'Cocktail bar' }, cost: 150000, margin: 0.14, risk: 0.6 },
  { id: 'startup', icon: '🚀', name: { fr: 'Start-up tech', en: 'Tech start-up' }, cost: 50000, margin: 0.05, risk: 1.4 },
  { id: 'gym', icon: '🏋️', name: { fr: 'Salle de sport', en: 'Gym' }, cost: 200000, margin: 0.11, risk: 0.4 },
  { id: 'agency', icon: '📣', name: { fr: 'Agence de com', en: 'Ad agency' }, cost: 60000, margin: 0.12, risk: 0.6 },
  { id: 'realestate', icon: '🏘️', name: { fr: 'Agence immobilière', en: 'Real estate agency' }, cost: 120000, margin: 0.13, risk: 0.5 },
  { id: 'funeral', icon: '⚰️', name: { fr: 'Pompes funèbres', en: 'Funeral home' }, cost: 180000, margin: 0.15, risk: 0.15 },
  { id: 'weedshop', icon: '🌿', name: { fr: 'Boutique de CBD', en: 'CBD shop' }, cost: 40000, margin: 0.18, risk: 0.5 },
  { id: 'clinic', icon: '💉', name: { fr: 'Clinique esthétique', en: 'Cosmetic clinic' }, cost: 500000, margin: 0.16, risk: 0.4 },
  { id: 'label', icon: '🎵', name: { fr: 'Label de musique', en: 'Record label' }, cost: 100000, margin: 0.08, risk: 1.1 },
  { id: 'casino', icon: '🎰', name: { fr: 'Casino', en: 'Casino' }, cost: 2000000, margin: 0.2, risk: 0.5 },
];
