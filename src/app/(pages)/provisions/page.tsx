"use client";
import ProvisionCard from "@/components/ProvisionCard";
import SearchInput from "@/components/SearchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type Provision = {
   id: number;
   title: string;
   description: string;
   approvedAt: Date;
   organization: string;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   fileUrl: any;
};

type PaginatedResponse = {
   provisions: Provision[];
   total: number;
   page: number;
   pageSize: number;
   totalPages: number;
};

export default function ProvisionsPage() {
   const [provisions, setProvisions] = useState<Provision[]>([]);
   const [isLoading, setLoading] = useState<boolean>(true);
   const [search, setSearch] = useState<string>('');
   const [page, setPage] = useState(1);
   const [pageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [total, setTotal] = useState(0);

   const fetchProvisions = async () => {
      setLoading(true);
      try {
         const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
         });
         
         if (search) {
            params.append('search', search);
         }

         const res = await fetch(`/api/provisions?${params}`);
         if (!res.ok) {
            throw new Error('Failed to fetch provisions');
         }
         const data: PaginatedResponse = await res.json();
         setProvisions(data.provisions);
         setTotal(data.total);
         setTotalPages(data.totalPages);
      } catch (error) {
         console.error('Error:', error);
         setProvisions([]);
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
         fetchProvisions();
      }, 350);
      return () => clearTimeout(t);
   }, [page, search]);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">Проект Положения о ТК &quot;Кинематография&quot;</h1>
               {/* <p className="text-center text-base font-light text-gray-700 max-w-180">Нормативные документы, регламентирующие деятельность Технического комитета</p> */}
            </div>
            <SearchInput value={search} onChange={setSearch} count={total} />
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
               ) : (
                  <>
                     <div className="flex flex-col gap-10">
                        {provisions.length === 0 ? (
                           <div className="text-center py-8 text-gray-500">
                              Положения не найдены
                           </div>
                        ) : (
                           <>
                              {provisions.map((provision: Provision) => (
                                 <ProvisionCard
                                    key={provision.id}
                                    title={provision.title}
                                    description={provision.description}
                                    approvedAt={new Date(provision.approvedAt)}
                                    organization={provision.organization}
                                    fileUrl={provision.fileUrl}
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
                                       disabled={page <= 1 || isLoading}
                                    >
                                       Предыдущая
                                    </Button>
                                    <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                       disabled={page >= totalPages || isLoading}
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
   )
}