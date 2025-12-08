export interface AccountListing {
  id: string;
  sellerName: string; // Gerçek app'te User ID olur
  price: number;
  image: string; // Base64 veya URL (Deprecated)
  imageUrls?: string[]; // New Multi-image support
  title: string;
  description: string;
  rank: string;
  rankTier?: number;
  walletVP?: number;
  walletRP?: number;
  accountLevel?: number;
  totalVP: number;
  inventoryCount: number;
  inventoryUUIDs?: string[]; // Skin UUIDs
  status: 'active' | 'sold';
  createdAt: number;
}

// Global variable to act as an in-memory database for development
// Note: This data will be reset when the Next.js server restarts or rebuilds
let listings: AccountListing[] = [
  {
    id: 'demo-1',
    sellerName: 'JettMain',
    price: 1500,
    image: 'https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png',
    title: 'Full Skinli Plat Hesap',
    description: 'İçinde Yağmacı Vandal, Ejder Operatör var. Mail devredilecek.',
    rank: 'Platinum 2',
    totalVP: 12500,
    inventoryCount: 12,
    status: 'active',
    createdAt: Date.now()
  }
];

export function getListings(): AccountListing[] {
  return listings.filter(l => l.status === 'active');
}

export function addListing(listing: Omit<AccountListing, 'id' | 'createdAt' | 'status'>): AccountListing {
  const newListing: AccountListing = {
    ...listing,
    id: Math.random().toString(36).substring(7),
    status: 'active',
    createdAt: Date.now()
  };
  listings = [newListing, ...listings];
  return newListing;
}

export function getListingById(id: string): AccountListing | undefined {
  return listings.find(l => l.id === id);
}
