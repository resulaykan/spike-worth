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
  weaponType: string;
  isMelee: boolean;
  tier?: ValorantTier;
  price: number;
  chromas?: {
    uuid: string;
    displayName: string;
    displayIcon?: string;
    fullRender?: string;
  }[];
  levels?: {
    uuid: string;
    displayName: string;
    levelItem?: string;
  }[];
}

export interface ValorantRank {
  tier: number;
  tierName: string;
  largeIcon?: string;
  color: string;
}

// Tier Base Prices
const TIER_PRICES: Record<string, { gun: number; knife: number }> = {
  '12683d76-48d7-84a3-4e09-6985794f0445': { gun: 875, knife: 1750 },  // Select
  '0cebb8be-46d7-c12a-d306-e9907bfc5a25': { gun: 1275, knife: 2550 }, // Deluxe
  '60bca009-4182-7998-dee7-b8a2558dc369': { gun: 1775, knife: 3550 }, // Premium
  'e046854e-406c-37f4-6607-19a9ba8426fc': { gun: 2175, knife: 4350 }, // Exclusive
  '411e4a55-4e59-7757-41f0-86a53f101bb5': { gun: 2475, knife: 4950 }, // Ultra
};

const DEFAULT_PRICE = { gun: 1775, knife: 3550 };

function detectWeaponType(displayName: string, assetPath: string): string {
  const name = displayName.toLowerCase();
  const path = assetPath.toLowerCase();

  if (path.includes('melee') || name.includes('bıçak') || name.includes('karambit') || name.includes('kılıç') || name.includes('balta') || name.includes('hançer') || name.includes('katana') || name.includes('fan') || name.includes('knife') || name.includes('blade') || name.includes('axe') || name.includes('dagger')) return 'Melee';
  if (name.includes('vandal')) return 'Vandal';
  if (name.includes('phantom')) return 'Phantom';
  if (name.includes('operator')) return 'Operator';
  if (name.includes('sheriff')) return 'Sheriff';
  if (name.includes('ghost')) return 'Ghost';
  if (name.includes('classic')) return 'Classic';
  if (name.includes('marshal')) return 'Marshal';
  if (name.includes('spectre')) return 'Spectre';
  if (name.includes('guardian')) return 'Guardian';
  if (name.includes('frenzy')) return 'Frenzy';
  if (name.includes('shorty')) return 'Shorty';
  if (name.includes('stinger')) return 'Stinger';
  if (name.includes('outlaw')) return 'Outlaw';
  if (name.includes('bucky')) return 'Bucky';
  if (name.includes('judge')) return 'Judge';
  if (name.includes('bulldog')) return 'Bulldog';
  if (name.includes('ares')) return 'Ares';
  if (name.includes('odin')) return 'Odin';

  return 'Diğer';
}

// Fallback high-profile skins in case offline/rate-limited
export const FALLBACK_SKINS: ValorantSkin[] = [
  {
    uuid: '9c97b83d-4c3e-8622-c36b-278cf05bcbb7',
    displayName: 'Champions 2021 Vandal',
    displayIcon: 'https://media.valorant-api.com/weaponskins/9c97b83d-4c3e-8622-c36b-278cf05bcbb7/displayicon.png',
    contentTierUuid: 'e046854e-406c-37f4-6607-19a9ba8426fc',
    assetPath: 'ShooterGame/Content/Equippables/Guns/Rifles/AK47/AK47_Champions_PrimaryAsset',
    weaponType: 'Vandal',
    isMelee: false,
    price: 2675
  },
  {
    uuid: '2a3b04c8-4720-c918-a6b1-a6bcf3650228',
    displayName: 'Kuronami Vandal',
    displayIcon: 'https://media.valorant-api.com/weaponskins/2a3b04c8-4720-c918-a6b1-a6bcf3650228/displayicon.png',
    contentTierUuid: 'e046854e-406c-37f4-6607-19a9ba8426fc',
    assetPath: 'ShooterGame/Content/Equippables/Guns/Rifles/AK47/AK47_Kuronami_PrimaryAsset',
    weaponType: 'Vandal',
    isMelee: false,
    price: 2375
  },
  {
    uuid: '60bca009-4182-7998-dee7-b8a2558dc369',
    displayName: 'Yağmacı Vandal',
    displayIcon: 'https://media.valorant-api.com/weaponskins/60bca009-4182-7998-dee7-b8a2558dc369/displayicon.png',
    contentTierUuid: '60bca009-4182-7998-dee7-b8a2558dc369',
    assetPath: 'ShooterGame/Content/Equippables/Guns/Rifles/AK47/AK47_Reaver_PrimaryAsset',
    weaponType: 'Vandal',
    isMelee: false,
    price: 1775
  },
  {
    uuid: '87588b4a-4c28-97c2-9a3d-3d8a56c075ea',
    displayName: 'Asil Vandal',
    displayIcon: 'https://media.valorant-api.com/weaponskins/87588b4a-4c28-97c2-9a3d-3d8a56c075ea/displayicon.png',
    contentTierUuid: '60bca009-4182-7998-dee7-b8a2558dc369',
    assetPath: 'ShooterGame/Content/Equippables/Guns/Rifles/AK47/AK47_Prime_PrimaryAsset',
    weaponType: 'Vandal',
    isMelee: false,
    price: 1775
  },
  {
    uuid: 'b6863073-455b-f542-a8c6-2c97a598cfa7',
    displayName: 'Champions 2021 Karambit',
    displayIcon: 'https://media.valorant-api.com/weaponskins/b6863073-455b-f542-a8c6-2c97a598cfa7/displayicon.png',
    contentTierUuid: 'e046854e-406c-37f4-6607-19a9ba8426fc',
    assetPath: 'ShooterGame/Content/Equippables/Melee/Melee_Champions_PrimaryAsset',
    weaponType: 'Melee',
    isMelee: true,
    price: 5350
  },
  {
    uuid: '85c7c251-4040-cfc6-9467-33a7e5fdf261',
    displayName: 'RGX 11z Pro Blade',
    displayIcon: 'https://media.valorant-api.com/weaponskins/85c7c251-4040-cfc6-9467-33a7e5fdf261/displayicon.png',
    contentTierUuid: 'e046854e-406c-37f4-6607-19a9ba8426fc',
    assetPath: 'ShooterGame/Content/Equippables/Melee/Melee_RGX_PrimaryAsset',
    weaponType: 'Melee',
    isMelee: true,
    price: 4350
  },
  {
    uuid: 'c4e1be92-4df3-0b04-a63e-f1b29a2886f4',
    displayName: 'Ejder Ateşi Vandal',
    displayIcon: 'https://media.valorant-api.com/weaponskins/c4e1be92-4df3-0b04-a63e-f1b29a2886f4/displayicon.png',
    contentTierUuid: '411e4a55-4e59-7757-41f0-86a53f101bb5',
    assetPath: 'ShooterGame/Content/Equippables/Guns/Rifles/AK47/AK47_Dragon_PrimaryAsset',
    weaponType: 'Vandal',
    isMelee: false,
    price: 2475
  },
  {
    uuid: 'd8c83758-45e0-96f3-18ab-a8a25c150c26',
    displayName: 'İyon Phantom',
    displayIcon: 'https://media.valorant-api.com/weaponskins/d8c83758-45e0-96f3-18ab-a8a25c150c26/displayicon.png',
    contentTierUuid: '60bca009-4182-7998-dee7-b8a2558dc369',
    assetPath: 'ShooterGame/Content/Equippables/Guns/Rifles/Burst/Burst_Ion_PrimaryAsset',
    weaponType: 'Phantom',
    isMelee: false,
    price: 1775
  }
];

interface RawTierItem {
  uuid: string;
  displayName: string;
  devName: string;
  highlightColor?: string;
  displayIcon: string;
}

interface RawSkinItem {
  uuid: string;
  displayName: string;
  displayIcon?: string;
  contentTierUuid?: string;
  assetPath?: string;
  chromas?: { uuid: string; displayName: string; displayIcon?: string; fullRender?: string }[];
  levels?: { uuid: string; displayName: string; levelItem?: string }[];
}

interface RawRankItem {
  tier: number;
  tierName: string;
  largeIcon?: string;
  color?: string;
}

export async function fetchValorantData(): Promise<{
  skins: ValorantSkin[];
  tiers: Map<string, ValorantTier>;
  ranks: ValorantRank[];
}> {
  try {
    // 1. Tiers
    const tierRes = await fetch('https://valorant-api.com/v1/contenttiers?language=tr-TR', { next: { revalidate: 86400 } });
    const tierJson = await tierRes.json();
    const tiersMap = new Map<string, ValorantTier>();

    if (tierJson.status === 200 && Array.isArray(tierJson.data)) {
      tierJson.data.forEach((t: RawTierItem) => {
        tiersMap.set(t.uuid, {
          uuid: t.uuid,
          displayName: t.displayName,
          devName: t.devName,
          highlightColor: t.highlightColor ? `#${t.highlightColor.slice(0, 6)}` : '#ffffff',
          displayIcon: t.displayIcon,
        });
      });
    }

    // 2. Skins
    const skinRes = await fetch('https://valorant-api.com/v1/weapons/skins?language=tr-TR', { next: { revalidate: 86400 } });
    const skinJson = await skinRes.json();
    const skins: ValorantSkin[] = [];

    if (skinJson.status === 200 && Array.isArray(skinJson.data)) {
      skinJson.data.forEach((s: RawSkinItem) => {
        const weaponType = detectWeaponType(s.displayName, s.assetPath || '');
        const isMelee = weaponType === 'Melee';

        let price = DEFAULT_PRICE.gun;
        if (s.contentTierUuid && TIER_PRICES[s.contentTierUuid]) {
          price = isMelee ? TIER_PRICES[s.contentTierUuid].knife : TIER_PRICES[s.contentTierUuid].gun;
        } else if (isMelee) {
          price = DEFAULT_PRICE.knife;
        }

        // Standard edition filter (ignore default skins without art)
        if (s.displayIcon && s.displayName && !s.displayName.toLowerCase().startsWith('standart')) {
          skins.push({
            uuid: s.uuid,
            displayName: s.displayName,
            displayIcon: s.displayIcon,
            contentTierUuid: s.contentTierUuid || '',
            assetPath: s.assetPath || '',
            weaponType: weaponType,
            isMelee: isMelee,
            tier: s.contentTierUuid ? tiersMap.get(s.contentTierUuid) : undefined,
            price: price,
            chromas: s.chromas || [],
            levels: s.levels || []
          });
        }
      });
    }

    // 3. Ranks
    const rankRes = await fetch('https://valorant-api.com/v1/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04?language=tr-TR', { next: { revalidate: 86400 } });
    const rankJson = await rankRes.json();
    const ranks: ValorantRank[] = [];

    if (rankJson.status === 200 && rankJson.data && Array.isArray(rankJson.data.tiers)) {
      rankJson.data.tiers.forEach((t: RawRankItem) => {
        if (t.tier >= 3 && t.largeIcon) {
          ranks.push({
            tier: t.tier,
            tierName: t.tierName,
            largeIcon: t.largeIcon,
            color: `#${t.color ? t.color.slice(0, 6) : 'ffffff'}`
          });
        }
      });
    }

    return {
      skins: skins.length > 0 ? skins : FALLBACK_SKINS,
      tiers: tiersMap,
      ranks: ranks
    };
  } catch (error) {
    console.error("Valorant API Error (using fallbacks):", error);
    return {
      skins: FALLBACK_SKINS,
      tiers: new Map(),
      ranks: []
    };
  }
}