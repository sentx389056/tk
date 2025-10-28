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

    const [name, setName] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [organization, setOrganization] = useState<string>('');
    const [experience, setExperience] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    useEffect(() => {
        const fetchMembers = async () => {
            const res = await fetch('/api/members');
            if (!res.ok) {
                throw new Error('Failed to fetch members');
            }
            const data = await res.json();
            setMembers(data);
            setLoading(false);
        }
        fetchMembers();
    }, []);

    async function handleDelete(id: any) {
        await fetch(`/api/members/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/members/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                position,
                organization,
                experience,
                email,
                phone,
                address,
            }),
        });

        if (!res.ok) {
            toast.error("Ошибка при добавлении объекта.");
            return;
        }

        const newMember = await res.json();
        setMembers(prev => [newMember, ...prev]);
        toast.success("Объект успешно добавлен!");
        
        // Clear form fields
        setName('');
        setPosition('');
        setOrganization('');
        setExperience('');
        setEmail('');
        setPhone('');
        setAddress('');
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
                                <Label htmlFor="sheet-name">ФИО*</Label>
                                <Input id="sheet-name" value={name} onChange={(e) => setName(e.target.value)} required/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-position">Должность</Label>
                                <Input id="sheet-position" value={position} onChange={(e) => setPosition(e.target.value)}/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-organization">Организация</Label>
                                <Input id="sheet-organization" value={organization} onChange={(e) => setOrganization(e.target.value)}/>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-experience">Опыт</Label>
                                <Input id="sheet-experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-email">Почта</Label>
                                <Input id="sheet-email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-phone">Телефон</Label>
                                <Input id="sheet-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="sheet-address">Адрес</Label>
                                <Input id="sheet-address" value={address} onChange={(e) => setAddress(e.target.value)} />
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
                                                                    <AlertDialogAction onClick={() => handleDelete(member.id)}>Удалить</AlertDialogAction>
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
                            <TableCell className="text-right">{members.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    )
}
