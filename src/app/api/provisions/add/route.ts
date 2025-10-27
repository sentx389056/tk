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
        const description = formData.get('description') as string;
        const approvedAtStr = formData.get('approvedAt') as string;
        const organization = formData.get('organization') as string;

        const ext = extname(file.name).toLowerCase();
        const randomFileName = randomBytes(16).toString('hex');
        const fileName = `${randomFileName}${ext}`;

        const uploadDir = join(process.cwd(), 'public', 'uploads', 'project-standards');
        const filePath = join(uploadDir, fileName);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/project-standards/${fileName}`;

        const approvedAt = new Date(approvedAtStr);

        const provision = await prisma.technicalCommitteeRegulation.create({
            data: {
                title,
                description,
                approvedAt,
                organization,
                fileUrl,
            },
        });

        return NextResponse.json({ success: true, id: provision.id }, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании положения о ТК:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}