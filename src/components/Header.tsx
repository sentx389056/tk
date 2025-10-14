"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
   NavigationMenu, NavigationMenuContent,
   NavigationMenuItem, NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger, navigationMenuTriggerStyle
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
import { Menu } from "lucide-react";


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
         title: "Проекты стандартов",
         href: "/projects",
         description: "Проекты национальных стандартов, разрабатываемые Техническим комитетом",
      },
   ]
};

export default function Header() {
   return (
      <header className="flex items-center justify-between w-full bg-black px-5 xl:px-40 py-2">
         <Link href="/">
            <Image src="/logo.svg" alt="gff-tk logo" width={225} height={70} />
         </Link>
         <div className="hidden xl:flex items-center justify-between gap-6">
            <NavigationMenu viewport={false}>
               <NavigationMenuList>
                  <NavigationMenuItem>
                     <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/">Главная</Link>
                     </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                     <NavigationMenuTrigger>О комитете</NavigationMenuTrigger>
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
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                     <NavigationMenuTrigger>Деятельность ТК 023</NavigationMenuTrigger>
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
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                     <NavigationMenuTrigger>Документы</NavigationMenuTrigger>
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
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                     <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link href="/contacts">Контакты</Link>
                     </NavigationMenuLink>
                  </NavigationMenuItem>
               </NavigationMenuList>
            </NavigationMenu>
         </div>
         <div className="grid grid-cols-1 xl:hidden items-center justify-between gap-6">
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
                  <div className="grid flex-1 auto-rows-min px-4">
                     <Link href="/" className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-medium  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                        Главная
                     </Link>
                     <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" >
                           <AccordionTrigger className="text-sm font-medium">О комитете</AccordionTrigger>
                           <AccordionContent>
                              <Link href="/team" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Состав ТК
                              </Link>
                              <Separator />
                              <Link href="/management" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Руководство
                              </Link>
                              <Separator />
                              <Link href="/standards" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Фонд стандартов закрепленных за ТК
                              </Link>
                           </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" >
                           <AccordionTrigger className="text-sm font-medium">Деятельность ТК 023</AccordionTrigger>
                           <AccordionContent>
                              <Link href="/meetings" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Заседания
                              </Link>
                              <Separator />
                              <Link href="/protocols" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Протоколы
                              </Link>
                              <Separator />
                              <Link href="/reports" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Годовые отчеты
                              </Link>
                           </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" >
                           <AccordionTrigger className="text-sm font-medium">Документы</AccordionTrigger>
                           <AccordionContent>
                              <Link href="/provisions" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Положения о ТК
                              </Link>
                              <Separator />
                              <Link href="/perspective" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Перспективная программа работы ТК
                              </Link>
                              <Separator />
                              <Link href="/projects" className="group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-light  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                                 Проекты стандартов
                              </Link>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                     <Link href="/contacts" className="border-t-1 group inline-flex h-9 w-full items-center justify-start py-2 text-sm font-medium  hover:text-accent-foreground  outline-none transition-[color,box-shadow] ">
                        Контакты
                     </Link>
                  </div>
                  <SheetFooter></SheetFooter>
               </SheetContent>
            </Sheet>
         </div>
      </header>
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
