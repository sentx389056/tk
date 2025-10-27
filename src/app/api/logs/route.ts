import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Ensure prisma is initialized
if (!prisma) {
    throw new Error('Prisma client is not initialized');
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const userId = searchParams.get('userId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const limit = searchParams.get('limit');

        // Build the where clause
        const where: any = {};
        
        if (type) {
            where.type = type;
        }
        if (userId) {
            where.userId = parseInt(userId, 10);
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }

        const logs = await prisma.log.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit ? parseInt(limit, 10) : undefined,
            include: {
                user: {
                    select: {
                        login: true,
                    },
                },
            },
        });
        
        return NextResponse.json(logs);
    } catch (error) {
        console.error('Failed to fetch logs:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error details:', errorMessage);
        return NextResponse.json(
            { 
                error: 'Failed to fetch logs', 
                details: errorMessage,
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, action, userId, documentId, metadata } = body;

        const log = await prisma.log.create({
            data: {
                type,
                action,
                userId,
                documentId,
                metadata: metadata ? JSON.stringify(metadata) : null
            },
            include: {
                user: {
                    select: {
                        login: true,
                    },
                },
            },
        });

        return NextResponse.json(log);
    } catch (error) {
        console.error('Failed to create log:', error);
        return NextResponse.json(
            { error: 'Failed to create log' },
            { status: 500 }
        );
    }
}