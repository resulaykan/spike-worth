import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spike Worth • Valorant Hesap Değerleme & Pazaryeri",
  description: "Valorant hesabının gerçek piyasa değerini, Champions ve nadir skin primlerini, rank seviyesini yapay zekâ destekli algoritma ve Turso LibSQL veritabanı ile hesapla.",
  keywords: ["valorant", "hesap değeri", "hesap hesaplama", "valorant pazar", "vp hesapla", "valorant skin fiyatları", "gece pazarı"],
  authors: [{ name: "Resul Aykan", url: "https://github.com/resulaykan" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-[#080c14] text-slate-100 min-h-screen antialiased`}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
