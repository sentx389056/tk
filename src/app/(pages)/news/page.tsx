"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// В будущем эти данные будут приходить из API админки
interface NewsItem {
   id: number;
   title: string;
   description: string;
   url: string;
   date: string;
   category: 'internal' | 'external';
}

type PaginatedResponse = {
   news: NewsItem[];
   total: number;
   page: number;
   pageSize: number;
   totalPages: number;
};

// Mock data для демонстрации
const mockNewsData: NewsItem[] = [
   {
      id: 1,
      title: "Цифровые технологии для кинематографии – в новом техническом комитете",
      description: "МОСКВА, 1 декабря 2025 г. – В целях развития национальной системы стандартизации в сфере профессиональной кинематографии приказом Росстандарта создан новый технический комитет по стандартизации № 015 «Кинематография» (ТК 015).",
      url: "https://www.rst.gov.ru/portal/gost/home/presscenter/news?portal:isSecure=true&navigationalstate=JBPNS_rO0ABXc0AAZhY3Rpb24AAAABAA5zaW5nbGVOZXdzVmlldwACaWQAAAABAAUxMDA3MAAHX19FT0ZfXw**&portal:componentId=88beae40-0e16-414c-b176-d0ab5de82e16",
      date: "01.12.2025",
      category: 'external'
   },
   {
      id: 2,
      title: "В РФ разработают современные стандарты в области кинематографии",
      description: "МОСКВА, 1 декабря. /ТАСС/. Новый технический комитет по стандартизации, который займется актуализацией межгосударственных и национальных стандартов РФ в области кинематографии, создан в России. Об этом ТАСС сообщили в Росстандарте.",
      url: "https://tass.ru/kultura/25776365",
      date: "01.12.2025",
      category: 'external'
   }
];

export default function NewsPage() {
   const [news, setNews] = useState<NewsItem[]>([]);
   const [isLoading, setLoading] = useState<boolean>(true);
   const [page, setPage] = useState(1);
   const [pageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [total, setTotal] = useState(0);

   const fetchNews = async () => {
      setLoading(true);
      try {
         // В будущем замените на реальный API вызов
         // const params = new URLSearchParams({
         //    page: page.toString(),
         //    pageSize: pageSize.toString()
         // });
         // const res = await fetch(`/api/news?${params}`);
         // const data: PaginatedResponse = await res.json();
         
         // Mock реализация для демонстрации
         await new Promise(resolve => setTimeout(resolve, 500));
         
         const startIndex = (page - 1) * pageSize;
         const endIndex = startIndex + pageSize;
         const paginatedNews = mockNewsData.slice(startIndex, endIndex);
         
         setNews(paginatedNews);
         setTotal(mockNewsData.length);
         setTotalPages(Math.ceil(mockNewsData.length / pageSize));
      } catch (error) {
         console.error('Error fetching news:', error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchNews();
   }, [page]);

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('ru-RU', {
         day: 'numeric',
         month: 'long',
         year: 'numeric'
      });
   };

   const internalNews = news.filter(n => n.category === 'internal');
   const externalNews = news.filter(n => n.category === 'external');

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <h1 className="text-4xl font-bold text-center mb-8">Новости</h1>
            
            <div className="max-w-4xl mx-auto space-y-6">
               {isLoading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                           <div className="p-6">
                              <div className="space-y-3">
                                 <Skeleton className="h-4 w-20" />
                                 <Skeleton className="h-6 w-full" />
                                 <Skeleton className="h-4 w-full" />
                                 <Skeleton className="h-4 w-3/4" />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <>
                     <div className="space-y-8">
                        {news.length === 0 ? (
                           <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                 </svg>
                              </div>
                              <p className="text-gray-500 text-lg">Новостей пока нет</p>
                              <p className="text-gray-400 text-sm mt-2">Следите за обновлениями</p>
                           </div>
                        ) : (
                           <>
                              {/* Карточки новостей в сетке */}
                              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                 {news.map((newsItem) => (
                                    <article key={newsItem.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                       <div className="p-6 flex flex-col h-full">
                                          <div className="flex items-center justify-between mb-3">
                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                newsItem.category === 'internal' 
                                                   ? 'bg-red-100 text-red-800' 
                                                   : 'bg-blue-100 text-blue-800'
                                             }`}>
                                                {newsItem.category === 'internal' ? 'ТК 015' : 'Пресс-релиз'}
                                             </span>
                                             <time className="text-xs text-gray-500">
                                                {formatDate(newsItem.date)}
                                             </time>
                                          </div>
                                          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                                             {newsItem.title}
                                          </h3>
                                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                                             {newsItem.description}
                                          </p>
                                          <div className="mt-auto">
                                             <a 
                                                href={newsItem.url}
                                                target={newsItem.category === 'external' ? '_blank' : '_self'}
                                                rel={newsItem.category === 'external' ? 'noopener noreferrer' : ''}
                                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
                                             >
                                                Читать далее
                                                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                             </a>
                                          </div>
                                       </div>
                                    </article>
                                 ))}
                              </div>

                              {/* Pagination Controls */}
                              {totalPages > 1 && (
                                 <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                       Показано {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} из {total} новостей
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setPage(p => Math.max(1, p - 1))}
                                          disabled={page <= 1 || isLoading}
                                          className="flex items-center gap-1"
                                       >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                          </svg>
                                          Предыдущая
                                       </Button>
                                       
                                       <div className="flex items-center gap-1">
                                          {[...Array(totalPages)].map((_, i) => (
                                             <Button
                                                key={i + 1}
                                                variant={page === i + 1 ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setPage(i + 1)}
                                                disabled={isLoading}
                                                className="w-8 h-8 p-0"
                                             >
                                                {i + 1}
                                             </Button>
                                          ))}
                                       </div>
                                       
                                       <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                          disabled={page >= totalPages || isLoading}
                                          className="flex items-center gap-1"
                                       >
                                          Следующая
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                       </Button>
                                    </div>
                                 </div>
                              )}
                           </>
                        )}
                     </div>
                  </>
               )}
            </div>
         </div>
      </main>
   );
}