'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, TrendingUp, Zap, Target, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import SampleReportModal from './SampleReportModal';
import { ValorantSkin } from '@/lib/valorant-api';

interface Props {
  randomSkins: ValorantSkin[];
}

const BACKGROUND_VIDEOS = [
  '/bind.webm',
  '/icebox.webm',
  '/lotus.webm',
  '/haven.webm'
];

export default function HomeClient({ randomSkins }: Props) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  // Video Logic
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(BACKGROUND_VIDEOS[0]);

  // Video bittiğinde çalışır
  const handleVideoEnd = () => {
    // Mevcut videodan farklı rastgele bir video seç
    let nextVideo;
    do {
      const randomIndex = Math.floor(Math.random() * BACKGROUND_VIDEOS.length);
      nextVideo = BACKGROUND_VIDEOS[randomIndex];
    } while (nextVideo === currentVideo && BACKGROUND_VIDEOS.length > 1);
    
    setCurrentVideo(nextVideo);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      if (total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <SampleReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />

      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
           <video 
             key={currentVideo} // Key değişince React elementi yeniden oluşturur, bu sayede yeni video sorunsuz yüklenir
             ref={videoRef}
             src={currentVideo}
             autoPlay 
             muted 
             playsInline
             onEnded={handleVideoEnd}
             onTimeUpdate={handleTimeUpdate}
             className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-1000"
           >
             {/* Fallback */}
             Your browser does not support the video tag.
           </video>
           
           {/* Overlay */}
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ff4655]/10 via-[#0f1923]/80 to-[#0f1923]" />
           
           {/* Sadeleştirilmiş Video Progress Bar */}
           <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 z-20">
             <div 
               className="h-full bg-[#ff4655] shadow-[0_0_15px_#ff4655] transition-all duration-100 ease-linear"
               style={{ width: `${progress}%` }}
             />
           </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1 mb-8 border border-[#ff4655]/30 bg-[#ff4655]/10 text-[#ff4655] text-xs font-bold uppercase tracking-widest relative">
            <div className="absolute top-0 left-0 w-1 h-1 bg-[#ff4655]" />
            <div className="absolute top-0 right-0 w-1 h-1 bg-[#ff4655]" />
            <div className="absolute bottom-0 left-0 w-1 h-1 bg-[#ff4655]" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#ff4655]" />
            <Zap className="w-3 h-3" />
            <span>Valorant Hesap Değerleme</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-7xl md:text-9xl font-black tracking-tighter mb-6 uppercase leading-none italic drop-shadow-2xl">
            SPIKE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">.WORTH</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 font-medium border-l-4 border-[#ff4655] pl-6 text-left bg-gradient-to-r from-white/5 to-transparent py-4">
            Skinlerin, rankın ve hesap seviyenin gerçek piyasa değerini anında öğren. 
            Yapay zeka destekli analiz motorumuz ile satış yapmadan önce doğru fiyatı bul.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <Link href="/calculate" className="w-full sm:w-auto px-10 py-5 bg-[#ff4655] text-white font-bold text-xl uppercase tracking-wider hover:bg-[#bd3944] transition-all clip-path-polygon flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(255,70,85,0.4)] hover:scale-105 active:scale-95 duration-200">
              Şimdi Hesapla
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button 
              onClick={() => setIsReportOpen(true)}
              className="w-full sm:w-auto px-10 py-5 border border-white/20 text-white font-bold text-xl uppercase tracking-wider hover:bg-white/5 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 duration-200"
            >
              Örnek Rapor
            </button>
          </motion.div>
        </motion.div>
        
        {/* Decorative Lines */}
        <div className="absolute bottom-2 right-10 w-32 h-32 border-r-2 border-b-2 border-white/10" />
      </section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full border-b border-white/5 bg-[#0f1923]"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="py-12 px-8 flex flex-col items-center text-center hover:bg-white/[0.02] transition-colors group">
            <Users className="w-10 h-10 text-[#ff4655] mb-4 group-hover:scale-110 transition-transform duration-300" />
            <div className="text-4xl font-black text-white mb-1 tracking-tighter">150K+</div>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Analiz Edilen Hesap</div>
          </div>
          <div className="py-12 px-8 flex flex-col items-center text-center hover:bg-white/[0.02] transition-colors group">
            <Target className="w-10 h-10 text-[#ff4655] mb-4 group-hover:scale-110 transition-transform duration-300" />
            <div className="text-4xl font-black text-white mb-1 tracking-tighter">%99.8</div>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Fiyat Doğruluğu</div>
          </div>
          <div className="py-12 px-8 flex flex-col items-center text-center hover:bg-white/[0.02] transition-colors group">
            <BarChart3 className="w-10 h-10 text-[#ff4655] mb-4 group-hover:scale-110 transition-transform duration-300" />
            <div className="text-4xl font-black text-white mb-1 tracking-tighter">₺25M+</div>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">Değerlenen Envanter</div>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
             <div className="absolute -inset-4 bg-gradient-to-r from-[#ff4655] to-purple-600 opacity-20 blur-2xl rounded-full animate-pulse" />
             <div className="relative border border-white/10 bg-[#1c252e] p-8 rounded-sm shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <span className="text-sm font-bold text-gray-400 uppercase">Envanter Analizi</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase text-[#ff4655] animate-pulse">Canlı Veri</span>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  {randomSkins.map((skin, index) => (
                    <motion.div 
                      key={skin.uuid} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/5 transition-all cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        {/* BÜYÜTÜLEN RESİM ALANI */}
                        <div 
                          className="w-24 h-16 rounded flex items-center justify-center font-bold relative overflow-hidden bg-black/40 border border-white/10 shadow-inner"
                        >
                          <div 
                             className="absolute inset-0 opacity-30"
                             style={{ background: `radial-gradient(circle at center, ${skin.tier?.highlightColor || '#fff'}, transparent 70%)` }}
                           />
                          <img src={skin.displayIcon} alt={skin.displayName} className="w-full h-full object-contain p-1 drop-shadow-lg" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-200 block">{skin.displayName}</span>
                          <span className="text-xs text-gray-500 uppercase tracking-wider">{skin.tier?.displayName}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#ff4655] text-sm bg-[#ff4655]/10 px-3 py-1 rounded border border-[#ff4655]/20">{skin.price} VP</span>
                    </motion.div>
                  ))}
                </div>
             </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
              Skinlerin Değerini <br />
              <span className="text-[#ff4655]">Tek Tek Hesaplama.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Teknolojimiz, Valorant hesabındaki her bir skini, varyantı ve yükseltme seviyesini ayrı ayrı analiz eder. Rankın, hesap seviyen ve açılmış ajanların da hesaba katılarak en gerçekçi piyasa değeri sunulur.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-[#ff4655] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors">Güvenli ve Anonim Analiz</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-[#ff4655] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors">Canlı Piyasa Verileri</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#ff4655] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/splash.png')] bg-cover bg-center mix-blend-overlay opacity-20" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-4 relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 drop-shadow-md">
            Satış Yapmaya Hazır Mısın?
          </h2>
          <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto font-medium">
            Hesabının değerini öğrendikten sonra, güvenilir partner sitelerimiz üzerinden anında nakite çevirebilirsin.
          </p>
          <Link href="/calculate" className="inline-block px-12 py-6 bg-white text-[#ff4655] font-black text-xl uppercase tracking-widest hover:bg-black hover:text-white transition-all skew-x-[-10deg] shadow-xl hover:shadow-2xl hover:-translate-y-1">
            <span className="skew-x-[10deg] inline-block">Hemen Değer Biç</span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}