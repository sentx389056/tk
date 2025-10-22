"use client";
import ProvisionCard from "@/components/ProvisionCard";
import SearchInput from "@/components/SearchInput";
import { useEffect, useState } from "react";

type Provision = {
   id: number;
   title: string;
   description: string;
   approvedAt: Date;
   organization: string;
};

export default function ProvisionsPage() {
   const [provisions, setProvisions] = useState<Provision[]>([]);

   useEffect(() => {
      const fetchProvisions = async () => {
         const res = await fetch('/api/provisions');
         if (!res.ok) {
            throw new Error('Failed to fetch provisions');
         }
         const data = await res.json();
         setProvisions(data);
      }
      fetchProvisions();
   }, []);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Положения о ТК</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Нормативные документы, регламентирующие деятельность Технического комитета</p>
            </div>
            <SearchInput />
            <section className="mt-8 flex flex-col gap-10">
               {provisions.map((provision) => {
                  return <ProvisionCard
                     key={provision.id}
                     title={provision.title}
                     description={provision.description}
                     approvedAt={new Date(provision.approvedAt)}
                     organization={provision.organization}
                  />
               })}
            </section>
         </div>
      </main>
   )
}