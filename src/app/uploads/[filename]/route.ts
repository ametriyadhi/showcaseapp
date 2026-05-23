import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request, { params }: { params: { filename: string } }) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'uploads', params.filename);
    const file = await fs.readFile(filePath);
    
    const ext = path.extname(params.filename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.mp4') contentType = 'video/mp4';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}
