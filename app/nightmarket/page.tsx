'use client';

import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, 
  Unlock,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchValorantData, ValorantSkin, FALLBACK_SKINS } from '@/lib/valorant-api';

interface NightMarketCard {
  id: number;
  skin: ValorantSkin;
  discountPercent: number;
  discountedPrice: number;
  isRevealed: boolean;
  tierColorClass: {
    back: string;
    border: string;
    glow: string;
  };
}

export default function NightMarketPage() {
  const [skinsPool, setSkinsPool] = useState<ValorantSkin[]>(FALLBACK_SKINS);
  const [cards, setCards] = useState<NightMarketCard[]>([]);

  // Generate 6 authentic Night Market cards
  const generateMarket = (pool: ValorantSkin[]) => {
    if (pool.length === 0) return;

    const candidates = pool.filter(s => s.price > 0 && s.displayIcon);
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const selectedSkins = shuffled.slice(0, 6);

    const generated: NightMarketCard[] = selectedSkins.map((skin, index) => {
      // Discounts in Valorant Night Market typically range from 18% to 49%
      const discountPercent = Math.floor(Math.random() * 32) + 18;
      const discountedPrice = Math.round(skin.price * (1 - discountPercent / 100));

      // Tier styling based on price
      let tierColorClass = {
        back: 'nm-card-back-blue',
        border: 'border-blue-500/40',
        glow: 'hover:border-blue-400'
      };

      if (skin.price >= 3550 || skin.isMelee) {
        tierColorClass = {
          back: 'nm-card-back-gold',
          border: 'border-amber-500/50',
          glow: 'hover:border-amber-400'
        };
      } else if (skin.price >= 2175) {
        tierColorClass = {
          back: 'nm-card-back-purple',
          border: 'border-pink-500/50',
          glow: 'hover:border-pink-400'
        };
      } else if (skin.price >= 1775) {
        tierColorClass = {
          back: 'nm-card-back-teal',
          border: 'border-teal-500/40',
          glow: 'hover:border-teal-400'
        };
      }

      return {
        id: index,
        skin,
        discountPercent,
        discountedPrice,
        isRevealed: false,
        tierColorClass
      };
    });

    setCards(generated);
  };

  useEffect(() => {
    async function init() {
      const data = await fetchValorantData();
      const pool = data.skins.length > 0 ? data.skins : FALLBACK_SKINS;
      setSkinsPool(pool);
      generateMarket(pool);
    }
    init();
  }, []);

  const handleRevealCard = (id: number) => {
    setCards((prev) => 
      prev.map((c) => {
        if (c.id === id && !c.isRevealed) {
          if (c.skin.price >= 2175 || c.skin.isMelee) {
            confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
          }
          return { ...c, isRevealed: true };
        }
        return c;
      })
    );
  };

  const handleRevealAll = () => {
    setCards((prev) => prev.map(c => ({ ...c, isRevealed: true })));
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-10 relative overflow-hidden">
      
      {/* Background Ambience Laser Grid (Just like Valorant In-Game) */}
      <div className="absolute inset-0 nightmarket-grid pointer-events-none opacity-60 -z-10" />
      <div className="absolute top-1/2 left-0 right-0 h-[1px] laser-line-red pointer-events-none -z-10 -rotate-6" />
      <div className="absolute top-1/2 left-0 right-0 h-[1px] laser-line-cyan pointer-events-none -z-10 rotate-6" />

      {/* Top Authentic Timer Bar */}
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <div className="inline-flex items-center gap-2 text-red-500 font-mono text-xs sm:text-sm font-black tracking-widest uppercase">
          <Clock className="w-4 h-4" />
          <span>BİTİŞE KALAN SÜRE: 24 GÜN</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          GECE PAZARI
        </h1>
        <p className="text-xs sm:text-sm text-white/50 max-w-md">
          Sana özel 6 gizemli teklif. Kartların üzerine tıklayarak indirimli skinleri ortaya çıkar.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleRevealAll}
          className="px-6 py-3 rounded-none bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-600/30 flex items-center gap-2"
        >
          <Unlock className="w-4 h-4" />
          <span>Tüm Kartları Aç</span>
        </button>

        <button
          onClick={() => generateMarket(skinsPool)}
          className="px-6 py-3 rounded-none bg-[#141e2c] hover:bg-[#1a273a] text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Yeniden Dağıt</span>
        </button>
      </div>

      {/* 6 Authentic Valorant Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto pt-4">
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleRevealCard(card.id)}
              className={`h-[380px] sm:h-[420px] transition-all duration-300 cursor-pointer relative overflow-hidden select-none flex flex-col justify-between ${
                card.isRevealed
                  ? 'bg-[#0e1622] border-2 border-white/20 hover:border-white/40 shadow-2xl'
                  : `${card.tierColorClass.back} border-2 ${card.tierColorClass.border} hover:scale-[1.03] hover:shadow-2xl`
              }`}
            >
              {card.isRevealed ? (
                // --- REVEALED FACE (1:1 Valorant Game HUD) ---
                <div className="h-full flex flex-col justify-between p-3.5 relative">
                  
                  {/* Subtle Tier Watermark in Background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="w-32 h-32 border-4 border-white/40 rotate-45 rounded-sm" />
                  </div>

                  {/* Top Bar: Discount Tag (Left) & VP Prices (Right) */}
                  <div className="flex items-start justify-between z-10">
                    {/* Red Angular Discount Badge */}
                    <div className="bg-[#ff4655] text-white font-mono font-black text-xs px-2 py-0.5 tracking-wider">
                      -{card.discountPercent}%
                    </div>

                    {/* VP Price Header */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-white font-black text-sm sm:text-base font-mono">
                        <span className="text-[10px] text-white/70 font-sans">V</span>
                        <span>{card.discountedPrice.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="text-[10px] font-mono text-white/40 line-through">
                        {card.skin.price.toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </div>

                  {/* Center Weapon Image (Tilted at authentic Valorant Angle) */}
                  <div className="my-auto py-4 flex items-center justify-center relative z-10">
                    {card.skin.displayIcon && (
                      <img 
                        src={card.skin.displayIcon} 
                        alt={card.skin.displayName} 
                        className="max-h-36 max-w-full object-contain -rotate-12 filter drop-shadow-[0_12px_16px_rgba(0,0,0,0.8)]"
                      />
                    )}
                  </div>

                  {/* Bottom Skin Name Label */}
                  <div className="z-10 bg-[#070b12]/95 border-t border-white/10 p-2 text-center">
                    <h3 className="font-black text-[11px] sm:text-xs text-white uppercase tracking-wider truncate" title={card.skin.displayName}>
                      {card.skin.displayName}
                    </h3>
                  </div>

                </div>
              ) : (
                // --- UNREVEALED CARD BACK (Geometric Diamond Circuit Design) ---
                <div className="h-full flex flex-col items-center justify-between p-4 relative">
                  
                  {/* Top Circuit Traces */}
                  <div className="w-full flex flex-col items-center opacity-40">
                    <div className="w-[1px] h-12 bg-white/60" />
                    <div className="w-8 h-[1px] bg-white/60" />
                  </div>

                  {/* Center Diamond Emblem */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-white/40 rotate-45 flex items-center justify-center transition-transform group-hover:rotate-90 duration-500">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 border border-white/60 rotate-45 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white/80 rotate-45" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Circuit Traces & Label */}
                  <div className="w-full flex flex-col items-center opacity-40 space-y-2">
                    <div className="w-8 h-[1px] bg-white/60" />
                    <div className="w-[1px] h-12 bg-white/60" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/70 block">
                      AÇMAK İÇİN TIKLA
                    </span>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
