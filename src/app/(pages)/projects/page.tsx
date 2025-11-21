"use client";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type Project = {
   id: number;
   title: string;
   description: string;
   startDate: Date;
   endDate: Date;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   fileUrl?: any;
}

type PaginatedResponse = {
   projects: Project[];
   total: number;
   page: number;
   pageSize: number;
   totalPages: number;
};

export default function ProjectsPage() {
   const nationalStandards = [
      {
         id: 1,
         code: "ГОСТ 2639-76",
         title: "Кинопроекторы для 35- и 70-мм фильмов. Типы. Основные параметры. Технические требования",
      },
      {
         id: 2,
         code: "ГОСТ 3840-79",
         title: "Объективы кинопроекционные. Технические условия",
      },
      {
         id: 3,
         code: "ГОСТ 6850-76",
         title: "Кинопроекторы для 16-мм фильмов. Типы. Основные параметры. Технические требования",
      },
      {
         id: 4,
         code: "ГОСТ 8910-75",
         title: "Приборы для измерения длины киноленты. Расчетные шаги перфорации. Передаточные числа",
      },
      {
         id: 5,
         code: "ГОСТ 9039-73",
         title: "Насадки анаформные для кинопроекционных объективов. Технические условия",
      },
      {
         id: 6,
         code: "ГОСТ 9040-81",
         title: "Блоки анаформных кинопроекционных объективов для съемки 35-мм широкоэкранных фильмов. Общие технические условия",
      },
      {
         id: 7,
         code: "ГОСТ 11079-76",
         title: "Фильмы изображения кинопроекционные контрольные. Типы. Основные параметры и размеры",
      },
      {
         id: 8,
         code: "ГОСТ 13137-82",
         title: "Аппараты киноскопировальные для контактной печати 70-, 35- и 16-мм кинофильмов. Экспонируемые поля. Размеры и расположение. Методы контроля",
      },
      {
         id: 9,
         code: "ГОСТ 17706-83",
         title: "Кинопроекторы и киносчитыватели для 70-, 35- и 16-мм кинофильмов. Размеры и расположение проецируемых полей. Методы контроля",
      },
      {
         id: 10,
         code: "ГОСТ 17813-90",
         title: "Кинопроекторы профессиональной кинематографии. Методы испытаний",
      },
      {
         id: 11,
         code: "ГОСТ 19869-74",
         title: "Фонограммы магнитные на 35-мм перфорированной ленте. Размеры и расположение дорожек записи и магнитных головок. Технические требования",
      },
      {
         id: 12,
         code: "ГОСТ 21998-76",
         title: "Фильмы контрольные звуковые 35- и 16-м с фотографической записью. Типы. Основные параметры и размеры",
      },
      {
         id: 13,
         code: "ГОСТ 23848-79",
         title: "Кинопроекторы для 16-, 35- и 70-мм фильмов. Маркировка, упаковка, транспортирование и хранение",
      },
      {
         id: 14,
         code: "ГОСТ 24229-80",
         title: "Аппараты киносьемочные 70-, 35- и 16-мм. Экспонируемые поля. Размеры и расположение. Методы контроля",
      },
      {
         id: 15,
         code: "ГОСТ 25704-83",
         title: "Материалы фильмов. Поля изображения и дорожки записи. Магнитные дорожки. Размеры и расположение. Методы контроля",
      },
      {
         id: 16,
         code: "ГОСТ 26018-83",
         title: "Аппараты киноскопировальные для оптической печати 70-, 35- и 16-мм кинофильмов. Размеры и расположение просвечиваемых и экспонируемых полей, методы контроля",
      },
      {
         id: 17,
         code: "ГОСТ 26157-84",
         title: "Объективы киносъемочные. Общие технические условия",
      },
      {
         id: 18,
         code: "ГОСТ Р 51103-2011",
         title: "Кинематография. Аппаратура и оборудование профессионального кинематографа. Требования безопасности и методы испытаний",
      },
   ];

   const internationalStandards = [
      {
         id: 1,
         code: "ISO 26433:2009",
         title: "Digital cinema (D-cinema) — XML data types",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 2,
         code: "ISO 26432-2:2008",
         title: "Digital source processing — Part 2: Digital cinema (D-cinema) low frequency effects (LFE) channel audio characteristics",
         ics: "37.060.99",
      },
      {
         id: 3,
         code: "ISO 26431-1:2008",
         title: "Digital cinema (D-cinema) quality — Part 1: Screen luminance level, chromaticity and uniformity",
         ics: "37.060.99",
      },
      {
         id: 4,
         code: "ISO 26430-9:2009",
         title: "Digital cinema (D-cinema) operations — Part 9: Key delivery bundle",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 5,
         code: "ISO 26430-6:2009",
         title: "Digital cinema (D-cinema) operations — Part 6: Auditorium security messages for intra-theater communications",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 6,
         code: "ISO 26430-5:2009",
         title: "Digital cinema (D-cinema) operations — Part 5: Security log event class and constraints",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 7,
         code: "ISO 26430-4:2009",
         title: "Digital cinema (D-cinema) operations — Part 4: Log record format specification",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 8,
         code: "ISO 26430-3:2008",
         title: "Digital cinema (D-cinema) operations — Part 3: Generic extra-theater message format",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 9,
         code: "ISO 26430-2:2008",
         title: "Digital cinema (D-cinema) operations — Part 2: Digital certificate",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 10,
         code: "ISO 26430-1:2008",
         title: "Digital cinema (D-cinema) operations — Part 1: Key delivery message",
         ics: "35.040.40\n37.060.99",
      },
      {
         id: 11,
         code: "ISO 26429-10:2009",
         title: "Digital cinema (D-cinema) packaging — Part 10: Stereoscopic picture track file",
         ics: "35.040.40\n37.060.99",
      },
   ];

   const [projects, setProjects] = useState<Project[]>([]);
   const [isLoading, setLoading] = useState<boolean>(true);
   const [search, setSearch] = useState<string>("");
   const [page, setPage] = useState(1);
   const [pageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [total, setTotal] = useState(0);

   const fetchProjects = async () => {
      setLoading(true);
      try {
         const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
         });
         
         if (search) {
            params.append('search', search);
         }

         const res = await fetch(`/api/projects?${params}`);
         if (!res.ok) {
            throw new Error('Failed to fetch projects');
         }
         const data: PaginatedResponse = await res.json();
         setProjects(data.projects);
         setTotal(data.total);
         setTotalPages(data.totalPages);
      } catch (error) {
         console.error('Error:', error);
         setProjects([]);
      } finally {
         setLoading(false);
      }
   };

   // Reset to first page when search changes
   useEffect(() => {
      setPage(1);
   }, [search]);

   // Fetch when page or search changes
   useEffect(() => {
      const t = setTimeout(() => {
         fetchProjects();
      }, 350);
      return () => clearTimeout(t);
   }, [page, search]);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">Перечни стандартов</h1>
               {/* <p className="text-center text-base font-light text-gray-700 max-w-180">Проекты национальных стандартов, разрабатываемые Техническим комитетом</p> */}
            </div>
            <div className="mt-10 flex flex-col items-center text-center gap-2">
               <h2 className="text-base font-semibold uppercase tracking-wide max-w-3xl text-gray-900">
                  Перечень национальных стандартов Российской Федерации и межгосударственных стандартов,
                  действующих в Российской Федерации на национальном уровне и относящихся к компетенции
                  ТК «Кинематография»
               </h2>
            </div>
            <section className="w-full mt-6 text-[9px] sm:text-[10px] md:text-xs">
               <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <table className="w-full min-w-[720px] table-fixed border border-gray-300 border-collapse text-gray-900">

                     <colgroup>
                        <col className="w-12" />
                        <col className="w-[20%]" />
                        <col className="w-[68%]" />
                     </colgroup>
                     <thead className="bg-[#F2F4F7] text-[8px] sm:text-[8px] md:text-[10px] tracking-wide text-gray-700 uppercase">

                        <tr>
                           <th className="px-3 py-3 text-center align-middle border border-gray-300">№ п/п</th>
                           <th className="px-3 py-3 text-left align-middle border border-gray-300">Обозначение</th>
                           <th className="px-3 py-3 text-left align-middle border border-gray-300">Наименование</th>
                        </tr>
                     </thead>
                     <tbody>
                        {nationalStandards.map((standard, index) => (
                           <tr key={standard.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-3 py-3 text-center align-top border border-gray-300">{standard.id}</td>
                              <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words">{standard.code}</td>
                              <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words">{standard.title}</td>
                           </tr>
                        ))}
                     </tbody>

                  </table>
               </div>
            </section>
            <div className="mt-12 flex flex-col items-center text-center gap-2">
               <h2 className="text-base font-semibold uppercase tracking-wide max-w-3xl text-gray-900">
                  Перечень международных стандартов (ISO/TC 36), относящихся к компетенции ТК «Кинематография»
               </h2>
            </div>
            <section className="w-full mt-6 text-[9px] sm:text-[10px] md:text-xs">
               <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <table className="w-full min-w-[720px] table-fixed border border-gray-300 border-collapse text-gray-900">

                     <colgroup>
                        <col className="w-12" />
                        <col className="w-[22%]" />
                        <col className="w-[60%]" />
                        <col className="w-[16%]" />
                     </colgroup>
                     <thead className="bg-[#F2F4F7] text-[8px] sm:text-[8px] md:text-[10px] tracking-wide text-gray-700 uppercase">

                        <tr>
                           <th className="px-3 py-3 text-center align-middle border border-gray-300">№ п/п</th>
                           <th className="px-3 py-3 text-left align-middle border border-gray-300">Обозначение</th>
                           <th className="px-3 py-3 text-left align-middle border border-gray-300">Наименование</th>
                           <th className="px-3 py-3 text-center align-middle border border-gray-300">Код ICS</th>
                        </tr>
                     </thead>
                     <tbody>
                        {internationalStandards.map((standard, index) => (
                           <tr key={standard.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="px-3 py-3 text-center align-top border border-gray-300">{standard.id}</td>
                              <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words">{standard.code}</td>
                              <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words">{standard.title}</td>
                              <td className="px-3 py-3 text-center align-top border border-gray-300 leading-snug whitespace-pre-line">{standard.ics}</td>
                           </tr>
                        ))}
                     </tbody>

                  </table>
               </div>
            </section>
            {/* <SearchInput value={search} onChange={setSearch} count={total} /> */}
            <section className="mt-8 flex flex-col gap-10">
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
               // ) : projects.length === 0 ? (
               //    <div className="text-center py-8 text-gray-500">
               //       Перечни стандартов не найдены
               //    </div>
               ) : (
                  <>
                     {projects.map((project) => (
                        <ProjectCard
                           key={project.id}
                           title={project.title}
                           description={project.description}
                           startDate={new Date(project.startDate)}
                           endDate={new Date(project.endDate)}
                           fileUrl={project.fileUrl}
                        />
                     ))}
                     {/* Pagination controls */}
                     {projects.length > 0 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                           <div className="text-sm text-gray-500">Страница {page} из {totalPages}</div>
                           <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1 || isLoading}>
                                 Предыдущая
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages || isLoading}>
                                 Следующая
                              </Button>
                           </div>
                        </div>
                     )}
                  </>
               )}
            </section>
         </div>
      </main>
   )
}