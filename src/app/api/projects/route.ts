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
            const projects = await prisma.standardProject.findMany({
                where,
                orderBy: { id: 'desc' },
            });
            return NextResponse.json(projects, { status: 200 });
        }

        const [projects, total] = await Promise.all([
            prisma.standardProject.findMany({
                where,
                orderBy: { id: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.standardProject.count({ where })
        ]);

        return NextResponse.json({
            projects,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /projects:', error);
        return NextResponse.json({ error: 'Не удалось загрузить проекты' }, { status: 500 });
    }
}