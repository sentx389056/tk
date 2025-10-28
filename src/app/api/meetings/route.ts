import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

        const where: any = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' as const } },
                { location: { contains: search, mode: 'insensitive' as const } },
            ];
        }

        const [meetings, total] = await Promise.all([
            prisma.meeting.findMany({
                where,
                orderBy: { publishedAt: 'asc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.meeting.count({ where }),
        ]);

        // parse attachments field (stored as JSON string) into objects for the client
        const parsed = meetings.map((m) => ({
            ...m,
            attachments: (() => {
                try {
                    return typeof m.attachments === 'string' ? JSON.parse(m.attachments) : m.attachments;
                } catch {
                    return m.attachments;
                }
            })(),
        }));

        return NextResponse.json({
            meetings: parsed,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        }, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /meetings:', error);
        return NextResponse.json({ error: 'Не удалось загрузить заседания' }, { status: 500 });
    }
}