import { toast } from "sonner";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Protocol = {
    id: number,
    title: string,
    attachments: string,
    publishedAt: Date
}

export function SectionProtocol() {

    const [protocols, setProtocols] = useState<Protocol[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState('');
    const [publishedAt, setPublishedAt] = useState<string>(new Date().toISOString().slice(0, 10));
    const [files, setFiles] = useState<FileList | null>(null);

    useEffect(() => {
        const fetchProtocols = async () => {
            const res = await fetch('/api/protocols');
            if (!res.ok) {
                throw new Error('Failed to fetch members');
            }
            const data = await res.json();
            setProtocols(data);
            setLoading(false);
        }
        fetchProtocols();
    }, []);

    async function handleDelete(id: any) {
        await fetch(`/api/protocols/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
    }

    async function handleAdd(e: any) {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('publishedAt', publishedAt);
            if (files) {
                Array.from(files).forEach((f) => fd.append('attachments', f));
            }

            const res = await fetch('/api/protocols/add', { method: 'POST', body: fd });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.error(err?.error || 'Ошибка при загрузке');
                return;
            }
            const data = await res.json();
            const newProtocol = data.protocol;
            setProtocols(prev => [newProtocol, ...prev]);
            toast.success('Протокол добавлен');
            // reset form
            setTitle('');
            setFiles(null);
        } catch (error) {
            console.error(error);
            toast.error('Серверная ошибка');
        }
    }

    return (
        <div>
            <form onSubmit={handleAdd} className="overflow-scroll">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="m-1">Добавить протокол</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Добавление протокола</SheetTitle>
                            <SheetDescription>
                                Заполните название и прикрепите файлы протокола.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="grid gap-3">
                                <Label htmlFor="protocol-title">Наименование*</Label>
                                <Input id="protocol-title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="protocol-date">Дата протокола</Label>
                                <Input id="protocol-date" type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="protocol-files">Файлы (PDF, DOC)*</Label>
                                <input id="protocol-files" type="file" multiple onChange={(e) => setFiles(e.target.files)} className="w-full" accept=".pdf,.doc,.docx" required />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button type="submit">Добавить</Button>
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
                            <TableHead className="text-gray-500">Приложения</TableHead>
                            <TableHead className="text-gray-500">Дата публикации</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableRow>
                        <TableCell colSpan={4} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} className="!p-0">
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
                            <TableHead>Приложения</TableHead>
                            <TableHead>Дата публикации</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {protocols.map((protocol) => (
                            <TableRow key={protocol.id}>
                                <TableCell className="font-medium">{protocol.id}</TableCell>
                                <TableCell>{protocol.title}</TableCell>
                                <TableCell>
                                    {(() => {
                                        try {
                                            const at = typeof protocol.attachments === 'string' ? JSON.parse(protocol.attachments) : protocol.attachments;
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
                                <TableCell>{new Date(protocol.publishedAt).toLocaleDateString('ru-RU')}</TableCell>
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
                                                                    <AlertDialogAction onClick={() => handleDelete(protocol.id)}>Удалить</AlertDialogAction>
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
                            <TableCell className="text-right">{protocols.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
