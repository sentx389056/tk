import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileText } from "lucide-react";
import { useCallback } from "react";

type StandardProjectCardProps = {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    fileUrl?: any;
}

export default function ProjectCard({ title, description, startDate, endDate, fileUrl }: StandardProjectCardProps) {
    const startDateFormatted = startDate.toLocaleDateString('ru-RU');
    const endDateFormatted = endDate.toLocaleDateString('ru-RU');

    const getFileNameFromUrl = (url: string) => {
        try {
            const withoutQuery = url.split('?')[0];
            const parts = withoutQuery.split('/').filter(Boolean);
            const last = parts.length ? parts[parts.length - 1] : withoutQuery;
            return decodeURIComponent(last);
        } catch (e) {
            return 'file';
        }
    }

    const resolveFile = useCallback(() => {
        if (!fileUrl) return null;
        try {
            if (typeof fileUrl === 'string') {
                const trimmed = fileUrl.trim();
                if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed) && parsed[0]) return parsed[0];
                    if (parsed && parsed.fileUrl) return parsed;
                }
                return { fileUrl: trimmed, fileName: getFileNameFromUrl(trimmed) };
            }
            if (Array.isArray(fileUrl) && fileUrl[0]) return fileUrl[0];
            if (fileUrl && typeof fileUrl === 'object' && fileUrl.fileUrl) return fileUrl;
        } catch (e) {
            return null;
        }
        return null;
    }, [fileUrl]);

    const handleDownload = useCallback(() => {
        const f = resolveFile();
        if (!f || !f.fileUrl) return;
        const url = f.fileUrl;
        const name = f.fileName || getFileNameFromUrl(url);

        // Create an anchor and trigger download (works for same-origin files)
        try {
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            // Fallback: open in new tab
            window.open(url, '_blank');
        }
    }, [resolveFile]);

    return (
        <Card className="w-full px-6">
            <CardHeader className="p-0">
                   <div className="flex gap-3 flex-col">
                    <div className="flex gap-3 items-center mb-7">
                        <FileText size={32} color="#CC4E3A" className="hidden sm:flex" />
                        <div className="flex flex-col">
                            <CardTitle className="mb-3">{title}</CardTitle>
                            <CardDescription className="text-gray-500">
                                {description}
                            </CardDescription>
                        </div>
                    </div>

                </div>
                <CardAction>
                    <Button type="button" className="w-full bg-red-pink font-medium cursor-pointer" onClick={handleDownload} disabled={!fileUrl}><Download size={16} /><span className="hidden sm:flex">Скачать проект</span></Button>
                </CardAction>
            </CardHeader>
            <CardContent className="p-0 flex items-center gap-30 flex-wrap sm:flex-nowrap max-sm:gap-4">
                <CardDescription className="text-gray-500 flex gap-2 items-center">
                    <Calendar size={16} />
                    <p>Начало:</p>
                    <p>{startDateFormatted}</p>
                </CardDescription>
                <CardDescription className="text-gray-500 flex gap-2 items-center">
                    <Calendar size={16} />
                    <p>Окончание:</p>
                    <p>{endDateFormatted}</p>
                </CardDescription>
            </CardContent>
        </Card>
    )
}