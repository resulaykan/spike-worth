'use client';

import { useState, useEffect } from 'react';
import { fetchValorantData, ValorantSkin } from '@/lib/valorant-api';
import { Search, Loader2, Filter, X, Image as ImageIcon } from 'lucide-react';

export default function SkinsPage() {
  const [allSkins, setAllSkins] = useState<ValorantSkin[]>([]);
  const [filteredSkins, setFilteredSkins] = useState<ValorantSkin[]>([]);
  const [displayedSkins, setDisplayedSkins] = useState<ValorantSkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [selectedSkin, setSelectedSkin] = useState<ValorantSkin | null>(null);

  // Pagination
  const ITEMS_PER_PAGE = 24;
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      const { skins } = await fetchValorantData();
      // Rastgele sırala ki her seferinde farklı skinler görünsün veya isme göre sırala
      const sorted = skins.sort((a, b) => a.displayName.localeCompare(b.displayName));
      setAllSkins(sorted);
      setFilteredSkins(sorted);
      setDisplayedSkins(sorted.slice(0, ITEMS_PER_PAGE));
      setLoading(false);
    }
    load();
  }, []);

  // Filter Logic
  useEffect(() => {
    const filtered = allSkins.filter(skin => 
      skin.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSkins(filtered);
    setPage(1);
    setDisplayedSkins(filtered.slice(0, ITEMS_PER_PAGE));
  }, [searchQuery, allSkins]);

  const loadMore = () => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const newItems = filteredSkins.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayedSkins(newItems);
    setPage(nextPage);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0f1923]">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[url('https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png')] bg-cover bg-center" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4">
            Skin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4655] to-red-800">Galerisi</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Valorant evrenindeki tüm skinleri keşfet, aşamalarını incele ve fiyatlarını öğren.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Skin ara... (Örn: Ejder Ateşi, Yağmacı)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c252e] border border-white/10 text-white pl-14 pr-4 py-5 rounded-sm focus:border-[#ff4655] focus:outline-none transition-all shadow-lg placeholder:text-gray-600 text-lg font-medium"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <div className="bg-[#ff4655] text-white text-xs font-bold px-2 py-1 rounded">
              {filteredSkins.length} SONUÇ
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#ff4655] animate-spin mb-4" />
            <p className="text-gray-400 animate-pulse">Cephanelik Yükleniyor...</p>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <>
            {displayedSkins.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400">Sonuç Bulunamadı</h3>
                <p className="text-gray-500 mt-2">Farklı bir arama terimi deneyin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedSkins.map((skin) => (
                  <div 
                    key={skin.uuid} 
                    onClick={() => setSelectedSkin(skin)}
                    className="group bg-[#1c252e] border border-white/5 hover:border-[#ff4655] transition-all duration-300 cursor-pointer overflow-hidden relative"
                  >
                    {/* Tier Stripe */}
                    <div 
                      className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2"
                      style={{ backgroundColor: skin.tier?.highlightColor || '#555' }}
                    />

                    {/* Image Area */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-black/40 to-transparent p-6 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <img 
                        src={skin.displayIcon} 
                        alt={skin.displayName} 
                        className="w-full h-full object-contain transform group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 relative z-10"
                      />
                    </div>

                    {/* Info Area */}
                    <div className="p-4 bg-[#0f1923] border-t border-white/5 relative z-20">
                      <h3 className="text-white font-bold truncate pr-6">{skin.displayName}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                           {skin.tier?.displayIcon && (
                             <img src={skin.tier.displayIcon} className="w-4 h-4 object-contain" alt="tier" />
                           )}
                           <span 
                             className="text-xs font-bold uppercase tracking-wider"
                             style={{ color: skin.tier?.highlightColor || '#999' }}
                           >
                             {skin.tier?.displayName || 'Standart'}
                           </span>
                        </div>
                        <span className="text-sm font-medium text-gray-400">{skin.price} VP</span>
                      </div>
                    </div>
                    
                    {/* Hover Overlay Icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {displayedSkins.length < filteredSkins.length && (
              <div className="mt-12 text-center">
                <button 
                  onClick={loadMore}
                  className="px-12 py-4 bg-[#ff4655] hover:bg-[#bd3944] text-white font-black uppercase tracking-widest transition-all clip-path-polygon skew-x-[-10deg]"
                >
                  <span className="skew-x-[10deg] flex items-center gap-2">
                    Daha Fazla Göster ({filteredSkins.length - displayedSkins.length})
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Skin Detail Modal */}
      {selectedSkin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setSelectedSkin(null)}>
          <div 
            className="bg-[#1c252e] border border-white/10 max-w-4xl w-full relative shadow-2xl overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedSkin(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-[#ff4655] text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Side */}
              <div className="bg-[#0f1923] p-12 flex items-center justify-center relative min-h-[300px]">
                 <div 
                   className="absolute inset-0 opacity-20"
                   style={{ background: `radial-gradient(circle at center, ${selectedSkin.tier?.highlightColor || '#fff'}, transparent 70%)` }}
                 />
                 <img 
                   src={selectedSkin.displayIcon} 
                   alt={selectedSkin.displayName} 
                   className="w-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                 />
              </div>

              {/* Info Side */}
              <div className="p-8 flex flex-col justify-center">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedSkin.tier?.displayIcon && (
                      <img src={selectedSkin.tier.displayIcon} className="w-6 h-6 object-contain" alt="tier" />
                    )}
                    <span 
                      className="text-sm font-bold uppercase tracking-widest"
                      style={{ color: selectedSkin.tier?.highlightColor || '#999' }}
                    >
                      {selectedSkin.tier?.displayName || 'Standart'}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase leading-none mb-4">{selectedSkin.displayName}</h2>
                  <div className="w-20 h-1 bg-[#ff4655]" />
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-gray-400">Mağaza Fiyatı</span>
                    <span className="text-xl font-bold text-[#ff4655]">{selectedSkin.price} VP</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-gray-400">Silah Türü</span>
                    <span className="font-medium text-white">{selectedSkin.isMelee ? 'Yakın Dövüş (Bıçak)' : 'Ateşli Silah'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-gray-400">Yayınlanma</span>
                    <span className="font-medium text-white">Bilinmiyor</span>
                  </div>
                </div>

                <button className="w-full py-4 border border-white/20 hover:bg-white hover:text-black text-white font-bold uppercase tracking-widest transition-all">
                  Detaylı İncele (Wiki)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
