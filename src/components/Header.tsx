"use client"
import { useState } from "react";
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
   SheetTitle,
   SheetTrigger
} from "@/components/ui/sheet";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ExternalLink, Menu } from "lucide-react";

export default function Header() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
   return (
      <>
         <div className="w-full bg-black border-b border-gray-900">
            <div className="px-3 sm:px-6 xl:px-20 py-1">
               <Link href="https://gosfilmofond.ru/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs transition-colors duration-200 font-bold" style={{ color: '#d1d5db' }}>
                  ГОСФИЛЬМОФОНД РОССИИ
                  <ExternalLink size={12} />
               </Link>
            </div>
         </div>
         <header className="flex items-center justify-between w-full bg-black px-3 sm:px-6 xl:px-20 py-2">

            <Link href="/" className="shrink-0 flex items-center gap-3">
               <Image src="/TKlogo.png" alt="gff-tk logo" width={120} height={150} className="h-auto sm:w-[90px]" />
               <p className="text-white font-semibold text-xs hidden sm:flex" style={{ color: 'white' }}>ТЕХНИЧЕСКИЙ КОМИТЕТ ПО СТАНДАРТИЗАЦИИ<br />ТК № 015 «КИНЕМАТОГРАФИЯ»</p>
            </Link>
            <div className="hidden lg:flex items-center justify-between gap-6 flex-1 ml-18">
               <NavigationMenu viewport={false}>
                  <NavigationMenuList>
                     <NavigationMenuItem>
                        <NavigationMenuLink asChild className={buttonVariants({ variant: "link" })}>
                           <Link href="/provisions" className="text-md" style={{ color: 'white' }}>Приказ<br />о создании ТК</Link>
                        </NavigationMenuLink>
                     </NavigationMenuItem>
                     <NavigationMenuItem>
                        <NavigationMenuLink asChild className={buttonVariants({ variant: "link" })}>
                           <Link href="/perspective" className="text-md" style={{ color: 'white' }}>Перспективная<br />программа</Link>
                        </NavigationMenuLink>
                     </NavigationMenuItem>
                     <NavigationMenuItem>
                        <NavigationMenuLink asChild className={buttonVariants({ variant: "link" })}>
                           <Link href="/projects" className="text-md" style={{ color: 'white' }}>Перечни стандартов</Link>
                        </NavigationMenuLink>
                     </NavigationMenuItem>
                  </NavigationMenuList>
               </NavigationMenu>
               <div className="flex-1 flex justify-end">
                  <Sheet open={isDesktopMenuOpen} onOpenChange={setIsDesktopMenuOpen}>
                     <SheetTrigger asChild>
                        <Menu size={40} color="white" className="cursor-pointer hover:bg-gray-500 p-2 rounded-lg" />
                     </SheetTrigger>
                     <SheetContent className="bg-black text-white border-gray-700">
                        <SheetHeader className="text-white">
                           <SheetTitle className="text-white">Меню навигации</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-5 px-2">
                           <Link
                              href="/team"
                              className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium text-white hover:text-gray-300 hover:underline outline-none transition-[color,box-shadow]"
                              style={{ color: 'white' }}
                              onClick={() => setIsDesktopMenuOpen(false)}
                           >
                              Состав ТК
                           </Link>
                           <Link
                              href="/news"
                              className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium text-white hover:text-gray-300 hover:underline outline-none transition-[color,box-shadow]"
                              style={{ color: 'white' }}
                              onClick={() => setIsDesktopMenuOpen(false)}
                           >
                              Новости
                           </Link>
                           <Link
                              href="/activity"
                              className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium text-white hover:text-gray-300 hover:underline outline-none transition-[color,box-shadow]"
                              style={{ color: 'white' }}
                              onClick={() => setIsDesktopMenuOpen(false)}
                           >
                              Деятельность
                           </Link>
                           <Link
                              href="/contacts"
                              className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium text-white hover:text-gray-300 hover:underline outline-none transition-[color,box-shadow]"
                              style={{ color: 'white' }}
                              onClick={() => setIsDesktopMenuOpen(false)}
                           >
                              Контакты ТК
                           </Link>
                           <Link
                              href="https://gosfilmofond.ru/"
                              className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium text-white hover:text-gray-300 hover:underline outline-none transition-[color,box-shadow]"
                              style={{ color: 'white' }}
                              onClick={() => setIsDesktopMenuOpen(false)}
                              target="_blank"
                              rel="noopener noreferrer"
                           >
                              ГОСФИЛЬМОФОНД РОССИИ
                           </Link>
                        </div>
                        <SheetFooter></SheetFooter>
                     </SheetContent>
                  </Sheet>
               </div>

               {/* Desktop login link (visible on xl and up) */}
               {/* <Link href="/login" className={`${buttonVariants({variant: "ghost"})} text-white`}>Вход для членов ТК</Link> */}
            </div>
            <div className="grid grid-cols-1 lg:hidden items-center justify-between gap-6">
               <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                     <div>
                        <span className="sr-only">Открыть меню</span>
                        <Menu color="white" aria-hidden="true" size={35} />
                     </div>
                  </SheetTrigger>
                  <SheetContent className="bg-black text-white border-gray-700">
                     <SheetHeader className="text-white">
                        <SheetTitle className="text-white">Меню навигации</SheetTitle>
                     </SheetHeader>
                     <div className="flex flex-col gap-5 px-2">
                        <Link
                           href="/provisions"
                           className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium text-white hover:text-gray-300 hover:underline outline-none transition-[color,box-shadow]"
                           style={{ color: 'white' }}
                           onClick={() => setIsMenuOpen(false)}
                        >
                           Приказ о создании ТК
                        </Link>
                        <Link
                           href="/perspective"
                           className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium text-white hover:text-gray-300 outline-none transition-[color,box-shadow] hover:underline"
                           style={{ color: 'white' }}
                           onClick={() => setIsMenuOpen(false)}
                        >
                           Перспективная программа
                        </Link>
                        <Link
                           href="/projects"
                           className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium text-white hover:text-gray-300 outline-none transition-[color,box-shadow] hover:underline"
                           style={{ color: 'white' }}
                           onClick={() => setIsMenuOpen(false)}
                        >
                           Перечни стандартов
                        </Link>
                        <Link
                           href="/team"
                           className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-5 text-xl font-medium text-white hover:text-gray-300 outline-none transition-[color,box-shadow] hover:underline"
                           style={{ color: 'white' }}
                           onClick={() => setIsMenuOpen(false)}
                        >
                           Состав ТК
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
                        <Link
                           href="/news"
                           className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-2 text-xl font-medium text-white hover:text-gray-300 outline-none transition-[color,box-shadow] hover:underline"
                           onClick={() => setIsMenuOpen(false)}
                        >
                           Новости
                        </Link>
                        <Link
                           href="/activity"
                           className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-2 text-xl font-medium text-white hover:text-gray-300 outline-none transition-[color,box-shadow] hover:underline"
                           onClick={() => setIsMenuOpen(false)}
                        >
                           Деятельность
                        </Link>
                        <Link
                           href="/contacts"
                           className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-2 text-xl font-medium text-white hover:text-gray-300 outline-none transition-[color,box-shadow] hover:underline"
                           onClick={() => setIsMenuOpen(false)}
                        >
                           Контакты ТК
                        </Link>
                        <Link
                           href="https://gosfilmofond.ru/"
                           className="border-b-1 group inline-flex h-9 w-full items-center justify-start py-2 text-xl font-medium text-white hover:text-gray-300 outline-none transition-[color,box-shadow] hover:underline"
                           onClick={() => setIsMenuOpen(false)}
                        >
                           ГОСФИЛЬМОФОНД РОССИИ
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
               <p className="text-muted-foreground line-clamp-2 text-2xl leading-snug">
                  {children}
               </p>
            </Link>
         </NavigationMenuLink>
      </li>
   )
}
