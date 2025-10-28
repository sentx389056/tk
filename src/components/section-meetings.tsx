import { toast } from "sonner";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

type Meeting = {
    id: number,
    title: string,
    location: string,
    attachments: any,
    format: string,
    publishedAt: Date
}

export function SectionMeetings() {

    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    // form state
    const [title, setTitle] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [format, setFormat] = useState<string>('Очное');
    const [publishedAt, setPublishedAt] = useState<string>(new Date().toISOString().slice(0, 10));
    const [files, setFiles] = useState<FileList | null>(null);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const res = await fetch('/api/meetings?page=1&pageSize=10000');
                if (!res.ok) {
                    throw new Error('Failed to fetch members');
                }
                const data = await res.json();
                // API may return either an array (legacy) or a paginated object { meetings, total, ... }
                if (Array.isArray(data)) {
                    setMeetings(data);
                } else if (data && Array.isArray(data.meetings)) {
                    setMeetings(data.meetings);
                } else {
                    setMeetings([]);
                }
            } catch (err) {
                console.error('Error fetching meetings:', err);
                setMeetings([]);
            } finally {
                setLoading(false);
            }
        }
        fetchMeetings();
    }, []);

    async function handleDelete(id: any) {
        await fetch(`/api/meetings/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('location', location);
            fd.append('format', format);
            fd.append('publishedAt', publishedAt);
            if (files) {
                Array.from(files).forEach((f) => fd.append('attachments', f));
            }

            const res = await fetch('/api/meetings/add', { method: 'POST', body: fd });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.error(err?.error || 'Ошибка при загрузке');
                return;
            }
            const data = await res.json();
            const newMeeting = data.meeting;
            setMeetings(prev => [newMeeting, ...prev]);
            toast.success('Заседание добавлено');
            setTitle(''); setLocation(''); setFormat('Очное'); setFiles(null);
        } catch (error) {
            console.error(error);
            toast.error('Серверная ошибка');
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="overflow-scroll">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="m-1">Добавить заседание</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Добавление заседания</SheetTitle>
                            <SheetDescription>
                                Заполните поля и прикрепите файлы повестки/материалов для заседания.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="grid gap-3">
                                <Label htmlFor="meeting-title">Наименование*</Label>
                                <Input id="meeting-title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="meeting-location">Место</Label>
                                <Input id="meeting-location" value={location} onChange={(e) => setLocation(e.target.value)} type="text" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="meeting-format">Формат</Label>
                                <select id="meeting-format" value={format} onChange={(e) => setFormat(e.target.value)} className="p-2 border rounded">
                                    <option>Очное</option>
                                    <option>Заочное</option>
                                    <option>Смешанное</option>
                                </select>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="meeting-date">Дата проведения</Label>
                                <Input id="meeting-date" type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="meeting-files">Файлы (можно несколько)</Label>
                                <input id="meeting-files" type="file" multiple onChange={(e) => setFiles(e.target.files)} className="w-full" />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button type="submit" onClick={handleSubmit}>Добавить</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Закрыть</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </form>
            {isLoading ? (
                <Table className="text-base">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-500">ID</TableHead>
                            <TableHead className="text-gray-500">Наименование</TableHead>
                            <TableHead className="text-gray-500">Место</TableHead>
                            <TableHead className="text-gray-500">Формат</TableHead>
                            <TableHead className="text-gray-500">Приложения</TableHead>
                            <TableHead className="text-gray-500">Дата публикации</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableRow>
                        <TableCell colSpan={6} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={6} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={6} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={6} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={6} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                </Table>
            ) : (
                <Table className="text-base">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Наименование</TableHead>
                            <TableHead>Место</TableHead>
                            <TableHead>Формат</TableHead>
                            <TableHead>Приложения</TableHead>
                            <TableHead>Дата публикации</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meetings.map((meet) => (
                            <TableRow key={meet.id}>
                                <TableCell className="font-medium">{meet.id}</TableCell>
                                <TableCell>{meet.title}</TableCell>
                                <TableCell>{meet.location}</TableCell>
                                <TableCell>{meet.format}</TableCell>
                                <TableCell>
                                    {(() => {
                                        try {
                                            const at = typeof meet.attachments === 'string' ? JSON.parse(meet.attachments) : meet.attachments;
                                            if (Array.isArray(at)) {
                                                return at.map((a: any, idx: number) => (
                                                    <div key={idx}><a className="underline text-blue-600" href={a.fileUrl} target="_blank" rel="noreferrer">{a.fileName}</a></div>
                                                ));
                                            }
                                            return null;
                                        } catch (e) {
                                            return null;
                                        }
                                    })()}
                                </TableCell>
                                <TableCell>{meet.publishedAt ? new Date(meet.publishedAt).toLocaleDateString('ru-RU') : ''}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline">...</Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <h4 className="leading-none font-medium">Действия</h4>

                                                </div>
                                                <div className="grid gap-2">
                                                    {/* <div className="grid grid-cols-3 items-center gap-4">
                                                        Редактировать
                                                    </div> */}
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline">Удалить</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Вы уверены что хотите удалить этот объект?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Это действие невозможно отменить. Это приведет к безвозвратному удалению записи.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Отменить</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(meet.id)}>Удалить</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                    {/* <div className="grid grid-cols-3 items-center gap-4">
                                                        Скачать
                                                    </div> */}
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter className="w-full">
                        <TableRow>
                            <TableCell colSpan={1}>Всего:</TableCell>
                            <TableCell className="text-right">{meetings.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
