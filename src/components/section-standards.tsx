import { toast } from "sonner";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { createLog } from '@/lib/logging';
import { Label } from "./ui/label";

type Protocol = {
    id: number,
    title: string,
    attachments: string,
    publishedAt: Date
}
interface ProtectedDoc {
    id: number;
    title: string;
    description?: string;
    fileName: string;
    copyrightHolder?: string;
    createdAt: string;
}

export function SectionStandards() {
    const [docs, setDocs] = useState<ProtectedDoc[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [copyrightHolder, setCopyrightHolder] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchDocs = async () => {
            const res = await fetch('/api/protected-documents');
            if (!res.ok) {
                setDocs([]);
                setLoading(false);
                return;
            }
            const data = await res.json();
            setDocs(data || []);
            setLoading(false);
            try {
                const me = await fetch('/api/auth/me');
                const meJson = await me.json();
                const userId = meJson?.user?.id;
                if (userId) {
                    await createLog({ type: 'AUTH', entity: 'Просмотр документов по стандартизации', userId });
                }
            } catch (e) {
                console.error('Failed to log', e);
            }
        }
        fetchDocs();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function handleAdd(e: any) {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (!file) {
            toast.error('Выберите файл');
            return false;
        }

        try {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('description', description);
            fd.append('copyrightHolder', copyrightHolder);
            fd.append('file', file);

            const res = await fetch('/api/protected-documents', { method: 'POST', body: fd });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                toast.error(err?.error || 'Ошибка при загрузке');
                return false;
            }
            const data = await res.json();
            const newDoc = data.doc;
            setDocs(prev => [newDoc, ...prev]);
            toast.success('Документ добавлен');
            setTitle(''); setDescription(''); setCopyrightHolder(''); setFile(null);
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Серверная ошибка');
            return false;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const ok = await handleAdd(e);
        if (ok) setIsOpen(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function handleDelete(id: any) {
        await fetch(`/api/protected-documents/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="overflow-scroll">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="m-1">Добавить документ</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Добавление документа по стандартизации</SheetTitle>
                            <SheetDescription>Добавьте метаданные и загрузите защищённый файл.</SheetDescription>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="grid gap-3">
                                <Label htmlFor="doc-title">Наименование*</Label>
                                <Input id="doc-title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="doc-desc">Описание</Label>
                                <Input id="doc-desc" value={description} onChange={(e) => setDescription(e.target.value)} type="text" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="doc-copyright">Правообладатель</Label>
                                <Input id="doc-copyright" value={copyrightHolder} onChange={(e) => setCopyrightHolder(e.target.value)} type="text" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="doc-file">Файл (обязательно)</Label>
                                <input id="doc-file" type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="w-full" required />
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
                <Table className="text-base max-w-[1420px] max-2xl:w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-500">ID</TableHead>
                            <TableHead className="text-gray-500">Наименование</TableHead>
                            <TableHead className="text-gray-500">Файл</TableHead>
                            <TableHead className="text-gray-500">Правообладатель</TableHead>
                            <TableHead className="text-gray-500">Дата</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableRow>
                        <TableCell colSpan={5} className="!p-0">
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
                            <TableHead>Файл</TableHead>
                            <TableHead>Правообладатель</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {docs.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell className="font-medium">{d.id}</TableCell>
                                <TableCell>{d.title}</TableCell>
                                <TableCell>{d.fileName}</TableCell>
                                <TableCell>{d.copyrightHolder}</TableCell>
                                <TableCell>{new Date(d.createdAt).toLocaleDateString('ru-RU')}</TableCell>
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
                                                        <Button variant="outline" onClick={async () => {
                                                                    try {
                                                                        window.open(`/api/protected-documents/download?id=${d.id}`, '_blank');
                                                                    } catch (e) {
                                                                        console.error(e);
                                                                        toast.error('Не удалось открыть документ');
                                                                    }
                                                                }}>Просмотреть
                                                                </Button>
                                                        <AlertDialog>
                                                            <div className="flex flex-col gap-5">
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="outline">Удалить</Button>
                                                                </AlertDialogTrigger>                                                            </div>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Вы уверены что хотите удалить этот объект?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Это действие невозможно отменить. Это приведет к безвозвратному удалению записи.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Отменить</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(d.id)}>Удалить</AlertDialogAction>
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
                            <TableCell className="text-right">{docs.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
