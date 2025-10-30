import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Skeleton } from "./ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Provision = {
    id: number,
    title: string,
    description: string,
    approvedAt: Date,
    organization: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fileUrl: any,
}

export function SectionProvisions() {

    const [provisons, setProvisions] = useState<Provision[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [approvedAt, setApprovedAt] = useState('');
    const [organization, setOrganization] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchProvisions = async () => {
            try {
                const res = await fetch('/api/provisions?all=true');
                if (!res.ok) {
                    throw new Error('Failed to fetch provisions');
                }
                const data = await res.json();
                setProvisions(data);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Не удалось загрузить положения');
            } finally {
                setLoading(false);
            }
        };
        fetchProvisions();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function handleDelete(id: any) {
        await fetch(`/api/provisions/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fileUrl', file as Blob);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('approvedAt', approvedAt);
        formData.append('organization', organization);

        const res = await fetch('/api/provisions/add', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            toast.error('Ошибка добавления!');
            return;
        }

        const newProvision = await res.json();
        setProvisions(prev => [newProvision, ...prev]);
        toast.success('Объект успешно добавлен!');

        // Clear form
        setTitle('');
        setDescription('');
        setApprovedAt('');
        setOrganization('');
        setFile(null);
    }

    const getFileNameFromUrl = (url: string) => {
        try {
            const withoutQuery = url.split('?')[0];
            const parts = withoutQuery.split('/').filter(Boolean);
            const last = parts.length ? parts[parts.length - 1] : withoutQuery;
            return decodeURIComponent(last);
        } catch (e) {
            return 'Файл';
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDownload = async (fileUrl: any) => {
        try {
            let urls: { fileUrl: string, fileName?: string }[] = [];
            
            if (typeof fileUrl === 'string') {
                const trimmed = fileUrl.trim();
                if ((trimmed.startsWith('[') || trimmed.startsWith('{'))) {
                    const parsed = JSON.parse(trimmed);
                    urls = Array.isArray(parsed) ? parsed : [parsed];
                } else if (trimmed) {
                    urls = [{ fileUrl: trimmed }];
                }
            } else if (Array.isArray(fileUrl)) {
                urls = fileUrl;
            } else if (fileUrl && typeof fileUrl === 'object') {
                urls = [fileUrl];
            }

            for (const url of urls) {
                if (!url.fileUrl) continue;
                
                const response = await fetch(url.fileUrl);
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = url.fileName || getFileNameFromUrl(url.fileUrl);
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(a);
            }
            toast.success('Файл успешно скачан');
        } catch (error) {
            console.error('Ошибка при скачивании:', error);
            toast.error('Ошибка при скачивании файла');
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="m-1">Добавить объект</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Добавление объекта</SheetTitle>
                            <SheetDescription>
                                Внесите данные в заданные ниже поля. Нажмите «Добавить», когда закончите.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-name">Наименование*</Label>
                                <Input id="sheet-name" value={title} onChange={(e) => setTitle(e.target.value)} type="text" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-description">Описание</Label>
                                <Input id="sheet-description" value={description} onChange={(e) => setDescription(e.target.value)} type="text" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-endDate">Дата принятия*</Label>
                                <Input id="sheet-endDate" value={approvedAt} onChange={(e) => setApprovedAt(e.target.value)} type="date"  required/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-endDate">Организация</Label>
                                <Input id="sheet-endDate" value={organization} onChange={(e) => setOrganization(e.target.value)} type="text"  />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-file">Прикрепления*</Label>
                                <Input id="sheet-file" onChange={(e) => setFile(e.target.files?.[0] || null)} type="file" accept=".pdf,.doc,.docx" required />
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
                            <TableHead className="text-gray-500">Описание</TableHead>
                            <TableHead className="text-gray-500">Дата принятия</TableHead>
                            <TableHead className="text-gray-500">Организация</TableHead>
                            <TableHead className="text-gray-500">Приложения</TableHead>
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
                            <TableHead>Описание</TableHead>
                            <TableHead>Дата принятия</TableHead>
                            <TableHead>Организация</TableHead>
                            <TableHead>Приложения</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {provisons.map((provision) => (
                            <TableRow key={provision.id}>
                                <TableCell className="font-medium">{provision.id}</TableCell>
                                <TableCell>{provision.title}</TableCell>
                                <TableCell>{provision.description}</TableCell>
                                <TableCell>{provision.approvedAt ? new Date(provision.approvedAt).toLocaleDateString('ru-RU') : ''}</TableCell>
                                <TableCell>{provision.organization}</TableCell>
                                <TableCell>
                                    {(() => {
                                        try {
                                            if (typeof provision.fileUrl === 'string') {
                                                const trimmed = provision.fileUrl.trim();
                                                if ((trimmed.startsWith('[') || trimmed.startsWith('{'))) {
                                                    const at = JSON.parse(trimmed);
                                                    if (Array.isArray(at)) {
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        return at.map((a: any, idx: number) => (
                                                            <div key={idx}><a className="underline text-blue-600" href={a.fileUrl} target="_blank" rel="noreferrer">{a.fileName || getFileNameFromUrl(a.fileUrl)}</a></div>
                                                        ));
                                                    }
                                                    if (at && at.fileUrl) {
                                                        return <a className="underline text-blue-600" href={at.fileUrl} target="_blank" rel="noreferrer">{at.fileName || getFileNameFromUrl(at.fileUrl)}</a>;
                                                    }
                                                }
                                                if (trimmed) {
                                                    const name = getFileNameFromUrl(trimmed);
                                                    return <a className="underline text-blue-600" href={trimmed} target="_blank" rel="noreferrer">{name}</a>;
                                                }
                                            }

                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            const at = provision.fileUrl as any;
                                            if (Array.isArray(at)) {
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                return at.map((a: any, idx: number) => (
                                                    <div key={idx}><a className="underline text-blue-600" href={a.fileUrl} target="_blank" rel="noreferrer">{a.fileName || getFileNameFromUrl(a.fileUrl)}</a></div>
                                                ));
                                            }
                                            if (at && typeof at === 'object' && at.fileUrl) {
                                                return <a className="underline text-blue-600" href={at.fileUrl} target="_blank" rel="noreferrer">{at.fileName || getFileNameFromUrl(at.fileUrl)}</a>;
                                            }

                                            return null;
                                        } catch (e) {
                                            return null;
                                        }
                                    })()}
                                </TableCell>
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
                                                                    <AlertDialogAction onClick={() => handleDelete(provision.id)}>Удалить</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                        <Button 
                                                            variant="outline"
                                                            onClick={() => handleDownload(provision.fileUrl)}
                                                        >
                                                            Скачать
                                                        </Button>
                                                    </div>
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
                            <TableCell className="text-right">{provisons.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
