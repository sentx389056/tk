import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const projects = await prisma.standardProject.findMany({
            orderBy: { id: 'asc' },
        });

        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error('Ошибка в API /projects:', error);
        return NextResponse.json({ error: 'Не удалось загрузить проекты' }, { status: 500 });
    }
}