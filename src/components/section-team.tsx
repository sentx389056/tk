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

type teamMember = {
    id: number;
    orgName: string;
    contactsInfo: string;
}

export function SectionTeamMembers() {

    const [teamMember, setTeamMember] = useState<teamMember[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    const [orgName, setOrgName] = useState<string>('');
    const [contactsInfo, setContactsInfo] = useState<string>('');

    useEffect(() => {
        const fetchTeamMember = async () => {
            try {
                const res = await fetch('/api/team');
                if (!res.ok) {
                    throw new Error('Failed to fetch team');
                }
                const data = await res.json();
                // Handle both paginated response and direct array response
                if (Array.isArray(data.teamMembers)) {
                    setTeamMember(data.teamMembers);
                } else if (Array.isArray(data.teamMember)) {
                    setTeamMember(data.teamMember);
                } else if (Array.isArray(data)) {
                    setTeamMember(data);
                } else {
                    setTeamMember([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching team:', error);
                setTeamMember([]);
                setLoading(false);
            }
        }
        fetchTeamMember();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function handleDelete(id: any) {
        try {
            const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
            
            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.error || "Ошибка при удалении объекта.");
                return;
            }
            
            toast.success("Объект успешно удален!");
            setTeamMember(prev => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error('Delete error:', error);
            toast.error("Ошибка при удалении объекта.");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/team/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orgName,
                contactsInfo
            }),
        });

        if (!res.ok) {
            toast.error("Ошибка при добавлении объекта.");
            return;
        }

        const newTeamMember = await res.json();
        setTeamMember(prev => [newTeamMember, ...prev]);
        toast.success("Объект успешно добавлен!");

        // Clear form fields
        setOrgName('');
        setContactsInfo('');
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
                                <Label htmlFor="sheet-title">Наименование организации</Label>
                                <Input id="sheet-title" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-description">Контактные данные организации</Label>
                                <Input id="sheet-description" value={contactsInfo} onChange={(e) => setContactsInfo(e.target.value)} />
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
                            <TableHead className="text-gray-500">Наименование организации</TableHead>
                            <TableHead className="text-gray-500">Контактные данные организации</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableRow>
                        <TableCell colSpan={4} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} className="!p-0">
                            <Skeleton className="h-[35] w-full rounded-none" />
                        </TableCell>
                    </TableRow>
                </Table>
            ) : (
                <Table className="text-base">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">ID</TableHead>
                            <TableHead>Наименование организации</TableHead>
                            <TableHead>Контактные данные организации</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMember.map((n) => (
                            <TableRow key={n.id}>
                                <TableCell className="font-medium">{n.id}</TableCell>
                                <TableCell>{n.orgName}</TableCell>
                                <TableCell>{n.contactsInfo}</TableCell>
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
                            <TableCell>Всего:</TableCell>
                            <TableCell className="text-left" colSpan={3}>{teamMember.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
