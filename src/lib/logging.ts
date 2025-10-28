import { prisma } from '@/lib/prisma';

export type LogType = 'DELETE' | 'ADD' | 'DOWNLOAD' | 'AUTH';

export interface LogData {
    type: LogType;
    action: string;
    userId: number;
    documentId?: number;
    metadata?: any;
}

export async function createLog(data: LogData) {
    try {
        const response = await fetch('/api/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            cache: 'no-cache',
            credentials: 'same-origin',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to create log');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating log:', error);
        return null;
    }
}

export type PaginatedLogsResponse = {
    logs: {
        id: number;
        type: LogType;
        action: string;
        user: {
            login: string;
            member?: {
                name?: string;
            }
        };
        documentId: number | null;
        metadata: string | null;
        createdAt: string;
    }[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export async function getLogs(options?: {
    type?: LogType;
    userId?: number;
    memberName?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
}): Promise<PaginatedLogsResponse> {
    try {
        let url = '/api/logs';
        const params = new URLSearchParams();
        
        if (options?.type) {
            params.append('type', options.type);
        }
        if (options?.userId) {
            params.append('userId', options.userId.toString());
        }
        if (options?.memberName) {
            params.append('memberName', options.memberName);
        }
        if (options?.startDate) {
            params.append('startDate', options.startDate.toISOString());
        }
        if (options?.endDate) {
            params.append('endDate', options.endDate.toISOString());
        }
        if (options?.page) {
            params.append('page', options.page.toString());
        }
        if (options?.pageSize) {
            params.append('pageSize', options.pageSize.toString());
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-cache',
            credentials: 'same-origin',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch logs');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        return {
            logs: [],
            total: 0,
            page: 1,
            pageSize: 10,
            totalPages: 0
        };
    }
}