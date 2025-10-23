import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "./ui/table";
import { useEffect, useState } from "react";

type Standard = {
    id: number,
    title: string,
    description: string,
    approved: boolean,
    approvedAt: Date,
    organization: string,
    fileUrl: string,
}

export function SectionFundStandards() {

    const [standards, setStandards] = useState<Standard[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStandards = async () => {
            const res = await fetch('/api/standards');
            if (!res.ok) {
                throw new Error('Failed to fetch standards');
            }
            const data = await res.json();
            setStandards(data);
            setLoading(false);
        }
        fetchStandards();
    }, []);

    const approvedText = (approved: boolean) => {
        return approved ? "Да" : "Нет";
    }

    return (
        <div>
            {isLoading ? (
                <Table className="text-base">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-500">ID</TableHead>
                            <TableHead className="text-gray-500">Наименование</TableHead>
                            <TableHead className="text-gray-500">Описание</TableHead>
                            <TableHead className="text-gray-500">Принят</TableHead>
                            <TableHead className="text-gray-500">Дата принятия</TableHead>
                            <TableHead className="text-gray-500">Организация</TableHead>
                            <TableHead className="text-gray-500">file_url</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableRow>
                        <TableCell colSpan={7} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={7} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={7} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={7} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={7} className="!p-0">
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
                            <TableHead>Принят</TableHead>
                            <TableHead>Дата принятия</TableHead>
                            <TableHead>Организация</TableHead>
                            <TableHead>file_url</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {standards.map((standard) => (
                            <TableRow key={standard.id}>
                                <TableCell className="font-medium">{standard.id}</TableCell>
                                <TableCell>{standard.title}</TableCell>
                                <TableCell>{standard.description}</TableCell>
                                <TableCell>{approvedText(standard.approved)}</TableCell>
                                <TableCell>DATA</TableCell>
                                <TableCell>{standard.organization}</TableCell>
                                <TableCell>{standard.fileUrl}</TableCell>
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
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                        Скачать
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
                            <TableCell className="text-right">{standards.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
