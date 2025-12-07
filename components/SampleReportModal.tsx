'use client';

import { X, CheckCircle, ShieldCheck, TrendingUp, DollarSign, BarChart3, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SampleReportModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#1c252e] border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - PDF Header Style */}
        <div className="bg-[#0f1923] p-6 border-b border-white/10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#ff4655] flex items-center justify-center text-white font-bold">V</div>
              <h2 className="text-xl font-black uppercase text-white tracking-tighter">ValoValue <span className="text-[#ff4655]">Premium</span></h2>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Rapor ID: #TR-88234-X</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          {/* Summary Section */}
          <div className="flex flex-col md:flex-row gap-6 items-center bg-[#0f1923] p-6 border border-[#ff4655]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#ff4655]/10 rounded-full blur-2xl" />
            <div className="text-center md:text-left flex-1">
              <h3 className="text-gray-400 text-sm font-bold uppercase mb-1">Tahmini Hesap Değeri</h3>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tighter">₺3.250 - ₺3.600</div>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-bold uppercase rounded border border-green-500/20">Yüksek Talep</span>
                <span className="text-xs text-gray-500">Son güncelleme: Bugün</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-[#ff4655] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,70,85,0.4)]">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Varlık Dağılımı</h4>
              <div className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-sm">
                <span className="text-gray-400">Skin Değeri (64 Adet)</span>
                <span className="font-bold text-white">₺2.100</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-sm">
                <span className="text-gray-400">Bıçak Değeri (4 Adet)</span>
                <span className="font-bold text-white">₺950</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-sm">
                <span className="text-gray-400">Rank (Ascendant 2)</span>
                <span className="font-bold text-green-400">+₺400</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Pazar Analizi</h4>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <TrendingUp className="w-5 h-5 text-[#ff4655] shrink-0" />
                <p>Bu hesap türü için talep son 30 günde <strong className="text-white">%12 arttı</strong>.</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <DollarSign className="w-5 h-5 text-green-500 shrink-0" />
                <p>En hızlı satış <strong className="text-white">Itemsatış</strong> platformunda, en yüksek fiyat <strong className="text-white">GameSatış</strong> üzerinde görülmektedir.</p>
              </div>
            </div>
          </div>

          {/* Footer / CTA inside Modal */}
          <div className="bg-[#ff4655]/10 border border-[#ff4655]/20 p-4 text-center">
            <p className="text-[#ff4655] font-medium text-sm mb-3">Bu rapor örnektir. Kendi hesabınız için gerçek verileri analiz edin.</p>
            <button onClick={onClose} className="bg-[#ff4655] hover:bg-[#bd3944] text-white px-8 py-2 font-bold uppercase tracking-widest text-sm transition-colors">
              Anlaşıldı
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
