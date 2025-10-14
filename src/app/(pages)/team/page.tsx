import TeamCard from "@/components/TeamCard";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: 'Состав Технического комитета | ТК "Кинематография"',
};

export default function TeamPage() {
   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
         <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-center mb-2">Состав Технического комитета</h1>
            <p className="text-center text-base font-light text-gray-700 max-w-180">Участники ТК по стандартизации в области кинематографии и архивного дела</p>
         </div>
         <section className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-10 mt-15">
            <TeamCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" place="Госфильмофонд России" experience="15 лет" mail="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" />
            <TeamCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" place="Госфильмофонд России" experience="15 лет" mail="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" />
            <TeamCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" place="Госфильмофонд России" experience="15 лет" mail="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" />
            <TeamCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" place="Госфильмофонд России" experience="15 лет" mail="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" />
            <TeamCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" place="Госфильмофонд России" experience="15 лет" mail="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" />
            <TeamCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" place="Госфильмофонд России" experience="15 лет" mail="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" />
            <TeamCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" place="Госфильмофонд России" experience="15 лет" mail="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" />
            <TeamCard name="Иванов Сергей Петрович" jobTitle="Председатель ТК" place="Госфильмофонд России" experience="15 лет" mail="ivanov@gosfilmofond.ru" phone="+7 (495) 123-45-67" />
         </section>
         </div>
      </main>
   )
}