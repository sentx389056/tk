import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
        const all = searchParams.get('all') === 'true';

        const where = search ? {
            title: {
                contains: search,
                mode: 'insensitive' as const
            }
        } : {};

        if (all) {
            // Для панели управления - возвращаем все записи без пагинации
            const provisions = await prisma.technicalCommitteeRegulation.findMany({
                where,
                orderBy: { id: 'asc' },
            });
            return NextResponse.json(provisions, { status: 200 });
        }

        // Для публичной страницы - возвращаем с пагинацией
        const [provisions, total] = await Promise.all([
            prisma.technicalCommitteeRegulation.findMany({
                where,
                orderBy: { id: 'asc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.technicalCommitteeRegulation.count({ where })
        ]);

        return NextResponse.json({
            provisions,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /provisions:', error);
        return NextResponse.json({ error: 'Не удалось загрузить положения' }, { status: 500 });
    }
}