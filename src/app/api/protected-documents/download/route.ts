import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const doc = await prisma.protectedDocument.findUnique({ where: { id: Number(id) } });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Resolve file path inside project root
    const projectRoot = process.cwd();
    const safePath = path.join(projectRoot, doc.filePath);

    if (!fs.existsSync(safePath)) {
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(safePath);

    // Log the download server-side
    try {
      await prisma.log.create({
        data: {
          type: 'DOWNLOAD',
          action: `Просмотр/запрос защищённого документа: ${doc.title}`,
          userId: user.id,
          documentId: doc.id,
          metadata: JSON.stringify({ fileName: doc.fileName, remoteAddr: 'server' })
        }
      });
    } catch (e) {
      console.error('Failed to write download log:', e);
    }

    const headers = new Headers();
    // Serve inline (to discourage direct saving) and avoid caching
    headers.set('Content-Disposition', `inline; filename="${doc.fileName}"`);
    headers.set('Cache-Control', 'no-store');
    // Attempt a basic content-type guess by extension
    const ext = path.extname(doc.fileName).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' : 'application/octet-stream';
    headers.set('Content-Type', contentType);

    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (error) {
    console.error('Error in download route:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
