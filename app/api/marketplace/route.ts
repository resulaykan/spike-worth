import { NextResponse, NextRequest } from 'next/server';
import { fetchListingsFromDb, insertListingToDb } from '@/lib/turso';
import { checkRateLimit, sanitizeText } from '@/lib/security';

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
    // 1. Rate Limiting based on IP / Forwarded header
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous-user';
    const rateLimit = checkRateLimit(`listing-${ip}`, 5, 10 * 60 * 1000); // 5 listings per 10 mins

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderdiniz. Lütfen 10 dakika sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Input Sanitization & Validation
    const sellerName = sanitizeText(body.sellerName || body.seller_name || '', 40);
    const title = sanitizeText(body.title || '', 100);
    const description = sanitizeText(body.description || '', 500);
    const price = Number(body.price);

    if (!sellerName || sellerName.length < 2) {
      return NextResponse.json({ error: 'Lütfen geçerli bir satıcı adı girin.' }, { status: 400 });
    }

    if (!title || title.length < 4) {
      return NextResponse.json({ error: 'İlan başlığı en az 4 karakter olmalıdır.' }, { status: 400 });
    }

    if (isNaN(price) || price < 50 || price > 100000) {
      return NextResponse.json({ error: 'Lütfen geçerli bir fiyat girin (50 ₺ - 100.000 ₺ arası).' }, { status: 400 });
    }

    const created = await insertListingToDb({
      seller_name: sellerName,
      title: title,
      description: description,
      price: price,
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

    return NextResponse.json({ success: true, listing: created });
  } catch (error: unknown) {
    console.error('API /api/marketplace POST error:', error);
    const msg = error instanceof Error ? error.message : 'İlan veritabanına eklenemedi';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}