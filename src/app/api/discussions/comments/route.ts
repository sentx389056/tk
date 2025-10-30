import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";

// POST /api/discussions/comments - создание нового комментария
export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Необходима авторизация' },
                { status: 401 }
            );
        }

        const data = await request.json();
        const { content, discussionId } = data;

        if (!content || !discussionId) {
            return NextResponse.json(
                { error: 'Необходимо указать текст комментария и ID обсуждения' },
                { status: 400 }
            );
        }

        const comment = await prisma.discussionComment.create({
            data: {
                content,
                discussionId,
                createdBy: user.id
            },
            include: {
                createdByUser: {
                    include: {
                        member: true
                    }
                }
            }
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Не удалось создать комментарий' },
            { status: 500 }
        );
    }
}

// DELETE /api/discussions/comments?id={id} - удаление комментария
export async function DELETE(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Необходима авторизация' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Необходимо указать ID комментария' },
                { status: 400 }
            );
        }

        // Проверяем, является ли пользователь автором комментария
        const comment = await prisma.discussionComment.findUnique({
            where: { id: parseInt(id) },
            select: { createdBy: true }
        });

        if (!comment) {
            return NextResponse.json(
                { error: 'Комментарий не найден' },
                { status: 404 }
            );
        }

        if (comment.createdBy !== user.id) {
            return NextResponse.json(
                { error: 'Нет прав на удаление этого комментария' },
                { status: 403 }
            );
        }

        await prisma.discussionComment.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { error: 'Не удалось удалить комментарий' },
            { status: 500 }
        );
    }
}