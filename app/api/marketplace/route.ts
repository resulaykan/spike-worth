import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Supabase'e ekle
    const { data, error } = await supabase
      .from('listings')
      .insert([
        {
          seller_name: body.sellerName,
          price: body.price,
          image_urls: body.imageUrls, // Save array of URLs
          title: body.title,
          description: body.description,
          rank: body.rank,
          rank_tier: body.rankTier, 
          wallet_vp: body.walletVP,
          wallet_rp: body.walletRP,
          account_level: body.accountLevel,
          total_vp: body.totalVP,
          inventory_count: body.inventoryCount,
          inventory_uuids: body.inventoryUUIDs, // Array of Skin UUIDs
          status: 'active'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}