import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const provisions = await prisma.technicalCommitteeRegulation.findMany({
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(provisions, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /provisions:', error);
        return NextResponse.json({ error: 'Не удалось загрузить положения' }, { status: 500 });
    }
}