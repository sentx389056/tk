import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

        // Get user ID from the cookie
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

        const body = await request.json();

        const member = await prisma.technicalCommitteeMember.create({
            data: {
                name: body.name,
                position: body.position,
                organization: body.organization,
                experience: body.experience,
                email: body.email,
                phone: body.phone,
                address: body.address,
            },
        });

        // Log the action if we have a user ID
        if (userId) {
            await prisma.log.create({
                data: {
                    type: 'ADD',
                    action: 'Добавление сотрудника в Состав ТК',
                    userId,
                    metadata: JSON.stringify({
                        memberId: member.id,
                        memberName: member.name,
                        timestamp: new Date().toISOString()
                    })
                }
            });
        }


        return NextResponse.json(member, { status: 201 });
    } catch (error) {
        console.error("Error adding member:", error);
        return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
    }
}