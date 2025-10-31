// app/api/reports/add/route.ts
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from "path";

export async function POST(request: NextRequest) {
  try {
    // Get user ID from the cookie
    const cookies = request.headers.get('cookie');
    let userId = null;

    if (cookies) {
      const tkUserCookie = cookies.split(';').find(c => c.trim().startsWith('tk_user='));
      if (tkUserCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(tkUserCookie.split('=')[1]));
          userId = userData.id;
        } catch (e) {
          console.error('Error parsing user cookie:', e);
        }
      }
    }

    const formData = await request.formData();

    const file = formData.get('fileUrl') as File | null;
    const title = formData.get('title')?.toString() || '';
    const publishedAtStr = formData.get('publishedAt')?.toString() || '';
    const achievementsRaw = formData.get('achievements');

    if (!file || !title || !publishedAtStr) {
      return NextResponse.json({ error: 'Обязательные поля отсутствуют' }, { status: 400 });
    }

    const keyAchievements = achievementsRaw ? String(achievementsRaw) : '[]';

    const ext = extname(file.name).toLowerCase();
    const randomFileName = randomBytes(16).toString('hex');
    const fileName = `${randomFileName}${ext}`;
    const uploadsRoot = process.env.UPLOADS_DIR || join(process.cwd(), 'uploads');
    const uploadDir = join(uploadsRoot, 'reports');
    const filePath = join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/reports/${fileName}`;

    const publishedAt = new Date(publishedAtStr);

    const report = await prisma.annualReport.create({
      data: {
        title,
        fileUrl,
        keyAchievements,
        publishedAt,
      },
    });

    // Log the action if we have a user ID
    if (userId) {
      await prisma.log.create({
        data: {
          type: 'ADD',
          action: 'Добавление годового отчёта',
          userId,
          metadata: JSON.stringify({
            reportId: report.id,
            reporteName: report.title,
            timestamp: new Date().toISOString()
          })
        }
      });
    }


    return NextResponse.json({ success: true, id: report.id }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании отчёта:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}