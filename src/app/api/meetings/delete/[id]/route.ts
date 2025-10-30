import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, { params }: any) {
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

        // Get the executive before deleting
        const meeting = await prisma.meeting.findUnique({
            where: { id: Number(params.id) },
            select: { id: true, title: true }
        });

        // Delete the executive
        await prisma.meeting.delete({
            where: { id: Number(params.id) }
        });

        // Log the action if we have both user ID and executive data
        if (userId && meeting) {
            await prisma.log.create({
                data: {
                    type: 'DELETE',
                    action: 'Удаление заседания',
                    userId,
                    metadata: JSON.stringify({
                        meetingId: meeting.id,
                        meetingName: meeting.title,
                        timestamp: new Date().toISOString()
                    })
                }
            });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error deleting meeting:', error);
        return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 });
    }
}