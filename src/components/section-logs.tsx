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
    action: string;
    user: {
        login: string;
    };
    documentId: number | null;
    metadata: string | null;
    createdAt: string;
};

export function SectionLogs() {
    const [logs, setLogs] = React.useState<Log[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState<LogType | 'ALL'>('ALL');
    const [dateFrom, setDateFrom] = React.useState('');
    const [dateTo, setDateTo] = React.useState('');

    const fetchLogs = React.useCallback(async () => {
        setLoading(true);
        try {
            const options: any = {};
            if (filter !== 'ALL') {
                options.type = filter;
            }
            if (dateFrom) {
                options.startDate = new Date(dateFrom);
            }
            if (dateTo) {
                options.endDate = new Date(dateTo);
            }
            const data = await getLogs(options);
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    }, [filter, dateFrom, dateTo]);

    React.useEffect(() => {
        fetchLogs();
    }, [filter]);

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
                                        log.type === 'AUTH' ? 'bg-blue-100 text-blue-800' :
                                        log.type === 'DELETE' ? 'bg-red-100 text-red-800' :
                                        log.type === 'ADD' ? 'bg-green-100 text-green-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
                                        {log.type === 'AUTH' ? 'Авторизация' :
                                         log.type === 'DELETE' ? 'Удаление' :
                                         log.type === 'ADD' ? 'Добавление' :
                                         'Скачивание'}
                                    </span>
                                    <span className="font-medium text-sm">{log.user.login}</span>
                                </div>
                                <p className="text-sm text-gray-600">{log.action}</p>
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
            </CardContent>
        </Card>
    );
}