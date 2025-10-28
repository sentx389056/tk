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

        const title = String(formData.get('title') || '');
        const publishedAtStr = String(formData.get('publishedAt') || '');
        const publishedAt = publishedAtStr ? new Date(publishedAtStr) : new Date();

        // support multiple files under the key 'attachments'
        const files = formData.getAll('attachments') as File[];

        const uploadDir = join(process.cwd(), 'public', 'files', 'protocols');
        await mkdir(uploadDir, { recursive: true });

        const savedFiles: Array<{ fileName: string; fileUrl: string }> = [];

        for (const f of files) {
            if (!f || typeof (f as any).arrayBuffer !== 'function') continue;
            const file = f as File;
            const ext = extname(file.name).toLowerCase();
            // basic validation: only allow pdf, doc, docx
            if (!['.pdf', '.doc', '.docx'].includes(ext)) {
                return NextResponse.json({ error: 'Разрешены только PDF и DOC/DOCX файлы' }, { status: 400 });
            }
            const randomFileName = randomBytes(12).toString('hex') + ext;
            const filePath = join(uploadDir, randomFileName);
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            // basic size limit: 10MB per file
            if (buffer.length > 10 * 1024 * 1024) {
                return NextResponse.json({ error: 'Файл слишком большой (макс 10MB)' }, { status: 400 });
            }
            await writeFile(filePath, buffer);
            savedFiles.push({ fileName: file.name, fileUrl: `/files/protocols/${randomFileName}` });
        }

        // store protocol in DB; attachments stored as JSON string
        const protocol = await prisma.protocol.create({
            data: {
                title,
                publishedAt,
                attachments: JSON.stringify(savedFiles),
            },
        });

        if (userId) {
            await prisma.log.create({
                data: {
                    type: 'ADD',
                    action: 'Добавление протокола',
                    userId,
                    metadata: JSON.stringify({
                        protocolId: protocol.id,
                        protocolName: protocol.title,
                        timestamp: new Date().toISOString()
                    })
                }
            });
        }

        return NextResponse.json({ 
            success: true, 
            protocol: { 
                ...protocol, 
                attachments: savedFiles 
            } 
        }, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании протокола:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}
