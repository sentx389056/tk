
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        
        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
        }

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

        const team = await prisma.teamMembers.findUnique({
            where: { id: Number(id) },
            select: { id: true, orgName: true }
        });

        if (!team) {
            return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
        }

        await prisma.teamMembers.delete({
            where: { id: Number(id) }
        });

        // Log the action if we have both user ID and team data
        if (userId && team) {
            await prisma.log.create({
                data: {
                    type: 'DELETE',
                    action: 'Удаление записи в Состав ТК',
                    userId,
                    metadata: JSON.stringify({
                        memberId: team.id,
                        memberName: team.orgName,
                        timestamp: new Date().toISOString()
                    })
                }
            });
        }

        return NextResponse.json({ ok: true, message: 'Team member deleted successfully' });
    } catch (error) {
        console.error('Error deleting team member:', error);
        return NextResponse.json({ 
            error: 'Failed to delete team member',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
