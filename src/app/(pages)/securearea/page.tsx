'use client';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import React, { use, useEffect, useState } from "react";
import MemberCard from "@/components/MemberCard";
import StandardProjectCard from "@/components/StandardProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
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

const frameworks = [
    {
        value: "Информация о членах",
        label: "Информация о членах",
    },
    {
        value: "Проекты стандартов",
        label: "Проекты стандартов",
    },
    {
        value: "Документы по стандартизации",
        label: "Документы по стандартизации",
    },
    {
        value: "Журнал логов",
        label: "Журнал логов",
    }
]

const items = [
    {
        title: "Главная",
        value: "Главная",
    },
    {
        title: "Состав ТК",
        value: "Состав ТК",
    },
    {
        title: "Руководство",
        value: "Руководство",
    },
    {
        title: "Фонд стандартов",
        value: "Фонд стандартов",
    },
    {
        title: "Заседания",
        value: "Заседания",
    },
    {
        title: "Протоколы",
        value: "Протоколы",
    },
    {
        title: "Годовые отчеты",
        value: "Годовые отчеты",
    },
    {
        title: "Положения о ТК",
        value: "Положения о ТК",
    },
    {
        title: "Проекты стандартов",
        value: "Проекты стандартов",
    },
]

type Member = {
    id: number;
    name: string;
    position: string;
    organization: string;
    email: string;
    phone: string;
    address: string;
}

type StandardProject = {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    fileUrl?: string;
}

export default function SecureAreaPage({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [members, setMembers] = React.useState<Member[]>([]);
    const [standards, setStandards] = React.useState<StandardProject[]>([]);
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("Информация о членах");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [tab, setTab] = useState<string>("Главная");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    // members pagination
    const [membersPage, setMembersPage] = useState(1);
    const [membersPageSize] = useState(10);
    const [membersTotalPages, setMembersTotalPages] = useState(1);
    const [membersTotal, setMembersTotal] = useState(0);
    

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: membersPage.toString(),
                    pageSize: membersPageSize.toString(),
                });

                const res = await fetch(`/api/members?${params}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch members');
                }
                const data = await res.json();
                // support paginated response { members, total, totalPages }
                if (Array.isArray((data as any).members)) {
                    setMembers(data.members);
                    setMembersTotal(data.total || 0);
                    setMembersTotalPages(data.totalPages || 1);
                } else if (Array.isArray(data)) {
                    // fallback if API returns array
                    setMembers(data as any);
                    setMembersTotal((data as any).length || 0);
                    setMembersTotalPages(1);
                } else {
                    setMembers([]);
                    setMembersTotal(0);
                    setMembersTotalPages(1);
                }
            } catch (err) {
                console.error('Failed to fetch members:', err);
                setMembers([]);
                setMembersTotal(0);
                setMembersTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, [membersPage, membersPageSize]);

    useEffect(() => {
        const fetchStandards = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: page.toString(),
                    pageSize: pageSize.toString(),
                    all: 'true' // добавляем флаг для админ-панели
                });
                
                const res = await fetch(`/api/projects?${params}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch standards');
                }
                const data = await res.json();
                // API may return either { projects, total, totalPages } or an array when all=true
                if (Array.isArray(data)) {
                    setStandards(data);
                    setTotal(data.length || 0);
                    setTotalPages(1);
                } else if (data && Array.isArray((data as any).projects)) {
                    setStandards((data as any).projects);
                    setTotal((data as any).total || 0);
                    setTotalPages((data as any).totalPages || 1);
                } else {
                    setStandards([]);
                    setTotal(0);
                    setTotalPages(1);
                }
            } catch (error) {
                console.error('Error:', error);
                setStandards([]);
            } finally {
                setLoading(false);
            }
        };
        fetchStandards();
    }, [page, pageSize]);

    

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
            <div className="flex flex-col w-full px-5 xl:px-40">
                <div>
                    <div className="flex flex-row">
                        <Card className="w-full py-0 mt-5">
                            <CardHeader className="p-4">
                                <div className="flex gap-3 items-center justify-start text-left">
                                    <p>Выберите категорию:</p>
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
                                    <div className="ml-auto">
                                        <Dialog>
                                            <form>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline">Панель управления</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <SidebarProvider
                                                        style={
                                                            {
                                                                "--sidebar-width": "calc(var(--spacing) * 72)",
                                                                "--header-height": "calc(var(--spacing) * 12)",
                                                            } as React.CSSProperties
                                                        }
                                                    >
                                                        <Sidebar collapsible="offcanvas" {...props}>
                                                            <SidebarHeader>
                                                                <SidebarMenu>
                                                                    <SidebarMenuItem>
                                                                        <SidebarMenuButton
                                                                            asChild
                                                                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                                                                        >
                                                                            <a href="/">
                                                                                <span className="text-base font-semibold">ТК "Кинематография"</span>
                                                                            </a>
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
                                                                <div>
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

                                                                        {tab === "Главная" && (
                                                                            <SectionMain />
                                                                        )}

                                                                        {tab === "Состав ТК" && (
                                                                            <SectionMembers />
                                                                        )}

                                                                        {tab === "Руководство" && (
                                                                            <SectionManagements />
                                                                        )}

                                                                        {tab === "Фонд стандартов" && (
                                                                            <SectionFundStandards />
                                                                        )}

                                                                        {tab === "Заседания" && (
                                                                            <SectionMeetings />
                                                                        )}

                                                                        {tab === "Протоколы" && (
                                                                            <SectionProtocol />
                                                                        )}

                                                                        {tab === "Годовые отчеты" && (
                                                                            <SectionAnnualReports />
                                                                        )}

                                                                        {tab === "Положения о ТК" && (
                                                                            <SectionProvisions />
                                                                        )}

                                                                        {tab === "Проекты стандартов" && (
                                                                            <SectionProjects />
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

            {value === "Журнал логов" ? (
                <div className="px-5 xl:px-40">
                    <SectionLogs />
                </div>
            ) : value === "Информация о членах" ? (
                <div className="px-5 xl:px-40">
                    <Card className="w-full rounded-none mb-5 py-0">
                        <CardHeader className="p-4">
                            <div className="flex gap-3 justify-start text-left flex-col">
                                <h2 className="font-semibold">Информация о членах ТК и их представителях</h2>
                                {isLoading ? (
                                    <div className="flex flex-col gap-10">
                                        <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                                            <Skeleton className="h-5 rounded-xl max-sm: w-[200]" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[250px]" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                                            <Skeleton className="h-5 rounded-xl max-sm: w-[200]" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[250px]" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                                            <Skeleton className="h-5 rounded-xl max-sm: w-[200]" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[250px]" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                                            <Skeleton className="h-5 rounded-xl max-sm: w-[200]" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                                <Skeleton className="h-4 w-[250px]" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {members.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">Члены не найдены</div>
                                        ) : (
                                            <>
                                                {members.map((member) => (
                                                    <MemberCard
                                                        key={member.id}
                                                        name={member.name}
                                                        position={member.position}
                                                        organization={member.organization}
                                                        email={member.email}
                                                        phone={member.phone}
                                                        address={member.address}
                                                    />
                                                ))}

                                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                    <div className="text-sm text-gray-500">Страница {membersPage} из {membersTotalPages}</div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setMembersPage(p => Math.max(1, p - 1))}
                                                            disabled={membersPage <= 1 || isLoading}
                                                        >
                                                            Предыдущая
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setMembersPage(p => Math.min(membersTotalPages, p + 1))}
                                                            disabled={membersPage >= membersTotalPages || isLoading}
                                                        >
                                                            Следующая
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
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
                                {isLoading ? (
                                    <div className="flex flex-col gap-10">
                                        <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                                            <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                                            <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                                            <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                                            <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-[250px]" />
                                                <Skeleton className="h-4 w-[200px]" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {standards.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                Проекты не найдены
                                            </div>
                                        ) : (
                                            <>
                                                {standards.map((standard) => (
                                                    <StandardProjectCard
                                                        key={standard.id}
                                                        title={standard.title}
                                                        description={standard.description}
                                                        startDate={new Date(standard.startDate)}
                                                        endDate={new Date(standard.endDate)}
                                                        fileUrl={standard.fileUrl}
                                                    />
                                                ))}
                                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                    <div className="text-sm text-gray-500">Страница {page} из {totalPages}</div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                                            disabled={page <= 1 || isLoading}
                                                        >
                                                            Предыдущая
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                            disabled={page >= totalPages || isLoading}
                                                        >
                                                            Следующая
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>)}
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            ) : value === "Журнал логов" ? (
                <div className="px-5 xl:px-40">
                    <Card className="w-full rounded-none mb-5 py-0">
                        <CardHeader className="p-4">
                            <div className="flex gap-3 justify-start text-left flex-col">
                                <h2 className="font-semibold">Журнал логов</h2>
                                logs
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            ) : value === "Документы по стандартизации" ? (
                <div className="px-5 xl:px-40">
                    <Card className="w-full rounded-none mb-5 py-0">
                        <CardHeader className="p-4">
                            <div className="flex gap-3 justify-start text-left flex-col">
                                <h2 className="font-semibold">Документы по стандартизации</h2>
                                <SectionStandards />
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            ) : null}
        </main>
    );
}