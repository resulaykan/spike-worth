'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  Unlock,
  Clock,
  Sparkles
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
    accent: string;
  };
}

// Web Audio API Sound Synth for Authentic Valorant Night Market Flip Sound
function playFlipSound(pitch = 1) {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320 * pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(780 * pitch, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Ignore audio restriction
  }
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
        glow: 'hover:border-blue-400',
        accent: '#3b82f6'
      };

      if (skin.price >= 3550 || skin.isMelee) {
        tierColorClass = {
          back: 'nm-card-back-gold',
          border: 'border-amber-500/60',
          glow: 'hover:border-amber-400',
          accent: '#f59e0b'
        };
      } else if (skin.price >= 2175) {
        tierColorClass = {
          back: 'nm-card-back-purple',
          border: 'border-pink-500/60',
          glow: 'hover:border-pink-400',
          accent: '#ec4899'
        };
      } else if (skin.price >= 1775) {
        tierColorClass = {
          back: 'nm-card-back-teal',
          border: 'border-teal-500/50',
          glow: 'hover:border-teal-400',
          accent: '#14b8a6'
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
          playFlipSound(1.2);
          if (c.skin.price >= 2175 || c.skin.isMelee) {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
          }
          return { ...c, isRevealed: true };
        }
        return c;
      })
    );
  };

  const handleRevealAll = () => {
    playFlipSound(1.5);
    setCards((prev) => prev.map(c => ({ ...c, isRevealed: true })));
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-10 relative overflow-hidden">
      
      {/* Background Ambience Laser Grid (1:1 Valorant In-Game Atmosphere) */}
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
          Sana özel 6 gizemli teklif. Kartların üzerine tıklayarak 3D animasyonla indirimli skinleri ortaya çıkar.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleRevealAll}
          className="px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-red-600/30 flex items-center gap-2"
        >
          <Unlock className="w-4 h-4" />
          <span>Tüm Kartları Aç</span>
        </button>

        <button
          onClick={() => generateMarket(skinsPool)}
          className="px-6 py-3.5 bg-[#141e2c] hover:bg-[#1a273a] text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Yeniden Dağıt</span>
        </button>
      </div>

      {/* 6 Authentic Large Valorant Cards with 3D Flip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5 max-w-7xl mx-auto pt-4 [perspective:1400px]">
        {cards.map((card) => {
          return (
            <motion.div
              key={card.id}
              onClick={() => handleRevealCard(card.id)}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="h-[460px] sm:h-[510px] cursor-pointer relative select-none [transform-style:preserve-3d]"
            >
              {/* FLIPPING INNER CONTAINER */}
              <motion.div
                animate={{ rotateY: card.isRevealed ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full relative [transform-style:preserve-3d]"
              >
                
                {/* --- FRONT SIDE: UNREVEALED MYSTERY CARD (Geometric Circuit Pattern) --- */}
                <div 
                  className={`absolute inset-0 w-full h-full [backface-visibility:hidden] p-5 flex flex-col items-center justify-between border-2 ${card.tierColorClass.border} ${card.tierColorClass.back} shadow-2xl overflow-hidden`}
                >
                  {/* Top Circuit Traces */}
                  <div className="w-full flex flex-col items-center opacity-40">
                    <div className="w-[1.5px] h-16 bg-white/70" />
                    <div className="w-12 h-[1.5px] bg-white/70" />
                  </div>

                  {/* Center Diamond Emblem with Hover Rotation */}
                  <div className="relative flex items-center justify-center my-auto">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-white/50 rotate-45 flex items-center justify-center transition-transform hover:rotate-90 duration-700 shadow-lg">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border border-white/70 rotate-45 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white/90 rotate-45" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Circuit Traces & Interactive Prompt */}
                  <div className="w-full flex flex-col items-center opacity-50 space-y-2">
                    <div className="w-12 h-[1.5px] bg-white/70" />
                    <div className="w-[1.5px] h-16 bg-white/70" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white font-bold block pt-1">
                      AÇMAK İÇİN TIKLA
                    </span>
                  </div>
                </div>

                {/* --- BACK SIDE: REVEALED FACE (Rotated 180deg - 1:1 In-Game Valorant Skin HUD) --- */}
                <div 
                  className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-4 flex flex-col justify-between bg-[#0b121c] border-2 border-white/20 shadow-2xl relative overflow-hidden"
                >
                  {/* Geometric Watermark in Background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="w-40 h-40 border-4 border-white/30 rotate-45 rounded-sm" />
                  </div>

                  {/* Top Bar: Red Discount Tag (Left) & VP Prices (Right) */}
                  <div className="flex items-start justify-between z-10">
                    <div className="bg-[#ff4655] text-white font-mono font-black text-xs px-2.5 py-1 tracking-wider">
                      -{card.discountPercent}%
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-white font-black text-base font-mono">
                        <span className="text-[11px] text-white/70 font-sans">V</span>
                        <span>{card.discountedPrice.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="text-xs font-mono text-white/40 line-through">
                        {card.skin.price.toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </div>

                  {/* Center Weapon Image (Tilted at authentic Valorant Angle) */}
                  <div className="my-auto py-6 flex items-center justify-center relative z-10">
                    {card.skin.displayIcon ? (
                      <img 
                        src={card.skin.displayIcon} 
                        alt="" 
                        className="max-h-44 max-w-full object-contain -rotate-12 filter drop-shadow-[0_16px_20px_rgba(0,0,0,0.85)]"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Sparkles className="w-12 h-12 text-white/20" />
                    )}
                  </div>

                  {/* Bottom Skin Name Bar */}
                  <div className="z-10 bg-[#060a10]/95 border-t border-white/10 p-2.5 text-center">
                    <h3 className="font-black text-xs text-white uppercase tracking-wider truncate" title={card.skin.displayName}>
                      {card.skin.displayName}
                    </h3>
                  </div>

                </div>

              </motion.div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
