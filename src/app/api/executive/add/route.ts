import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Get user ID from the cookie first
        const cookies = request.headers.get('cookie');
        let userId = null;
        
        if (cookies) {
            const tkUserCookie = cookies.split(';').find(c => c.trim().startsWith('tk_user='));
            if (tkUserCookie) {
                try {
                    const userData = JSON.parse(decodeURIComponent(tkUserCookie.split('=')[1]));
                    userId = userData.id;
                } catch (e) {
                    console.error('Error parsing user cookie:', e);
                }
            }
        }

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
                achievements,
                awards,
                address
            }
        });

        // Log the action if we have a user ID
        if (userId) {
            await prisma.log.create({
                data: {
                    type: 'ADD',
                    action: 'Добавление руководящего сотрудника',
                    userId,
                    metadata: JSON.stringify({
                        executiveId: executive.id,
                        executiveName: executive.name,
                        executivePosition: executive.position,
                        timestamp: new Date().toISOString()
                    })
                }
            });
        }

        return NextResponse.json(executive);
    } catch (error) {
        console.error('Ошибка при создании руководителя:', error);
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}