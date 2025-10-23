import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { useEffect, useState } from "react";

type Member = {
    id: number,
    name: string,
    position: string,
    organization: string,
    experience: string,
    email: string,
    phone: string,
    address: string,
}

export function SectionMembers() {

    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMembers = async () => {
            const res = await fetch('/api/users');
            if (!res.ok) {
                throw new Error('Failed to fetch members');
            }
            const data = await res.json();
            setMembers(data);
            setLoading(false);
        }
        fetchMembers();
    }, []);

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
                            <TableHead className="text-gray-500">Опыт</TableHead>
                            <TableHead className="text-gray-500">Почта</TableHead>
                            <TableHead className="text-gray-500">Телефон</TableHead>
                            <TableHead className="text-gray-500">Адрес</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableRow>
                        <TableCell colSpan={8} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={8} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={8} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={8} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={8} className="!p-0">
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
                            <TableHead>Опыт</TableHead>
                            <TableHead>Почта</TableHead>
                            <TableHead>Телефон</TableHead>
                            <TableHead>Адрес</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.id}</TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.position}</TableCell>
                                <TableCell>{member.organization}</TableCell>
                                <TableCell>{member.experience}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.phone}</TableCell>
                                <TableCell>{member.address}</TableCell>
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
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                        Редактировать
                                                    </div>
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                        Удалить
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
                            <TableCell className="text-right">{members.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
