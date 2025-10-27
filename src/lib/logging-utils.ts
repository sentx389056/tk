import { prisma } from '@/lib/prisma';
import { LogType } from '@prisma/client';

export interface LogOperationOptions {
    type: LogType;
    action: string;
    userId: number;
    documentId?: number;
    metadata?: Record<string, any>;
}

export async function logOperation(options: LogOperationOptions) {
    try {
        const { type, action, userId, documentId, metadata } = options;

        return await prisma.log.create({
            data: {
                type,
                action,
                userId,
                documentId,
                metadata: metadata ? JSON.stringify({
                    ...metadata,
                    timestamp: new Date().toISOString()
                }) : null
            }
        });
    } catch (error) {
        console.error('Failed to create log entry:', error);
        // Don't throw - we don't want logging failures to break the main operation
        return null;
    }
}

// Helper to extract user ID from request cookies
export function getUserIdFromCookie(request: Request): number | null {
    try {
        const cookies = request.headers.get('cookie');
        if (!cookies) return null;

        const tkUserCookie = cookies.split(';').find(c => c.trim().startsWith('tk_user='));
        if (!tkUserCookie) return null;

        const userData = JSON.parse(decodeURIComponent(tkUserCookie.split('=')[1]));
        return userData.id || null;
    } catch (e) {
        console.error('Error extracting user ID from cookie:', e);
        return null;
    }
}

// Log constants for consistency
export const LOG_ACTIONS = {
    // Standards
    STANDARD_ADD: 'STANDARD_ADD',
    STANDARD_DELETE: 'STANDARD_DELETE',
    STANDARD_UPDATE: 'STANDARD_UPDATE',
    
    // Provisions
    PROVISION_ADD: 'PROVISION_ADD',
    PROVISION_DELETE: 'PROVISION_DELETE',
    PROVISION_UPDATE: 'PROVISION_UPDATE',
    
    // Meetings
    MEETING_ADD: 'MEETING_ADD',
    MEETING_DELETE: 'MEETING_DELETE',
    MEETING_UPDATE: 'MEETING_UPDATE',
    
    // Reports
    REPORT_ADD: 'REPORT_ADD',
    REPORT_DELETE: 'REPORT_DELETE',
    REPORT_UPDATE: 'REPORT_UPDATE',
    
    // Projects
    PROJECT_ADD: 'PROJECT_ADD',
    PROJECT_DELETE: 'PROJECT_DELETE',
    PROJECT_UPDATE: 'PROJECT_UPDATE',
    
    // Protocols
    PROTOCOL_ADD: 'PROTOCOL_ADD',
    PROTOCOL_DELETE: 'PROTOCOL_DELETE',
    PROTOCOL_UPDATE: 'PROTOCOL_UPDATE',
    
    // Executive members
    EXECUTIVE_ADD: 'EXECUTIVE_ADD',
    EXECUTIVE_DELETE: 'EXECUTIVE_DELETE',
    EXECUTIVE_UPDATE: 'EXECUTIVE_UPDATE',
    
    // File operations
    FILE_UPLOAD: 'FILE_UPLOAD',
    FILE_DOWNLOAD: 'FILE_DOWNLOAD',
    FILE_DELETE: 'FILE_DELETE'
} as const;

export type LogAction = typeof LOG_ACTIONS[keyof typeof LOG_ACTIONS];