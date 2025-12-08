'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Star, ShieldCheck, Calendar, Sword } from 'lucide-react';
import { fetchValorantData, ValorantRank, ValorantSkin } from '@/lib/valorant-api';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRelativeTime } from '@/lib/utils';

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<any>(null);
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
       // 1. Fetch Valorant Data
       const { skins, ranks } = await fetchValorantData();
       setAllSkins(skins);
       setRankData(ranks);

       // 2. Fetch Listing Data
       if (params.id) {
         fetch(`/api/marketplace/${params.id}`)
          .then(res => res.json())
          .then(data => {
              if (data.error) {
                alert('İlan bulunamadı');
                window.location.href = '/marketplace';
                return;
              }
              // Map snake_case to camelCase
              const mapped = {
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

    } catch (error) {
      alert('Ödeme başlatılamadı.');
      setIsProcessingPayment(false);
    }
  };
  
  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 })
  };

  const nextImage = () => {
    setSlideDirection(1);
    setCurrentImageIndex(prev => (prev === (listing.imageUrls.length - 1) ? 0 : prev + 1));
  };

  const prevImage = () => {
    setSlideDirection(-1);
    setCurrentImageIndex(prev => (prev === 0 ? listing.imageUrls.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1923] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#ff4655] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0f1923]">
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[url('https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/splash.png')] bg-cover bg-center" />
      
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
            <div className="aspect-video bg-black relative group overflow-hidden border border-white/10 rounded-lg shadow-2xl">
                <AnimatePresence initial={false} custom={slideDirection}>
                  <motion.img
                    key={currentImageIndex}
                    src={listing.imageUrls[currentImageIndex]}
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
                      {listing.imageUrls.map((_: any, idx: number) => (
                        <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${currentImageIndex === idx ? 'bg-[#ff4655]' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
            </div>

            {/* Description */}
            <div className="bg-[#1c252e] border border-white/10 p-8 rounded-lg">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                 <Star className="w-5 h-5 text-[#ff4655]" /> İLAN AÇIKLAMASI
               </h3>
               <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>

          {/* Right: Info & Action */}
          <div className="space-y-6">
             {/* Price Card */}
             <div className="bg-[#1c252e] border border-[#ff4655] p-6 rounded-lg shadow-[0_0_30px_rgba(255,70,85,0.1)]">
                <h1 className="text-2xl font-black text-white uppercase mb-2">{listing.title}</h1>
                <div className="flex items-center gap-2 mb-6">
                   <ShieldCheck className="w-4 h-4 text-green-500" />
                   <span className="text-green-500 text-xs font-bold uppercase tracking-widest">Güvenilir Satıcı</span>
                   <span className="text-gray-500 text-xs">| {listing.sellerName}</span>
                   <span className="text-gray-500 text-xs flex items-center gap-1 ml-2">
                     <Calendar className="w-3 h-3" />
                     {listing.createdAt ? formatRelativeTime(listing.createdAt) : ''}
                   </span>
                </div>

                <div className="flex items-end gap-2 mb-6 border-b border-white/10 pb-6">
                  <span className="text-5xl font-black text-[#ff4655]">₺{listing.price}</span>
                  <span className="text-gray-400 mb-2 font-medium">TL</span>
                </div>

                <div className="space-y-4 mb-6">
                   <div>
                     <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Satıcıya Not</label>
                     <textarea 
                        className="w-full bg-[#0f1923] border border-white/10 p-3 text-white text-sm focus:border-[#ff4655] focus:outline-none resize-none h-20 rounded"
                        placeholder="Discord ID vb. iletişim bilgisi..."
                        value={buyerNote}
                        onChange={e => setBuyerNote(e.target.value)}
                     />
                   </div>
                   <button 
                     onClick={handleBuy}
                     disabled={isProcessingPayment}
                     className="w-full py-4 bg-[#ff4655] hover:bg-[#bd3944] text-white font-black uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff4655]/20"
                   >
                     {isProcessingPayment ? <Loader2 className="animate-spin" /> : 'HEMEN SATIN AL'}
                   </button>
                </div>
                
                <div className="text-xs text-center text-gray-500">
                  <ShieldCheck className="w-3 h-3 inline mr-1" />
                  Ödemeniz SpikeWorth güvencesindedir.
                </div>
             </div>

             {/* Stats Card */}
             <div className="bg-[#1c252e] border border-white/10 p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#0f1923] rounded border border-white/5">
                   <div className="flex items-center gap-3">
                      {listing.rankTier && getRankIcon(listing.rankTier) && (
                        <img src={getRankIcon(listing.rankTier)!} className="w-10 h-10 object-contain" alt="rank" />
                      )}
                      <div>
                        <div className="text-xs text-gray-500 uppercase">Rank</div>
                        <div className="font-bold text-white">{listing.rank}</div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-[#0f1923] rounded border border-white/5">
                      <div className="text-xs text-gray-500 uppercase mb-1">Level</div>
                      <div className="font-bold text-white text-lg">{listing.accountLevel || 0}</div>
                   </div>
                   <div className="p-3 bg-[#0f1923] rounded border border-white/5">
                      <div className="text-xs text-gray-500 uppercase mb-1">Envanter</div>
                      <div className="font-bold text-white text-lg">{listing.inventoryCount}</div>
                   </div>
                   <div className="p-3 bg-[#0f1923] rounded border border-white/5">
                      <div className="text-xs text-gray-500 uppercase mb-1">VP</div>
                      <div className="font-bold text-[#ff4655] text-lg">{listing.walletVP || 0}</div>
                   </div>
                   <div className="p-3 bg-[#0f1923] rounded border border-white/5">
                      <div className="text-xs text-gray-500 uppercase mb-1">RP</div>
                      <div className="font-bold text-white text-lg">{listing.walletRP || 0}</div>
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* Inventory Full List */}
        {listing.inventoryUUIDs.length > 0 && (
          <div className="mb-20">
             <h2 className="text-2xl font-black text-white uppercase mb-6 flex items-center gap-3">
               <Sword className="w-6 h-6 text-[#ff4655]" /> Hesap Envanteri
             </h2>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {listing.inventoryUUIDs.map((uuid: string) => {
                   const skin = allSkins.find(s => s.uuid === uuid);
                   if (!skin) return null;
                   return (
                     <div key={uuid} className="bg-[#1c252e] border border-white/5 p-4 rounded group hover:border-[#ff4655] transition-all">
                        <div className="aspect-[2/1] relative mb-3 flex items-center justify-center">
                           <img src={skin.displayIcon} alt={skin.displayName} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="text-center">
                           <div className="text-white font-bold text-sm truncate" title={skin.displayName}>{skin.displayName}</div>
                           <div className="text-[#ff4655] text-xs font-bold mt-1">{skin.price} VP</div>
                        </div>
                     </div>
                   )
                })}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
