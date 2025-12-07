'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Search, Trash2, Plus, Loader2, Trophy, CheckCircle, Lock, Star, Coins, AlertCircle, ChevronDown, Sword } from 'lucide-react';
import { fetchValorantData, ValorantSkin, ValorantRank } from '@/lib/valorant-api';

export default function ValorantCalculatePage() {
  // Data State
  const [allSkins, setAllSkins] = useState<ValorantSkin[]>([]);
  const [allRanks, setAllRanks] = useState<ValorantRank[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // User Input State
  const [inventory, setInventory] = useState<ValorantSkin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedRankTier, setSelectedRankTier] = useState<number>(0); 
  const [level, setLevel] = useState('');
  const [vp, setVp] = useState('');
  const [rp, setRp] = useState('');

  // UI State
  const [isRankOpen, setIsRankOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<null | { min: number, max: number, details: any }>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [searchResults, setSearchResults] = useState<ValorantSkin[]>([]);

  // Verileri çek
  useEffect(() => {
    async function load() {
      const { skins, ranks } = await fetchValorantData();
      setAllSkins(skins);
      setAllRanks(ranks);
      setLoadingData(false);
    }
    load();
  }, []);

  // Arama filtresi
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const filtered = allSkins.filter(s => 
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
    setSearchResults(filtered);
  }, [searchQuery, allSkins]);

  const addToInventory = (skin: ValorantSkin) => {
    setInventory(prev => [skin, ...prev]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeFromInventory = (index: number) => {
    setInventory(prev => prev.filter((_, i) => i !== index));
  };

  const calculate = () => {
    setIsCalculating(true);
    
    // Kur Bilgisi: 375 VP = 120 TL => 1 VP = 0.32 TL
    const VP_RATE = 120 / 375; 

    setTimeout(() => {
      let totalVP = 0;
      
      // 1. Skinlerin VP Değeri (API'den gelen otomatik fiyat)
      inventory.forEach(skin => {
        totalVP += skin.price;
      });

      // 2. Cüzdan VP
      totalVP += (parseInt(vp) || 0);

      // 3. Radyanit Değeri (10 RP = 1000 VP => 1 RP = 100 VP)
      const rpAmount = (parseInt(rp) || 0);
      totalVP += rpAmount * 100;

      // VP'yi TL'ye çevir
      let tlValue = totalVP * VP_RATE;

      // 4. Rank Değeri (Doğrudan TL olarak ekle)
      // Rank katsayısı: Tier * 30 TL (Örn: Ascendant 1 (Tier 21) = 630 TL)
      const rankVal = selectedRankTier * 30;
      tlValue += rankVal;
      
      // 5. Level Değeri (Sembolik)
      tlValue += (parseInt(level) || 0) * 0.5;

      // Toplam Harcanan Değer (Piyasa değeri değil, harcanan değer gibi)
      // Satış için genellikle bu değerin %50-70'i alınır. Biz "Değer" dediğimiz için tam değeri gösterip
      // satış aralığını aşağıda belirtelim.
      
      const variation = tlValue * 0.05; // %5 sapma
      
      setResult({
        min: Math.floor(tlValue - variation),
        max: Math.floor(tlValue + variation),
        details: {
          totalVP: totalVP,
          vpInTL: Math.floor(totalVP * VP_RATE),
          rankValue: rankVal,
          inventoryCount: inventory.length
        }
      });
      
      setIsCalculating(false);
    }, 1500);
  };

  const currentRank = allRanks.find(r => r.tier === selectedRankTier);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[url('https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/splash.png')] bg-cover bg-fixed bg-center">
      <div className="absolute inset-0 bg-[#0f1923]/95 z-0" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          ANA SAYFAYA DÖN
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: CALCULATOR FORM & INVENTORY */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Account Details Card */}
            <div className="bg-[#1c252e] border border-white/10 p-6 rounded-sm relative group">
               <div className="absolute top-0 left-0 w-1 h-full bg-[#ff4655]" />
               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Star className="w-5 h-5 text-[#ff4655]" /> HESAP DETAYLARI
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                 {/* Rank Selector */}
                 <div className="relative">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Rank</label>
                   <button 
                     onClick={() => setIsRankOpen(!isRankOpen)}
                     className="w-full bg-[#0f1923] border border-white/10 text-white p-3 flex items-center justify-between hover:border-[#ff4655] transition-colors"
                   >
                     <div className="flex items-center gap-3">
                       {currentRank ? (
                         <>
                           <img src={currentRank.largeIcon} alt={currentRank.tierName} className="w-8 h-8 object-contain" />
                           <span className="font-bold">{currentRank.tierName}</span>
                         </>
                       ) : (
                         <span className="text-gray-400">Rank Seçiniz</span>
                       )}
                     </div>
                     <ChevronDown className="w-4 h-4 text-gray-500" />
                   </button>

                   {isRankOpen && (
                     <div className="absolute top-full left-0 w-full bg-[#0f1923] border border-white/10 z-50 max-h-60 overflow-y-auto shadow-xl mt-1 grid grid-cols-1 divide-y divide-white/5">
                       {allRanks.map((r) => (
                         <button
                           key={r.tier}
                           onClick={() => {
                             setSelectedRankTier(r.tier);
                             setIsRankOpen(false);
                           }}
                           className="w-full p-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                         >
                           <img src={r.largeIcon} alt={r.tierName} className="w-8 h-8 object-contain" />
                           <span className="text-sm font-bold text-gray-300">{r.tierName}</span>
                         </button>
                       ))}
                     </div>
                   )}
                 </div>

                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Level</label>
                   <input 
                     type="number" 
                     placeholder="Örn: 150"
                     className="w-full bg-[#0f1923] border border-white/10 text-white p-3 focus:border-[#ff4655] focus:outline-none transition-colors h-[50px]"
                     onChange={(e) => setLevel(e.target.value)}
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">VP Miktarı (Cüzdan)</label>
                   <input 
                     type="number" 
                     placeholder="0"
                     className="w-full bg-[#0f1923] border border-white/10 text-white p-3 focus:border-[#ff4655] focus:outline-none transition-colors h-[50px]"
                     onChange={(e) => setVp(e.target.value)}
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Radyanit</label>
                   <input 
                     type="number" 
                     placeholder="0"
                     className="w-full bg-[#0f1923] border border-white/10 text-white p-3 focus:border-[#ff4655] focus:outline-none transition-colors h-[50px]"
                     onChange={(e) => setRp(e.target.value)}
                   />
                 </div>
               </div>
            </div>

            {/* 2. Inventory Manager */}
            <div className="bg-[#1c252e] border border-white/10 p-6 rounded-sm relative min-h-[400px]">
               <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <Trophy className="w-5 h-5 text-cyan-500" /> ENVANTER YÖNETİMİ
                 </h2>
                 <span className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1 rounded">
                   {inventory.length} EŞYA EKLENDİ
                 </span>
               </div>

               {/* Search Bar */}
               <div className="relative mb-6">
                 <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                   <input 
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder={loadingData ? "Veriler yükleniyor..." : "Skin ara... (Örn: Yağmacı Vandal)"}
                     disabled={loadingData}
                     className="w-full bg-[#0f1923] border border-white/10 text-white pl-12 pr-4 py-4 focus:border-cyan-500 focus:outline-none transition-colors placeholder:text-gray-600"
                   />
                   {loadingData && (
                     <div className="absolute right-4 top-1/2 -translate-y-1/2">
                       <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                     </div>
                   )}
                 </div>

                 {/* Search Results */}
                 {searchResults.length > 0 && (
                   <div className="absolute top-full left-0 w-full bg-[#0f1923] border border-white/10 border-t-0 z-50 max-h-80 overflow-y-auto shadow-2xl">
                     {searchResults.map((skin) => (
                       <button
                         key={skin.uuid}
                         onClick={() => addToInventory(skin)}
                         className="w-full p-3 flex items-center gap-4 hover:bg-white/5 transition-colors border-b border-white/5 text-left group"
                       >
                         <img src={skin.displayIcon} alt={skin.displayName} className="w-16 h-8 object-contain" />
                         <div className="flex-1">
                           <div className="font-bold text-sm text-gray-200 group-hover:text-white flex items-center gap-2">
                             {skin.displayName}
                             {skin.isMelee && <Sword className="w-3 h-3 text-red-500" />}
                           </div>
                           <div className="flex items-center gap-2 mt-1">
                             {skin.tier?.displayIcon && (
                               <img src={skin.tier.displayIcon} alt="tier" className="w-3 h-3 object-contain opacity-70" />
                             )}
                             <span className="text-xs font-medium text-gray-400">
                               {skin.price} VP
                             </span>
                           </div>
                         </div>
                         <Plus className="w-5 h-5 text-gray-500 group-hover:text-cyan-500" />
                       </button>
                     ))}
                   </div>
                 )}
               </div>

               {/* Inventory Grid */}
               {inventory.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-lg text-gray-500">
                   <Search className="w-12 h-12 mb-4 opacity-20" />
                   <p className="font-bold text-sm">ENVANTER BOŞ</p>
                   <p className="text-xs mt-1">Yukarıdaki arama çubuğundan skin ekleyin.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                   {inventory.map((skin, idx) => (
                     <div key={`${skin.uuid}-${idx}`} className="group relative bg-[#0f1923] border border-white/10 p-3 hover:border-white/30 transition-all">
                       <div className="absolute top-2 right-2 flex gap-1 z-10">
                         {skin.tier?.displayIcon && (
                           <div className="bg-black/50 p-1 rounded backdrop-blur-sm">
                              <img src={skin.tier.displayIcon} alt="tier" className="w-4 h-4 object-contain" />
                           </div>
                         )}
                         <button 
                           onClick={() => removeFromInventory(idx)}
                           className="p-1 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded transition-colors opacity-0 group-hover:opacity-100"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                       
                       <div className="aspect-[2/1] mb-2 flex items-center justify-center bg-black/20 rounded relative overflow-hidden">
                          <div 
                            className="absolute inset-0 opacity-20"
                            style={{ background: `radial-gradient(circle at center, ${skin.tier?.highlightColor || '#fff'}, transparent 70%)` }}
                          />
                          <img src={skin.displayIcon} alt={skin.displayName} className="w-full h-full object-contain relative z-10" />
                          {skin.isMelee && (
                            <div className="absolute bottom-1 right-1 bg-red-600 text-white text-[9px] px-1 rounded font-bold uppercase">Bıçak</div>
                          )}
                       </div>
                       
                       <div className="text-center">
                         <div className="text-xs font-bold text-gray-300 truncate" title={skin.displayName}>{skin.displayName}</div>
                         <div className="text-[10px] font-bold text-[#ff4655] mt-1">
                           {skin.price} VP
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
            
            <button 
               onClick={calculate}
               disabled={isCalculating || loadingData}
               className={`w-full py-5 font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 transition-all skew-x-[-10deg] ${isCalculating ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#ff4655] hover:bg-[#bd3944] text-white shadow-[0_0_20px_rgba(255,70,85,0.3)]'}`}
             >
               <span className="skew-x-[10deg] flex items-center gap-2">
                 {isCalculating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Calculator className="w-6 h-6" />}
                 {isCalculating ? 'Analiz Ediliyor...' : 'Hesapla'}
               </span>
             </button>

          </div>

          {/* RIGHT: LIVE RESULT */}
          <div className="lg:col-span-4">
             <div className="sticky top-24 space-y-4">
               
               {/* Result Card */}
               {!result ? (
                 <div className="bg-[#1c252e] border border-white/10 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                   <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                     <Coins className="w-10 h-10 text-gray-600" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-400 uppercase mb-2">SONUÇ BEKLENİYOR</h3>
                   <p className="text-sm text-gray-500">Skinleri ekleyin ve hesapla butonuna basın.</p>
                 </div>
               ) : (
                 <div className="bg-gradient-to-b from-[#1c252e] to-[#0f1923] border border-[#ff4655] p-1 shadow-[0_0_30px_rgba(255,70,85,0.15)] animate-fade-in-up">
                   <div className="bg-[#0f1923] p-6">
                      <div className="text-center pb-6 border-b border-white/10 mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff4655]/10 text-[#ff4655] text-xs font-bold uppercase tracking-widest mb-3 border border-[#ff4655]/20">
                          <CheckCircle className="w-3 h-3" /> Hesap Değeri
                        </div>
                        <div className="text-5xl font-black text-white tracking-tighter">
                          ₺{result.min} <span className="text-gray-600 text-3xl">-</span> ₺{result.max}
                        </div>
                        <div className="text-xs text-gray-500 mt-2 font-medium">Güncel VP Kuru İle Hesaplanmıştır</div>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Toplam Envanter + Cüzdan</span>
                          <span className="font-bold text-gray-200">{result.details.totalVP} VP</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">TL Karşılığı (120/375)</span>
                          <span className="font-bold text-[#ff4655]">₺{result.details.vpInTL}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Rank/Level Değeri</span>
                          <span className="font-bold text-green-400">+₺{result.details.rankValue}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Envanter Sayısı</span>
                          <span className="font-bold text-white">{result.details.inventoryCount} Parça</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button disabled className="w-full py-3 bg-white/10 text-gray-400 font-black uppercase tracking-widest cursor-not-allowed border border-white/5 relative overflow-hidden group">
                          <span className="relative z-10">Pazar Yeri (Yakında)</span>
                          {/* Diagonal striped background for disabled state */}
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTBMMTAgMEgwTDEwIDEwWiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
                        </button>
                        <button 
                          onClick={() => setShowPremiumModal(true)}
                          className="w-full py-3 bg-[#ff4655]/10 border border-[#ff4655]/50 text-[#ff4655] font-bold uppercase tracking-widest hover:bg-[#ff4655] hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                        >
                          <Lock className="w-4 h-4" /> Detaylı Rapor
                        </button>
                      </div>
                   </div>
                 </div>
               )}

               {/* Info Box */}
               <div className="bg-[#1c252e] p-4 border-l-2 border-yellow-500 flex gap-3">
                 <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                 <p className="text-xs text-gray-400 leading-relaxed">
                   <strong className="text-gray-300 block mb-1">Kur Bilgisi</strong>
                   Sistem 375 VP'yi 120 TL olarak baz alır (1 VP ≈ 0.32 TL). Skin fiyatları resmi Valorant mağaza katmanlarına göre otomatik belirlenir.
                 </p>
               </div>

             </div>
          </div>

        </div>
      </div>
      
      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c252e] border border-[#ff4655] max-w-md w-full p-1 relative shadow-[0_0_50px_rgba(255,70,85,0.2)]">
             <div className="bg-[#0f1923] p-8">
                <button 
                  onClick={() => setShowPremiumModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                  X
                </button>
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 text-[#ff4655] mx-auto mb-4" />
                  <h2 className="text-2xl font-black uppercase text-white">PRO ANALİZ</h2>
                  <p className="text-gray-400 text-sm mt-2">Hesabının her kuruşunu hesaplayan detaylı PDF raporu.</p>
                </div>
                <button className="w-full py-4 bg-[#ff4655] text-white font-bold uppercase tracking-widest hover:bg-[#bd3944]">
                  Satın Al (20 TL)
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}