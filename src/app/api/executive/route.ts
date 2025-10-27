import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const executives = await prisma.executive.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json(executives, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /executive:', error);
        return NextResponse.json({ error: 'Не удалось загрузить руководящий состав' }, { status: 500 });
    }
}