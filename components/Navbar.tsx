import Link from 'next/link';
import { Crosshair, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0f1923]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-[#ff4655] rounded-sm transform group-hover:rotate-45 transition-transform duration-300">
              <Crosshair className="w-6 h-6 text-white transform group-hover:-rotate-45 transition-transform duration-300" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
              SPIKE<span className="text-[#ff4655]">.WORTH</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 uppercase font-bold tracking-widest text-xs">
            <Link href="/" className="text-gray-300 hover:text-[#ff4655] transition-colors relative group">
              Ana Sayfa
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff4655] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/calculate" className="text-gray-300 hover:text-[#ff4655] transition-colors relative group">
              Hesapla
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff4655] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/marketplace" className="text-gray-300 hover:text-[#ff4655] transition-colors relative group">
              Pazaryeri
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff4655] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/skins" className="text-gray-300 hover:text-[#ff4655] transition-colors relative group">
              Skinler
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff4655] group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
             {/* Login Removed as requested */}
            <button className="md:hidden p-2 text-gray-400 hover:text-[#ff4655]">
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff4655]/50 to-transparent" />
    </nav>
  );
}
