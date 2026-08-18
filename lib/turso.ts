import { createClient, Client } from '@libsql/client';

export interface AccountListing {
  id: string;
  seller_name: string;
  title: string;
  description: string;
  price: number;
  rank: string;
  rank_tier: number;
  account_level: number;
  wallet_vp: number;
  wallet_rp: number;
  total_vp: number;
  inventory_count: number;
  inventory_uuids: string[];
  image_urls: string[];
  status: 'active' | 'sold' | 'pending';
  verified: boolean;
  created_at: string;
}

export interface SavedValuation {
  id: string;
  account_name: string;
  rank: string;
  account_level: number;
  total_vp: number;
  invested_try: number;
  market_value_try: number;
  rarity_score: number;
  archetype: string;
  skin_uuids: string[];
  created_at: string;
}

// In-Memory / Local Seed Data with 100% verified working Riot image URLs
export const SEED_LISTINGS: AccountListing[] = [
  {
    id: 'val-001',
    seller_name: 'ResulAykan',
    title: 'Champions 2021 Vandal + Asil + Kuronami Koleksiyonlu Immortal 3 Hesap',
    description: 'İlk maili ile birlikte teslim edilecektir. Champions 2021 Vandal seti, Kuronami ve Asil Vandal bulunmaktadır. Bütün renk paketleri ve radyanit geliştirmeleri açıktır.',
    price: 4850,
    rank: 'Ölümsüzlük 3',
    rank_tier: 26,
    account_level: 284,
    wallet_vp: 1450,
    wallet_rp: 180,
    total_vp: 78500,
    inventory_count: 64,
    inventory_uuids: [
      '9bf19b77-4b33-7203-9f2c-16932970622f', // Champions 2021 Vandal
      'd8d5d7a1-4d81-8560-54bc-0692ab40f69b', // Kuronami Vandal
      'b9ee2457-481c-6776-3f5b-0ca8e8f90c89', // Asil Vandal
      'e5490f71-455b-74ad-f762-f5a876d4dff9'  // RGX Vandal
    ],
    image_urls: [
      'https://media.valorant-api.com/weaponskins/9bf19b77-4b33-7203-9f2c-16932970622f/displayicon.png'
    ],
    status: 'active',
    verified: true,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'val-002',
    seller_name: 'ViperMain99',
    title: 'Kuronami + Ejder Ateşi Vandal + RGX Phantom - Elmas 2',
    description: 'Tertemiz smurf hesaptır, hilesiz ve ban geçmişi yoktur. Kuronami Vandal ve Ejder Ateşi tüm animasyonları ve renkleri açıktır.',
    price: 2400,
    rank: 'Elmas 2',
    rank_tier: 20,
    account_level: 112,
    wallet_vp: 650,
    wallet_rp: 90,
    total_vp: 34200,
    inventory_count: 28,
    inventory_uuids: [
      'd8d5d7a1-4d81-8560-54bc-0692ab40f69b', // Kuronami Vandal
      '18609205-4edb-5966-cff8-0fba0230ba1e', // Ejder Vandal
      '499acf05-4f79-e345-3714-57bf7aa163ea'  // RGX Phantom
    ],
    image_urls: [
      'https://media.valorant-api.com/weaponskins/d8d5d7a1-4d81-8560-54bc-0692ab40f69b/displayicon.png'
    ],
    status: 'active',
    verified: true,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'val-003',
    seller_name: 'SpectreGod',
    title: 'Arcane Vandal + Asil Vandal + RGX Classic - Yücelik 1',
    description: 'Tekrar gelmeyecek Arcane Vandal ve Asil Vandal içerir. Koleksiyon değeri çok yüksektir.',
    price: 3600,
    rank: 'Yücelik 1',
    rank_tier: 21,
    account_level: 195,
    wallet_vp: 2100,
    wallet_rp: 320,
    total_vp: 52000,
    inventory_count: 42,
    inventory_uuids: [
      '4ccb9517-4762-eb45-1242-7ca667223459', // Arcane Vandal
      'b9ee2457-481c-6776-3f5b-0ca8e8f90c89'  // Asil Vandal
    ],
    image_urls: [
      'https://media.valorant-api.com/weaponskins/4ccb9517-4762-eb45-1242-7ca667223459/displayicon.png'
    ],
    status: 'active',
    verified: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

let tursoClientInstance: Client | null = null;

export function getTursoClient(): Client | null {
  const url = process.env.TURSO_DATABASE_URL || process.env.NEXT_PUBLIC_TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN || process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN;

  if (!url) {
    return null;
  }

  if (!tursoClientInstance) {
    tursoClientInstance = createClient({
      url,
      authToken
    });
  }

  return tursoClientInstance;
}

// Initialize tables if connected
export async function initTursoTables(): Promise<void> {
  const client = getTursoClient();
  if (!client) return;

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS listings (
        id TEXT PRIMARY KEY,
        seller_name TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        rank TEXT NOT NULL,
        rank_tier INTEGER DEFAULT 0,
        account_level INTEGER DEFAULT 1,
        wallet_vp INTEGER DEFAULT 0,
        wallet_rp INTEGER DEFAULT 0,
        total_vp INTEGER DEFAULT 0,
        inventory_count INTEGER DEFAULT 0,
        inventory_uuids TEXT DEFAULT '[]',
        image_urls TEXT DEFAULT '[]',
        status TEXT DEFAULT 'active',
        verified INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS valuations (
        id TEXT PRIMARY KEY,
        account_name TEXT NOT NULL,
        rank TEXT NOT NULL,
        account_level INTEGER DEFAULT 1,
        total_vp INTEGER DEFAULT 0,
        invested_try REAL DEFAULT 0,
        market_value_try REAL DEFAULT 0,
        rarity_score INTEGER DEFAULT 0,
        archetype TEXT NOT NULL,
        skin_uuids TEXT DEFAULT '[]',
        created_at TEXT NOT NULL
      );
    `);
  } catch (err) {
    console.warn('Turso init error (using fallback):', err);
  }
}

// Fetch all active listings
export async function fetchListingsFromDb(): Promise<AccountListing[]> {
  const client = getTursoClient();
  if (!client) {
    return SEED_LISTINGS;
  }

  try {
    await initTursoTables();
    const result = await client.execute({
      sql: 'SELECT * FROM listings WHERE status = ? ORDER BY created_at DESC',
      args: ['active']
    });

    if (result.rows.length === 0) {
      return SEED_LISTINGS;
    }

    return result.rows.map((row: Record<string, unknown>) => {
      let rawImageUrls: string[] = [];
      try {
        rawImageUrls = typeof row.image_urls === 'string' ? JSON.parse(row.image_urls || '[]') : [];
      } catch {
        rawImageUrls = [];
      }

      // If stored image is invalid/empty, fallback to verified skin URL
      if (!rawImageUrls || rawImageUrls.length === 0 || rawImageUrls[0] === '') {
        rawImageUrls = ['https://media.valorant-api.com/weaponskins/9bf19b77-4b33-7203-9f2c-16932970622f/displayicon.png'];
      }

      return {
        id: String(row.id),
        seller_name: String(row.seller_name),
        title: String(row.title),
        description: String(row.description || ''),
        price: Number(row.price),
        rank: String(row.rank),
        rank_tier: Number(row.rank_tier || 0),
        account_level: Number(row.account_level || 1),
        wallet_vp: Number(row.wallet_vp || 0),
        wallet_rp: Number(row.wallet_rp || 0),
        total_vp: Number(row.total_vp || 0),
        inventory_count: Number(row.inventory_count || 0),
        inventory_uuids: typeof row.inventory_uuids === 'string' ? JSON.parse(row.inventory_uuids || '[]') : [],
        image_urls: rawImageUrls,
        status: row.status as 'active' | 'sold' | 'pending',
        verified: Boolean(row.verified),
        created_at: String(row.created_at)
      };
    });
  } catch (err) {
    console.error('Error fetching from Turso, returning seed listings:', err);
    return SEED_LISTINGS;
  }
}

// Insert new listing
export async function insertListingToDb(listing: Omit<AccountListing, 'id' | 'created_at'>): Promise<AccountListing> {
  const fallbackImg = 'https://media.valorant-api.com/weaponskins/9bf19b77-4b33-7203-9f2c-16932970622f/displayicon.png';
  const validImages = listing.image_urls && listing.image_urls.length > 0 && listing.image_urls[0] 
    ? listing.image_urls 
    : [fallbackImg];

  const newListing: AccountListing = {
    ...listing,
    id: `val-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    image_urls: validImages,
    created_at: new Date().toISOString()
  };

  const client = getTursoClient();
  if (client) {
    try {
      await initTursoTables();
      await client.execute({
        sql: `INSERT INTO listings (id, seller_name, title, description, price, rank, rank_tier, account_level, wallet_vp, wallet_rp, total_vp, inventory_count, inventory_uuids, image_urls, status, verified, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          newListing.id,
          newListing.seller_name,
          newListing.title,
          newListing.description,
          newListing.price,
          newListing.rank,
          newListing.rank_tier,
          newListing.account_level,
          newListing.wallet_vp,
          newListing.wallet_rp,
          newListing.total_vp,
          newListing.inventory_count,
          JSON.stringify(newListing.inventory_uuids),
          JSON.stringify(newListing.image_urls),
          newListing.status,
          newListing.verified ? 1 : 0,
          newListing.created_at
        ]
      });
    } catch (err) {
      console.error('Turso insert error:', err);
    }
  }

  SEED_LISTINGS.unshift(newListing);
  return newListing;
}
