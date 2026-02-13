import { prisma } from '@/lib/prisma';
import { LogType } from '@prisma/client';

export interface LogOperationOptions {
    type: LogType;
    entity: string;
    entityId?: string;
    details?: string;
    ip?: string;
    userAgent?: string;
}

export async function logOperation(userId: number, options: LogOperationOptions) {
    try {
        await prisma.log.create({
            data: {
                userId,
                type: options.type,
                entity: options.entity,
                entityId: options.entityId,
                details: options.details,
                ip: options.ip,
                userAgent: options.userAgent,
                createdAt: new Date(),
            },
        });
    } catch (error) {
        console.error('Failed to log operation:', error);
        // Не прерываем выполнение из-за ошибки логирования
    }
}

export async function getLogs(userId?: number, limit: number = 100) {
    try {
        const where = userId ? { userId } : {};
        
        return await prisma.log.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        login: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error('Failed to fetch logs:', error);
        return [];
    }
}
