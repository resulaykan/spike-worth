'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Filter, Search, ShieldCheck, Star, Calendar } from 'lucide-react';
import { getListings, AccountListing } from '@/lib/marketplace-data';
import { formatRelativeTime } from '@/lib/utils';
import { fetchValorantData, ValorantRank } from '@/lib/valorant-api';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketplacePage() {
  const [listings, setListings] = useState<AccountListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<AccountListing | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [buyerNote, setBuyerNote] = useState('');
  const [rankData, setRankData] = useState<ValorantRank[]>([]);
  const [allSkins, setAllSkins] = useState<any[]>([]); // To map UUIDs to images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);

  // Filter State
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minLevel: '',
    selectedRank: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', minLevel: '', selectedRank: '' });
  };

  // Fetch listings and Rank Data
  useEffect(() => {
    async function init() {
       // 1. Fetch Rank and Skin Data
       const { ranks, skins } = await fetchValorantData();
       setRankData(ranks);
       setAllSkins(skins);

       // 2. Fetch Listings
       fetch('/api/marketplace')
        .then(res => res.json())
        .then(data => {
            // Map Supabase snake_case to frontend camelCase
            const mappedData = data.map((item: any) => ({
              id: item.id,
              sellerName: item.seller_name,
              price: item.price,
              image: item.image_urls?.[0] || item.image_url, // Main image
              imageUrls: item.image_urls || [item.image_url], // All images
              title: item.title,
              description: item.description,
              rank: item.rank,
              rankTier: item.rank_tier, // Get tier from DB
              walletVP: item.wallet_vp,
              walletRP: item.wallet_rp,
              accountLevel: item.account_level,
              totalVP: item.total_vp,
              inventoryCount: item.inventory_count,
              inventoryUUIDs: item.inventory_uuids || [], // Get UUIDs
              status: item.status,
              createdAt: item.created_at
            }));
            setListings(mappedData);
            setLoading(false);
        });
    }
    init();
  }, []);

  // Filter Logic
  const filteredListings = listings.filter(listing => {
    if (filters.minPrice && listing.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && listing.price > parseInt(filters.maxPrice)) return false;
    if (filters.minLevel && (listing.accountLevel || 0) < parseInt(filters.minLevel)) return false;
    if (filters.selectedRank && listing.rank !== filters.selectedRank) return false;
    return true;
  });

  const getRankIcon = (tier: number) => {
    const r = rankData.find(rd => rd.tier === tier);
    return r ? r.largeIcon : null;
  };
  
  const getRankName = (tier: number, fallbackName: string) => {
      const r = rankData.find(rd => rd.tier === tier);
      return r ? r.tierName : fallbackName;
  };

  const handleBuy = async (listing: AccountListing) => {
    try {
      setIsProcessingPayment(true);
      
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: `Hesap: ${listing.title} (#${listing.id})`,
          price: listing.price,
          note: `Listing ID: ${listing.id}. Note: ${buyerNote}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      const html = await response.text();
      
      document.open();
      document.write(html);
      document.close();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Ödeme başlatılamadı.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0f1923]">
       <div className="fixed inset-0 pointer-events-none opacity-5 bg-[url('https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/splash.png')] bg-cover bg-center" />
       
       <div className="relative z-10 max-w-7xl mx-auto">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 group transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                ANA SAYFA
              </Link>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                Hesap <span className="text-[#ff4655]">Pazarı</span>
              </h1>
              <p className="text-gray-400 mt-2">Güvenli oyuncu hesabı alım satım platformu.</p>
            </div>

            <div className="flex gap-4">
               <Link href="/calculate" className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-widest transition-all rounded">
                  Hesap Sat
               </Link>
            </div>
         </div>

         {/* Main Content Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           
           {/* Filter Sidebar */}
           <div className="lg:col-span-1 space-y-6">
             <div className="bg-[#1c252e] border border-white/10 p-5 rounded-lg sticky top-24">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-white font-bold flex items-center gap-2">
                   <Filter className="w-4 h-4 text-[#ff4655]" /> FİLTRELE
                 </h3>
                 <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-white underline">
                   Temizle
                 </button>
               </div>

               {/* Price Filter */}
               <div className="mb-6">
                 <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Fiyat Aralığı (TL)</label>
                 <div className="flex gap-2">
                   <input 
                     type="number" 
                     placeholder="Min" 
                     value={filters.minPrice}
                     onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                     className="w-full bg-[#0f1923] border border-white/10 p-2 text-white text-sm focus:border-[#ff4655] focus:outline-none rounded"
                   />
                   <input 
                     type="number" 
                     placeholder="Max" 
                     value={filters.maxPrice}
                     onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                     className="w-full bg-[#0f1923] border border-white/10 p-2 text-white text-sm focus:border-[#ff4655] focus:outline-none rounded"
                   />
                 </div>
               </div>

               {/* Level Filter */}
               <div className="mb-6">
                 <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Min. Level</label>
                 <input 
                   type="number" 
                   placeholder="Örn: 20" 
                   value={filters.minLevel}
                   onChange={(e) => handleFilterChange('minLevel', e.target.value)}
                   className="w-full bg-[#0f1923] border border-white/10 p-2 text-white text-sm focus:border-[#ff4655] focus:outline-none rounded"
                 />
               </div>

               {/* Rank Filter */}
               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Rank</label>
                 <select 
                   value={filters.selectedRank}
                   onChange={(e) => handleFilterChange('selectedRank', e.target.value)}
                   className="w-full bg-[#0f1923] border border-white/10 p-2 text-white text-sm focus:border-[#ff4655] focus:outline-none rounded"
                 >
                   <option value="">Tümü</option>
                   {rankData.map(r => (
                     <option key={r.tier} value={r.tierName}>{r.tierName}</option>
                   ))}
                 </select>
               </div>
             </div>
           </div>

           {/* Listings Grid */}
           <div className="lg:col-span-3">
             {loading ? (
               <div className="flex justify-center py-20">
                 <Loader2 className="w-10 h-10 text-[#ff4655] animate-spin" />
               </div>
             ) : filteredListings.length === 0 ? (
               <div className="text-center py-20 border border-dashed border-white/10 rounded">
                 <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                 <p className="text-gray-400">Aradığınız kriterlere uygun hesap bulunamadı.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {filteredListings.map(listing => (
                   <div key={listing.id} className="bg-[#1c252e] border border-white/5 hover:border-[#ff4655] transition-all group overflow-hidden rounded-lg">
                     {/* Image */}
                     <div className="aspect-video bg-black/20 relative overflow-hidden">
                       <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-2 border border-white/10">
                         {listing.rankTier ? (
                             <>
                                {getRankIcon(listing.rankTier) && (
                                    <img src={getRankIcon(listing.rankTier)!} className="w-5 h-5 object-contain" alt="rank" />
                                )}
                                {getRankName(listing.rankTier, listing.rank)}
                             </>
                         ) : (
                             listing.rank
                         )}
                       </div>
                     </div>
                     
                     {/* Content */}
                     <div className="p-5">
                       <h3 className="text-xl font-bold text-white mb-2 truncate">{listing.title}</h3>
                       <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                         <span>{listing.inventoryCount} Skin</span>
                         <span>Lvl {listing.accountLevel || '?'}</span>
                       </div>
                       
                       <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-4">
                         <Calendar className="w-3 h-3" />
                         {formatRelativeTime(listing.createdAt)}
                       </div>
                       
                       <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                         <div className="text-2xl font-bold text-[#ff4655]">₺{listing.price}</div>
                         <Link 
                           href={`/marketplace/${listing.id}`}
                           className="px-4 py-2 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors text-sm rounded"
                         >
                           İncele
                         </Link>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
         </div>
       </div>
    </div>
  );
}
