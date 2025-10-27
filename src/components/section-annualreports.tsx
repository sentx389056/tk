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

type Report = {
    id: number,
    title: string,
    publishedAt: Date,
    fileUrl: any,
    keyAchievements: string,
}

export function SectionAnnualReports() {

    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    const [title, setTitle] = useState('');
    const [publishedAt, setPublishedAt] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [keyAchievements, setKeyAchievements] = useState<string[]>([]);
    const [newAchievement, setNewAchievement] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            const res = await fetch('/api/reports');
            if (!res.ok) {
                throw new Error('Failed to fetch standards');
            }
            const data = await res.json();
            setReports(data);
            setLoading(false);
        }
        fetchReports();
    }, []);

    async function handleDelete(id: any) {
        await fetch(`/api/reports/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
    }

    const addAchievement = () => {
        if (newAchievement.trim()) {
            setKeyAchievements([...keyAchievements, newAchievement.trim()]);
            setNewAchievement('');
        }
    };

    const removeAchievement = (index: number) => {
        setKeyAchievements(keyAchievements.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fileUrl', file as Blob);
        formData.append('title', title);
        formData.append('publishedAt', publishedAt);
        formData.append('achievements', JSON.stringify(keyAchievements));

        const res = await fetch('/api/reports/add', {
            method: 'POST',
            body: formData,
        })

        if (res.ok) {
            toast.success('Объект успешно добавлен!')
        } else {
            toast.error('Ошибка добавления!')
        }
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
                                <Label htmlFor="sheet-endDate">Достижения</Label>
                                <Input id="sheet-endDate" value={newAchievement} onChange={(e) => setNewAchievement(e.target.value)} type="text"/>
                            </div>
                            <Button variant="outline" className="m-1" onClick={addAchievement}>+</Button>
                            <ul className="space-y-1">
                                {keyAchievements.map((ach, i) => (
                                    <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                        {ach}
                                        <button
                                            type="button"
                                            onClick={() => removeAchievement(i)}
                                            className="text-red-500"
                                        >
                                            Удалить
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-endDate">Дата публикации*</Label>
                                <Input id="sheet-endDate" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} type="date" required />
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
                            <TableHead className="text-gray-500">Достижения</TableHead>
                            <TableHead className="text-gray-500">Приложения</TableHead>
                            <TableHead className="text-gray-500">Дата публикации</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableRow>
                        <TableCell colSpan={5} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={5} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={5} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={5} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
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
                            <TableHead>Достижения</TableHead>
                            <TableHead>Приложения</TableHead>
                            <TableHead>Дата публикации</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">{report.id}</TableCell>
                                <TableCell>{report.title}</TableCell>
                                <TableCell>{Array.isArray(report.keyAchievements) ? report.keyAchievements.join(', ') : report.keyAchievements}</TableCell>
                                <TableCell>
                                    {(() => {
                                        try {
                                            if (typeof report.fileUrl === 'string') {
                                                const trimmed = report.fileUrl.trim();
                                                if ((trimmed.startsWith('[') || trimmed.startsWith('{'))) {
                                                    const at = JSON.parse(trimmed);
                                                    if (Array.isArray(at)) {
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

                                            const at = report.fileUrl as any;
                                            if (Array.isArray(at)) {
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
                                <TableCell>{report.publishedAt ? new Date(report.publishedAt).toLocaleDateString('ru-RU') : ''}</TableCell>
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
                                                                    <AlertDialogAction onClick={() => handleDelete(report.id)}>Удалить</AlertDialogAction>
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
                            <TableCell className="text-right">{reports.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
