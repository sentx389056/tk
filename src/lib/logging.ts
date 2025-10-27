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

export async function getLogs(options?: {
    type?: LogType;
    userId?: number;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}): Promise<any[]> {
    try {
        let url = '/api/logs';
        const params = new URLSearchParams();
        
        if (options?.type) {
            params.append('type', options.type);
        }
        if (options?.userId) {
            params.append('userId', options.userId.toString());
        }
        if (options?.startDate) {
            params.append('startDate', options.startDate.toISOString());
        }
        if (options?.endDate) {
            params.append('endDate', options.endDate.toISOString());
        }
        if (options?.limit) {
            params.append('limit', options.limit.toString());
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
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching logs:', error);
        return [];
    }
}