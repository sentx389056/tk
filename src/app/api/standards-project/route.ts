import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const stProjects = await prisma.standardProject.findMany({
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(stProjects, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /standards-project:', error);
        return NextResponse.json({ error: 'Не удалось загрузить проекты стандартов' }, { status: 500 });
    }
}