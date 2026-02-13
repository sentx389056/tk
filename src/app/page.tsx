import Advantage from "@/components/Advantage";
import { Award, Calendar, Disc2, FileText } from "lucide-react";
import MainTask from "@/components/MainTask";
import Contacts from "@/components/Contacts";
import Map from "@/components/Map";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {

  const standardProjects = await prisma.standardProject.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const protocol = await prisma.protocol.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const report = await prisma.annualReport.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return (
    <main className="flex flex-col w-full px-5 xl:px-40 py-10">
      <div className="py-10">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mb-2">Технический комитет по стандартизации</h1>
          <p className="text-center text-4xl font-bold mb-10">&quot;Кинематография&quot;</p>

          <nav className="w-full max-w-4xl mx-auto mb-16">
            <ul className="flex flex-wrap gap-4 text-center justify-center">
              <li className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link href="/provisions" className="block text-lg font-medium text-gray-800 hover:text-[#CC4E3A] transition-colors">
                  Приказ о создании ТК
                </Link>
              </li>
              <li className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link href="/perspective" className="block text-lg font-medium text-gray-800 hover:text-[#CC4E3A] transition-colors">
                  Перспективная программа
                </Link>
              </li>
              <li className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link href="/projects" className="block text-lg font-medium text-gray-800 hover:text-[#CC4E3A] transition-colors">
                  Перечни стандартов
                </Link>
              </li>
              <li className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link href="/team" className="block text-lg font-medium text-gray-800 hover:text-[#CC4E3A] transition-colors">
                  Состав ТК
                </Link>
              </li>
              <li className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link href="/news" className="block text-lg font-medium text-gray-800 hover:text-[#CC4E3A] transition-colors">
                  Новости
                </Link>
              </li>
              <li className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link href="/contacts" className="block text-lg font-medium text-gray-800 hover:text-[#CC4E3A] transition-colors">
                  Контакты ТК
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <section className="mt-15">
          {/* <ul className="grid xl:grid-cols-4 gap-8 sm:grid-cols-2">
            <li>
              <Advantage count={standardProjects.length} text="Стандартов" Icon={FileText} />
            </li>
            <li>
              <Advantage count={protocol.length} text="Протоколов" Icon={FileText} />
            </li>
            <li>
              <Advantage count={report.length} text="Заседаний в год" Icon={Calendar} />
            </li>
            <li>
              <Advantage count={15} text="Лет работы" Icon={Award} />
            </li>
          </ul> */}
        </section>
        {/* <div className="grid sm:grid-cols-2 gap-8 mt-16">
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
              <LastEvents />
            </div>
          </section>
        </div> */}
        {/* <div className="flex flex-col sm:flex-row mt-16 gap-6">
          <Contacts />
          <section className="w-full">
            <Map />
          </section>
        </div> */}
      </div>
    </main>

  );
}
