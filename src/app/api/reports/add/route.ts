// app/api/reports/add/route.ts
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from "path";

export async function POST(request: NextRequest) {
  try {
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
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'reports');
    const filePath = join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
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

    return NextResponse.json({ success: true, id: report.id }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании отчёта:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}