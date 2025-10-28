import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
        const executive = await prisma.executive.findUnique({
            where: { id: Number(params.id) },
            select: { id: true, name: true, position: true }
        });

        // Delete the executive
        await prisma.executive.delete({
            where: { id: Number(params.id) }
        });

        // Log the action if we have both user ID and executive data
        if (userId && executive) {
            await prisma.log.create({
                data: {
                    type: 'DELETE',
                    action: 'Удаление руководителя',
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

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error deleting executive:', error);
        return NextResponse.json({ error: 'Failed to delete executive' }, { status: 500 });
    }
}