"use client"
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
   NavigationMenu, NavigationMenuContent,
   NavigationMenuItem, NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {
   Sheet,
   SheetContent,
   SheetFooter,
   SheetHeader,
   SheetTrigger
} from "@/components/ui/sheet";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ExternalLink, Menu } from "lucide-react";

const info = {
   about: [
      {
         title: "Состав ТК",
         href: "/team",
         description: "Участники ТК по стандартизации в области кинематографии и архивного дела",
      },
      {
         title: "Руководство",
         href: "/management",
         description: 'Команда профессионалов, возглавляющая ТК "Кинематография"',
      },
      {
         title: "Фонд стандартов закрепленных за ТК",
         href: "/standards",
         description: "Национальные стандарты, закрепленные за Техническим комитетом по стандартизации",
      },
      {
         title: "Поступившие заявки",
         href: "/applications",
         description: "Заявки организаций на участие в работе Технического комитета",
      }
   ],
   activity: [
      {
         title: "Заседания",
         href: "/meetings",
         description: "Информация о проведенных и планируемых заседаниях Технического комитета",
      },
      {
         title: "Протоколы",
         href: "/protocols",
         description: "Официальные протоколы заседаний Технического комитета по стандартизации",
      },
      {
         title: "Годовые отчеты",
         href: "/reports",
         description: "Ежегодные отчеты о деятельности Технического комитета по стандартизации",
      }
   ],
   documents: [
      {
         title: "Положения о ТК",
         href: "/provisions",
         description: "Нормативные документы, регламентирующие деятельность Технического комитета",
      },
      {
         title: "Перспективная программа работы ТК",
         href: "/perspective",
         description: "Планы и проекты Технического комитета по стандартизации в области кинематографии",
      },
      {
         title: "Перечни стандартов",
         href: "/projects",
         description: "Проекты национальных стандартов, разрабатываемые Техническим комитетом",
      },
   ]
};

export default function Header() {
   return (
      <>
         <div className="w-full bg-black border-b border-gray-900">
            <div className="px-3 sm:px-6 xl:px-40 py-1">
               <Link href="https://gosfilmofond.ru/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs transition-colors duration-200 font-bold">
                  ГОСФИЛЬМОФОНД РОССИИ
                  <ExternalLink size={12} />
               </Link>
            </div>
         </div>
         <header className="flex items-center justify-between w-full bg-black px-3 sm:px-6 xl:px-40 py-2">

            <Link href="/" className="shrink-0 flex items-center gap-3">
               <Image src="/TKlogo.svg" alt="gff-tk logo" width={150} height={70} className="w-[120px] h-auto sm:w-[150px]" />
               <p className="text-white font-semibold text-sm hidden sm:flex">ТЕХНИЧЕСКИЙ КОМИТЕТ ПО СТАНДАРТИЗАЦИИ<br />ТК 015 «КИНЕМАТОГРАФИЯ»</p>
            </Link>
            <div className="hidden 2xl:flex items-center justify-between gap-6">
               <NavigationMenu viewport={false}>
                  <NavigationMenuList>
                     {/* <NavigationMenuItem>
                     <NavigationMenuLink asChild className={buttonVariants({variant: "link"})}>
                        <Link href="/">Главная</Link>
                     </NavigationMenuLink>
                  </NavigationMenuItem> */}
                     {/* <NavigationMenuItem>
                     <NavigationMenuTrigger className={buttonVariants({variant: "link"})}>О комитете</NavigationMenuTrigger>
                     <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                           {info.about.map((component) => (
                              <ListItem
                                 key={component.title}
                                 title={component.title}
                                 href={component.href}
                              >
                                 {component.description}
                              </ListItem>
                           ))}
                        </ul>
                     </NavigationMenuContent>
                  </NavigationMenuItem> */}
                     {/* <NavigationMenuItem>
                     <NavigationMenuTrigger className={buttonVariants({variant: "link"})}>Деятельность ТК 023</NavigationMenuTrigger>
                     <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                           {info.activity.map((component) => (
                              <ListItem
                                 key={component.title}
                                 title={component.title}
                                 href={component.href}
                              >
                                 {component.description}
                              </ListItem>
                           ))}
                        </ul>
                     </NavigationMenuContent>
                  </NavigationMenuItem> */}
                     {/* <NavigationMenuItem>
                     <NavigationMenuTrigger className={buttonVariants({variant: "link"})}>Документы</NavigationMenuTrigger>
                     <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                           {info.documents.map((component) => (
                              <ListItem
                                 key={component.title}
                                 title={component.title}
                                 href={component.href}
                              >
                                 {component.description}
                              </ListItem>
                           ))}
                        </ul>
                     </NavigationMenuContent>
                  </NavigationMenuItem> */}
                     <NavigationMenuItem>
                        <NavigationMenuLink asChild className={buttonVariants({ variant: "link" })}>
                           <Link href="/provisions">Положение о ТК</Link>
                        </NavigationMenuLink>
                     </NavigationMenuItem>
                     <NavigationMenuItem>
                        <NavigationMenuLink asChild className={buttonVariants({ variant: "link" })}>
                           <Link href="/perspective">Перспективная<br />программа</Link>
                        </NavigationMenuLink>
                     </NavigationMenuItem>
                     <NavigationMenuItem>
                        <NavigationMenuLink asChild className={buttonVariants({ variant: "link" })}>
                           <Link href="/projects">Перечни стандартов</Link>
                        </NavigationMenuLink>
                     </NavigationMenuItem>
                     <NavigationMenuItem>
                        <NavigationMenuLink asChild className={buttonVariants({ variant: "link" })}>
                           <Link href="/applications">Поступившие заявки<br />на участие в ТК</Link>
                        </NavigationMenuLink>
                     </NavigationMenuItem>
                     <NavigationMenuItem>
                        <NavigationMenuLink asChild className={buttonVariants({ variant: "link" })}>
                           <Link href="/contacts">Контакты ТК</Link>
                        </NavigationMenuLink>
                     </NavigationMenuItem>
                  </NavigationMenuList>
               </NavigationMenu>
               {/* Desktop login link (visible on xl and up) */}
               {/* <Link href="/login" className={`${buttonVariants({variant: "ghost"})} text-white`}>Вход для членов ТК</Link> */}
            </div>
            <div className="grid grid-cols-1 2xl:hidden items-center justify-between gap-6">
               <Sheet>
                  <SheetTrigger asChild>
                     <Button variant="ghost" className="hover:bg-slate-200/50 cursor-pointer">
                        <span className="sr-only">Открыть меню</span>
                        <Menu color="white" aria-hidden="true" />
                     </Button>
                  </SheetTrigger>
                  <SheetContent>
                     <SheetHeader>

                     </SheetHeader>
                     <div className="flex flex-col gap-5 px-2">
                        <Link href="/provisions" className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium  hover:text-accent-foreground hover:underline  outline-none transition-[color,box-shadow]">
                           Положение о ТК
                        </Link>
                        <Link href="/perspective" className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium  hover:text-accent-foreground  outline-none transition-[color,box-shadow] hover:underline">
                           Перспективная программа
                        </Link>
                        <Link href="/projects" className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium  hover:text-accent-foreground  outline-none transition-[color,box-shadow] hover:underline">
                           Перечни стандартов
                        </Link>
                        <Link href="/applications" className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium  hover:text-accent-foreground  outline-none transition-[color,box-shadow] hover:underline">
                           Поступившие заявки на участие в ТК
                        </Link>
                        {/* <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" >
                           <AccordionTrigger className="text-sm font-medium">О комитете</AccordionTrigger>
                           <AccordionContent>
                              <Link href="/team" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground outline-none transition-[color,box-shadow] ">
                                 Состав ТК
                              </Link>
                              <Link href="/management" className="roup inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Руководство
                              </Link>
                              <Link href="/standards" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Фонд стандартов закрепленных за ТК
                              </Link>
                              <Link href="/applications" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Поступившие заявки
                              </Link>
                           </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" >
                           <AccordionTrigger className="text-sm font-medium">Деятельность ТК 023</AccordionTrigger>
                           <AccordionContent>
                              <Link href="/meetings" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Заседания
                              </Link>
                              <Link href="/protocols" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Протоколы
                              </Link>
                              <Link href="/reports" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Годовые отчеты
                              </Link>
                           </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" >
                           <AccordionTrigger className="text-sm font-medium">Документы</AccordionTrigger>
                           <Separator/>
                           <AccordionContent>
                              <Link href="/provisions" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Положения о ТК
                              </Link>
                              <Link href="/perspective" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Перспективная программа работы ТК
                              </Link>
                              <Link href="/projects" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Перечни стандартов
                              </Link>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion> */}
                        <Link href="/contacts" className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-2 text-xl font-medium  hover:text-accent-foreground  outline-none transition-[color,box-shadow] hover:underline">
                           Контакты ТК
                        </Link>
                        {/* <Link href="/login" className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-medium  hover:text-accent-foreground  outline-none transition-[color,box-shadow] hover:underline">
                        Вход для членов ТК
                     </Link> */}
                     </div>
                     <SheetFooter></SheetFooter>
                  </SheetContent>
               </Sheet>
            </div>
         </header>
      </>
   )
}

function ListItem({
   title,
   children,
   href,
   ...props
}
   :
   React.ComponentPropsWithoutRef<"li"> & { href: string }
) {
   return (
      <li {...props}>
         <NavigationMenuLink asChild>
            <Link href={href}>
               <div className="text-sm leading-none font-medium">{title}</div>
               <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                  {children}
               </p>
            </Link>
         </NavigationMenuLink>
      </li>
   )
}
