'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Lock, 
  Unlock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchValorantData, ValorantSkin, FALLBACK_SKINS } from '@/lib/valorant-api';

interface NightMarketCard {
  id: number;
  skin: ValorantSkin;
  discountPercent: number;
  discountedPrice: number;
  isRevealed: boolean;
}

export default function NightMarketPage() {
  const [skinsPool, setSkinsPool] = useState<ValorantSkin[]>(FALLBACK_SKINS);
  const [cards, setCards] = useState<NightMarketCard[]>([]);

  // Generate 6 random Night Market cards
  const generateMarket = (pool: ValorantSkin[]) => {
    if (pool.length === 0) return;

    // Filter candidate skins (Select, Deluxe, Premium + Knives)
    const candidates = pool.filter(s => s.price > 0 && s.displayIcon);
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const selectedSkins = shuffled.slice(0, 6);

    const generated: NightMarketCard[] = selectedSkins.map((skin, index) => {
      // Random discount between 18% and 48%
      const discountPercent = Math.floor(Math.random() * 31) + 18;
      const discountedPrice = Math.round(skin.price * (1 - discountPercent / 100));

      return {
        id: index,
        skin,
        discountPercent,
        discountedPrice,
        isRevealed: false
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

  // Reveal a single card
  const handleRevealCard = (id: number) => {
    setCards((prev) => 
      prev.map((c) => {
        if (c.id === id && !c.isRevealed) {
          // If high tier skin revealed, shoot confetti!
          if (c.skin.price >= 2175 || c.skin.displayName.toLowerCase().includes('champions')) {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
          }
          return { ...c, isRevealed: true };
        }
        return c;
      })
    );
  };

  // Reveal all
  const handleRevealAll = () => {
    setCards((prev) => prev.map(c => ({ ...c, isRevealed: true })));
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Valorant Gece Pazarı Simülatörü</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Şansını Dene: <span className="text-purple-400">Gece Pazarı</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/60">
          6 gizemli kartı çevirerek sana özel indirimli Valorant skin tekliflerini keşfet!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleRevealAll}
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all active:scale-95 clip-tactical"
        >
          <Unlock className="w-4 h-4" />
          <span>Tüm Kartları Aç</span>
        </button>

        <button
          onClick={() => generateMarket(skinsPool)}
          className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Yeni Pazar Dağıt</span>
        </button>
      </div>

      {/* 6 Night Market Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleRevealCard(card.id)}
              className={`min-h-[320px] rounded-3xl border-2 transition-all duration-500 cursor-pointer flex flex-col justify-between p-6 relative overflow-hidden select-none group ${
                card.isRevealed
                  ? 'hud-panel border-purple-500/40 bg-gradient-to-b from-purple-950/20 via-slate-900/80 to-slate-950/90 shadow-2xl shadow-purple-900/20'
                  : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-white/10 hover:border-purple-400/60 hover:scale-[1.02] shadow-xl'
              }`}
            >
              {card.isRevealed ? (
                // REVEALED FACE
                <div className="flex flex-col justify-between h-full space-y-4 animate-in zoom-in-95 duration-300">
                  
                  {/* Top Discount Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white/50">{card.skin.weaponType}</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-black font-mono font-black text-xs shadow-md">
                      -%{card.discountPercent}
                    </span>
                  </div>

                  {/* Skin Image */}
                  <div className="w-full h-32 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                    {card.skin.displayIcon && (
                      <img 
                        src={card.skin.displayIcon} 
                        alt={card.skin.displayName} 
                        className="max-h-full max-w-full object-contain filter drop-shadow-2xl" 
                      />
                    )}
                  </div>

                  {/* Skin Info & Discounted Price */}
                  <div className="space-y-2 border-t border-white/10 pt-3">
                    <h3 className="font-black text-base text-white truncate">
                      {card.skin.displayName}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-white/40 line-through">
                        {card.skin.price} VP
                      </span>
                      <span className="text-xl font-black text-cyan-400 font-mono">
                        {card.discountedPrice} <span className="text-xs text-white/60">VP</span>
                      </span>
                    </div>
                  </div>

                </div>
              ) : (
                // UNREVEALED MYSTERY CARD
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                    <Lock className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-purple-300">
                      GİZLİ TEKLİF #{card.id + 1}
                    </h4>
                    <p className="text-[11px] text-white/40">Çevirmek için tıkla</p>
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
