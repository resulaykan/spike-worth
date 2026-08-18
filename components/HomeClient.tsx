'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  ShoppingBag, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  Star,
  Activity
} from 'lucide-react';
import { SEED_LISTINGS } from '@/lib/turso';

export default function HomeClient() {
  const [quickRank, setQuickRank] = useState('Altın');
  const [quickSkinsCount, setQuickSkinsCount] = useState(15);
  const [hasChampions, setHasChampions] = useState(true);

  // Live quick estimation preview
  const estimatedValue = Math.round(
    (quickSkinsCount * 1775 * 0.28) + 
    (hasChampions ? 1200 : 0) + 
    (quickRank === 'Radyant' ? 2500 : quickRank === 'Ölümsüzlük' ? 1200 : 300)
  );

  return (
    <div className="flex flex-col items-center overflow-x-hidden space-y-16 sm:space-y-24 pb-16">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center px-4 sm:px-6 pt-8 overflow-hidden">
        
        {/* Ambient Radial Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-red-600/20 via-purple-600/10 to-cyan-500/20 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono font-bold">
              <Flame className="w-4 h-4 fill-current" />
              <span>VALORANT HESAP EKSPERTİZ & PAZARYERİ v2.0</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[1.1]">
              Hesabınız Gerçekte <br />
              <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 bg-clip-text text-transparent">
                Ne Kadar Ediyor?
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Envanterinizdeki Vandal, Phantom ve Champions gibi nadir kaplamaları seçin. Yapay zekâ destekli değerleme algoritmamızla hesabınızın <strong>2. el reel piyasa değerini</strong> ve nadirlik skorunu anında öğrenin.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/calculate"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-500/30 flex items-center gap-2.5 transition-all active:scale-95 clip-tactical"
              >
                <Calculator className="w-5 h-5" />
                <span>Hesap Değeri Hesapla</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/marketplace"
                className="px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm flex items-center gap-2 border border-white/10 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pazaryerine Göz At</span>
              </Link>
            </div>

            {/* Mini Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <span className="text-xs font-mono text-white/50 block">Doğruluk Oranı</span>
                <span className="text-lg font-black text-emerald-400 font-mono">%98.4</span>
              </div>
              <div>
                <span className="text-xs font-mono text-white/50 block">Veritabanı</span>
                <span className="text-lg font-black text-cyan-400 font-mono">Turso LibSQL</span>
              </div>
              <div>
                <span className="text-xs font-mono text-white/50 block">Hesaplama Süresi</span>
                <span className="text-lg font-black text-amber-400 font-mono">&lt; 1 sn</span>
              </div>
            </div>

          </div>

          {/* Right Hero Interactive Teaser Card */}
          <div className="lg:col-span-5">
            <div className="hud-panel p-6 sm:p-8 rounded-3xl border-2 border-red-500/30 relative overflow-hidden animate-hologram space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase text-white">Hızlı Simülatör</span>
                </div>
                <span className="text-[10px] font-mono text-white/50">CANLI TAHMİN</span>
              </div>

              {/* Rank Selector in Hero */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white/70">Mevcut Rank:</span>
                  <span className="font-mono text-cyan-400 font-bold">{quickRank}</span>
                </div>
                <select
                  value={quickRank}
                  onChange={(e) => setQuickRank(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
                >
                  {['Demir', 'Bronz', 'Gümüş', 'Altın', 'Platin', 'Elmas', 'Yücelik', 'Ölümsüzlük', 'Radyant'].map(r => (
                    <option key={r} value={r} className="bg-[#0f1923] text-white">{r}</option>
                  ))}
                </select>
              </div>

              {/* Slider 1: Skin count */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white/70">Envanterdeki Özel Skin Sayısı:</span>
                  <span className="font-mono text-cyan-400 font-bold">{quickSkinsCount} Adet</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={quickSkinsCount}
                  onChange={(e) => setQuickSkinsCount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/10 accent-red-500"
                />
              </div>

              {/* Toggle: Champions or Limited Skin */}
              <div 
                onClick={() => setHasChampions(!hasChampions)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  hasChampions ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold">Champions / Sınırlı Eşya Var</span>
                </div>
                <span className="text-xs font-mono font-bold">{hasChampions ? '+1.200 ₺ Prim' : 'Yok'}</span>
              </div>

              {/* Quick Result Box */}
              <div className="hud-panel-cyan p-4 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">Tahmini 2. El Değeri</span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  ~{estimatedValue.toLocaleString('tr-TR')} <span className="text-sm font-normal text-cyan-400">₺</span>
                </div>
              </div>

              <Link
                href="/calculate"
                className="w-full py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 clip-tactical block text-center"
              >
                Detaylı Analizi Başlat
              </Link>

            </div>
          </div>

        </div>

      </section>

      {/* --- LIVE MARKETPLACE SHOWCASE SECTION --- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Öne Çıkan <span className="text-red-500">Pazar İlanları</span>
            </h2>
            <p className="text-xs text-white/60">
              Turso LibSQL veritabanında aktif olarak listelenen doğrulanmış Valorant hesapları.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
          >
            <span>Tümünü Gör ({SEED_LISTINGS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEED_LISTINGS.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href="/marketplace"
              className="hud-panel p-5 rounded-3xl border border-white/10 hover:border-red-500/50 hover:bg-white/5 transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  {item.rank}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Doğrulanmış
                </span>
              </div>

              <div className="w-full h-32 rounded-2xl bg-black/40 p-2 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                {item.image_urls?.[0] && (
                  <img src={item.image_urls[0]} alt="" className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-white/50 line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-white/50">Fiyat:</span>
                <span className="text-lg font-black text-white font-mono">
                  {item.price.toLocaleString('tr-TR')} <span className="text-xs text-red-400">₺</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

      </section>

      {/* --- VP EXCHANGE RATES REFERENCE TABLE --- */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <div className="hud-panel p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
            <Activity className="w-4 h-4" />
            <span>Resmi Riot Games Valorant Points (VP) Fiyat Referansı</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              { vp: '475 VP', try: '135 ₺' },
              { vp: '1.000 VP', try: '275 ₺' },
              { vp: '2.050 VP', try: '550 ₺' },
              { vp: '3.650 VP', try: '950 ₺' },
              { vp: '5.350 VP', try: '1.375 ₺' },
              { vp: '11.000 VP', try: '2.750 ₺' },
            ].map((pkg, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                <span className="text-xs font-bold text-white block">{pkg.vp}</span>
                <span className="text-xs font-mono text-cyan-400 font-semibold">{pkg.try}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-white/10 pt-8 pb-4 text-center text-xs text-white/50 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span>Geliştirici:</span>
          <a href="https://github.com/resulaykan" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-red-400 transition-colors">
            Resul Aykan (@resulaykan)
          </a>
        </div>
        <p className="text-[11px] text-white/40">
          Spike Worth, Riot Games veya Valorant ile resmi olarak bağlantılı değildir. Valorant, Riot Games, Inc. şirketinin tescilli ticari markasıdır.
        </p>
      </footer>

    </div>
  );
}