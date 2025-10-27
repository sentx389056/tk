import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const file = formData.get('fileUrl') as File;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string | null;
        const startDateStr = formData.get('startDate') as string;
        const endDateStr = formData.get('endDate') as string | null;

        const ext = extname(file.name).toLowerCase();
        const randomFileName = randomBytes(16).toString('hex');
        const fileName = `${randomFileName}${ext}`;

        const uploadDir = join(process.cwd(), 'public', 'uploads', 'project-standards');
        const filePath = join(uploadDir, fileName);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/project-standards/${fileName}`;

        const startDate = new Date(startDateStr);
        const endDate = endDateStr ? new Date(endDateStr) : undefined;

        const standardProject = await prisma.standardProject.create({
            data: {
                title,
                description,
                startDate,
                endDate,
                fileUrl,
            },
        });

        return NextResponse.json({ success: true, id: standardProject.id }, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании проекта стандарта:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}