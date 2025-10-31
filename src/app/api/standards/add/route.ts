import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { NextRequest, NextResponse } from 'next/server';

import { getUserFromRequest } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    console.log('[Standards Add] Starting file upload...');
    
    // Get user from request with database verification
    const user = await getUserFromRequest(request);
    if (!user) {
      console.error('[Standards Add] No authenticated user found');
      return NextResponse.json({ 
        error: 'Пожалуйста, войдите в систему заново', 
        code: 'AUTH_REQUIRED' 
      }, { status: 401 });
    }
    console.log('[Standards Add] User authenticated:', { id: user.id, login: user.login });

    const formData = await request.formData();

    const file = formData.get('fileUrl') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const approved = formData.get('approved') === 'true';
    const approvedAtStr = formData.get('approvedAt') as string | null;
    const organization = formData.get('organization') as string;

    const ext = extname(file.name).toLowerCase();
    const randomFileName = randomBytes(16).toString('hex');
    const fileName = `${randomFileName}${ext}`;
    
    const uploadsRoot = process.env.UPLOADS_DIR || join(process.cwd(), 'uploads');
    const uploadDir = join(uploadsRoot, 'standards');
    const filePath = join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Создаём директорию, если её нет
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/standards/${fileName}`;

    const approvedAt = approvedAtStr ? new Date(approvedAtStr) : null;

  const standard = await prisma.standardFund.create({
      data: {
        title,
        description,
        approved,
        approvedAt,
        organization,
        fileUrl,
      },
    });

    // Log the standard creation
    try {
      await prisma.log.create({
        data: {
          type: 'ADD',
          action: 'Добавление фонда стандартов',
          userId: user.id,
          documentId: standard.id,
          metadata: JSON.stringify({
            title: standard.title,
            fileUrl: standard.fileUrl,
            organization: standard.organization,
            approved: standard.approved,
            timestamp: new Date().toISOString()
          })
        }
      });
    } catch (logError) {
      console.error('Error creating log entry:', logError);
      // Standard was created successfully, so we'll just log the error and continue
      // rather than failing the whole request
    }

    return NextResponse.json({ success: true, id: standard.id }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании фонда:', error);
    return NextResponse.json({ error: 'Не все обязательные поля заполнены!' }, { status: 500 });
  }
}