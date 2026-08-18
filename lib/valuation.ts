export interface ValuationInput {
  rank: string;
  rankTier: number;
  accountLevel: number;
  walletVP: number;
  walletRP: number;
  battlepassCount: number;
  selectedSkins: {
    uuid: string;
    displayName: string;
    price: number;
    tierName?: string;
    isExclusive?: boolean;
    isChampions?: boolean;
    chromaCount?: number;
    levelCount?: number;
  }[];
}

export interface ValuationReport {
  totalVPSpent: number;
  totalRPSpent: number;
  investedCashTRY: number;
  investedCashUSD: number;
  marketEstimatedValueTRY: number;
  marketEstimatedValueUSD: number;
  quickSellValueTRY: number;
  collectorMaxTRY: number;
  rarityScore: number;
  archetype: {
    title: string;
    description: string;
    color: string;
    badge: string;
  };
  topValueSkins: {
    displayName: string;
    price: number;
    rarityNote: string;
  }[];
  breakdown: {
    skinsValueVP: number;
    walletVPValue: number;
    battlepassValueVP: number;
    exclusiveBonusVP: number;
    rankBonusTRY: number;
  };
}

// Current VP Price Rates (1.000 VP ≈ 275 ₺ / ~$8.5 USD)
export const VP_PER_TRY = 3.65; // ~1 TRY = 3.65 VP (1000 VP = 274 TL)
export const VP_PER_USD = 115;  // ~1 USD = 115 VP (1000 VP = $8.7 USD)

export function calculateAccountWorth(input: ValuationInput): ValuationReport {
  let skinsVP = 0;
  let exclusiveBonusVP = 0;
  let totalChromaRP = 0;

  const analyzedSkins = input.selectedSkins.map((skin) => {
    const nameLower = skin.displayName.toLowerCase();
    const isChampions = nameLower.includes('champions');
    const isArcane = nameLower.includes('arcane');
    const isVct = nameLower.includes('vct lock') || nameLower.includes('ignite');

    const basePrice = skin.price || 1775;
    let multiplierBonus = 0;

    if (isChampions || isArcane || isVct) {
      // Unobtainable limited items have huge second-hand value
      multiplierBonus = basePrice * 0.75;
    } else if (skin.price >= 2475) {
      multiplierBonus = basePrice * 0.25;
    }

    skinsVP += basePrice;
    exclusiveBonusVP += multiplierBonus;

    const chromas = skin.chromaCount || 1;
    const levels = skin.levelCount || 1;
    totalChromaRP += (chromas - 1) * 15 + (levels - 1) * 10;

    let rarityNote = 'Standart';
    if (isChampions) rarityNote = '🏆 Champions (Bir Daha Gelmeyecek)';
    else if (isArcane) rarityNote = '✨ Arcane Koleksiyonu (Sınırlı)';
    else if (isVct) rarityNote = '⚡ VCT Özel Koleksiyonu';
    else if (skin.price >= 2475) rarityNote = '💎 Ultra / Seçkin Sürüm';

    return {
      displayName: skin.displayName,
      price: basePrice + multiplierBonus,
      rarityNote
    };
  });

  const battlepassValueVP = input.battlepassCount * 1000;
  const totalAccountVP = skinsVP + input.walletVP + battlepassValueVP + exclusiveBonusVP;

  // Real Gross Money Invested
  const investedCashTRY = Math.round((skinsVP + input.walletVP + battlepassValueVP) / VP_PER_TRY);
  const investedCashUSD = Math.round((skinsVP + input.walletVP + battlepassValueVP) / VP_PER_USD);

  // Rank Bonus on Secondary Market (Radiant/Immortal accounts have high value)
  let rankBonusTRY = 0;
  if (input.rankTier >= 24) { // Immortal / Radiant
    rankBonusTRY = 1200 + (input.rankTier - 24) * 500;
  } else if (input.rankTier >= 21) { // Ascendant
    rankBonusTRY = 450;
  } else if (input.rankTier >= 18) { // Diamond
    rankBonusTRY = 250;
  }

  // Second-hand Market Amortization Rate (typically 45% - 65% of invested value + rarity bonus + rank)
  const baseMarketTRY = (investedCashTRY * 0.48) + (exclusiveBonusVP / VP_PER_TRY * 0.85) + rankBonusTRY;
  const marketEstimatedValueTRY = Math.round(Math.max(250, baseMarketTRY));
  const marketEstimatedValueUSD = Math.round(marketEstimatedValueTRY / 37.5);

  const quickSellValueTRY = Math.round(marketEstimatedValueTRY * 0.75);
  const collectorMaxTRY = Math.round(marketEstimatedValueTRY * 1.35);

  // Calculate Rarity Score (0 - 100)
  const skinCount = input.selectedSkins.length;
  let rarityScore = Math.min(99, Math.round((skinCount * 1.8) + (exclusiveBonusVP / 500) + (input.accountLevel * 0.08)));
  if (rarityScore < 15) rarityScore = 15;

  // Determine Archetype Profile
  let archetype = {
    title: 'Yeni Nesil Ajan',
    description: 'Başlangıç seviyesinde dengeli bir Valorant hesabı.',
    color: 'from-blue-500 to-indigo-600',
    badge: '🎯 Standart Oyuncu'
  };

  if (totalAccountVP >= 60000 || input.selectedSkins.some(s => s.displayName.toLowerCase().includes('champions'))) {
    archetype = {
      title: '💎 Okyanus Balinası (Radiant Whale)',
      description: 'Nadir Champions eşyalarına ve devasa skin cephaneliğine sahip elit koleksiyon.',
      color: 'from-amber-400 via-rose-500 to-purple-600',
      badge: '👑 Elit Koleksiyoncu'
    };
  } else if (input.rankTier >= 24) {
    archetype = {
      title: '⚡ Radyant Gladyatörü',
      description: 'Yüksek MMR ve üst düzey dereceli lig prestijine sahip hesap.',
      color: 'from-red-500 via-orange-500 to-amber-500',
      badge: '🏆 Dereceli Şampiyonu'
    };
  } else if (skinCount >= 20) {
    archetype = {
      title: '🎨 Cephanelik Ustası',
      description: 'Her silah türü için özel animasyonlu ve bitiricili skinler içeren zengin envanter.',
      color: 'from-cyan-400 via-indigo-500 to-purple-500',
      badge: '✨ Skin Koleksiyoneri'
    };
  }

  // Top 4 Most Valuable Skins
  const topValueSkins = analyzedSkins
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);

  return {
    totalVPSpent: skinsVP + input.walletVP + battlepassValueVP,
    totalRPSpent: totalChromaRP + input.walletRP,
    investedCashTRY,
    investedCashUSD,
    marketEstimatedValueTRY,
    marketEstimatedValueUSD,
    quickSellValueTRY,
    collectorMaxTRY,
    rarityScore,
    archetype,
    topValueSkins,
    breakdown: {
      skinsValueVP: skinsVP,
      walletVPValue: input.walletVP,
      battlepassValueVP,
      exclusiveBonusVP: Math.round(exclusiveBonusVP),
      rankBonusTRY
    }
  };
}
