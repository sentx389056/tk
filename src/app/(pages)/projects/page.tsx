import ProjectCard from "@/components/ProjectCard";
import SearchInput from "@/components/SearchInput";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: 'Проекты стандартов | ТК "Кинематография"',
};

export default function ProjectsPage() {
   return (
         <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
               <div className="flex flex-col items-center">
                  <h1 className="text-4xl font-bold text-center mb-2">Проекты стандартов</h1>
                  <p className="text-center text-base font-light text-gray-700 max-w-180">Проекты национальных стандартов, разрабатываемые Техническим комитетом</p>
               </div>
               <SearchInput />
               <section className="mt-8 flex flex-col gap-10">
                  <ProjectCard title='ГОСТ Р "Цифровая кинематография. Форматы файлов"' subtitle="Цифровая кинематография. Форматы файлов для производства и архивного хранения" description="Проект стандарта устанавливает требования к форматам цифровых файлов, используемых в кинематографии для производства фильмов и их архивного хранения." accept_in="15.01.2024" accept_out="15.03.2024" />
                  <ProjectCard title='ГОСТ Р "Цифровая кинематография. Форматы файлов"' subtitle="Цифровая кинематография. Форматы файлов для производства и архивного хранения" description="Проект стандарта устанавливает требования к форматам цифровых файлов, используемых в кинематографии для производства фильмов и их архивного хранения." accept_in="15.01.2024" accept_out="15.03.2024" />
               </section>
            </div>
         </main>
   )
}