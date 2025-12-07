// Bu dosya ileride veritabanından veya geniş bir JSON dosyasından beslenecek.
// Şimdilik yapı örneği olarak static veriler içeriyor.

export type SkinTier = 'Select' | 'Deluxe' | 'Premium' | 'Ultra' | 'Exclusive';

export interface Skin {
  id: string;
  name: string;
  tier: SkinTier;
  price: number; // VP fiyatı
  image?: string; // İleride eklenecek görsel URL'i
}

export const valorantData = {
  tiers: {
    Select: { color: 'text-blue-400', multiplier: 0.4 }, // 875 VP -> Satış değeri çarpanı
    Deluxe: { color: 'text-green-400', multiplier: 0.5 }, // 1275 VP
    Premium: { color: 'text-pink-500', multiplier: 0.6 }, // 1775 VP
    Ultra: { color: 'text-yellow-400', multiplier: 0.7 }, // 2475 VP
    Exclusive: { color: 'text-orange-500', multiplier: 0.8 }, // Değişken
  },
  ranks: [
    { name: 'Iron', value: 50 },
    { name: 'Bronze', value: 100 },
    { name: 'Silver', value: 150 },
    { name: 'Gold', value: 250 },
    { name: 'Platinum', value: 400 },
    { name: 'Diamond', value: 700 },
    { name: 'Ascendant', value: 1200 },
    { name: 'Immortal', value: 2500 },
    { name: 'Radiant', value: 5000 },
  ],
  // Örnek skin listesi (İleride burası binlerce satır olacak)
  exampleSkins: [
    { id: 'vandal-reaver', name: 'Reaver Vandal', tier: 'Premium', price: 1775 },
    { id: 'phantom-oni', name: 'Oni Phantom', tier: 'Premium', price: 1775 },
    { id: 'operator-elderflame', name: 'Elderflame Operator', tier: 'Ultra', price: 2475 },
    { id: 'knife-rgx-butterfly', name: 'RGX 11z Pro Firefly', tier: 'Exclusive', price: 4350 },
  ] as Skin[]
};
