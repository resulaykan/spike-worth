import { NextResponse, NextRequest } from 'next/server';
import { fetchListingsFromDb, SEED_LISTINGS } from '@/lib/turso';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listings = await fetchListingsFromDb();
    const found = listings.find((l) => l.id === id) || SEED_LISTINGS.find((l) => l.id === id);

    if (!found) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(found);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'İlan getirilemedi';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}