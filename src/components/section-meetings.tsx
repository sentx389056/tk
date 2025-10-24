import { toast } from "sonner";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

type Meeting = {
    id: number,
    title: string,
    location: string,
    attachments: string,
    format: string,
    publishedAt: Date
}

export function SectionMeetings() {

    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMeetings = async () => {
            const res = await fetch('/api/meetings');
            if (!res.ok) {
                throw new Error('Failed to fetch members');
            }
            const data = await res.json();
            setMeetings(data);
            setLoading(false);
        }
        fetchMeetings();
    }, []);

    async function handleDelete(id: any) {
        await fetch(`/api/meetings/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
    }

    return (
        <div>
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
                                <TableCell>{meet.attachments}</TableCell>
                                <TableCell>DATA</TableCell>
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
