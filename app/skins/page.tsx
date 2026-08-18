'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Layers
} from 'lucide-react';
import { fetchValorantData, ValorantSkin, FALLBACK_SKINS } from '@/lib/valorant-api';

export default function SkinsCatalogPage() {
  const [skins, setSkins] = useState<ValorantSkin[]>(FALLBACK_SKINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('Tümü');

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
      return matchesSearch && matchesWeapon;
    });
  }, [skins, searchQuery, selectedWeapon]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>Valorant Skin & Fiyat Veritabanı</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Skin <span className="text-red-500">Cephaneliği</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/60">
          Tüm Valorant kaplamalarını, VP değerlerini, aşamalarını ve renk varyantlarını inceleyin.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="hud-panel p-5 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Skin veya kaplama adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-sans outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Weapon Type Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {weaponTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedWeapon(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedWeapon === type
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredSkins.map((skin) => (
          <div
            key={skin.uuid}
            className="hud-panel p-3.5 rounded-2xl border border-white/10 hover:border-red-500/50 transition-all flex flex-col justify-between gap-3 group"
          >
            {/* Image Preview */}
            <div className="w-full aspect-[4/3] rounded-xl bg-black/40 p-2 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
              {skin.displayIcon ? (
                <img 
                  src={skin.displayIcon} 
                  alt={skin.displayName} 
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  loading="lazy" 
                />
              ) : (
                <span className="text-[10px] text-white/30">Görsel Yok</span>
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

    </div>
  );
}
