import { toast } from "sonner";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

type Executive = {
    person: {
        name: string;
        position: string;
        organization: string;
        email: string;
        phone: string;
        experience: string;
    };
    id: number;
    biography: string;
    education: string;
    achievements: string;
    awards: string;
};

export function SectionManagements() {

    const [persons, setPersons] = useState<Executive[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPersons = async () => {
            const res = await fetch('/api/executive');
            if (!res.ok) {
                throw new Error('Failed to fetch persons');
            }
            const data = await res.json();
            setPersons(data);
            setLoading(false);
        }
        fetchPersons();
    }, []);

    async function handleDelete(id: any) {
        await fetch(`/api/executive/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
    }

    return (
        <div>
            {isLoading ? (
                <Table className="text-base">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-500">ID</TableHead>
                            <TableHead className="text-gray-500">ФИО</TableHead>
                            <TableHead className="text-gray-500">Должность</TableHead>
                            <TableHead className="text-gray-500">Организация</TableHead>
                            <TableHead className="text-gray-500">Почта</TableHead>
                            <TableHead className="text-gray-500">Телефон</TableHead>
                            <TableHead className="text-gray-500">Опыт</TableHead>
                            <TableHead className="text-gray-500">Биография</TableHead>
                            <TableHead className="text-gray-500">Образование</TableHead>
                            <TableHead className="text-gray-500">Достижения</TableHead>
                            <TableHead className="text-gray-500">Награды</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableRow>
                        <TableCell colSpan={11} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={11} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={11} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={11} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={11} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                </Table>
            ) : (
                <Table className="text-base">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>ФИО</TableHead>
                            <TableHead>Должность</TableHead>
                            <TableHead>Организация</TableHead>
                            <TableHead>Почта</TableHead>
                            <TableHead>Телефон</TableHead>
                            <TableHead>Опыт</TableHead>
                            <TableHead>Биография</TableHead>
                            <TableHead>Образование</TableHead>
                            <TableHead>Достижения</TableHead>
                            <TableHead>Награды</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {persons.map((person) => (
                            <TableRow key={person.id}>
                                <TableCell className="font-medium">{person.id}</TableCell>
                                <TableCell>{person.person.name}</TableCell>
                                <TableCell>{person.person.position}</TableCell>
                                <TableCell>{person.person.organization}</TableCell>
                                <TableCell>{person.person.email}</TableCell>
                                <TableCell>{person.person.phone}</TableCell>
                                <TableCell>{person.person.experience}</TableCell>
                                <TableCell>{person.biography}</TableCell>
                                <TableCell>{person.education}</TableCell>
                                <TableCell>{person.achievements}</TableCell>
                                <TableCell>{person.awards}</TableCell>
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
                                                                    <AlertDialogAction onClick={() => handleDelete(person.id)}>Удалить</AlertDialogAction>
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
                            <TableCell className="text-right">{persons.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
