import { NextRequest } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() || '';
  switch (ext) {
    case 'pdf': return 'application/pdf';
    case 'doc': return 'application/msword';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default: return 'application/octet-stream';
  }
}

export async function GET(_req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathSegments } = await context.params;
    const segments = Array.isArray(pathSegments) ? pathSegments : [];
    if (!segments.length) return new Response('Not Found', { status: 404 });

    const uploadsRoot = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
    const protocolsRoot = path.join(uploadsRoot, 'protocols') + path.sep;
    const filePath = path.resolve(path.join(protocolsRoot, ...segments));
    if (!filePath.startsWith(protocolsRoot)) return new Response('Forbidden', { status: 403 });
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return new Response('File not found', { status: 404 });

    const stream = fs.createReadStream(filePath);
    const filename = segments[segments.length - 1] || 'file';
    const headers = new Headers();
    headers.set('Content-Type', getContentType(filename));
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(stream as unknown as ReadableStream, { status: 200, headers });
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
}


