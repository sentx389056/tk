import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogType, getLogs } from '@/lib/logging';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Log = {
    id: number;
    type: LogType;
    entity: string;
    user: {
        login: string;
        member?: {
            name?: string;
        }
    };
    documentId: number | null;
    metadata: string | null;
    createdAt: string;
};

type PaginatedResponse = {
    logs: Log[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export function SectionLogs() {
    const [logs, setLogs] = React.useState<Log[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState<LogType | 'ALL'>('ALL');
    const [dateFrom, setDateFrom] = React.useState('');
    const [dateTo, setDateTo] = React.useState('');
    const [memberName, setMemberName] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [pageSize] = React.useState(10);
    const [totalPages, setTotalPages] = React.useState(1);

    const fetchLogs = React.useCallback(async () => {
        setLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const options: any = {
                page,
                pageSize
            };
            if (filter !== 'ALL') {
                options.type = filter;
            }
            if (memberName) {
                options.memberName = memberName;
            }
            if (dateFrom) {
                options.startDate = new Date(dateFrom);
            }
            if (dateTo) {
                options.endDate = new Date(dateTo);
            }
            const data = await getLogs(options) as PaginatedResponse;
            setLogs(data.logs);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    }, [filter, dateFrom, dateTo, memberName]);

    React.useEffect(() => {
        setPage(1); // Reset to first page when filter changes
        fetchLogs();
    }, [filter]);

    React.useEffect(() => {
        fetchLogs();
    }, [page]); // Fetch when page changes

    // Auto-apply member name filter with debounce
    React.useEffect(() => {
        const t = setTimeout(() => {
            fetchLogs();
        }, 350);
        return () => clearTimeout(t);
    }, [memberName, fetchLogs]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Загрузка...</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="space-y-4">
                <CardTitle>Журнал действий</CardTitle>
                <div className="flex flex-wrap gap-4">
                    <Select value={filter} onValueChange={(value: LogType | 'ALL') => setFilter(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Тип действия" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Все действия</SelectItem>
                            <SelectItem value="AUTH">Авторизация</SelectItem>
                            <SelectItem value="ADD">Добавление</SelectItem>
                            <SelectItem value="DELETE">Удаление</SelectItem>
                            <SelectItem value="DOWNLOAD">Скачивание</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="По имени пользователя"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className="w-[200px]"
                    />
                    <Input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-[180px]"
                        placeholder="От"
                    />
                    <Input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-[180px]"
                        placeholder="До"
                    />
                    <Button onClick={() => fetchLogs()}>Применить фильтры</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-1 text-xs rounded ${
                                        log.type === 'AUTH' ? 'bg-blue-100 text-blue-800 max-sm:hidden' :
                                        log.type === 'DELETE' ? 'bg-red-100 text-red-800 max-sm:hidden' :
                                        log.type === 'ADD' ? 'bg-green-100 text-green-800 max-sm:hidden' :
                                        'bg-purple-100 text-purple-800 max-sm:hidden'
                                    }`}>
                                        {log.type === 'AUTH' ? 'Авторизация' :
                                         log.type === 'DELETE' ? 'Удаление' :
                                         log.type === 'ADD' ? 'Добавление' :
                                         'Скачивание'}
                                    </span>
                                    <span className="font-medium text-sm">{log.user.member?.name || log.user.login}</span>
                                </div>
                                <p className="text-sm text-gray-600">{log.entity}</p>
                                {log.metadata && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {JSON.parse(log.metadata).message}
                                    </p>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">
                                {formatDate(log.createdAt)}
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Нет записей в журнале
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-gray-500">
                        Страница {page} из {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page <= 1}
                        >
                            Предыдущая
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages}
                        >
                            Следующая
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}