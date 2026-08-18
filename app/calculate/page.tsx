'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  ShoppingBag,
  Layers,
  Star,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchValorantData, ValorantSkin, ValorantRank, FALLBACK_SKINS } from '@/lib/valorant-api';
import { calculateAccountWorth, ValuationReport, ValuationInput } from '@/lib/valuation';
import { insertListingToDb } from '@/lib/turso';

export default function CalculatePage() {
  const [allSkins, setAllSkins] = useState<ValorantSkin[]>(FALLBACK_SKINS);
  const [ranks, setRanks] = useState<ValorantRank[]>([]);

  // Form State
  const [selectedRank, setSelectedRank] = useState<string>('Altın 2');
  const [selectedRankTier, setSelectedRankTier] = useState<number>(14);
  const [accountLevel, setAccountLevel] = useState<number>(125);
  const [walletVP, setWalletVP] = useState<number>(450);
  const [walletRP, setWalletRP] = useState<number>(85);
  const [battlepassCount, setBattlepassCount] = useState<number>(4);

  // Selected Inventory Skins
  const [inventory, setInventory] = useState<ValorantSkin[]>(() => {
    return FALLBACK_SKINS.slice(0, 4); // Default preset with popular skins
  });

  // Filter and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [onlyExclusive, setOnlyExclusive] = useState(false);

  // Report Modal / View
  const [report, setReport] = useState<ValuationReport | null>(null);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [sellerName, setSellerName] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [listingSuccess, setListingSuccess] = useState(false);

  // Fetch live Valorant API data
  useEffect(() => {
    async function loadData() {
      const data = await fetchValorantData();
      if (data.skins.length > 0) setAllSkins(data.skins);
      if (data.ranks.length > 0) setRanks(data.ranks);
    }
    loadData();
  }, []);

  const weaponCategories = ['Tümü', 'Vandal', 'Phantom', 'Melee', 'Operator', 'Sheriff', 'Ghost', 'Classic', 'Diğer'];

  // Filter skins
  const filteredSkins = useMemo(() => {
    return allSkins.filter((skin) => {
      const matchesSearch = skin.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Tümü' || skin.weaponType === selectedCategory;
      const isExcl = skin.price >= 2175 || skin.displayName.toLowerCase().includes('champions') || skin.displayName.toLowerCase().includes('arcane');
      const matchesExcl = !onlyExclusive || isExcl;

      return matchesSearch && matchesCategory && matchesExcl;
    });
  }, [allSkins, searchQuery, selectedCategory, onlyExclusive]);

  // Add / Remove from inventory
  const handleAddSkin = (skin: ValorantSkin) => {
    if (!inventory.some(s => s.uuid === skin.uuid)) {
      setInventory(prev => [skin, ...prev]);
    }
  };

  const handleRemoveSkin = (uuid: string) => {
    setInventory(prev => prev.filter(s => s.uuid !== uuid));
  };

  // Perform Calculation
  const handleCalculate = () => {
    const input: ValuationInput = {
      rank: selectedRank,
      rankTier: selectedRankTier,
      accountLevel,
      walletVP,
      walletRP,
      battlepassCount,
      selectedSkins: inventory.map(s => ({
        uuid: s.uuid,
        displayName: s.displayName,
        price: s.price,
        isChampions: s.displayName.toLowerCase().includes('champions'),
        chromaCount: s.chromas?.length || 1,
        levelCount: s.levels?.length || 1
      }))
    };

    const result = calculateAccountWorth(input);
    setReport(result);
    setListingPrice(String(result.marketEstimatedValueTRY));

    // Fire celebration confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Post to Turso Marketplace
  const handlePostToTurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !listingPrice) return;

    await insertListingToDb({
      seller_name: sellerName,
      title: `${selectedRank} • ${inventory.length} Özel Skinli Valorant Hesabı`,
      description: `${inventory.slice(0, 5).map(s => s.displayName).join(', ')} ve daha fazlası. Toplam ${report?.totalVPSpent || 0} VP değerinde.`,
      price: Number(listingPrice),
      rank: selectedRank,
      rank_tier: selectedRankTier,
      account_level: accountLevel,
      wallet_vp: walletVP,
      wallet_rp: walletRP,
      total_vp: report?.totalVPSpent || 0,
      inventory_count: inventory.length,
      inventory_uuids: inventory.map(s => s.uuid),
      image_urls: inventory[0]?.displayIcon ? [inventory[0].displayIcon] : [],
      status: 'active',
      verified: true
    });

    setListingSuccess(true);
    setTimeout(() => {
      setIsListingModalOpen(false);
      setListingSuccess(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Yapay Zekâ Destekli Piyasa Değerleme Algoritması</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
          Valorant <span className="text-red-500">Hesap Değeri</span> Hesaplayıcı
        </h1>
        <p className="text-xs sm:text-sm text-white/60">
          Envanterinizdeki skinleri, rankınızı ve cüzdan bakiyenizi ekleyin; gerçek 2. el piyasa değerini ve nadirlik primini anında hesaplayın.
        </p>
      </div>

      {/* --- REPORT RESULT MODAL / HERO VIEW IF CALCULATED --- */}
      {report && (
        <div className="hud-panel p-6 sm:p-10 rounded-3xl border-2 border-red-500/40 relative overflow-hidden animate-hologram space-y-8">
          <div className="scanline-effect" />
          
          {/* Top Archetype Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/15 inline-block">
                {report.archetype.badge}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                {report.archetype.title}
              </h2>
              <p className="text-xs text-white/60 max-w-xl">
                {report.archetype.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setReport(null)}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yeniden Hesapla</span>
              </button>

              <button
                onClick={() => setIsListingModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-500/30 flex items-center gap-2 clip-tactical"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pazaryerinde Sat</span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Box 1: Estimated Market Worth */}
            <div className="hud-panel-cyan p-5 rounded-2xl space-y-1 relative">
              <p className="text-[11px] font-mono text-cyan-400 uppercase font-bold">Tavsiye Edilen Piyasa Değeri</p>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {report.marketEstimatedValueTRY.toLocaleString('tr-TR')} <span className="text-sm font-normal text-cyan-400">₺</span>
              </div>
              <p className="text-[11px] text-white/50 font-mono">~${report.marketEstimatedValueUSD} USD</p>
            </div>

            {/* Box 2: Total Invested Money */}
            <div className="hud-panel p-5 rounded-2xl space-y-1">
              <p className="text-[11px] font-mono text-white/60 uppercase font-bold">Harcanan Toplam Para (Brüt)</p>
              <div className="text-2xl sm:text-3xl font-bold text-white/90 font-mono">
                {report.investedCashTRY.toLocaleString('tr-TR')} <span className="text-sm font-normal text-white/50">₺</span>
              </div>
              <p className="text-[11px] text-white/50 font-mono">{report.totalVPSpent.toLocaleString('tr-TR')} VP Harcandı</p>
            </div>

            {/* Box 3: Quick Sell Price */}
            <div className="hud-panel p-5 rounded-2xl space-y-1">
              <p className="text-[11px] font-mono text-amber-400 uppercase font-bold">Hızlı Satış Fiyatı (1-2 Gün)</p>
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
                {report.quickSellValueTRY.toLocaleString('tr-TR')} <span className="text-sm font-normal text-amber-400">₺</span>
              </div>
              <p className="text-[11px] text-white/50 font-mono">Anında alıcı bulur</p>
            </div>

            {/* Box 4: Rarity Score */}
            <div className="hud-panel-red p-5 rounded-2xl space-y-1">
              <p className="text-[11px] font-mono text-rose-400 uppercase font-bold">Nadirlik & Koleksiyon Skoru</p>
              <div className="text-3xl sm:text-4xl font-black text-rose-300 font-mono">
                {report.rarityScore} <span className="text-sm font-normal text-rose-400">/ 100</span>
              </div>
              <p className="text-[11px] text-white/50 font-mono">Sınırlı & Champions primi dahil</p>
            </div>

          </div>

          {/* Top Valued Items in Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Hesabın En Değerli Eşyaları ({report.topValueSkins.length})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {report.topValueSkins.map((skin, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400">{skin.rarityNote}</span>
                    <h5 className="font-bold text-sm text-white mt-1">{skin.displayName}</h5>
                  </div>
                  <div className="text-right text-xs font-mono font-bold text-cyan-400">
                    {skin.price.toLocaleString('tr-TR')} VP Değer
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* --- MAIN 2-COLUMN VALUATION WORKBENCH --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (Step 1 & Selected Inventory) */}
        <div className="space-y-6">
          
          {/* STEP 1: Account Attributes */}
          <div className="hud-panel p-5 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-red-400">
              <ShieldCheck className="w-4 h-4" />
              <span>1. Hesap Genel Bilgileri</span>
            </div>

            {/* Rank Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">Mevcut Rank</label>
              <select
                value={selectedRank}
                onChange={(e) => {
                  const rankName = e.target.value;
                  setSelectedRank(rankName);
                  const matched = ranks.find(r => r.tierName === rankName);
                  if (matched) setSelectedRankTier(matched.tier);
                }}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
              >
                {ranks.length > 0 ? (
                  ranks.map((r) => (
                    <option key={r.tier} value={r.tierName} className="bg-[#0f1923] text-white">
                      {r.tierName}
                    </option>
                  ))
                ) : (
                  ['Demir 1', 'Bronz 2', 'Gümüş 3', 'Altın 2', 'Platin 3', 'Elmas 2', 'Yücelik 1', 'Ölümsüzlük 3', 'Radyant'].map((r) => (
                    <option key={r} value={r} className="bg-[#0f1923] text-white">
                      {r}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Account Level & Battlepasses */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Hesap Seviyesi</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={accountLevel}
                  onChange={(e) => setAccountLevel(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs font-bold outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Savaş Bileti Sayısı</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={battlepassCount}
                  onChange={(e) => setBattlepassCount(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs font-bold outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Wallet VP & RP */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Cüzdandaki VP</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={walletVP}
                  onChange={(e) => setWalletVP(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs font-bold outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/70">Cüzdandaki RP</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={walletRP}
                  onChange={(e) => setWalletRP(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs font-bold outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* SELECTED INVENTORY LIST */}
          <div className="hud-panel p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400">
                <Layers className="w-4 h-4" />
                <span>Seçilen Skinler ({inventory.length})</span>
              </div>

              {inventory.length > 0 && (
                <button
                  onClick={() => setInventory([])}
                  className="text-[10px] font-mono text-red-400 hover:text-red-300"
                >
                  Tümünü Temizle
                </button>
              )}
            </div>

            {/* Inventory Scroll Container */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {inventory.length > 0 ? (
                inventory.map((skin) => (
                  <div 
                    key={skin.uuid}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 group hover:border-red-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-black/40 p-1 shrink-0 flex items-center justify-center">
                        {skin.displayIcon && (
                          <img src={skin.displayIcon} alt={skin.displayName} className="max-h-full max-w-full object-contain" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate">{skin.displayName}</p>
                        <p className="text-[10px] text-white/50 font-mono">{skin.price} VP</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveSkin(skin.uuid)}
                      className="p-1.5 rounded-lg opacity-40 hover:opacity-100 hover:text-red-400 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-2xl space-y-1">
                  <p className="font-bold">Henüz skin seçilmedi</p>
                  <p className="text-[10px]">Sağdaki katalogdan skinleri ekleyin</p>
                </div>
              )}
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              disabled={inventory.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 via-rose-600 to-amber-500 hover:from-red-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed clip-tactical"
            >
              <Calculator className="w-4 h-4" />
              <span>Değerlemeyi Başlat</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN (Skin Catalog Browser) */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="hud-panel p-5 rounded-3xl space-y-4">
            
            {/* Search Bar & Fast Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Skin adı ara (ör: Kuronami, Champions, Yağmacı, Asil)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-sans outline-none focus:border-red-500"
                />
              </div>

              <button
                onClick={() => setOnlyExclusive(!onlyExclusive)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  onlyExclusive 
                    ? 'bg-amber-500 text-black font-extrabold shadow-md shadow-amber-500/20' 
                    : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Nadir / Champions</span>
              </button>
            </div>

            {/* Weapon Type Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {weaponCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skins Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredSkins.map((skin) => {
                const isSelected = inventory.some(s => s.uuid === skin.uuid);

                return (
                  <div
                    key={skin.uuid}
                    onClick={() => isSelected ? handleRemoveSkin(skin.uuid) : handleAddSkin(skin)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 group relative overflow-hidden ${
                      isSelected
                        ? 'bg-red-500/20 border-red-500 shadow-md shadow-red-500/20'
                        : 'bg-white/5 border-white/10 hover:border-red-500/40 hover:bg-white/10'
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Skin Preview Icon */}
                    <div className="w-full aspect-[4/3] rounded-xl bg-black/40 p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {skin.displayIcon ? (
                        <img 
                          src={skin.displayIcon} 
                          alt={skin.displayName} 
                          className="max-h-full max-w-full object-contain filter drop-shadow-md" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-[10px] text-white/40">Görsel Yok</div>
                      )}
                    </div>

                    {/* Skin Info */}
                    <div>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                        {skin.displayName}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                        <span className="text-white/50">{skin.weaponType}</span>
                        <span className="font-bold text-cyan-400">{skin.price} VP</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

      {/* --- POST TO TURSO MARKETPLACE MODAL --- */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="hud-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-white/20 space-y-4">
            
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase">Hesabı Pazaryerine Ekle</h3>
              <p className="text-xs text-white/60">
                Hesap bilgileriniz Turso LibSQL veritabanına kaydedilecek ve anında listelenecektir.
              </p>
            </div>

            {listingSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <p className="font-bold text-sm">İlan Başarıyla Yayınlandı!</p>
                <p className="text-xs opacity-80">Pazaryerine yönlendiriliyorsunuz...</p>
              </div>
            ) : (
              <form onSubmit={handlePostToTurso} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Satıcı Adınız / Discord</label>
                  <input
                    type="text"
                    required
                    placeholder="ör: Resul#1234"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Satış Fiyatı (₺)</label>
                  <input
                    type="number"
                    required
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs font-bold outline-none focus:border-red-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/5 text-[11px] text-white/60 space-y-1">
                  <div className="flex justify-between">
                    <span>Rank:</span>
                    <span className="font-bold text-white">{selectedRank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skin Sayısı:</span>
                    <span className="font-bold text-white">{inventory.length} Adet</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsListingModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold"
                  >
                    İptal
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-500/25 clip-tactical"
                  >
                    İlanı Yayınla
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}