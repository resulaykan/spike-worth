'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldAlert, 
  Calculator, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  Menu, 
  X, 
  Flame,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/calculate', label: 'Değer Hesapla', icon: Calculator, badge: 'AI Pro' },
    { href: '/marketplace', label: 'Pazaryeri', icon: ShoppingBag, badge: 'Turso DB' },
    { href: '/nightmarket', label: 'Gece Pazarı', icon: Sparkles, badge: 'Simülatör' },
    { href: '/skins', label: 'Skin Kataloğu', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080c14]/85 backdrop-blur-xl transition-all">
      
      {/* Top Ticker Bar (Live VP Rate) */}
      <div className="hidden sm:flex items-center justify-between px-6 py-1 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-cyan-500/10 border-b border-white/5 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-white/70">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>CANLI VP KURU:</span>
          <span className="text-white font-bold">1.000 VP ≈ 275 ₺ ($8.5)</span>
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <Flame className="w-3 h-3 fill-current" />
            Champions & Sınırlı Koleksiyon Primi Aktif
          </span>
          <span>•</span>
          <span>Turso LibSQL Edge Veritabanı</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-500/25 group-hover:scale-105 transition-transform clip-tactical">
            <ShieldAlert className="w-5 h-5 fill-white/20 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-black text-lg tracking-wider text-white">
              <span>SPIKE</span>
              <span className="text-red-500">WORTH</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-mono font-bold border border-red-500/30">
                v2.0
              </span>
            </div>
            <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest hidden sm:inline">
              Valorant Değerleme & Pazar
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-black/30 text-white' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/calculate"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-500/25 transition-all active:scale-95 clip-tactical"
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden sm:inline">Hesap Değeri Bul</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#080c14] px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
                  isActive ? 'bg-red-500 text-white' : 'bg-white/5 text-white/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-white font-mono">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
