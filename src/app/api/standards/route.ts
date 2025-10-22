import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const standards = await prisma.standardFund.findMany({
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(standards, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /standards:', error);
        return NextResponse.json({ error: 'Не удалось загрузить стандарты' }, { status: 500 });
    }
}