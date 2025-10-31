"use client";
import SearchInput from "@/components/SearchInput";
import StandardCard from "@/components/StandardCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type Standard = {
   id: number;
   title: string;
   description: string;
   approvedAt: Date;
   organization: string;
   fileUrl?: string;
};

type PaginatedResponse = {
   standards: Standard[];
   total: number;
   page: number;
   pageSize: number;
   totalPages: number;
};

export default function StandardsPage() {
   const [standards, setStandards] = useState<Standard[]>([]);
   const [isloading, setLoading] = useState<boolean>(true);
   const [search, setSearch] = useState<string>("");
   const [page, setPage] = useState(1);
   const [pageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [total, setTotal] = useState(0);

   const fetchStandards = async () => {
      setLoading(true);
      try {
         const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
         });

         if (search) {
            params.append('search', search);
         }

         const res = await fetch(`/api/standards?${params}`);
         if (!res.ok) {
            throw new Error('Failed to fetch standards');
         }
         const data: PaginatedResponse = await res.json();
         setStandards(data.standards);
         setTotal(data.total);
         setTotalPages(data.totalPages);
      } catch (error) {
         console.error('Error fetching standards:', error);
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
         fetchStandards();
      }, 350);
      return () => clearTimeout(t);
   }, [page, search]);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Фонд стандартов</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Национальные стандарты, закрепленные за Техническим комитетом по стандартизации</p>
            </div>
            <SearchInput value={search} onChange={setSearch} count={total} />
            <section className="mt-8 flex flex-col gap-10">
               {isloading ? (
                  <div className="flex flex-col gap-10">
                     {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                           <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                           <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <>
                     <div className="flex flex-col gap-10">
                        {standards.length === 0 ? (
                           <div className="text-center py-8 text-gray-500">
                              Стандарты не найдены
                           </div>
                        ) : (
                           <>
                              {standards.map((standard: Standard) => (
                                 <StandardCard
                                    key={standard.id}
                                    title={standard.title}
                                    description={standard.description}
                                    approvedAt={new Date(standard.approvedAt)}
                                    organization={standard.organization}
                                    fileUrl={standard.fileUrl}
                                 />
                              ))}

                              {/* Pagination Controls */}
                              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                 <div className="text-sm text-gray-500">
                                    Страница {page} из {totalPages}
                                 </div>
                                 <div className="flex gap-2">
                                    <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => setPage(p => Math.max(1, p - 1))}
                                       disabled={page <= 1 || isloading}
                                    >
                                       Предыдущая
                                    </Button>
                                    <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                       disabled={page >= totalPages || isloading}
                                    >
                                       Следующая
                                    </Button>
                                 </div>
                              </div>
                           </>
                        )}
                     </div>
                  </>
               )}
            </section>
         </div>
      </main>
   );
}