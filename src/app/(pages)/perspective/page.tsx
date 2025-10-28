"use client";
import PerspectiveStandartCard from "@/components/PerspectiveStandartCard";
import PerspectiveTasks from "@/components/PerspectiveTask";
import { Skeleton } from "@/components/ui/skeleton";
import { Disc2, FileText } from "lucide-react";
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
   const [standards, setStandards] = useState<Standard[]>([]);
   const [isLoading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchStandards = async () => {
         setLoading(true);
         try {
            const res = await fetch('/api/standards-project');
            if (!res.ok) {
               // try to get error message from JSON body
               const errBody = await res.json().catch(() => null);
               console.error('API error fetching standards:', errBody || res.statusText);
               throw new Error(errBody?.error || 'Failed to fetch standards');
            }
            const data = await res.json();

            // API may return either a paginated object { standards: [] } or a plain array
            if (data && Array.isArray((data as any).standards)) {
               setStandards((data as any).standards);
            } else if (Array.isArray(data)) {
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
               <h1 className="text-4xl font-bold text-center mb-2">Перспективная программа работы ТК</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Планы и проекты Технического комитета по стандартизации в области кинематографии</p>
            </div>
            <section className="mt-15 shadow-md px-8 py-10 rounded-md">
               <h2 className="text-center font-bold text-xl mb-18">Перспективная программа работы ТК 191 на 2025 год</h2>
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
                  <h2 className="text-lg font-semibold">Проекты стандартов</h2>
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
            </section>
         </div>
      </main>
   )
}