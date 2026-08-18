'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Layers, 
  X, 
  Star
} from 'lucide-react';
import { fetchValorantData, ValorantSkin, FALLBACK_SKINS } from '@/lib/valorant-api';

export default function SkinsCatalogPage() {
  const [skins, setSkins] = useState<ValorantSkin[]>(FALLBACK_SKINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('Tümü');
  const [onlyExclusive, setOnlyExclusive] = useState(false);

  // Selected Skin Detail Modal
  const [selectedSkin, setSelectedSkin] = useState<ValorantSkin | null>(null);
  const [selectedChromaIndex, setSelectedChromaIndex] = useState(0);

  const closeSkinModal = useCallback(() => {
    setSelectedSkin(null);
    setSelectedChromaIndex(0);
  }, []);

  // ESC key listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSkinModal();
      }
    };

    if (selectedSkin) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSkin, closeSkinModal]);

  useEffect(() => {
    async function load() {
      const data = await fetchValorantData();
      if (data.skins.length > 0) setSkins(data.skins);
    }
    load();
  }, []);

  const weaponTypes = ['Tümü', 'Vandal', 'Phantom', 'Melee', 'Operator', 'Sheriff', 'Ghost', 'Classic', 'Marshal', 'Spectre', 'Guardian', 'Outlaw'];

  const filteredSkins = useMemo(() => {
    return skins.filter((skin) => {
      const matchesSearch = skin.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWeapon = selectedWeapon === 'Tümü' || skin.weaponType === selectedWeapon;
      const isExcl = skin.price >= 2175 || skin.displayName.toLowerCase().includes('champions') || skin.displayName.toLowerCase().includes('arcane');
      const matchesExcl = !onlyExclusive || isExcl;

      return matchesSearch && matchesWeapon && matchesExcl;
    });
  }, [skins, searchQuery, selectedWeapon, onlyExclusive]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Skin <span className="text-red-500">Cephaneliği</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/60">
          Valorant&apos;taki tüm kaplamaları, mağaza VP değerlerini, renk çeşitlerini ve aşamalarını inceleyin.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-[#101823] border border-white/10 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Skin veya kaplama adı ara (ör: Kuronami, Champions, Asil, Yağmacı)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#090e17] border border-white/10 text-white text-xs outline-none focus:border-red-500 font-sans"
            />
          </div>

          <button
            onClick={() => setOnlyExclusive(!onlyExclusive)}
            className={`px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              onlyExclusive 
                ? 'bg-amber-500 text-black font-extrabold' 
                : 'bg-[#090e17] text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Nadir / Champions</span>
          </button>
        </div>

        {/* Weapon Type Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {weaponTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedWeapon(type)}
              className={`px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                selectedWeapon === type
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'bg-[#090e17] text-white/50 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Count Indicator */}
      <div className="flex items-center justify-between text-xs text-white/50 font-mono px-1">
        <span>Toplam <strong>{filteredSkins.length}</strong> kaplama listeleniyor</span>
        <span>Ayrıntı görmek için skine tıklayın</span>
      </div>

      {/* Skin Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredSkins.map((skin) => (
          <div
            key={skin.uuid}
            onClick={() => {
              setSelectedSkin(skin);
              setSelectedChromaIndex(0);
            }}
            className="bg-[#101823] border border-white/10 hover:border-red-500 p-3.5 transition-all flex flex-col justify-between gap-3 group cursor-pointer"
          >
            {/* Image Preview */}
            <div className="w-full aspect-[4/3] bg-[#090e17] p-2 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
              {skin.displayIcon ? (
                <img 
                  src={skin.displayIcon} 
                  alt="" 
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Layers className="w-8 h-8 text-white/20" />
              )}
            </div>

            {/* Title & Info */}
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-white truncate group-hover:text-red-400 transition-colors">
                {skin.displayName}
              </h4>
              <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                <span>{skin.weaponType}</span>
                <span className="font-bold text-cyan-400">{skin.price} VP</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- SKIN DETAIL MODAL (ESC / BACKDROP CLOSE) --- */}
      {selectedSkin && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSkinModal();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-[#101823] border border-white/20 p-6 sm:p-8 max-w-lg w-full space-y-6 relative shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">{selectedSkin.weaponType}</span>
                <h3 className="text-xl font-black text-white uppercase mt-0.5">{selectedSkin.displayName}</h3>
              </div>
              <button 
                onClick={closeSkinModal}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Kapat (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Weapon Image (Display active chroma or main icon) */}
            <div className="w-full h-44 bg-[#090e17] p-4 flex items-center justify-center border border-white/5 relative">
              {(() => {
                const activeChroma = selectedSkin.chromas?.[selectedChromaIndex];
                const activeImg = activeChroma?.fullRender || activeChroma?.displayIcon || selectedSkin.displayIcon;
                return activeImg ? (
                  <img 
                    src={activeImg} 
                    alt="" 
                    className="max-h-full max-w-full object-contain filter drop-shadow-2xl -rotate-6"
                  />
                ) : (
                  <Layers className="w-12 h-12 text-white/20" />
                );
              })()}
            </div>

            {/* Price & Value Details */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-[#090e17] border border-white/5">
                <span className="text-[10px] font-mono text-white/50 block">Mağaza VP Değeri</span>
                <span className="font-bold text-base text-cyan-400 font-mono">{selectedSkin.price.toLocaleString('tr-TR')} VP</span>
              </div>

              <div className="p-3 bg-[#090e17] border border-white/5">
                <span className="text-[10px] font-mono text-white/50 block">Tahmini ₺ Karşılığı</span>
                <span className="font-bold text-base text-white font-mono">{Math.round(selectedSkin.price * 0.31).toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>

            {/* Chromas / Renk Paketleri if available */}
            {selectedSkin.chromas && selectedSkin.chromas.length > 1 && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-white/70">Renk Varyantları ({selectedSkin.chromas.length})</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedSkin.chromas.map((chroma, idx) => (
                    <button
                      key={chroma.uuid}
                      onClick={() => setSelectedChromaIndex(idx)}
                      className={`p-2 text-[10px] font-bold border transition-all truncate text-center ${
                        selectedChromaIndex === idx
                          ? 'bg-red-600 text-white border-red-500'
                          : 'bg-[#090e17] text-white/60 hover:text-white border-white/10'
                      }`}
                    >
                      {chroma.displayName.replace(selectedSkin.displayName, '').replace(/[()]/g, '').trim() || `Varyant ${idx + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={closeSkinModal}
              className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Kapat (ESC)
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
