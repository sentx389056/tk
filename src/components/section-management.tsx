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

type Executive = {
    id: number;
    name: string;
    position: string;
    organization: string;
    email: string;
    phone: string;
    address: string;
    experience: string;
    biography: string;
    education: string;
    achievements: string;
    awards: string;
};

export function SectionManagements() {

    const [executives, setExecutives] = useState<Executive[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [organization, setOrganization] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [experience, setExperience] = useState('');
    const [biography, setBiography] = useState('');
    const [education, setEducation] = useState('');
    const [achievements, setAchievements] = useState<string[]>([]);
    const [newAchievement, setNewAchievement] = useState('');
    const [awards, setAwards] = useState<string[]>([]);
    const [newAward, setNewAward] = useState('');


    useEffect(() => {
        const fetchExecutives = async () => {
            const res = await fetch('/api/executive');
            if (!res.ok) {
                throw new Error('Failed to fetch executive');
            }
            const data = await res.json();
            setExecutives(data);
            setLoading(false);
        }
        fetchExecutives();
    }, []);

    async function handleDelete(id: any) {
        await fetch(`/api/executive/delete/${id}`, { method: 'DELETE' });
        toast.success("Объект успешно удален!");
    }

    const addAchievement = () => {
        if (newAchievement.trim()) {
            setAchievements([...achievements, newAchievement.trim()]);
            setNewAchievement('');
        }
    };

    const removeAchievement = (index: number) => {
        setAchievements(achievements.filter((_, i) => i !== index));
    };

    const addAward = () => {
        if (newAward.trim()) {
            setAwards([...awards, newAward.trim()]);
            setNewAward('');
        }
    };

    const removeAward = (index: number) => {
        setAwards(awards.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('position', position);
        formData.append('organization', organization);
        formData.append('email', email);
        formData.append('phone', position);
        formData.append('experience', experience);
        formData.append('biography', biography);
        formData.append('education', education);
        formData.append('address', address);
        formData.append('achievements', JSON.stringify(achievements));
        formData.append('awards', JSON.stringify(awards));

        const res = await fetch('/api/executive/add', {
            method: 'POST',
            body: formData,
        })

        if (res.ok) {
            toast.success('Объект успешно добавлен!')
        } else {
            toast.error('Ошибка добавления!')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="m-1">Добавить объект</Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:w-[540px] h-full flex flex-col">
                        <SheetHeader className="flex-none">
                            <SheetTitle>Добавление объекта</SheetTitle>
                            <SheetDescription>
                                Внесите данные в заданные ниже поля. Нажмите «Добавить», когда закончите.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto py-4">
                            <div className="grid gap-6 px-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-name">ФИО*</Label>
                                    <Input id="sheet-name" value={name} onChange={(e) => setName(e.target.value)} type="text" required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-position">Должность</Label>
                                    <Input id="sheet-position" value={position} onChange={(e) => setPosition(e.target.value)} type="text" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-organization">Организация</Label>
                                    <Input id="sheet-organization" value={organization} onChange={(e) => setOrganization(e.target.value)} type="text" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-email">Почта</Label>
                                    <Input id="sheet-email" value={email} onChange={(e) => setEmail(e.target.value)} type="text"  />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-phone">Телефон</Label>
                                    <Input id="sheet-phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="text"  />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-phone">Адрес</Label>
                                    <Input id="sheet-phone" value={address} onChange={(e) => setAddress(e.target.value)} type="text"  />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-experience">Опыт</Label>
                                    <Input id="sheet-experience" value={experience} onChange={(e) => setExperience(e.target.value)} type="text"  />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-bio">Биография</Label>
                                    <Input id="sheet-bio" value={biography} onChange={(e) => setBiography(e.target.value)} type="text"  />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-education">Образование</Label>
                                    <Input id="sheet-education" value={education} onChange={(e) => setEducation(e.target.value)} type="text"  />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="sheet-achievements">Достижения</Label>
                                    <Input id="sheet-achievements" value={newAchievement} onChange={(e) => setNewAchievement(e.target.value)} type="text" />
                                </div>
                                <Button variant="outline" className="m-1" onClick={addAchievement}>+</Button>
                                <ul className="space-y-1">
                                    {achievements.map((ach, i) => (
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
                                    <Label htmlFor="sheet-awards">Награды</Label>
                                    <Input id="sheet-awards" value={newAward} onChange={(e) => setNewAward(e.target.value)} type="text" />
                                </div>
                                <Button variant="outline" className="m-1" onClick={addAward}>+</Button>
                                <ul className="space-y-1">
                                    {awards.map((awd, i) => (
                                        <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                            {awd}
                                            <button
                                                type="button"
                                                onClick={() => removeAward(i)}
                                                className="text-red-500"
                                            >
                                                Удалить
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <SheetFooter className="flex-none p-4 border-t bg-white">
                            <Button type="submit" onClick={handleSubmit}>Добавить</Button>
                            <SheetClose asChild>
                                <Button variant="outline">Закрыть</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </form>
            <div className="h-[60vh] w-full overflow-auto">
                {isLoading ? (
                    <Table className="text-base min-w-full">
                        <TableHeader className="sticky top-0 bg-white z-10">
                            <TableRow>
                                <TableHead className="text-gray-500">ID</TableHead>
                                <TableHead className="text-gray-500">ФИО</TableHead>
                                <TableHead className="text-gray-500">Должность</TableHead>
                                <TableHead className="text-gray-500">Организация</TableHead>
                                <TableHead className="text-gray-500">Почта</TableHead>
                                <TableHead className="text-gray-500">Телефон</TableHead>
                                <TableHead className="text-gray-500">Адрес</TableHead>
                                <TableHead className="text-gray-500">Опыт</TableHead>
                                <TableHead className="text-gray-500">Биография</TableHead>
                                <TableHead className="text-gray-500">Образование</TableHead>
                                <TableHead className="text-gray-500">Достижения</TableHead>
                                <TableHead className="text-gray-500">Награды</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableRow>
                            <TableCell colSpan={12} className="!p-0">
                                <Skeleton className="h-[35] w-full rounded-none" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={12} className="!p-0">
                                <Skeleton className="h-[35] w-full rounded-none" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={12} className="!p-0">
                                <Skeleton className="h-[35] w-full rounded-none" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={12} className="!p-0">
                                <Skeleton className="h-[35] w-full rounded-none" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={12} className="!p-0">
                                <Skeleton className="h-[35] w-full rounded-none" />
                            </TableCell>
                        </TableRow>
                    </Table>
                ) : (
                    <Table className="text-base min-w-full">
                        <TableHeader className="sticky top-0 bg-white z-10">
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>ФИО</TableHead>
                                <TableHead>Должность</TableHead>
                                <TableHead>Организация</TableHead>
                                <TableHead>Почта</TableHead>
                                <TableHead>Телефон</TableHead>
                                <TableHead>Адрес</TableHead>
                                <TableHead>Опыт</TableHead>
                                <TableHead>Биография</TableHead>
                                <TableHead>Образование</TableHead>
                                <TableHead>Достижения</TableHead>
                                <TableHead>Награды</TableHead>
                                <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {executives.map((executive) => (
                                <TableRow key={executive.id}>
                                    <TableCell className="font-medium">{executive.id}</TableCell>
                                    <TableCell>{executive.name}</TableCell>
                                    <TableCell>{executive.position}</TableCell>
                                    <TableCell>{executive.organization}</TableCell>
                                    <TableCell>{executive.email}</TableCell>
                                    <TableCell>{executive.phone}</TableCell>
                                    <TableCell>{executive.address}</TableCell>
                                    <TableCell>{executive.experience}</TableCell>
                                    <TableCell>{executive.biography}</TableCell>
                                    <TableCell>{executive.education}</TableCell>
                                    <TableCell>{executive.achievements}</TableCell>
                                    <TableCell>{executive.awards}</TableCell>
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
                                                                        <AlertDialogAction onClick={() => handleDelete(executive.id)}>Удалить</AlertDialogAction>
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
                                <TableCell className="text-right">{executives.length}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                )}
            </div>
        </div>
    )
}
