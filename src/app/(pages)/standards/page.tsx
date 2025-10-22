"use client";
import SearchInput from "@/components/SearchInput";
import StandardCard from "@/components/StandardCard";
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

export default function StandardsPage() {
   const [standards, setStandards] = useState<Standard[]>([]);
   const [isloading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchStandards = async () => {
         const res = await fetch('/api/standards');
         if (!res.ok) {
            throw new Error('Failed to fetch standards');
         }
         const data = await res.json();
         setStandards(data);
         setLoading(false);
      };
      fetchStandards();
   }, []);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Фонд стандартов</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Национальные стандарты, закрепленные за Техническим комитетом по стандартизации</p>
            </div>
            <SearchInput />
            <section className="mt-8 flex flex-col gap-10">
               {isloading ? (
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
                  standards.map((standard) => {
                     return <StandardCard
                        key={standard.id}
                        title={standard.title}
                        description={standard.description}
                        approvedAt={new Date(standard.approvedAt)}
                        organization={standard.organization}
                        fileUrl={standard.fileUrl}
                     />
                  })
               )
               }
            </section>
         </div>
      </main>
   )
}