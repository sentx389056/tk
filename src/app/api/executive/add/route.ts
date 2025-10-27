import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const name = formData.get('name') as string;
        const position = formData.get('position') as string;
        const organization = formData.get('organization') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string | null;
        const experience = formData.get('experience') as string | null;
        const biography = formData.get('biography') as string | null;
        const education = formData.get('education') as string | null;
        const address = formData.get('address') as string | null;

        const awardsRaw = formData.get('awards');

        const achievementsRaw = formData.get('achievements');

        const achievements = achievementsRaw ? String(achievementsRaw) : '[]';
        const awards = awardsRaw ? String(awardsRaw) : '[]';

        const executive = await prisma.executive.create({
            data: {
                name,
                position,
                organization,
                email,
                phone,
                experience,
                biography,
                education,
                address,
                achievements,
                awards,
            },
        });

        return NextResponse.json({ success: true, id: executive.id }, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании отчёта:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}