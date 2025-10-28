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
      <main className="flex flex-col w-full px-4 sm:px-6 lg:px-8 xl:px-40 py-6 sm:py-10">
         <div className="py-6 sm:py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-4">Состав Технического комитета</h1>
               <p className="text-center text-sm sm:text-base font-light text-gray-700 max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
                  Участники ТК по стандартизации в области кинематографии и архивного дела
               </p>
            </div>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-10">
               {isloading ? (
                  <>
                     <Skeleton className="h-[300px] rounded-xl" />
                     <Skeleton className="h-[300px] rounded-xl hidden sm:block" />
                     <Skeleton className="h-[300px] rounded-xl hidden lg:block" />
                     <Skeleton className="h-[300px] rounded-xl hidden xl:block" />
                  </>
               ) : (
                  members.map((member) => (
                     <TeamCard 
                        key={member.id} 
                        name={member.name} 
                        email={member.email} 
                        position={member.position} 
                        organization={member.organization} 
                        phone={member.phone} 
                        experience={member.experience}
                     />
                  ))
               )}
            </section>
         </div>
      </main>
   )
}