import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";

// GET /api/discussions - получение списка обсуждений
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
        const status = searchParams.get('status') || undefined;

        // Формируем условия поиска
        const where = {
            AND: [
                search ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' as const } },
                        { content: { contains: search, mode: 'insensitive' as const } }
                    ]
                } : {},
                status ? { status } : {}
            ]
        };

        // Получаем обсуждения с пагинацией
        const [discussions, total] = await Promise.all([
            prisma.internalDiscussion.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
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
                        select: { comments: true }
                    }
                }
            }),
            prisma.internalDiscussion.count({ where })
        ]);

        return NextResponse.json({
            discussions,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        });
    } catch (error) {
        console.error('Error in discussions API:', error);
        return NextResponse.json(
            { error: 'Не удалось загрузить обсуждения' },
            { status: 500 }
        );
    }
}

// POST /api/discussions - создание нового обсуждения
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
        const { title, content } = data;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Необходимо указать заголовок и содержание' },
                { status: 400 }
            );
        }

        const discussion = await prisma.internalDiscussion.create({
            data: {
                title,
                content,
                createdBy: user.id,
                status: 'open'
            },
            include: {
                createdByUser: {
                    include: {
                        member: true
                    }
                },
                comments: true,
                _count: {
                    select: { comments: true }
                }
            },
        });

        return NextResponse.json({ discussion }, { status: 201 });
    } catch (error) {
        console.error('Error creating discussion:', error);
        const errorMessage = error instanceof Error ? error.message : 'Не удалось создать обсуждение';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}