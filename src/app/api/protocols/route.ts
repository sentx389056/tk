import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

        const where = search ? {
            title: {
                contains: search,
                mode: 'insensitive' as const
            }
        } : {};

        const [protocols, total] = await Promise.all([
            prisma.protocol.findMany({
                where,
                orderBy: { id: 'asc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.protocol.count({ where }),
        ]);

        return NextResponse.json({
            protocols,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /protocols:', error);
        return NextResponse.json({ error: 'Не удалось загрузить протоколы' }, { status: 500 });
    }
}