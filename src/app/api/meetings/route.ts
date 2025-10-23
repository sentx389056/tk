import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const meetings = await prisma.meeting.findMany({
            orderBy: {
                publishedAt: 'asc',
            },
        });
        return NextResponse.json(meetings, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /meetings:', error);
        return NextResponse.json({ error: 'Не удалось загрузить заседания' }, { status: 500 });
    }
}