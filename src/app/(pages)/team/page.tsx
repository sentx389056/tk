'use client';
import TeamCard from "@/components/TeamCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type Member = {
   id: number;
   name: string;
   email: string;
   position: string;
   organization: string;
   phone: string;
   experience: string;
};

export default function TeamPage() {
   const [members, setMembers] = useState<Member[]>([]);
   const [isloading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchMembers = async () => {
         const res = await fetch('/api/members');
         if (!res.ok) {
            throw new Error('Failed to fetch members');
         }
         const data = await res.json();
         setMembers(data);
         setLoading(false);
      };
      fetchMembers()
   }, []);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Состав Технического комитета</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Участники ТК по стандартизации в области кинематографии и архивного дела</p>
            </div>
            <section className="flex gap-10 mt-15 max-md:flex-wrap">
               {isloading ? (
                  <div className="flex w-full gap-10 justify-center max-xl:flex-wrap">
                        <Skeleton className="h-[300] w-2xs rounded-xl" />
                        <Skeleton className="h-[300] w-2xs rounded-xl" />
                        <Skeleton className="h-[300] w-2xs rounded-xl" />
                        <Skeleton className="h-[300] w-2xs rounded-xl" />
                  </div>
               ) : (
                  members.map((member) => {
                     return <TeamCard key={member.id} name={member.name} email={member.email} position={member.position} organization={member.organization} phone={member.phone} experience={member.experience} />
                  })
               )}
            </section>
         </div>
      </main>
   )
}