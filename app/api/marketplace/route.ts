import { NextResponse, NextRequest } from 'next/server';
import { fetchListingsFromDb, insertListingToDb } from '@/lib/turso';

export async function GET() {
  try {
    const listings = await fetchListingsFromDb();
    return NextResponse.json(listings);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Veritabanı hatası';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const created = await insertListingToDb({
      seller_name: body.sellerName || body.seller_name || 'Anonim',
      title: body.title || 'Valorant Hesabı',
      description: body.description || '',
      price: Number(body.price || 1000),
      rank: body.rank || 'Altın 1',
      rank_tier: Number(body.rankTier || body.rank_tier || 12),
      account_level: Number(body.accountLevel || body.account_level || 100),
      wallet_vp: Number(body.walletVP || body.wallet_vp || 0),
      wallet_rp: Number(body.walletRP || body.wallet_rp || 0),
      total_vp: Number(body.totalVP || body.total_vp || 0),
      inventory_count: Number(body.inventoryCount || body.inventory_count || 0),
      inventory_uuids: body.inventoryUUIDs || body.inventory_uuids || [],
      image_urls: body.imageUrls || body.image_urls || [],
      status: 'active',
      verified: true
    });

    return NextResponse.json(created);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'İlan eklenemedi';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}