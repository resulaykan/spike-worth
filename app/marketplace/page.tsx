'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Plus, 
  ExternalLink,
  CheckCircle2,
  X,
  CreditCard
} from 'lucide-react';
import { fetchListingsFromDb, insertListingToDb, AccountListing, SEED_LISTINGS } from '@/lib/turso';

export default function MarketplacePage() {
  const [listings, setListings] = useState<AccountListing[]>(SEED_LISTINGS);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRank, setSelectedRank] = useState('Tümü');
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  // Modal States
  const [selectedListing, setSelectedListing] = useState<AccountListing | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Form State for New Listing
  const [newTitle, setNewTitle] = useState('');
  const [newSeller, setNewSeller] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newRank, setNewRank] = useState('Ölümsüzlük 1');
  const [newLevel, setNewLevel] = useState(140);
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    async function loadData() {
      const dbListings = await fetchListingsFromDb();
      if (dbListings.length > 0) setListings(dbListings);
    }
    loadData();
  }, []);

  const ranksList = ['Tümü', 'Demir', 'Bronz', 'Gümüş', 'Altın', 'Platin', 'Elmas', 'Yücelik', 'Ölümsüzlük', 'Radyant'];

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRank = selectedRank === 'Tümü' || item.rank.toLowerCase().includes(selectedRank.toLowerCase());
      const matchesPrice = item.price <= maxPrice;

      return matchesSearch && matchesRank && matchesPrice;
    });
  }, [listings, searchQuery, selectedRank, maxPrice]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSeller || !newPrice) return;

    const created = await insertListingToDb({
      seller_name: newSeller,
      title: newTitle,
      description: newDesc,
      price: Number(newPrice),
      rank: newRank,
      rank_tier: 24,
      account_level: Number(newLevel),
      wallet_vp: 500,
      wallet_rp: 60,
      total_vp: 38000,
      inventory_count: 24,
      inventory_uuids: [],
      image_urls: ['https://media.valorant-api.com/weaponskins/2a3b04c8-4720-c918-a6b1-a6bcf3650228/displayicon.png'],
      status: 'active',
      verified: true
    });

    setListings(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewPrice('');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header & CTA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Valorant <span className="text-red-500">Hesap Pazarı</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Ekspertizden geçmiş onaylı Valorant hesaplarını inceleyin veya hesabınızı güvenle ilana koyun.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-600/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>İlan Oluştur</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#101823] border border-white/10 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="İlan başlığı, satıcı veya skin adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#090e17] border border-white/10 text-white text-xs outline-none focus:border-red-500"
            />
          </div>

          {/* Rank Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-white/50 uppercase">Rank Filtresi</label>
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="w-full p-2.5 bg-[#090e17] border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
            >
              {ranksList.map((r) => (
                <option key={r} value={r} className="bg-[#090e17] text-white">{r}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-white/50">
              <span>Maksimum Fiyat</span>
              <span className="text-cyan-400 font-bold">{maxPrice.toLocaleString('tr-TR')} ₺</span>
            </div>
            <input
              type="range"
              min="500"
              max="20000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 appearance-none cursor-pointer bg-white/10 accent-red-500"
            />
          </div>

        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedListing(item)}
            className="bg-[#101823] border border-white/10 hover:border-red-500 p-5 flex flex-col justify-between gap-4 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                {item.rank} • Lv.{item.account_level}
              </span>

              {item.verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Doğrulanmış
                </span>
              )}
            </div>

            <div className="w-full h-36 bg-[#090e17] p-3 flex items-center justify-center overflow-hidden">
              {item.image_urls?.[0] ? (
                <img 
                  src={item.image_urls[0]} 
                  alt="" 
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl" 
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-xs text-white/30">Valorant Hesabı</div>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-red-400 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-white/40 block">İlan Fiyatı</span>
                <span className="text-xl font-black text-white font-mono">
                  {item.price.toLocaleString('tr-TR')} <span className="text-xs text-red-400">₺</span>
                </span>
              </div>

              <span className="flex items-center gap-1 text-xs font-bold text-red-400 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                İncele
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* --- LISTING DETAIL MODAL --- */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#101823] border border-white/20 p-6 sm:p-8 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-red-400">{selectedListing.rank} • Seviye {selectedListing.account_level}</span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 uppercase">{selectedListing.title}</h2>
              </div>
              <button 
                onClick={() => { setSelectedListing(null); setPurchaseSuccess(false); }}
                className="p-2 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-48 bg-[#090e17] p-4 flex items-center justify-center">
              {selectedListing.image_urls?.[0] && (
                <img src={selectedListing.image_urls[0]} alt="" className="max-h-full max-w-full object-contain filter drop-shadow-2xl" />
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#090e17] border border-white/5">
                <span className="text-[10px] font-mono text-white/50 block">Cüzdan VP</span>
                <span className="font-bold text-sm text-cyan-400">{selectedListing.wallet_vp || 0} VP</span>
              </div>
              <div className="p-3 bg-[#090e17] border border-white/5">
                <span className="text-[10px] font-mono text-white/50 block">Cüzdan RP</span>
                <span className="font-bold text-sm text-amber-400">{selectedListing.wallet_rp || 0} RP</span>
              </div>
              <div className="p-3 bg-[#090e17] border border-white/5">
                <span className="text-[10px] font-mono text-white/50 block">Toplam Skin</span>
                <span className="font-bold text-sm text-white">{selectedListing.inventory_count || 12} Adet</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold uppercase text-white/70">İlan Açıklaması</h4>
              <p className="text-xs text-white/80 leading-relaxed p-3.5 bg-[#090e17] border border-white/5">
                {selectedListing.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div>
                <span className="text-[10px] text-white/50">Satıcı: <strong>{selectedListing.seller_name}</strong></span>
                <div className="text-3xl font-black text-white font-mono">
                  {selectedListing.price.toLocaleString('tr-TR')} <span className="text-xs text-red-400">₺</span>
                </div>
              </div>

              {purchaseSuccess ? (
                <div className="px-6 py-3 bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Satıcıya Talep İletildi!</span>
                </div>
              ) : (
                <button
                  onClick={() => setPurchaseSuccess(true)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Satın Alma Talebi Gönder</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- ADD NEW LISTING MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#101823] border border-white/20 p-6 sm:p-8 max-w-md w-full space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase">Yeni İlan Oluştur</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/70">İlan Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="ör: Champions 2021 Vandal + Asil Setli Immortal Hesap"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 bg-[#090e17] border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Satıcı Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="ör: Resul#TR1"
                    value={newSeller}
                    onChange={(e) => setNewSeller(e.target.value)}
                    className="w-full p-3 bg-[#090e17] border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Fiyat (₺)</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-3 bg-[#090e17] border border-white/10 text-white font-mono text-xs font-bold outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Rank</label>
                  <select
                    value={newRank}
                    onChange={(e) => setNewRank(e.target.value)}
                    className="w-full p-3 bg-[#090e17] border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
                  >
                    {ranksList.filter(r => r !== 'Tümü').map((r) => (
                      <option key={r} value={r} className="bg-[#090e17] text-white">{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Hesap Seviyesi</label>
                  <input
                    type="number"
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value))}
                    className="w-full p-3 bg-[#090e17] border border-white/10 text-white font-mono text-xs font-bold outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/70">Açıklama</label>
                <textarea
                  rows={3}
                  placeholder="Hesabın öne çıkan skinlerini ve detaylarını yazın..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 bg-[#090e17] border border-white/10 text-white text-xs outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 mt-2"
              >
                İlanı Yayınla
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
