import Advantage from "@/components/Advantage";
import { Award, Calendar, Disc2, FileText, TrendingUp } from "lucide-react";
import MainTask from "@/components/MainTask";
import LastEvents from "@/components/LastEvents";
import Contacts from "@/components/Contacts";
import Map from "@/components/Map";
import { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: 'Главная | ТК "Кинематография"',
};

export default function Home() {
  return (
    <main className="flex flex-col w-full px-5 xl:px-40 py-10">
      <div className="py-10">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mb-2">Технический комитет по стандартизации</h1>
          <p className="text-center text-xl text-red-pink font-semibold mb-2">ТК NNN &quot;Кинематография&quot;</p>
          <p className="text-center text-base font-light text-gray-700 max-w-180">Разработка национальных стандартов в области кинематографии, архивного хранения кинофильмов и цифровых технологий в кино</p>
        </div>
        <section className="mt-15">
          <ul className="grid xl:grid-cols-4 gap-8 sm:grid-cols-2">
            <li>
              <Advantage count={24} text="Стандартов" Icon={FileText} />
            </li>
            <li>
              <Advantage count={45} text="Протоколов" Icon={FileText} />
            </li>
            <li>
              <Advantage count={12} text="Заседаний в год" Icon={Calendar} />
            </li>
            <li>
              <Advantage count={15} text="Лет работы" Icon={Award} />
            </li>
          </ul>
        </section>
        <div className="grid sm:grid-cols-2 gap-8 mt-16">
          <section className="p-8 bg-white shadow-md rounded-lg">
            <div className="flex gap-3 mb-6">
              <Disc2 size={32} color="#CC4E3A" />
              <h2 className="text-2xl font-bold">Основные задачи ТК</h2>
            </div>
            <MainTask tasks={
              [
                "Разработка национальных стандартов в области кинематографии",
                "Гармонизация российских стандартов с международными",
                "Экспертиза проектов стандартов и технических регламентов",
                "Участие в международной стандартизации"
              ]
            } />
          </section>
          <section>
            <div className="p-8 bg-white shadow-md rounded-lg">
              <div className="flex items-center mb-6 gap-3">
                <TrendingUp size={32} color="#16A34A" />
                <h2 className="text-2xl font-bold">Последние события</h2>
              </div>
              <ul className="flex flex-col gap-4">
                <LastEvents title="Заседание ТК 191 №3/2024" description="Рассмотрение проектов стандартов по цифровой кинематографии" date="15.03.2024" />
                <LastEvents title='ГОСТ Р "Цифровая кинематография. Форматы файлов"' description="Проект стандарта направлен на публичное обсуждение" date="10.03.2024" />
                <LastEvents title="Годовой отчет ТК 191 за 2023 год" description="Опубликован отчет о деятельности комитета за прошедший год" date="28.02.2024" />
              </ul>
            </div>
          </section>
        </div>
        <div className="flex flex-col sm:flex-row mt-16 gap-6">
          <Contacts />
          <section className="w-full">
            <Map />
          </section>
        </div>
      </div>
    </main>
  );
}