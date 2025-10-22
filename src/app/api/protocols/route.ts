import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const protocols = await prisma.protocol.findMany({
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(protocols, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /protocols:', error);
        return NextResponse.json({ error: 'Не удалось загрузить протоколы' }, { status: 500 });
    }
}