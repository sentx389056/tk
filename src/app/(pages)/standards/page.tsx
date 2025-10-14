import SearchInput from "@/components/SearchInput";
import StandardCard from "@/components/StandardCard";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: 'Фонд стандартов | ТК "Кинематография"',
};

export default function StandardsPage() {
   return (
         <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
               <div className="flex flex-col items-center">
                  <h1 className="text-4xl font-bold text-center mb-2">Фонд стандартов</h1>
                  <p className="text-center text-base font-light text-gray-700 max-w-180">Национальные стандарты, закрепленные за Техническим комитетом по стандартизации</p>
               </div>
               <SearchInput />
               <section className="mt-8 flex flex-col gap-10">
                  <StandardCard title="ГОСТ Р 7.0.8-2013" description="Стандарт устанавливает термины и определения понятий в области делопроизводства и архивного дела." accept_in="01.11.2013" organization="Росстандарт" />
                  <StandardCard title="ГОСТ Р 7.0.8-2013" description="Стандарт устанавливает термины и определения понятий в области делопроизводства и архивного дела." accept_in="01.11.2013" organization="Росстандарт" />
               </section>
            </div>
         </main>
   )
}