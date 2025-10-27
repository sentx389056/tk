import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const meetings = await prisma.meeting.findMany({
            orderBy: {
                publishedAt: 'asc',
            },
        });
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
        return NextResponse.json(parsed, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /meetings:', error);
        return NextResponse.json({ error: 'Не удалось загрузить заседания' }, { status: 500 });
    }
}