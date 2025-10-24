import { toast } from "sonner";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

type Report = {
    id: number,
    title: string,
    publishedAt: Date,
    organization: string,
    fileUrl: string,
    keyAchievements: string,
}

export function SectionAnnualReports() {

    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

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

    return (
        <div>
            {isLoading ? (
                <Table className="text-base">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-500">ID</TableHead>
                            <TableHead className="text-gray-500">Наименование</TableHead>
                            <TableHead className="text-gray-500">Достижения</TableHead>
                            <TableHead className="text-gray-500">file_url</TableHead>
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
                            <TableHead>file_url</TableHead>
                            <TableHead>Дата публикации</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">{report.id}</TableCell>
                                <TableCell>{report.title}</TableCell>
                                <TableCell>{report.keyAchievements}</TableCell>
                                <TableCell>{report.fileUrl}</TableCell>
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
