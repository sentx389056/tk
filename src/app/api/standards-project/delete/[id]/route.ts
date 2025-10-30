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

    const standardProject = await prisma.standardProject.findUnique({
      where: { id: Number(params.id) },
      select: { id: true, title: true }
    });

    await prisma.standardProject.delete({
      where: { id: Number(params.id) }
    });

    // Log the action if we have both user ID and executive data
    if (userId && standardProject) {
      await prisma.log.create({
        data: {
          type: 'DELETE',
          action: 'Удаление проекта стандарта',
          userId,
          metadata: JSON.stringify({
            standardProjectId: standardProject.id,
            standardProjectName: standardProject.title,
            timestamp: new Date().toISOString()
          })
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting standard:', error);
    return NextResponse.json({ error: 'Failed to delete standard' }, { status: 500 });
  }
}