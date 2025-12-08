import { NextRequest, NextResponse } from 'next/server';
import { Shopier, ProductType, CurrencyType } from '@/lib/shopier';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, price, buyer, note } = body;

    // Basic validation
    if (!productName || !price) {
      return NextResponse.json({ error: 'Missing product name or price' }, { status: 400 });
    }

    // In a real app, save the 'note' to your database associated with the order
    if (note) {
      console.log('User Note for Order:', note);
    }

    // Default buyer if not provided
    const defaultBuyer = {
      id: '123456',
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      phone: '05555555555',
      address: 'Test Mah. Test Sok. No:1',
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34000',
    };

    const buyerData = buyer || defaultBuyer;

    const shopier = new Shopier(
      process.env.SHOPIER_API_KEY || '',
      process.env.SHOPIER_API_SECRET || ''
    );

    // Set Buyer Info
    shopier.setBuyer({
      buyer_id_nr: buyerData.id,
      product_name: productName,
      product_type: ProductType.REAL_OBJECT, // Switched back to Real Object to enable installments for testing
      buyer_name: buyerData.name,
      buyer_surname: buyerData.surname,
      buyer_email: buyerData.email,
      buyer_phone: buyerData.phone,
      platform_order_id: 'ORD-' + Date.now(), // Unique Order ID
    });

    // Set Billing Address
    shopier.setOrderBilling({
      billing_address: buyerData.address,
      billing_city: buyerData.city,
      billing_country: buyerData.country,
      billing_postcode: buyerData.zipCode,
    });

    // Set Shipping Address (Can be same as billing)
    shopier.setOrderShipping({
      shipping_address: buyerData.address,
      shipping_city: buyerData.city,
      shipping_country: buyerData.country,
      shipping_postcode: buyerData.zipCode,
    });
    
    // Set Currency
    shopier.setCurrency(CurrencyType.TL);

    // Generate Form HTML
    const paymentFormHtml = shopier.generatePaymentHTML(parseFloat(price));

    // Return the HTML directly with correct content type
    return new NextResponse(paymentFormHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Payment generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}