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

        const file = formData.get('fileUrl') as File;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const approvedAtStr = formData.get('approvedAt') as string;
        const organization = formData.get('organization') as string;

        const ext = extname(file.name).toLowerCase();
        const randomFileName = randomBytes(16).toString('hex');
        const fileName = `${randomFileName}${ext}`;

        const uploadsRoot = process.env.UPLOADS_DIR || join(process.cwd(), 'uploads');
        const uploadDir = join(uploadsRoot, 'project-standards');
        const filePath = join(uploadDir, fileName);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await mkdir(uploadDir, { recursive: true });
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

        // Log the action if we have a user ID
        if (userId) {
            await prisma.log.create({
                data: {
                    type: 'ADD',
                    action: 'Добавление положения о ТК',
                    userId,
                    documentId: provision.id,
                    metadata: JSON.stringify({
                        title: provision.title,
                        fileUrl: provision.fileUrl,
                        organization: provision.organization,
                        timestamp: new Date().toISOString()
                    })
                }
            });
        }

        return NextResponse.json({ success: true, id: provision.id }, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании положения о ТК:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}