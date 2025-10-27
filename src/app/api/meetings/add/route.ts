import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { extname, join } from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const title = String(formData.get('title') || '');
        const location = String(formData.get('location') || '');
        const publishedAtStr = String(formData.get('publishedAt') || '');
        const format = String(formData.get('format') || '');

        const publishedAt = publishedAtStr ? new Date(publishedAtStr) : new Date();

        // support multiple files under the key 'attachments'
        const files = formData.getAll('attachments') as File[];

        const uploadDir = join(process.cwd(), 'public', 'files', 'meetings');
        await mkdir(uploadDir, { recursive: true });

        const savedFiles: Array<{ fileName: string; fileUrl: string }> = [];

        for (const f of files) {
            if (!f || typeof (f as any).arrayBuffer !== 'function') continue;
            const file = f as File;
            const ext = extname(file.name).toLowerCase();
            const randomFileName = randomBytes(12).toString('hex') + ext;
            const filePath = join(uploadDir, randomFileName);
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            // basic size limit: 10MB per file
            if (buffer.length > 10 * 1024 * 1024) {
                return NextResponse.json({ error: 'Файл слишком большой (макс 10MB)' }, { status: 400 });
            }
            await writeFile(filePath, buffer);
            savedFiles.push({ fileName: file.name, fileUrl: `/files/meetings/${randomFileName}` });
        }

        // store meeting in DB; attachments stored as JSON string
        const meeting = await prisma.meeting.create({
            data: {
                title,
                location,
                format,
                publishedAt,
                attachments: JSON.stringify(savedFiles),
            },
        });

        return NextResponse.json({ success: true, meeting: { ...meeting, attachments: savedFiles } }, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании заседания:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}