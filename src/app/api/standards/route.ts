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
                mode: 'insensitive' as const,
            }
        } : {};

        const [standards, total] = await Promise.all([
            prisma.standardFund.findMany({
                where,
                orderBy: { id: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.standardFund.count({ where })
        ]);

        return NextResponse.json({
            standards,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /standards:', error);
        return NextResponse.json({ error: 'Не удалось загрузить стандарты' }, { status: 500 });
    }
}