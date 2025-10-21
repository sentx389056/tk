import PerspectiveStandartCard from "@/components/PerspectiveStandartCard";
import PerspectiveTasks from "@/components/PerspectiveTask";
import { Disc2, FileText } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: 'Перспективная программа работы ТК | ТК "Кинематография"',
};

export default function PerspectivePage() {
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
                     <PerspectiveStandartCard title='ГОСТ Р "ИИ в кинематографии. Основные требования"' description="Стандарт по применению искусственного интеллекта в кинопроизводстве" data="31.12.2025" />
                     <PerspectiveStandartCard title='ГОСТ Р "ИИ в кинематографии. Основные требования"' description="Стандарт по применению искусственного интеллекта в кинопроизводстве" data="31.12.2025" />
                  </div>
               </section>
            </div>
         </main>
   )
}