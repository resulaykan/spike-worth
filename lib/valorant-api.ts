export interface ValorantTier {
  uuid: string;
  displayName: string;
  devName: string;
  highlightColor: string;
  displayIcon: string;
}

export interface ValorantSkin {
  uuid: string;
  displayName: string;
  displayIcon: string;
  contentTierUuid: string;
  assetPath: string;
  isMelee: boolean;
  tier?: ValorantTier;
  price: number;
}

export interface ValorantRank {
  tier: number;
  tierName: string;
  largeIcon?: string;
  color: string;
}

// Fiyat Kuralları (Business Logic)
// API fiyat verisi sağlamadığı için bu kurallar sabittir.
const TIER_PRICES: Record<string, { gun: number, knife: number }> = {
  '12683d76-48d7-84a3-4e09-6985794f0445': { gun: 875, knife: 1750 },  // Select
  '0cebb8be-46d7-c12a-d306-e9907bfc5a25': { gun: 1275, knife: 2550 }, // Deluxe
  '60bca009-4182-7998-dee7-b8a2558dc369': { gun: 1775, knife: 3550 }, // Premium
  'e046854e-406c-37f4-6607-19a9ba8426fc': { gun: 2175, knife: 4350 }, // Exclusive
  '411e4a55-4e59-7757-41f0-86a53f101bb5': { gun: 2475, knife: 4950 }, // Ultra
};

const DEFAULT_PRICE = { gun: 875, knife: 1750 };

export async function fetchValorantData() {
  try {
    // 1. Tiers (Aşamalar) - Tamamen API'den (Türkçe)
    const tierRes = await fetch('https://valorant-api.com/v1/contenttiers?language=tr-TR');
    const tierJson = await tierRes.json();
    
    const tiersMap = new Map<string, ValorantTier>();
    
    if (tierJson.status === 200) {
      tierJson.data.forEach((t: any) => {
        tiersMap.set(t.uuid, {
          uuid: t.uuid,
          displayName: t.displayName, // API'den gelen resmi isim
          devName: t.devName,
          highlightColor: t.highlightColor ? `#${t.highlightColor.slice(0, 6)}` : '#ffffff',
          displayIcon: t.displayIcon,
        });
      });
    }

    // 2. Skins (Silah Kaplamaları) - Tamamen API'den (Türkçe)
    const skinRes = await fetch('https://valorant-api.com/v1/weapons/skins?language=tr-TR');
    const skinJson = await skinRes.json();
    
    const skins: ValorantSkin[] = [];

    if (skinJson.status === 200) {
      skinJson.data.forEach((s: any) => {
        const isMelee = s.assetPath ? s.assetPath.toLowerCase().includes('melee') : false;
        
        // Fiyatlandırma kuralı
        let price = 0;
        if (s.contentTierUuid && TIER_PRICES[s.contentTierUuid]) {
          price = isMelee ? TIER_PRICES[s.contentTierUuid].knife : TIER_PRICES[s.contentTierUuid].gun;
        } else {
          price = isMelee ? DEFAULT_PRICE.knife : DEFAULT_PRICE.gun;
        }

        if (s.displayIcon && s.contentTierUuid && tiersMap.has(s.contentTierUuid)) {
          skins.push({
            uuid: s.uuid,
            displayName: s.displayName,
            displayIcon: s.displayIcon,
            contentTierUuid: s.contentTierUuid,
            assetPath: s.assetPath,
            isMelee: isMelee,
            tier: tiersMap.get(s.contentTierUuid),
            price: price
          });
        }
      });
    }

    // 3. Ranks (Ranklar) - Tamamen API'den (Türkçe)
    const rankRes = await fetch('https://valorant-api.com/v1/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04?language=tr-TR');
    const rankJson = await rankRes.json();
    
    const ranks: ValorantRank[] = [];

    if (rankJson.status === 200 && rankJson.data && rankJson.data.tiers) {
       rankJson.data.tiers.forEach((t: any) => {
         // Tier ID'si 3 ve üzeri olanları al (Iron 1 ve üstü)
         if (t.tier >= 3 && t.largeIcon) {
           ranks.push({
             tier: t.tier,
             tierName: t.tierName, // API'den gelen resmi isim
             largeIcon: t.largeIcon,
             color: `#${t.color ? t.color.slice(0, 6) : 'ffffff'}`
           });
         }
       });
    }

    return { skins, tiers: tiersMap, ranks };

  } catch (error) {
    console.error("Valorant API Hatası:", error);
    return { skins: [], tiers: new Map(), ranks: [] };
  }
}