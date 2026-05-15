import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFile, mkdir, stat } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    // Ambil ekstensi asli dari file yang sudah terkompresi
    const ext = file.name.split('.').pop();

    // Simpan file terkompresi sebagai "original format" (base untuk WebP)
    const originalFilename = `${timestamp}-final.${ext}`;
    // Tentukan nama file WebP
    const webpFilename = `${timestamp}-final.webp`;

    const originalPath = path.join(uploadDir, originalFilename);
    const webpPath = path.join(uploadDir, webpFilename);

    // 1. Simpan file yang sudah terkompresi
    await writeFile(originalPath, buffer);

    // 2. Konversi ke WebP
    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(webpPath);

    const originalStats = await stat(originalPath);
    const webpStats = await stat(webpPath);

    return NextResponse.json({
      originalUrl: `/uploads/${originalFilename}`,
      webpUrl: `/uploads/${webpFilename}`,
      sizes: {
        // file.size di sini adalah ukuran file setelah Client Compression (Base Size)
        originalUpload: file.size,
        original: originalStats.size,
        webp: webpStats.size,
      },
    });

  } catch (error) {
    console.error('WebP conversion error:', error);
    return NextResponse.json({ error: 'Failed to convert image' }, { status: 500 });
  }
}