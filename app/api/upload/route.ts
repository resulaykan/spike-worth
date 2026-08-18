import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const base64Data = formData.get('base64') as string | null;

    if (!file && !base64Data) {
      return NextResponse.json({ error: 'Görsel dosyası bulunamadı.' }, { status: 400 });
    }

    let fileBuffer: Buffer;
    let mimeType = 'image/png';
    let ext = 'png';

    if (file) {
      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
      mimeType = file.type || 'image/png';
      ext = mimeType.split('/')[1] || 'png';
    } else if (base64Data) {
      const match = base64Data.match(/^data:image\/(\w+);base64,/);
      if (match) {
        ext = match[1];
        mimeType = `image/${ext}`;
      }
      const rawBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
      fileBuffer = Buffer.from(rawBase64, 'base64');
    } else {
      return NextResponse.json({ error: 'Geçersiz görsel verisi.' }, { status: 400 });
    }

    // 1. Primary: Upload to Catbox (Free, fast, permanent public CDN)
    try {
      const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
      const catboxForm = new FormData();
      catboxForm.append('reqtype', 'fileupload');
      catboxForm.append('fileToUpload', blob, `inventory-${Date.now()}.${ext}`);

      const catboxRes = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: catboxForm
      });

      const catboxUrl = (await catboxRes.text()).trim();
      if (catboxUrl.startsWith('https://')) {
        return NextResponse.json({
          success: true,
          url: catboxUrl,
          displayUrl: catboxUrl
        });
      }
    } catch (catboxErr) {
      console.warn('Catbox upload fallback:', catboxErr);
    }

    // 2. Secondary: If IMGBB_API_KEY is available
    const imgbbKey = process.env.IMGBB_API_KEY;
    if (imgbbKey) {
      try {
        const imgbbForm = new FormData();
        imgbbForm.append('image', fileBuffer.toString('base64'));

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
        console.warn('ImgBB fallback:', imgbbErr);
      }
    }

    // 3. Tertiary: Save directly to Next.js /public/uploads/ directory
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const filename = `inv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${ext}`;
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, fileBuffer);

      const localUrl = `/uploads/${filename}`;
      return NextResponse.json({
        success: true,
        url: localUrl,
        displayUrl: localUrl
      });
    } catch (fsErr) {
      console.warn('Local fs save fallback:', fsErr);
    }

    // 4. Ultimate Fallback: Base64 data URL
    const directDataUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    return NextResponse.json({
      success: true,
      url: directDataUrl,
      displayUrl: directDataUrl
    });

  } catch (error: unknown) {
    console.error('API /api/upload error:', error);
    const msg = error instanceof Error ? error.message : 'Yükleme başarısız';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
