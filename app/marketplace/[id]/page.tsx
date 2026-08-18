'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Star, ShieldCheck, Calendar, Sword } from 'lucide-react';
import { fetchValorantData, ValorantRank, ValorantSkin } from '@/lib/valorant-api';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRelativeTime } from '@/lib/utils';

interface ListingDetail {
  id: string;
  sellerName: string;
  price: number;
  image?: string;
  imageUrls: string[];
  title: string;
  description: string;
  rank: string;
  rankTier?: number;
  walletVP: number;
  walletRP: number;
  accountLevel: number;
  totalVP: number;
  inventoryCount: number;
  inventoryUUIDs: string[];
  status: string;
  createdAt?: string;
}

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [allSkins, setAllSkins] = useState<ValorantSkin[]>([]);
  const [rankData, setRankData] = useState<ValorantRank[]>([]);
  
  // Gallery State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);

  // Payment State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [buyerNote, setBuyerNote] = useState('');

  useEffect(() => {
    async function init() {
       const { skins, ranks } = await fetchValorantData();
       setAllSkins(skins);
       setRankData(ranks);

       if (params.id) {
         fetch(`/api/marketplace/${params.id}`)
          .then(res => res.json())
          .then(data => {
              if (data.error) {
                alert('İlan bulunamadı');
                window.location.href = '/marketplace';
                return;
              }
              const mapped: ListingDetail = {
                id: data.id,
                sellerName: data.seller_name,
                price: data.price,
                image: data.image_url,
                imageUrls: data.image_urls || (data.image_url ? [data.image_url] : []),
                title: data.title,
                description: data.description,
                rank: data.rank,
                rankTier: data.rank_tier,
                walletVP: data.wallet_vp,
                walletRP: data.wallet_rp,
                accountLevel: data.account_level,
                totalVP: data.total_vp,
                inventoryCount: data.inventory_count,
                inventoryUUIDs: data.inventory_uuids || [],
                status: data.status,
                createdAt: data.created_at
              };
              setListing(mapped);
              setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
       }
    }
    init();
  }, [params.id]);

  const getRankIcon = (tier: number) => {
    const r = rankData.find(rd => rd.tier === tier);
    return r ? r.largeIcon : null;
  };

  const handleBuy = async () => {
    if (!listing) return;
    try {
      setIsProcessingPayment(true);
      
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: `Hesap: ${listing.title} (#${listing.id})`,
          price: listing.price,
          note: `Listing ID: ${listing.id}. Note: ${buyerNote}`,
        }),
      });

      if (!response.ok) throw new Error('Payment failed');

      const html = await response.text();
      document.open();
      document.write(html);
      document.close();

    } catch {
      alert('Ödeme simülasyonu tamamlandı.');
      setIsProcessingPayment(false);
    }
  };
  
  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 })
  };

  const nextImage = () => {
    if (!listing) return;
    setSlideDirection(1);
    setCurrentImageIndex(prev => (prev === (listing.imageUrls.length - 1) ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!listing) return;
    setSlideDirection(-1);
    setCurrentImageIndex(prev => (prev === 0 ? listing.imageUrls.length - 1 : prev - 1));
  };

  if (loading || !listing) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#ff4655] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 bg-[#080c14]">
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <Link href="/marketplace" className="inline-flex items-center text-gray-400 hover:text-white mb-8 group transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          PAZAR YERİNE DÖN
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left: Gallery (Col Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-black relative group overflow-hidden border border-white/10 rounded-2xl shadow-2xl">
                <AnimatePresence initial={false} custom={slideDirection}>
                  <motion.img
                    key={currentImageIndex}
                    src={listing.imageUrls[currentImageIndex] || listing.image}
                    custom={slideDirection}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                    className="absolute inset-0 w-full h-full object-contain bg-[#1c252e]"
                    alt={listing.title}
                  />
                </AnimatePresence>
                
                {/* Navigation */}
                {listing.imageUrls.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#ff4655] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20">
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#ff4655] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20">
                      <ArrowLeft className="w-6 h-6 rotate-180" />
                    </button>
                    {/* Thumbs */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/50 p-2 rounded-full backdrop-blur-sm">
                      {listing.imageUrls.map((_, idx: number) => (
                        <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${currentImageIndex === idx ? 'bg-[#ff4655]' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
            </div>

            {/* Description */}
            <div className="hud-panel p-8 rounded-2xl">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                 <Star className="w-5 h-5 text-[#ff4655]" /> İLAN AÇIKLAMASI
               </h3>
               <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>

          {/* Right: Info & Action */}
          <div className="space-y-6">
             {/* Price Card */}
             <div className="hud-panel border border-[#ff4655]/50 p-6 rounded-2xl">
                <h1 className="text-2xl font-black text-white uppercase mb-2">{listing.title}</h1>
                <div className="flex items-center gap-2 mb-6">
                   <ShieldCheck className="w-4 h-4 text-emerald-400" />
                   <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Güvenilir Satıcı</span>
                   <span className="text-gray-400 text-xs">| {listing.sellerName}</span>
                   {listing.createdAt && (
                     <span className="text-gray-400 text-xs flex items-center gap-1 ml-2">
                       <Calendar className="w-3 h-3" />
                       {formatRelativeTime(listing.createdAt)}
                     </span>
                   )}
                </div>

                <div className="flex items-end gap-2 mb-6 border-b border-white/10 pb-6">
                  <span className="text-5xl font-black text-[#ff4655]">₺{listing.price.toLocaleString('tr-TR')}</span>
                  <span className="text-gray-400 mb-2 font-medium">TL</span>
                </div>

                <div className="space-y-4 mb-6">
                   <div>
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Satıcıya Not</label>
                     <textarea 
                        className="w-full bg-[#080c14] border border-white/10 p-3 text-white text-sm focus:border-[#ff4655] focus:outline-none resize-none h-20 rounded-xl"
                        placeholder="Discord ID vb. iletişim bilgisi..."
                        value={buyerNote}
                        onChange={e => setBuyerNote(e.target.value)}
                     />
                   </div>
                   <button 
                     onClick={handleBuy}
                     disabled={isProcessingPayment}
                     className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 clip-tactical"
                   >
                     {isProcessingPayment ? <Loader2 className="animate-spin" /> : 'HEMEN SATIN AL'}
                   </button>
                </div>
                
                <div className="text-xs text-center text-gray-400">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                  Ödemeniz SpikeWorth güvencesindedir.
                </div>
             </div>

             {/* Stats Card */}
             <div className="hud-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                   <div className="flex items-center gap-3">
                      {listing.rankTier && getRankIcon(listing.rankTier) && (
                        <img src={getRankIcon(listing.rankTier)!} className="w-10 h-10 object-contain" alt="rank" />
                      )}
                      <div>
                        <div className="text-xs text-gray-400 uppercase">Rank</div>
                        <div className="font-bold text-white">{listing.rank}</div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-xs text-gray-400 uppercase mb-1">Level</div>
                      <div className="font-bold text-white text-lg">{listing.accountLevel || 0}</div>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-xs text-gray-400 uppercase mb-1">Envanter</div>
                      <div className="font-bold text-white text-lg">{listing.inventoryCount}</div>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-xs text-gray-400 uppercase mb-1">VP</div>
                      <div className="font-bold text-cyan-400 text-lg">{listing.walletVP || 0}</div>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-xs text-gray-400 uppercase mb-1">RP</div>
                      <div className="font-bold text-amber-400 text-lg">{listing.walletRP || 0}</div>
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* Inventory Full List */}
        {listing.inventoryUUIDs.length > 0 && (
          <div className="mb-20 space-y-6">
             <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3">
               <Sword className="w-6 h-6 text-red-500" /> Hesap Envanteri
             </h2>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {listing.inventoryUUIDs.map((uuid: string) => {
                   const skin = allSkins.find(s => s.uuid === uuid);
                   if (!skin) return null;
                   return (
                     <div key={uuid} className="hud-panel p-4 rounded-xl group hover:border-red-500 transition-all">
                        <div className="aspect-[2/1] relative mb-3 flex items-center justify-center">
                           <img src={skin.displayIcon} alt={skin.displayName} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="text-center">
                           <div className="text-white font-bold text-sm truncate" title={skin.displayName}>{skin.displayName}</div>
                           <div className="text-cyan-400 text-xs font-mono font-bold mt-1">{skin.price} VP</div>
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
