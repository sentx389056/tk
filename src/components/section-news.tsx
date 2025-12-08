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

type News = {
    id: number;
    title: string;
    description: string;
    url: string;
    date: string;
    category: string;
}

export function SectionNews() {

    const [news, setNews] = useState<News[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                if (!res.ok) {
                    throw new Error('Failed to fetch news');
                }
                const data = await res.json();
                // Handle both paginated response and direct array response
                if (Array.isArray(data.news)) {
                    setNews(data.news);
                } else if (Array.isArray(data)) {
                    setNews(data);
                } else {
                    setNews([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching news:', error);
                setNews([]);
                setLoading(false);
            }
        }
        fetchNews();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function handleDelete(id: any) {
        await fetch(`/api/news/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
        setNews(news.filter((n) => n.id !== id));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/news/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                url,
                date,
                category
            }),
        });

        if (!res.ok) {
            toast.error("Ошибка при добавлении объекта.");
            return;
        }

        const news = await res.json();
        setNews(prev => [news, ...prev]);
        toast.success("Объект успешно добавлен!");

        // Clear form fields
        setTitle('');
        setDescription('');
        setUrl('');
        setDate('');
        setCategory('');
    };

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
                                <Label htmlFor="sheet-title">Заголовок</Label>
                                <Input id="sheet-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-description">Описание</Label>
                                <Input id="sheet-description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-url">URL</Label>
                                <Input id="sheet-url" value={url} onChange={(e) => setUrl(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-category">Категория</Label>
                                <Input id="sheet-category" value={category} onChange={(e) => setCategory(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-date">Дата публикации</Label>
                                <Input id="sheet-date" value={date} onChange={(e) => setDate(e.target.value)} type="date" />
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
                            <TableHead className="text-gray-500">Заголовок</TableHead>
                            <TableHead className="text-gray-500">Описание</TableHead>
                            <TableHead className="text-gray-500">URL</TableHead>
                            <TableHead className="text-gray-500">Категория</TableHead>
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
                            <TableHead>Заголовок</TableHead>
                            <TableHead>Описание</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Категория</TableHead>
                            <TableHead>Дата публикации</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {news.map((n) => (
                            <TableRow key={n.id}>
                                <TableCell className="font-medium">{n.id}</TableCell>
                                <TableCell>{n.title}</TableCell>
                                <TableCell>{n.description}</TableCell>
                                <TableCell>{n.url}</TableCell>
                                <TableCell>{n.category}</TableCell>
                                <TableCell>{n.date ? new Date(n.date).toLocaleDateString('ru-RU') : ''}</TableCell>
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
                                                                    <AlertDialogAction onClick={() => handleDelete(n.id)}>Удалить</AlertDialogAction>
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
                            <TableCell className="text-right">{news.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
