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

    const provision = await prisma.technicalCommitteeRegulation.findUnique({
      where: { id: Number(params.id) },
      select: { id: true, title: true }
    });

    await prisma.technicalCommitteeRegulation.delete({
      where: { id: Number(params.id) }
    });

    // Log the action if we have both user ID and executive data
    if (userId && provision) {
      await prisma.log.create({
        data: {
          type: 'DELETE',
          action: 'Удаление положения о ТК',
          userId,
          metadata: JSON.stringify({
            provisionId: provision.id,
            provisionName: provision.title,
            timestamp: new Date().toISOString()
          })
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting provision:', error);
    return NextResponse.json({ error: 'Failed to delete provision' }, { status: 500 });
  }
}