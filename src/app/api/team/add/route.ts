import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

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
        
        console.log('Received team data:', body);

        if (!body.orgName || !body.contactsInfo) {
            return NextResponse.json({ error: "orgName and contactsInfo are required" }, { status: 400 });
        }

        const team = await prisma.teamMembers.create({
            data: {
                orgName: body.orgName,
                contactsInfo: body.contactsInfo,
            },
        });

        if (userId) {
            await prisma.log.create({
                data: {
                    type: 'ADD',
                    entity: 'Добавление записи в Состав ТК',
                    userId,
                    metadata: JSON.stringify({
                        memberId: team.id,
                        memberName: team.orgName,
                        timestamp: new Date().toISOString()
                    })
                }
            });
        }


        return NextResponse.json(team, { status: 201 });
    } catch (error) {
        console.error("Error adding team:", error);
        console.error("Error details:", error instanceof Error ? error.message : 'Unknown error');
        console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json({ 
            error: "Failed to add team", 
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}