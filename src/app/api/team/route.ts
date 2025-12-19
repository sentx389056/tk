import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        
        const skip = (page - 1) * pageSize;
        
        const [teamMembers, total] = await Promise.all([
            prisma.teamMembers.findMany({
                orderBy: { id: 'desc' },
                skip,
                take: pageSize,
            }),
            prisma.teamMembers.count()
        ]);

        const totalPages = Math.ceil(total / pageSize);

        return NextResponse.json({
            teamMembers,
            total,
            page,
            pageSize,
            totalPages
        }, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /team:', error);
        return NextResponse.json({ error: 'Не удалось загрузить состав' }, { status: 500 });
    }
}