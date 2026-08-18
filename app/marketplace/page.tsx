'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  CreditCard, 
  AlertCircle, 
  Loader2, 
  Layers, 
  Mail, 
  Tag, 
  ImageIcon, 
  Sparkles, 
  Copy, 
  Check 
} from 'lucide-react';
import { AccountListing, SEED_LISTINGS } from '@/lib/turso';

export default function MarketplacePage() {
  const [listings, setListings] = useState<AccountListing[]>(SEED_LISTINGS);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRank, setSelectedRank] = useState('Tümü');
  const [onlyFirstMail, setOnlyFirstMail] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(15000);

  // Modal States
  const [selectedListing, setSelectedListing] = useState<AccountListing | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [copiedTag, setCopiedTag] = useState(false);

  // Detailed Form State for New Listing
  const [newSeller, setNewSeller] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRiotTag, setNewRiotTag] = useState('');
  const [hasFirstMail, setHasFirstMail] = useState(true);
  const [newBattlepassCount, setNewBattlepassCount] = useState(4);
  const [newWalletVP, setNewWalletVP] = useState(500);
  const [newWalletRP, setNewWalletRP] = useState(60);
  const [newRank, setNewRank] = useState('Ölümsüzlük 1');
  const [newLevel, setNewLevel] = useState(140);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Submit Status
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Close all modals handler
  const closeAllModals = useCallback(() => {
    setSelectedListing(null);
    setIsAddModalOpen(false);
    setPurchaseSuccess(false);
    setSubmitError(null);
  }, []);

  // Global ESC key listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    };

    const isAnyModalOpen = Boolean(selectedListing || isAddModalOpen);
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedListing, isAddModalOpen, closeAllModals]);

  // Fetch live listings from server API
  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/marketplace');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setListings(data);
        }
      }
    } catch (err) {
      console.warn('API error, using seed listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const ranksList = ['Tümü', 'Demir', 'Bronz', 'Gümüş', 'Altın', 'Platin', 'Elmas', 'Yücelik', 'Ölümsüzlük', 'Radyant'];

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.riot_tag && item.riot_tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRank = selectedRank === 'Tümü' || item.rank.toLowerCase().includes(selectedRank.toLowerCase());
      const matchesFirstMail = !onlyFirstMail || item.has_first_mail;
      const matchesPrice = item.price <= maxPrice;

      return matchesSearch && matchesRank && matchesFirstMail && matchesPrice;
    });
  }, [listings, searchQuery, selectedRank, onlyFirstMail, maxPrice]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSeller || !newPrice) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        seller_name: newSeller,
        seller_email: newEmail,
        riot_tag: newRiotTag,
        has_first_mail: hasFirstMail,
        battlepass_count: Number(newBattlepassCount),
        title: newTitle,
        description: newDesc,
        price: Number(newPrice),
        rank: newRank,
        rank_tier: 24,
        account_level: Number(newLevel),
        wallet_vp: Number(newWalletVP),
        wallet_rp: Number(newWalletRP),
        total_vp: Number(newWalletVP) + 38000,
        inventory_count: 24,
        customImageUrl: customImageUrl,
        image_urls: customImageUrl ? [customImageUrl] : ['https://media.valorant-api.com/weaponskins/9bf19b77-4b33-7203-9f2c-16932970622f/displayicon.png']
      };

      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error || 'İlan kaydedilemedi.');
        return;
      }

      if (json.listing) {
        setListings(prev => [json.listing, ...prev]);
      }

      setIsAddModalOpen(false);
      // Reset form
      setNewTitle('');
      setNewPrice('');
      setNewDesc('');
      setNewSeller('');
      setNewEmail('');
      setNewRiotTag('');
      setCustomImageUrl('');
    } catch (err) {
      console.error(err);
      setSubmitError('Bağlantı hatası oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyRiotTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
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
            İlk mail durumu, cüzdan VP/RP ve envanter detaylarıyla onaylı hesap pazaryeri.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-600/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Detaylı İlan Ver</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#101823] border border-white/10 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Başlık, satıcı veya Riot ID ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#090e17] border border-white/10 text-white text-xs outline-none focus:border-red-500"
            />
          </div>

          {/* Rank Filter */}
          <div className="space-y-1">
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="w-full p-2.5 bg-[#090e17] border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
            >
              {ranksList.map((r) => (
                <option key={r} value={r} className="bg-[#090e17] text-white">Rank: {r}</option>
              ))}
            </select>
          </div>

          {/* First Mail Only Filter */}
          <div>
            <button
              onClick={() => setOnlyFirstMail(!onlyFirstMail)}
              className={`w-full p-2.5 text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                onlyFirstMail
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-[#090e17] border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{onlyFirstMail ? '✓ Sadece İlk Mail Dahil' : 'Tüm Mail Durumları'}</span>
            </button>
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
              max="25000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 appearance-none cursor-pointer bg-white/10 accent-red-500"
            />
          </div>

        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center space-y-3 text-white/50">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          <span className="text-xs font-mono">İlanlar yükleniyor...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedListing(item)}
              className="bg-[#101823] border border-white/10 hover:border-red-500 p-5 flex flex-col justify-between gap-4 transition-all cursor-pointer group relative"
            >
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                  {item.rank} • Lv.{item.account_level}
                </span>

                <div className="flex items-center gap-1.5">
                  {item.has_first_mail ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      İlk Mail
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/5 text-white/50 border border-white/10">
                      Mail Değişir
                    </span>
                  )}
                </div>
              </div>

              {/* Weapon / Inventory Image */}
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
                  <Layers className="w-8 h-8 text-white/20" />
                )}
              </div>

              {/* Wallet Info Pill */}
              <div className="flex items-center justify-between text-[10px] font-mono px-3 py-1.5 bg-[#090e17] border border-white/5 text-white/70">
                <span className="flex items-center gap-1 text-cyan-400 font-bold">
                  <Sparkles className="w-3 h-3" />
                  {item.wallet_vp || 0} VP
                </span>
                <span className="text-amber-400 font-bold">
                  {item.wallet_rp || 0} RP
                </span>
                {item.battlepass_count ? (
                  <span className="text-purple-400">
                    {item.battlepass_count} BP
                  </span>
                ) : null}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-red-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Price & Action */}
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
      )}

      {/* --- LISTING DETAIL MODAL (ESC / BACKDROP TO CLOSE) --- */}
      {selectedListing && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAllModals();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-[#101823] border border-white/20 p-6 sm:p-8 max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-red-400">{selectedListing.rank} • Seviye {selectedListing.account_level}</span>
                  {selectedListing.has_first_mail ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      ✓ İlk Mail Dahil
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white/10 text-white/60 border border-white/20">
                      Mail Değişimi Açık
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 uppercase">{selectedListing.title}</h2>
              </div>
              <button 
                onClick={closeAllModals}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Kapat (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inventory Image */}
            <div className="w-full h-52 bg-[#090e17] p-4 flex items-center justify-center border border-white/5">
              {selectedListing.image_urls?.[0] ? (
                <img 
                  src={selectedListing.image_urls[0]} 
                  alt="" 
                  className="max-h-full max-w-full object-contain filter drop-shadow-2xl" 
                />
              ) : (
                <Layers className="w-12 h-12 text-white/20" />
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-[#090e17] border border-white/5">
                <span className="text-[10px] font-mono text-white/50 block">Cüzdan VP</span>
                <span className="font-bold text-sm text-cyan-400">{selectedListing.wallet_vp || 0} VP</span>
              </div>
              <div className="p-3 bg-[#090e17] border border-white/5">
                <span className="text-[10px] font-mono text-white/50 block">Cüzdan RP</span>
                <span className="font-bold text-sm text-amber-400">{selectedListing.wallet_rp || 0} RP</span>
              </div>
              <div className="p-3 bg-[#090e17] border border-white/5">
                <span className="text-[10px] font-mono text-white/50 block">Savaş Bileti</span>
                <span className="font-bold text-sm text-purple-400">{selectedListing.battlepass_count || 0} Adet</span>
              </div>
              <div className="p-3 bg-[#090e17] border border-white/5">
                <span className="text-[10px] font-mono text-white/50 block">Skin Sayısı</span>
                <span className="font-bold text-sm text-white">{selectedListing.inventory_count || 12} Adet</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold uppercase text-white/70">İlan Açıklaması</h4>
              <p className="text-xs text-white/80 leading-relaxed p-3.5 bg-[#090e17] border border-white/5 whitespace-pre-line">
                {selectedListing.description}
              </p>
            </div>

            {/* Seller Contact Info Card */}
            <div className="p-4 bg-[#090e17] border border-white/10 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-white/70">Satıcı & İletişim Bilgileri</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-2 bg-black/40 border border-white/5">
                  <span className="text-white/50">Satıcı:</span>
                  <span className="font-bold text-white">{selectedListing.seller_name}</span>
                </div>

                {selectedListing.riot_tag && (
                  <div className="flex items-center justify-between p-2 bg-black/40 border border-white/5">
                    <span className="text-white/50">Riot ID:</span>
                    <button 
                      onClick={() => copyRiotTag(selectedListing.riot_tag!)}
                      className="font-mono font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                      title="Kopyala"
                    >
                      <span>{selectedListing.riot_tag}</span>
                      {copiedTag ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
                    </button>
                  </div>
                )}

                {selectedListing.seller_email && (
                  <div className="flex items-center justify-between p-2 bg-black/40 border border-white/5 sm:col-span-2">
                    <span className="text-white/50">E-Posta:</span>
                    <a href={`mailto:${selectedListing.seller_email}`} className="font-mono font-bold text-cyan-400 hover:underline">
                      {selectedListing.seller_email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Purchase Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div>
                <span className="text-[10px] text-white/50 block">Güvenli Satış Bedeli:</span>
                <div className="text-3xl font-black text-white font-mono">
                  {selectedListing.price.toLocaleString('tr-TR')} <span className="text-xs text-red-400">₺</span>
                </div>
              </div>

              {purchaseSuccess ? (
                <div className="px-6 py-3 bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Satıcıya Satın Alma Bildirimi Gönderildi!</span>
                </div>
              ) : (
                <button
                  onClick={() => setPurchaseSuccess(true)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Satıcıyla İletişime Geç & Satın Al</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- DETAILED ADD LISTING MODAL (ESC / BACKDROP TO CLOSE) --- */}
      {isAddModalOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAllModals();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-[#101823] border border-white/20 p-6 sm:p-8 max-w-xl w-full space-y-5 max-h-[92vh] overflow-y-auto relative shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white uppercase">Detaylı İlan Oluştur</h3>
                <p className="text-xs text-white/50">Tüm bilgileri eksiksiz doldurarak hesabınızı güvenle yayınlayın. (ESC ile kapat)</p>
              </div>
              <button 
                onClick={closeAllModals} 
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Kapat (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="p-3 bg-red-500/15 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleCreateListing} className="space-y-4">
              
              {/* Bölüm 1: Satıcı & İletişim */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase text-red-500 block">1. Satıcı & İletişim Bilgileri</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white/70">Satıcı Adı / Rumuz *</label>
                    <input
                      type="text"
                      required
                      placeholder="ör: Resul Aykan"
                      value={newSeller}
                      onChange={(e) => setNewSeller(e.target.value)}
                      className="w-full p-2.5 bg-[#090e17] border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white/70">İletişim E-Postası *</label>
                    <input
                      type="email"
                      required
                      placeholder="ornek@gmail.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full p-2.5 bg-[#090e17] border border-white/10 text-white text-xs outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Riot Hesabının Etiketi (Riot ID#TAG)</label>
                  <div className="relative">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      placeholder="ör: Resul#TR1"
                      value={newRiotTag}
                      onChange={(e) => setNewRiotTag(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#090e17] border border-white/10 text-white text-xs font-mono outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bölüm 2: Hesap Durumu & İlk Mail */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-mono font-bold uppercase text-cyan-400 block">2. Hesap Güvenliği & Mail Durumu</span>
                
                <div 
                  onClick={() => setHasFirstMail(!hasFirstMail)}
                  className={`p-3.5 border cursor-pointer flex items-center justify-between transition-all ${
                    hasFirstMail
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-[#090e17] border-white/10 text-white/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <div>
                      <span className="text-xs font-bold block">İlk Mail İle Birlikte Teslim Edilecek</span>
                      <span className="text-[10px] opacity-70">Alıcı için en güvenli satış türüdür</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold">{hasFirstMail ? 'EVET (Dahil)' : 'HAYIR'}</span>
                </div>
              </div>

              {/* Bölüm 3: Cüzdan, Seviye ve Rank */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-mono font-bold uppercase text-amber-400 block">3. Cüzdan & Hesap İstatistikleri</span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold">Cüzdan VP</label>
                    <input
                      type="number"
                      min="0"
                      value={newWalletVP}
                      onChange={(e) => setNewWalletVP(Number(e.target.value))}
                      className="w-full p-2 bg-[#090e17] border border-white/10 text-white font-mono text-xs outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold">Cüzdan RP</label>
                    <input
                      type="number"
                      min="0"
                      value={newWalletRP}
                      onChange={(e) => setNewWalletRP(Number(e.target.value))}
                      className="w-full p-2 bg-[#090e17] border border-white/10 text-white font-mono text-xs outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold">Savaş Bileti</label>
                    <input
                      type="number"
                      min="0"
                      value={newBattlepassCount}
                      onChange={(e) => setNewBattlepassCount(Number(e.target.value))}
                      className="w-full p-2 bg-[#090e17] border border-white/10 text-white font-mono text-xs outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold">Seviye</label>
                    <input
                      type="number"
                      min="1"
                      value={newLevel}
                      onChange={(e) => setNewLevel(Number(e.target.value))}
                      className="w-full p-2 bg-[#090e17] border border-white/10 text-white font-mono text-xs outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Mevcut Rank</label>
                  <select
                    value={newRank}
                    onChange={(e) => setNewRank(e.target.value)}
                    className="w-full p-2.5 bg-[#090e17] border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
                  >
                    {ranksList.filter(r => r !== 'Tümü').map((r) => (
                      <option key={r} value={r} className="bg-[#090e17] text-white">{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bölüm 4: İlan Başlığı, Fiyat ve Fotoğraf */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-mono font-bold uppercase text-white/60 block">4. İlan Başlığı & Envanter Fotoğrafı</span>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">İlan Başlığı *</label>
                  <input
                    type="text"
                    required
                    placeholder="ör: Champions 2021 Vandal + Yağmacı Setli Immortal 3 Hesap"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-[#090e17] border border-white/10 text-white text-xs font-bold outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white/70">Satış Fiyatı (₺) *</label>
                    <input
                      type="number"
                      required
                      placeholder="4500"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full p-2.5 bg-[#090e17] border border-white/10 text-white font-mono text-xs font-bold outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white/70">Envanter Fotoğrafı / Görsel Linki</label>
                    <div className="relative">
                      <ImageIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        type="url"
                        placeholder="https://... (Hızlı resim linki)"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#090e17] border border-white/10 text-white text-xs outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/70">Açıklama & Öne Çıkan Skinler</label>
                  <textarea
                    rows={3}
                    placeholder="Hesaptaki bıçaklar, bitiricisi açık vandal skinleri ve teslimat şartlarını detaylandırın..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-2.5 bg-[#090e17] border border-white/10 text-white text-xs outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/30 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{submitting ? 'Veritabanına Kaydediliyor...' : 'İlanı Güvenle Yayınla'}</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
