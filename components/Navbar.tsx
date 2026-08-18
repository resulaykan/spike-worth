'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calculator, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  Menu, 
  X, 
  ArrowRight,
  Flame
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/calculate', label: 'Değer Hesapla', icon: Calculator },
    { href: '/marketplace', label: 'Pazaryeri', icon: ShoppingBag },
    { href: '/nightmarket', label: 'Gece Pazarı', icon: Sparkles },
    { href: '/skins', label: 'Skin Kataloğu', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090e17]/90 backdrop-blur-md">
      
      {/* Top Reference Ticker (No dev jargon, pure gaming context) */}
      <div className="hidden sm:flex items-center justify-between px-6 py-1 bg-[#060a10] border-b border-white/5 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-white/60">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>VALORANT MAĞAZA KURU:</span>
          <span className="text-white font-bold">1.000 VP = 275 ₺</span>
        </div>
        <div className="flex items-center gap-2 text-amber-400/90 font-medium">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Champions & Sınırlı Koleksiyon Değerleme Çarpanı Aktif</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-red-600 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-md shadow-red-600/30 group-hover:bg-red-500 transition-colors">
            V
          </div>
          <div className="flex items-center font-black text-lg tracking-wider text-white">
            <span>SPIKE</span>
            <span className="text-red-500">WORTH</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all ${
                  isActive
                    ? 'text-white border-b-2 border-red-500'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/calculate"
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-red-600/20"
          >
            <span>Hesap Değeri Bul</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#090e17] px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 text-xs uppercase tracking-wider font-bold transition-all ${
                  isActive ? 'bg-red-600 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
