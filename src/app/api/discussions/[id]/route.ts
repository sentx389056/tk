import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { status } = await request.json();
        
        if (!['open', 'closed'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be either "open" or "closed"' },
                { status: 400 }
            );
        }

        const discussion = await prisma.internalDiscussion.update({
            where: { id: parseInt(params.id) },
            data: { status },
            include: {
                createdByUser: {
                    include: {
                        member: true
                    }
                },
                comments: {
                    include: {
                        createdByUser: {
                            include: {
                                member: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        });

        return NextResponse.json(discussion);
    } catch (error) {
        console.error('Error updating discussion:', error);
        return NextResponse.json(
            { error: 'Failed to update discussion' },
            { status: 500 }
        );
    }
}