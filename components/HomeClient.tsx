'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Star
} from 'lucide-react';
import { SEED_LISTINGS } from '@/lib/turso';

export default function HomeClient() {
  const [quickRank, setQuickRank] = useState('Altın');
  const [quickSkinsCount, setQuickSkinsCount] = useState(12);
  const [hasChampions, setHasChampions] = useState(true);

  // Live calculation based on Riot Turkey VP package rates and secondary market dynamics
  const estimatedValue = Math.round(
    (quickSkinsCount * 1775 * 0.28) + 
    (hasChampions ? 1200 : 0) + 
    (quickRank === 'Radyant' ? 2500 : quickRank === 'Ölümsüzlük' ? 1200 : quickRank === 'Yücelik' ? 500 : 250)
  );

  return (
    <div className="flex flex-col items-center overflow-x-hidden space-y-16 sm:space-y-24 pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]">
              Valorant Hesabınız <br />
              <span className="text-red-500">Reel Piyasada</span> <br />
              Ne Kadar Ediyor?
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Envanterinizdeki Vandal, Phantom, Bıçak ve Champions gibi mağazaya bir daha dönmeyecek nadir kaplamaları analiz edin; hesabınızın gerçek 2. el piyasa değerini ve ekspertiz raporunu öğrenin.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/calculate"
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-red-600/30 flex items-center gap-2.5"
              >
                <Calculator className="w-4 h-4" />
                <span>Hesap Değeri Hesapla</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/nightmarket"
                className="px-7 py-4 bg-[#141e2c] hover:bg-[#1a273a] text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Gece Pazarı Simülatörü</span>
              </Link>
            </div>

            {/* Key Trust Points */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <span className="text-xs text-white/50 block">Riot VP Kuru</span>
                <span className="text-sm sm:text-base font-black text-white font-mono">1.000 VP = 275 ₺</span>
              </div>
              <div>
                <span className="text-xs text-white/50 block">Koleksiyon Primi</span>
                <span className="text-sm sm:text-base font-black text-amber-400 font-mono">Champions Dahil</span>
              </div>
              <div>
                <span className="text-xs text-white/50 block">Piyasa Amortismanı</span>
                <span className="text-sm sm:text-base font-black text-cyan-400 font-mono">%45 - %65</span>
              </div>
            </div>

          </div>

          {/* Right Hero: Fast Valuation Simulator Box */}
          <div className="lg:col-span-5">
            <div className="bg-[#101823] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl relative">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase text-white">Hızlı Simülasyon</span>
                </div>
                <span className="text-[10px] font-mono text-white/40 uppercase">Anlık Tahmin</span>
              </div>

              {/* Rank Select */}
              <div className="space-y-1.5">
                <label className="text-xs text-white/60 font-semibold block">Mevcut Rank</label>
                <select
                  value={quickRank}
                  onChange={(e) => setQuickRank(e.target.value)}
                  className="w-full p-3 bg-[#090e17] border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
                >
                  {['Demir', 'Bronz', 'Gümüş', 'Altın', 'Platin', 'Elmas', 'Yücelik', 'Ölümsüzlük', 'Radyant'].map(r => (
                    <option key={r} value={r} className="bg-[#090e17] text-white">{r}</option>
                  ))}
                </select>
              </div>

              {/* Skin Count Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white/70">Özel Silah / Bıçak Skin Sayısı:</span>
                  <span className="font-mono text-cyan-400 font-bold">{quickSkinsCount} Adet</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={quickSkinsCount}
                  onChange={(e) => setQuickSkinsCount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/10 accent-red-500"
                />
              </div>

              {/* Champions / Limited Toggle */}
              <div 
                onClick={() => setHasChampions(!hasChampions)}
                className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                  hasChampions ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-[#090e17] border-white/10 text-white/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold">Champions / Sınırlı Skin Var</span>
                </div>
                <span className="text-xs font-mono font-bold">{hasChampions ? '+1.200 ₺ Prim' : 'Yok'}</span>
              </div>

              {/* Output Result */}
              <div className="bg-[#090e17] border border-cyan-500/30 p-4 text-center space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">Tahmini 2. El Değeri</span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  ~{estimatedValue.toLocaleString('tr-TR')} <span className="text-sm font-normal text-cyan-400">₺</span>
                </div>
              </div>

              <Link
                href="/calculate"
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest block text-center shadow-lg shadow-red-600/20"
              >
                Tüm Envanteri Detaylı Hesapla
              </Link>

            </div>
          </div>

        </div>

      </section>

      {/* --- HOW IT WORKS / VALUATION LOGIC EXPLANATION --- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border-t border-white/10 pt-12 space-y-8">
          
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Değerleme Algoritması <span className="text-red-500">Nasıl Çalışır?</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60">
              Valorant hesaplarının değeri rastgele belirlenmez; 3 temel piyasa metriği üzerinden hesaplanır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#101823] border border-white/10 p-6 space-y-3">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-white uppercase">Resmi VP Harcaması (Brüt Değer)</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Envanterinizdeki her silah ve bıçak kaplamasının (Select, Deluxe, Premium, Ultra) mağaza VP fiyatı toplanarak hesaba yatırılan gerçek Türk Lirası tutarı hesaplanır.
              </p>
            </div>

            <div className="bg-[#101823] border border-white/10 p-6 space-y-3">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-white uppercase">Sınırlı & Champions Koleksiyon Primi</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Champions 2021-2024, VCT Lock In, Arcane Sheriff ve Ignite Fan gibi <strong>bir daha asla mağazaya gelmeyecek</strong> eşyalar piyasada değer kaybetmez; aksine koleksiyon değeri kazanır.
              </p>
            </div>

            <div className="bg-[#101823] border border-white/10 p-6 space-y-3">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-white uppercase">2. El Piyasa Amortismanı (%45 - %65)</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Hesap alım-satım piyasasındaki arz-talep dengesi, rank prestiji ve hızlı satış çarpanları hesaba katılarak alıcı ve satıcı için en adil fiyat aralığı belirlenir.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* --- LIVE MARKETPLACE PREVIEW --- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Pazaryeri <span className="text-red-500">İlanları</span>
            </h2>
            <p className="text-xs text-white/60">
              Ekspertizden geçmiş ve doğrulanmış Valorant hesap ilanları.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider"
          >
            <span>Tüm İlanlar ({SEED_LISTINGS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEED_LISTINGS.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href="/marketplace"
              className="bg-[#101823] border border-white/10 hover:border-red-500 p-5 flex flex-col justify-between gap-4 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                  {item.rank}
                </span>
                {item.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Doğrulanmış
                  </span>
                )}
              </div>

              <div className="w-full h-32 bg-[#090e17] p-2 flex items-center justify-center overflow-hidden">
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

      {/* --- RIOT GAMES VP OFFICIAL STORE RATES --- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#101823] border border-white/10 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Resmi Riot Games Valorant Points (VP) Mağaza Paketleri (Türkiye)
            </h3>
            <span className="text-[11px] font-mono text-white/50">Güncel Mağaza Fiyatları</span>
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
              <div key={idx} className="p-3 bg-[#090e17] border border-white/5 space-y-0.5">
                <span className="text-xs font-bold text-white block">{pkg.vp}</span>
                <span className="text-xs font-mono text-cyan-400 font-bold">{pkg.try}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-white/10 text-center text-xs text-white/50 space-y-2">
        <p>
          Geliştirici: <a href="https://github.com/resulaykan" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-red-400 transition-colors">Resul Aykan (@resulaykan)</a>
        </p>
        <p className="text-[11px] text-white/40">
          Spike Worth bağımsız bir topluluk aracıdır; Riot Games veya Valorant ile resmi olarak bağlantılı değildir.
        </p>
      </footer>

    </div>
  );
}