import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get('fileUrl') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const approved = formData.get('approved') === 'true';
    const approvedAtStr = formData.get('approvedAt') as string | null;
    const organization = formData.get('organization') as string;

    if (!file || !title || !organization) {
      return NextResponse.json({ error: 'Не все обязательные поля заполнены' }, { status: 400 });
    }

    const ext = extname(file.name).toLowerCase();
    const randomFileName = randomBytes(16).toString('hex');
    const fileName = `${randomFileName}${ext}`;
    
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'standards');
    const filePath = join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/standards/${fileName}`;

    const approvedAt = approvedAtStr ? new Date(approvedAtStr) : null;

    const standardFund = await prisma.standardFund.create({
       data: {
        title,
        description,
        approved,
        approvedAt,
        organization,
        fileUrl,
      },
    });

    return NextResponse.json({ success: true, id: standardFund.id }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании фонда:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}