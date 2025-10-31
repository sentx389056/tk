import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const reports = await prisma.annualReport.findMany({
            orderBy: { id: 'desc' },
        });

        return NextResponse.json(reports, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /reports:', error);
        return NextResponse.json({ error: 'Не удалось загрузить отчеты' }, { status: 500 });
    } 
}