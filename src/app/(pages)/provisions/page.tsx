"use client";
import ProvisionCard from "@/components/ProvisionCard";
import SearchInput from "@/components/SearchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type Provision = {
   id: number;
   title: string;
   description: string;
   approvedAt: Date;
   organization: string;
   fileUrl: any;
};

export default function ProvisionsPage() {
   const [provisions, setProvisions] = useState<Provision[]>([]);
   const [isLoading, setLoading] = useState<boolean>(true);
   const [search, setSearch] = useState<string>('');
   const [filtered, setFiltered] = useState<Provision[]>([]);

   useEffect(() => {
      const fetchProvisions = async () => {
         const res = await fetch('/api/provisions');
         if (!res.ok) {
            throw new Error('Failed to fetch provisions');
         }
         const data = await res.json();
         setProvisions(data);
            setFiltered(data);
         setLoading(false);
      }
      fetchProvisions();
   }, []);

   useEffect(() => {
      const t = setTimeout(() => {
         if (!search) {
            setFiltered(provisions);
            return;
         }

         const q = search.trim().toLowerCase();
         const result = provisions.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
         setFiltered(result);
      }, 200);

      return () => clearTimeout(t);
   }, [search, provisions]);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Положения о ТК</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Нормативные документы, регламентирующие деятельность Технического комитета</p>
            </div>
            <SearchInput value={search} onChange={setSearch} count={filtered.length} />
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
                  filtered.map((provision) => {
                     return <ProvisionCard
                        key={provision.id}
                        title={provision.title}
                        description={provision.description}
                        approvedAt={new Date(provision.approvedAt)}
                        organization={provision.organization}
                        fileUrl={provision.fileUrl}
                     />
                  }))}
            </section>
         </div>
      </main>
   )
}