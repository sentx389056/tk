import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveFile(field: any) {
  // field is a File from FormData
  const arrayBuffer = await field.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const projectRoot = process.cwd();
  const uploadsDir = path.join(projectRoot, 'protected_uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const safeName = `${Date.now()}-${field.name}`;
  const filePath = path.join(uploadsDir, safeName);
  await fs.promises.writeFile(filePath, buffer);
  return { filePath: path.relative(projectRoot, filePath), fileName: field.name };
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = String(formData.get('title') || '');
    const description = String(formData.get('description') || '');
    const copyrightHolder = String(formData.get('copyrightHolder') || '');

    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const saved = await saveFile(file);

    const doc = await prisma.protectedDocument.create({
      data: {
        title,
        description,
        filePath: saved.filePath,
        fileName: saved.fileName,
        copyrightHolder,
        createdBy: user.id,
      }
    });

    // Log creation
    try {
      await prisma.log.create({
        data: {
          type: 'ADD',
          action: `Добавлен защищённый документ: ${doc.title}`,
          userId: user.id,
          documentId: doc.id,
          metadata: JSON.stringify({ fileName: doc.fileName })
        }
      });
    } catch (e) {
      console.error('Failed to write add log:', e);
    }

    return NextResponse.json({ doc });
  } catch (error) {
    console.error('Failed to create protected document:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Require authenticated user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
    }

    const docs = await prisma.protectedDocument.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        fileName: true,
        copyrightHolder: true,
        createdAt: true,
        createdBy: true,
      }
    });

    return NextResponse.json(docs);
  } catch (error) {
    console.error('Failed to fetch protected documents:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
