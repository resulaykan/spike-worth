import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spike Worth • Valorant Hesap Değerleme & Pazaryeri",
  description: "Valorant hesabınızın gerçek 2. el piyasa değerini, Champions ve nadir koleksiyon primlerini güncel Riot Games VP kurlarıyla hesaplayın.",
  keywords: ["valorant", "hesap değeri", "hesap hesaplama", "valorant pazar", "vp hesapla", "valorant skin fiyatları", "gece pazarı"],
  authors: [{ name: "Resul Aykan", url: "https://github.com/resulaykan" }],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} bg-[#090e17] text-slate-100 min-h-screen antialiased`}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
