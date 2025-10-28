import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function getUserFromRequest(request: Request) {
    try {
        const cookieHeader = request.headers.get('cookie');
        if (!cookieHeader) return null;

        const tkUserCookie = cookieHeader.split(';').find(c => c.trim().startsWith('tk_user='));
        if (!tkUserCookie) return null;

        const userData = JSON.parse(decodeURIComponent(tkUserCookie.split('=')[1]));
        if (!userData?.id) return null;

        // Verify user exists in database
        const user = await prisma.user.findUnique({
                where: { id: userData.id },
                select: {
                    id: true,
                    login: true,
                    createdAt: true,
                    updatedAt: true,
                    member: {
                        select: {
                            id: true,
                            name: true,
                            position: true,
                            organization: true,
                            email: true,
                            phone: true
                        }
                    }
                }
        });

        return user;
    } catch (e) {
        console.error('Error extracting user from cookie:', e);
        return null;
    }
}

export async function getUserIdFromRequest(request: Request): Promise<number | null> {
    const user = await getUserFromRequest(request);
    return user?.id || null;
}