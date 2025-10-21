'use client';
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { ChevronsUpDown, Check } from "lucide-react";
import Link from "next/link";
import React from "react";
import MemberCard from "@/components/MemberCard";
import StandardCard from "@/components/StandardCard";

const frameworks = [
    {
        value: "Информация о членах",
        label: "Информация о членах",
    },
    {
        value: "Проекты стандартов",
        label: "Проекты стандартов",
    }
]

export default function SecureAreaPage() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("Информация о членах")

    function handleLogout() {
        // logout
    }

    return (
        <main>
            <div className="w-full bg-red-600 text-white py-2 flex justify-between items-center text-sm xl:px-40 flex-row">
                <div>
                    <h2>ЗАКРЫТЫЙ РАЗДЕЛ ТК 191 - КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ</h2>
                </div>
                <div className="flex">
                    <p>Пользователь: user</p>
                    <Link onClick={handleLogout} href="/login" className="underline ml-4 opacity-80 hover:opacity-100">
                        Выйти
                    </Link>
                </div>
            </div>
            <div className="flex flex-col w-full px-5 xl:px-40">
                <div>
                    <div className="flex flex-row">
                        <Card className="w-full rounded-none py-0">
                            <CardHeader className="p-4">
                                <div className="flex gap-3 items-center justify-start text-left">
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-[200px] justify-between"
                                            >
                                                {value
                                                    ? frameworks.find((framework) => framework.value === value)?.label
                                                    : "Выбрать раздел..."}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Поиск раздела..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>Ничего не найдено.</CommandEmpty>
                                                    <CommandGroup>
                                                        {frameworks.map((framework) => (
                                                            <CommandItem
                                                                key={framework.value}
                                                                value={framework.value}
                                                                onSelect={(currentValue) => {
                                                                    setValue(currentValue === value ? "" : currentValue)
                                                                    setOpen(false)
                                                                }}
                                                            >
                                                                {framework.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        value === framework.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>

            {value === "Информация о членах" ? (
                <div className="px-5 xl:px-40">
                    <Card className="w-full rounded-none mb-5 py-0">
                        <CardHeader className="p-4">
                            <div className="flex gap-3 justify-start text-left flex-col">
                                <h2 className="font-semibold">Информация о членах ТК и их представителях</h2>
                                <MemberCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" organization="Госфильмофонд России" email="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" address="г. Москва, ул.Всеволожский пер., д.3" />
                                <MemberCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" organization="Госфильмофонд России" email="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" address="г. Москва, ул.Всеволожский пер., д.3" />
                                <MemberCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" organization="Госфильмофонд России" email="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" address="г. Москва, ул.Всеволожский пер., д.3" />
                                <MemberCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" organization="Госфильмофонд России" email="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" address="г. Москва, ул.Всеволожский пер., д.3" />
                                <MemberCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" organization="Госфильмофонд России" email="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" address="г. Москва, ул.Всеволожский пер., д.3" />
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            ) : value === "Проекты стандартов" ? (
                <div className="px-5 xl:px-40">
                    <Card className="w-full rounded-none mb-5 py-0">
                        <CardHeader className="p-4">
                            <div className="flex gap-3 justify-start text-left flex-col">
                                <h2 className="font-semibold">Проекты стандартов</h2>
                                <StandardCard title="ГОСТ Р 7.0.8-2013" description="Стандарт устанавливает термины и определения понятий в области делопроизводства и архивного дела." accept_in="01.11.2013" organization="Росстандарт" />
                                <StandardCard title="ГОСТ Р 7.0.8-2013" description="Стандарт устанавливает термины и определения понятий в области делопроизводства и архивного дела." accept_in="01.11.2013" organization="Росстандарт" />
                                <StandardCard title="ГОСТ Р 7.0.8-2013" description="Стандарт устанавливает термины и определения понятий в области делопроизводства и архивного дела." accept_in="01.11.2013" organization="Росстандарт" />
                                <StandardCard title="ГОСТ Р 7.0.8-2013" description="Стандарт устанавливает термины и определения понятий в области делопроизводства и архивного дела." accept_in="01.11.2013" organization="Росстандарт" />
                                <StandardCard title="ГОСТ Р 7.0.8-2013" description="Стандарт устанавливает термины и определения понятий в области делопроизводства и архивного дела." accept_in="01.11.2013" organization="Росстандарт" />
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            ) : null}

        </main>
    );
}