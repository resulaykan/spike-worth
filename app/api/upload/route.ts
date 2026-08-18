import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const base64Data = formData.get('base64') as string | null;

    if (!file && !base64Data) {
      return NextResponse.json({ error: 'Görsel dosyası bulunamadı.' }, { status: 400 });
    }

    let imageBase64 = '';

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageBase64 = buffer.toString('base64');
    } else if (base64Data) {
      // Strip data:image/...;base64, prefix if present
      imageBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    }

    // 1. If IMGBB_API_KEY is provided in environment variables, upload to ImgBB
    const imgbbKey = process.env.IMGBB_API_KEY;
    if (imgbbKey) {
      try {
        const imgbbForm = new FormData();
        imgbbForm.append('image', imageBase64);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: 'POST',
          body: imgbbForm
        });

        const imgbbJson = await imgbbRes.json();
        if (imgbbJson.success && imgbbJson.data?.url) {
          return NextResponse.json({
            success: true,
            url: imgbbJson.data.url,
            displayUrl: imgbbJson.data.display_url || imgbbJson.data.url
          });
        }
      } catch (imgbbErr) {
        console.warn('ImgBB upload fallback:', imgbbErr);
      }
    }

    // 2. Free Public Image Host (Freeimage.host / ImgBB public fallback)
    try {
      const freeForm = new FormData();
      freeForm.append('key', '6d207e02198a847aa98d0a2a901485a5'); // Public community key
      freeForm.append('action', 'upload');
      freeForm.append('source', imageBase64);
      freeForm.append('format', 'json');

      const freeRes = await fetch('https://freeimage.host/api/1/upload', {
        method: 'POST',
        body: freeForm
      });

      const freeJson = await freeRes.json();
      if (freeJson?.image?.url) {
        return NextResponse.json({
          success: true,
          url: freeJson.image.url,
          displayUrl: freeJson.image.display_url || freeJson.image.url
        });
      }
    } catch {
      // Continue to inline fallback
    }

    // 3. Fallback: Return optimized data-URL so it works 100% everywhere with zero setup
    const mimeType = file?.type || 'image/png';
    const directDataUrl = `data:${mimeType};base64,${imageBase64}`;

    return NextResponse.json({
      success: true,
      url: directDataUrl,
      displayUrl: directDataUrl
    });

  } catch (error: unknown) {
    console.error('Image upload error:', error);
    const msg = error instanceof Error ? error.message : 'Yükleme başarısız';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
