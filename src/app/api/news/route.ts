import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        
        const skip = (page - 1) * pageSize;
        
        const [news, total] = await Promise.all([
            prisma.news.findMany({
                orderBy: { date: 'desc' },
                skip,
                take: pageSize,
            }),
            prisma.news.count()
        ]);

        const totalPages = Math.ceil(total / pageSize);

        return NextResponse.json({
            news,
            total,
            page,
            pageSize,
            totalPages
        }, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /news:', error);
        return NextResponse.json({ error: 'Не удалось загрузить новости' }, { status: 500 });
    }
}