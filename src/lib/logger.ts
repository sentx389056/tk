import { logOperation } from './logging-utils';
import { LogType } from '@prisma/client';

export class Logger {
    static async log(
        userId: number,
        type: LogType,
        entity: string,
        entityId?: string,
        details?: string,
        ip?: string,
        userAgent?: string
    ) {
        await logOperation(userId, {
            type,
            entity,
            entityId,
            details,
            ip,
            userAgent,
        });
    }

    static async login(userId: number, ip?: string, userAgent?: string) {
        await this.log(userId, 'LOGIN', 'User', userId.toString(), 'User logged in', ip, userAgent);
    }

    static async logout(userId: number, ip?: string, userAgent?: string) {
        await this.log(userId, 'LOGOUT', 'User', userId.toString(), 'User logged out', ip, userAgent);
    }

    static async create(userId: number, entity: string, entityId: string, details?: string, ip?: string, userAgent?: string) {
        await this.log(userId, 'CREATE', entity, entityId, details, ip, userAgent);
    }

    static async update(userId: number, entity: string, entityId: string, details?: string, ip?: string, userAgent?: string) {
        await this.log(userId, 'UPDATE', entity, entityId, details, ip, userAgent);
    }

    static async delete(userId: number, entity: string, entityId: string, details?: string, ip?: string, userAgent?: string) {
        await this.log(userId, 'DELETE', entity, entityId, details, ip, userAgent);
    }

    static async view(userId: number, entity: string, entityId: string, details?: string, ip?: string, userAgent?: string) {
        await this.log(userId, 'VIEW', entity, entityId, details, ip, userAgent);
    }

    static async download(userId: number, entity: string, entityId: string, details?: string, ip?: string, userAgent?: string) {
        await this.log(userId, 'DOWNLOAD', entity, entityId, details, ip, userAgent);
    }

    static async upload(userId: number, entity: string, entityId: string, details?: string, ip?: string, userAgent?: string) {
        await this.log(userId, 'UPLOAD', entity, entityId, details, ip, userAgent);
    }

    static async error(userId: number, entity: string, details?: string, ip?: string, userAgent?: string) {
        await this.log(userId, 'ERROR', entity, undefined, details, ip, userAgent);
    }
}
