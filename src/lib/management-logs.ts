import { prisma } from './prisma';
import { LogType } from '@prisma/client';

export interface LogEventOptions {
    userId: number;
    documentId?: number;
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: Record<string, any>;
    section: 'STANDARDS' | 'PROVISIONS' | 'PROTOCOLS' | 'REPORTS' | 'EXECUTIVES' | 'MEMBERS' | 'MEETINGS';
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'DOWNLOAD';
}

export async function logManagementAction(options: LogEventOptions) {
    const { userId, documentId, title, details, section, action } = options;
    
    try {
        return await prisma.log.create({
            data: {
                type: actionToLogType(action),
                action: `${section}_${action}`,
                userId,
                documentId,
                metadata: JSON.stringify({
                    title,
                    ...details,
                    timestamp: new Date().toISOString()
                })
            }
        });
    } catch (error) {
        console.error(`Failed to log ${section} ${action}:`, error);
        // Don't throw - we don't want logging failures to break the main operation
    }
}

function actionToLogType(action: LogEventOptions['action']): LogType {
    switch (action) {
        case 'CREATE':
            return 'ADD';
        case 'DELETE':
            return 'DELETE';
        case 'UPDATE':
            return 'UPDATE';
        case 'DOWNLOAD':
            return 'DOWNLOAD';
    }
}

// Examples of how to use:
/*
await logManagementAction({
    userId: currentUserId,
    documentId: standard.id,
    title: standard.title,
    section: 'STANDARDS',
    action: 'CREATE',
    details: {
        organization: standard.organization,
        approved: standard.approved
    }
});
*/