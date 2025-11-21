"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";

type Standard = {
   id: number;
   title: string;
   description: string;
   startDate: Date;
   endDate: Date;
   fileUrl?: string;
};

export default function PerspectivePage() {

   const standardsTable = [
      {
         id: 1,
         title: "Качество цифрового кино. Часть 1: Яркость, цветность и равномерность экрана.",
         type: "Разработка ГОСТ Р. Прямое применение МС – IDT  ISO 26431-1: 2008",
         directionNotice: "09.2026",
         direction: "06.2027",
         statement: "12.2027",
         note: "—",
      },
      {
         id: 2,
         title: "Прокатный мастер цифрового фильма (DCDM) — Часть 1: Характеристики изображения.",
         type: "Разработка ГОСТ Р. Прямое применение МС – IDT  ISO 26428-1: 2008",
         directionNotice: "09.2026",
         direction: "06.2027",
         statement: "12.2027",
         note: "—",
      },
      {
         id: 3,
         title: "Прокатный мастер цифрового фильма (DCDM) — Часть 2: Характеристики фонограмм.",
         type: "Разработка ГОСТ Р. Прямое применение МС – IDT  ISO 26428-2: 2008",
         directionNotice: "09.2026",
         direction: "06.2027",
         statement: "12.2027",
         note: "—",
      },
   ]

   const [standards, setStandards] = useState<Standard[]>([]);
   const [isLoading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchStandards = async () => {
         setLoading(true);
         try {
            const res = await fetch('/api/standards-project');
            if (!res.ok) {
               const errBody = await res.json().catch(() => null);
               console.error('API error fetching standards:', errBody || res.statusText);
               throw new Error(errBody?.error || 'Failed to fetch standards');
            }
            const data = await res.json();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (data && Array.isArray((data as any).standards)) {
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               setStandards((data as any).standards);
            } else if (Array.isArray(data)) {
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               setStandards(data as any);
            } else {
               setStandards([]);
            }
         } catch (error) {
            console.error('Failed to fetch standards:', error);
            setStandards([]);
         } finally {
            setLoading(false);
         }
      };

      fetchStandards();
   }, []);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">Проект Перспективной программы работы ТК</h1>
               {/* <p className="text-center text-base font-light text-gray-700 max-w-180">Планы и проекты Технического комитета по стандартизации в области кинематографии</p> */}
            </div>
            <section className="w-full">
               <Table className="w-full text-xs md:text-sm">
                  <TableHeader>
                     <TableRow>
                        <TableHead className="align-middle whitespace-normal">№ п/п</TableHead>
                        <TableHead className="align-middle whitespace-normal break-words">
                           Наименование проекта стандарта
                        </TableHead>
                        <TableHead className="align-middle whitespace-normal break-words">
                           Вид работ
                        </TableHead>
                        <TableHead className="text-center align-middle whitespace-normal break-words">
                           Направление в Росстандарт уведомления о разработке стандарта
                        </TableHead>
                        <TableHead className="text-center align-middle whitespace-normal break-words">
                           Направление в Росстандарт окончательной редакции проекта стандарта
                        </TableHead>
                        <TableHead className="text-center align-middle whitespace-normal break-words">
                           Утверждение стандарта
                        </TableHead>
                        <TableHead className="align-middle whitespace-normal">Примечание</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {standardsTable.map((standard) => (
                        <TableRow key={standard.id}>
                           <TableCell className="font-medium align-top whitespace-normal">{standard.id}</TableCell>
                           <TableCell className="font-medium align-top whitespace-normal break-words">
                              {standard.title}
                           </TableCell>
                           <TableCell className="font-medium align-top whitespace-normal break-words">
                              {standard.type}
                           </TableCell>
                           <TableCell className="font-medium align-top text-center whitespace-normal">
                              {standard.directionNotice}
                           </TableCell>
                           <TableCell className="font-medium align-top text-center whitespace-normal">
                              {standard.direction}
                           </TableCell>
                           <TableCell className="font-medium align-top text-center whitespace-normal">
                              {standard.statement}
                           </TableCell>
                           <TableCell className="font-medium align-top text-center whitespace-normal">
                              {standard.note}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </section>
            {/* <section className="mt-15 shadow-md px-8 py-10 rounded-md">
               <h2 className="text-center font-bold text-xl mb-18">Перспективная программа работы ТК на 2025 год</h2>
               <div>
                  <div className="flex items-center mb-6 gap-3">
                     <Disc2 size={24} color="#CC4E3A" />
                     <h2 className="text-lg font-bold">Основные цели и задачи</h2>
                  </div>
                  <div>
                     <div className="grid grid-cols-2 gap-y-4 gap-x-29 justify-center max-sm:flex flex-col max-md:gap-x-5">
                        <PerspectiveTasks number={1} text="Завершение работы над 3 стандартами, начатыми в 2024 году" />
                        <PerspectiveTasks number={2} text="Завершение работы над 3 стандартами, начатыми в 2024 году" />
                        <PerspectiveTasks number={3} text="Завершение работы над 3 стандартами, начатыми в 2024 году" />
                        <PerspectiveTasks number={4} text="Завершение работы над 3 стандартами, начатыми в 2024 году" />
                     </div>
                  </div>
               </div>
            </section>
            <section className="mt-15 shadow-md px-8 py-10 rounded-md">
               <div className="flex gap-2 items-center mb-10">
                  <FileText size={24} color="#CC4E3A" />
                  <h2 className="text-lg font-semibold">Перечни стандартов</h2>
               </div>
               <div className="flex gap-10 max-sm:flex flex-col">
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
                     </div>
                  ) : standards.length === 0 ? (
                     <div className="text-center py-8 text-gray-500">
                     Перечни стандартов не найдены
                  </div>
                  ) : (
                     standards.slice(-2).map((standard) => {
                        return <PerspectiveStandartCard
                           key={standard.id}
                           title={standard.title}
                           description={standard.description}
                           startDate={new Date(standard.startDate)}
                           endDate={new Date(standard.endDate)}
                           fileUrl={standard.fileUrl}
                        />
                     }))}
               </div>
            </section> */}
         </div>
      </main>
   )
}