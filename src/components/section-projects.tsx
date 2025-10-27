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

type Project = {
    id: number,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    fileUrl: string,
}

export function SectionProjects() {

    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await fetch('/api/projects');
            if (!res.ok) {
                throw new Error('Failed to fetch standards');
            }
            const data = await res.json();
            setProjects(data);
            setLoading(false);
        }
        fetchProjects();
    }, []);

    async function handleDelete(id: any) {
        await fetch(`/api/standards-project/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fileUrl', file as Blob);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);

        const res = await fetch('/api/standards-project/add', {
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
                                <Label htmlFor="sheet-description">Описание*</Label>
                                <Input id="sheet-description" value={description} onChange={(e) => setDescription(e.target.value)} type="text" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-startDate">Дата принятия*</Label>
                                <Input id="sheet-startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-endDate">Дата окончания*</Label>
                                <Input id="sheet-endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" required />
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
                            <TableHead className="text-gray-500">Дата окончания</TableHead>
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
                            <TableHead>Дата окончания</TableHead>
                            <TableHead>Приложения</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                            {projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell className="font-medium">{project.id}</TableCell>
                                    <TableCell>{project.title}</TableCell>
                                    <TableCell>{project.description}</TableCell>
                                    <TableCell>{project.startDate ? new Date(project.startDate).toLocaleDateString('ru-RU') : ''}</TableCell>
                                    <TableCell>{project.endDate ? new Date(project.endDate).toLocaleDateString('ru-RU') : ''}</TableCell>
                                    <TableCell>
                                        {(() => {
                                            try {
                                                if (typeof project.fileUrl === 'string') {
                                                    const trimmed = project.fileUrl.trim();
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

                                                const at = project.fileUrl as any;
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
                                                                    <AlertDialogAction onClick={() => handleDelete(project.id)}>Удалить</AlertDialogAction>
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
                            <TableCell className="text-right">{projects.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
