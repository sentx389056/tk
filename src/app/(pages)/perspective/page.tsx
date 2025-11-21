"use client";

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
      {
         id: 4,
         title: "Относительный и абсолютный уровни звукового давления для многоканальных звуковых систем в кино — Методы измерения и уровни воспроизведения аналоговых фонограмм и фонограмм цифровых фильмов.",
         type: "Разработка ГОСТ Р. Прямое применение МС – IDT ISO 22234:2005",
         directionNotice: "09.2027",
         direction: "06.2028",
         statement: "12.2028",
         note: "—",
      },
      {
         id: 5,
         title: "Кинематография. Электроакустическая частотная характеристика цепи B залов прослушивания и крытых кинотеатров — Технические характеристики и измерения.",
         type: "Разработка ГОСТ Р. Прямое применение МС – IDT ISO 2969:2015",
         directionNotice: "09.2027",
         direction: "06.2028",
         statement: "12.2028",
         note: "—",
      },
      {
         id: 6,
         title: "Кинематография. Уровень фонового акустического шума в кинотеатрах, просмотровых залах и студиях перезаписи.",
         type: "Разработка ГОСТ Р. Прямое применение МС – IDT ISO 9568:1993",
         directionNotice: "09.2027",
         direction: "06.2028",
         statement: "12.2028",
         note: "—",
      },
      {
         id: 7,
         title: "Кинематография. Метод измерения громкости фонограмм короткометражных фильмов.",
         type: "Разработка ГОСТ Р. Прямое применение МС – IDT ISO 21727:2016",
         directionNotice: "09.2027",
         direction: "06.2028",
         statement: "12.2028",
         note: "—",
      },
      {
         id: 8,
         title: "Прокатный мастер цифрового фильма (DCDM) — Часть 11: Дополнительные частоты кадров.",
         type: "Разработка ГОСТ Р. Прямое применение МС – IDT ISO 26428-11:2011",
         directionNotice: "09.2028",
         direction: "06.2029",
         statement: "12.2029",
         note: "—",
      },
      {
         id: 9,
         title: "Кинематография. Эксплуатация и консервация магнитных звуковых фонограмм для кино и телевидения.",
         type: "Разработка ГОСТ Р. Прямое применение МС – IDT ISO 12606:1997",
         directionNotice: "09.2028",
         direction: "06.2029",
         statement: "12.2029",
         note: "—",
      },
      {
         id: 10,
         title: "Технические требования и методы испытаний для стереоскопической проекции цифрового кино.",
         type: "Разработка ГОСТ Р. Прямое применение МС – IDT ISO 5926:2023",
         directionNotice: "09.2028",
         direction: "06.2029",
         statement: "12.2029",
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
         <div className="py-10 relative">
            <span className="absolute top-0 right-0 text-left">Проект</span>
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">ПЕРСПЕКТИВНАЯ ПРОГРАММА<br/>работы ТК «Кинематография» на 2026‒2029 гг.
               </h1>
               {/* <p className="text-center text-base font-light text-gray-700 max-w-180">Планы и проекты Технического комитета по стандартизации в области кинематографии</p> */}
            </div>

            <section className="w-full mt-6 text-[9px] sm:text-[10px] md:text-xs">
               <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <table className="w-full min-w-[960px] table-fixed border border-gray-300 border-collapse text-gray-900">

                     <colgroup>
                        <col className="w-[5%]" />
                        <col className="w-[20%]" />
                        <col className="w-[20%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                        <col className="w-[10%]" />
                     </colgroup>
                     <thead className="bg-[#F2F4F7] text-[8px] sm:text-[8px] md:text-[10px] tracking-wide text-gray-700 whitespace-normal">

                        <tr>
                           <th rowSpan={2} className="px-3 py-3 text-center align-middle border border-gray-300 text-sm">№ п/п</th>
                           <th rowSpan={2} className="px-3 py-3 text-left align-middle border border-gray-300 text-sm">Наименование проекта стандарта</th>
                           <th rowSpan={2} className="px-3 py-3 text-left align-middle border border-gray-300 text-sm">Вид работ</th>
                           <th colSpan={3} className="px-3 py-3 text-center align-middle border border-gray-300 text-sm">Сроки</th>
                           <th rowSpan={2} className="px-3 py-3 text-center align-middle border border-gray-300 whitespace-normal break-words text-sm">Примечание</th>
                        </tr>
                        <tr>
                           <th className="px-3 py-2 text-center align-middle border border-gray-300 leading-tight text-sm">Направление в Росстандарт уведомления о разработке стандарта</th>
                           <th className="px-3 py-2 text-center align-middle border border-gray-300 leading-tight text-sm">Направление в Росстандарт окончательной редакции проекта стандарта</th>
                           <th className="px-3 py-2 text-center align-middle border border-gray-300 leading-tight text-sm">Утверждение стандарта</th>
                        </tr>
                     </thead>
                     <tbody>
                        {standardsTable.map((standard, index) => (
                           <tr key={standard.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-3 py-3 text-center align-top border border-gray-300 text-sm">{standard.id}</td>
                              <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words text-sm">{standard.title}</td>
                              <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words text-sm">{standard.type}</td>
                              <td className="px-3 py-3 text-center align-top border border-gray-300 leading-snug text-sm">{standard.directionNotice}</td>
                              <td className="px-3 py-3 text-center align-top border border-gray-300 leading-snug text-sm">{standard.direction}</td>
                              <td className="px-3 py-3 text-center align-top border border-gray-300 leading-snug text-sm">{standard.statement}</td>
                              <td className="px-3 py-3 text-center align-top border border-gray-300 leading-snug text-sm">{standard.note}</td>
                           </tr>
                        ))}
                     </tbody>

                  </table>
               </div>
            </section>
         </div>
      </main>
   )
}