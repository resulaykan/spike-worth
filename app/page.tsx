import { fetchValorantData } from '@/lib/valorant-api';
import HomeClient from '@/components/HomeClient';

// Server Component: Data Fetching
export default async function Home() {
  const { skins } = await fetchValorantData();
  
  // Rastgele 3 Premium+ skin seç
  const premiumSkins = skins.filter(s => s.price >= 1775);
  const randomSkins = premiumSkins.length > 0 
    ? premiumSkins.sort(() => 0.5 - Math.random()).slice(0, 3) 
    : skins.slice(0, 3);

  // Client Component'e gönder
  return <HomeClient randomSkins={randomSkins} />;
}
