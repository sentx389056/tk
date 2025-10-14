import ProvisionCard from "@/components/ProvisionCard";
import SearchInput from "@/components/SearchInput";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: 'Положения о ТК | ТК "Кинематография"',
};

export default function ProvisionsPage() {
   return (
         <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
               <div className="flex flex-col items-center">
                  <h1 className="text-4xl font-bold text-center mb-2">Положения о ТК</h1>
                  <p className="text-center text-base font-light text-gray-700 max-w-180">Нормативные документы, регламентирующие деятельность Технического комитета</p>
               </div>
               <SearchInput />
               <section className="mt-8 flex flex-col gap-10">
                  <ProvisionCard title='Положение о Техническом комитете по стандартизации ТК 191 "Кинематография"' description="Основной документ, определяющий цели, задачи, функции и структуру Технического комитета" accept_in="01.11.2013" organization="Росстандарт" />
                  <ProvisionCard title='Положение о Техническом комитете по стандартизации ТК 191 "Кинематография"' description="Основной документ, определяющий цели, задачи, функции и структуру Технического комитета" accept_in="01.11.2013" organization="Росстандарт" />
               </section>
            </div>
         </main>
   )
}