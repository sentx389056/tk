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
import React, { useEffect, useState } from "react";
import MemberCard from "@/components/MemberCard";
import StandardProjectCard from "@/components/StandardProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserHeader } from "@/components/UserHeader";
import { SectionMembers } from "@/components/section-members";
import { Separator } from "@/components/ui/separator";
import SectionMain from "@/components/section-main";
import { SectionFundStandards } from "@/components/section-fundstandards";
import { SectionMeetings } from "@/components/section-meetings";
import { SectionProtocol } from "@/components/section-protocols";
import { SectionAnnualReports } from "@/components/section-annualreports";
import { SectionProvisions } from "@/components/section-provisions";
import { SectionProjects } from "@/components/section-projects";
import { SectionStandards } from "@/components/section-standards";
import { SectionManagements } from "@/components/section-management";
import { SectionLogs } from "@/components/section-logs";
import { SectionDiscussions } from "@/components/section-discussions";
import Link from "next/link";
import { SectionNews } from "@/components/section-news";

const frameworks = [
    {
        value: "Журнал логов",
        label: "Журнал логов",
    }
]

const items = [
    {
        title: "Новости",
        value: "Новости",
    },
]

export default function SecureAreaPage() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("Журнал логов");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [tab, setTab] = useState<string>("Главная");

    return (
        <main>
            <div className="w-full bg-red-600 text-white py-2 xl:px-40">
                <div className="flex justify-between items-center text-sm">
                    <div>
                        <h2>ЗАКРЫТЫЙ РАЗДЕЛ ТК 191 - КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ</h2>
                    </div>
                    <UserHeader />
                </div>
            </div>
            <div className="mb-5 flex flex-col w-full px-5 xl:px-40">
                <div>
                    <div className="flex">
                        <Card className="w-full py-0 mt-5">
                            <CardHeader className="p-4">
                                <div className="flex gap-10 items-center justify-start max-sm:flex-col">
                                    <p>Выберите раздел:</p>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild className="max-sm:w-full">
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
                                        <PopoverContent className="w-70 p-0">
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
                                    <div className="ml-auto max-sm:m-0 w-full">
                                        <Dialog>
                                            <form>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="max-sm:w-full">Панель управления</Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-[1420px] max-2xl:w-full">
                                                    <SidebarProvider
                                                        style={
                                                            {
                                                                // Use explicit sizes to avoid invalid `calc` with undefined CSS vars
                                                                "--sidebar-width": "18rem",
                                                                "--header-height": "3rem",
                                                            } as React.CSSProperties
                                                        }
                                                    >
                                                        <Sidebar collapsible="icon" variant="inset">
                                                            <SidebarHeader>
                                                                <SidebarMenu>
                                                                    <SidebarMenuItem>
                                                                        <SidebarMenuButton
                                                                            asChild
                                                                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                                                                        >
                                                                            <Link href="/">
                                                                                <span className="text-base font-semibold">ТК &quot;Кинематография&quot;</span>
                                                                            </Link>
                                                                        </SidebarMenuButton>
                                                                    </SidebarMenuItem>
                                                                </SidebarMenu>
                                                            </SidebarHeader>
                                                            <SidebarContent>
                                                                <SidebarGroup>
                                                                    <SidebarGroupContent className="flex flex-col gap-2">
                                                                        <SidebarMenu>
                                                                            <SidebarMenuItem className="flex items-center gap-2">
                                                                                <span className="text-sm font-medium">Разделы ТК</span>
                                                                            </SidebarMenuItem>
                                                                        </SidebarMenu>
                                                                        <SidebarMenu>
                                                                            {items.map((item) => (
                                                                                <SidebarMenuItem key={item.title} onClick={() => setTab(item.value)}>
                                                                                    <SidebarMenuButton tooltip={item.title}>
                                                                                        <span>{item.title}</span>
                                                                                    </SidebarMenuButton>
                                                                                </SidebarMenuItem>
                                                                            ))}
                                                                        </SidebarMenu>
                                                                    </SidebarGroupContent>
                                                                </SidebarGroup>
                                                            </SidebarContent>
                                                            <SidebarFooter>
                                                            </SidebarFooter>
                                                        </Sidebar>
                                                        <SidebarInset>
                                                            <div className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
                                                                <div className="flex items-center">
                                                                    <SidebarTrigger className="-ml-1" />
                                                                    <Separator
                                                                        orientation="vertical"
                                                                        className="mx-2 data-[orientation=vertical]:h-4"
                                                                    />
                                                                    <h2 className="text-base font-medium pl-5">{tab}</h2>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-1 flex-col">
                                                                <div className="@container/main flex flex-1 flex-col gap-2">
                                                                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

                                                                        {tab === "Новости" && (
                                                                            <SectionNews />
                                                                        )}

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SidebarInset>
                                                    </SidebarProvider>
                                                </DialogContent>
                                            </form>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>

            {value === 'Журнал логов' ? (
                <div className="px-5 xl:px-40">
                    <SectionLogs />
                </div>
            ) :
                <div className="px-5 xl:px-40">
                    <p>Выберите раздел</p>
                </div>
            }

        </main >
    );
}