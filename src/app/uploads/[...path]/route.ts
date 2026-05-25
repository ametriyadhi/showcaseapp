import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  try {
    const joinedPath = params.path.join('/');
    
    // First try to look in showcaseapp's public directory
    let filePath = path.join(process.cwd(), 'public', 'uploads', joinedPath);
    let fileBuffer;
    
    try {
      fileBuffer = await fs.readFile(filePath);
    } catch (e) {
      // Try 'apphub' directory
      try {
        const apphubPath = path.join(process.cwd(), '..', 'apphub', 'public', 'uploads', joinedPath);
        fileBuffer = await fs.readFile(apphubPath);
      } catch (e2) {
        // Try 'ais-apphub' directory
        const aisApphubPath = path.join(process.cwd(), '..', 'ais-apphub', 'public', 'uploads', joinedPath);
        fileBuffer = await fs.readFile(aisApphubPath);
      }
    }
    
    const ext = path.extname(joinedPath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.ico') contentType = 'image/x-icon';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}
