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
    // 1. Rate Limiting based on IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous-user';
    const rateLimit = checkRateLimit(`listing-${ip}`, 5, 10 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla ilan isteği gönderdiniz. Lütfen 10 dakika sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Input Sanitization & Validation
    const sellerName = sanitizeText(body.sellerName || body.seller_name || '', 40);
    const sellerEmail = sanitizeText(body.sellerEmail || body.seller_email || '', 60);
    const riotTag = sanitizeText(body.riotTag || body.riot_tag || '', 40);
    const hasFirstMail = body.hasFirstMail !== undefined ? Boolean(body.hasFirstMail) : Boolean(body.has_first_mail);
    const battlepassCount = Number(body.battlepassCount || body.battlepass_count || 0);

    const title = sanitizeText(body.title || '', 120);
    const description = sanitizeText(body.description || '', 800);
    const price = Number(body.price);

    const walletVP = Number(body.walletVP || body.wallet_vp || 0);
    const walletRP = Number(body.walletRP || body.wallet_rp || 0);
    const accountLevel = Number(body.accountLevel || body.account_level || 100);

    let imageUrls: string[] = [];
    if (Array.isArray(body.imageUrls || body.image_urls)) {
      imageUrls = (body.imageUrls || body.image_urls).filter((u: string) => typeof u === 'string' && u.startsWith('http'));
    }
    if (body.customImageUrl && typeof body.customImageUrl === 'string' && body.customImageUrl.startsWith('http')) {
      imageUrls.unshift(body.customImageUrl);
    }
    if (imageUrls.length === 0) {
      imageUrls = ['https://media.valorant-api.com/weaponskins/9bf19b77-4b33-7203-9f2c-16932970622f/displayicon.png'];
    }

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
      seller_email: sellerEmail,
      riot_tag: riotTag,
      has_first_mail: hasFirstMail,
      battlepass_count: battlepassCount,
      title: title,
      description: description,
      price: price,
      rank: body.rank || 'Altın 1',
      rank_tier: Number(body.rankTier || body.rank_tier || 12),
      account_level: accountLevel,
      wallet_vp: walletVP,
      wallet_rp: walletRP,
      total_vp: Number(body.totalVP || body.total_vp || (walletVP + 25000)),
      inventory_count: Number(body.inventoryCount || body.inventory_count || 12),
      inventory_uuids: body.inventoryUUIDs || body.inventory_uuids || [],
      image_urls: imageUrls,
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