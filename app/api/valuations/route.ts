import { NextResponse, NextRequest } from 'next/server';
import { getTursoClient, initTursoTables, SavedValuation } from '@/lib/turso';
import { checkRateLimit, sanitizeText } from '@/lib/security';

export async function GET() {
  const client = getTursoClient();
  if (!client) {
    return NextResponse.json([]);
  }

  try {
    await initTursoTables();
    const result = await client.execute('SELECT * FROM valuations ORDER BY created_at DESC LIMIT 20');
    const valuations = result.rows.map((row) => ({
      id: String(row.id),
      account_name: String(row.account_name),
      rank: String(row.rank),
      account_level: Number(row.account_level),
      total_vp: Number(row.total_vp),
      invested_try: Number(row.invested_try),
      market_value_try: Number(row.market_value_try),
      rarity_score: Number(row.rarity_score),
      archetype: String(row.archetype),
      skin_uuids: typeof row.skin_uuids === 'string' ? JSON.parse(row.skin_uuids || '[]') : [],
      created_at: String(row.created_at)
    }));

    return NextResponse.json(valuations);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Veritabanı hatası';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'anonymous-user';
    const rateLimit = checkRateLimit(`val-${ip}`, 15, 5 * 60 * 1000); // 15 valuations per 5 mins

    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Çok fazla istek gönderildi.' }, { status: 429 });
    }

    const body = await req.json();
    const client = getTursoClient();

    const valuation: SavedValuation = {
      id: `val-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      account_name: sanitizeText(body.accountName || 'Valorant Ajanı', 30),
      rank: body.rank || 'Altın',
      account_level: Number(body.accountLevel || 100),
      total_vp: Number(body.totalVP || 0),
      invested_try: Number(body.investedTRY || 0),
      market_value_try: Number(body.marketValueTRY || 0),
      rarity_score: Number(body.rarityScore || 50),
      archetype: body.archetype || 'Standart Oyuncu',
      skin_uuids: body.skinUUIDs || [],
      created_at: new Date().toISOString()
    };

    if (client) {
      await initTursoTables();
      await client.execute({
        sql: `INSERT INTO valuations (id, account_name, rank, account_level, total_vp, invested_try, market_value_try, rarity_score, archetype, skin_uuids, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          valuation.id,
          valuation.account_name,
          valuation.rank,
          valuation.account_level,
          valuation.total_vp,
          valuation.invested_try,
          valuation.market_value_try,
          valuation.rarity_score,
          valuation.archetype,
          JSON.stringify(valuation.skin_uuids),
          valuation.created_at
        ]
      });
    }

    return NextResponse.json({ success: true, valuation });
  } catch (err: unknown) {
    console.error('Valuation save error:', err);
    const msg = err instanceof Error ? err.message : 'Kayıt başarısız';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
