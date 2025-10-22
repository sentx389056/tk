'use client';
import TeamCard from "@/components/TeamCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type User = {
   id: number;
   name: string;
   email: string;
   position: string;
   organization: string;
   phone: string;
   experience: string;
};

export default function TeamPage() {
   const [users, setUsers] = useState<User[]>([]);
   const [isloading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchUsers = async () => {
         const res = await fetch('/api/users');
         if (!res.ok) {
            throw new Error('Failed to fetch users');
         }
         const data = await res.json();
         setUsers(data);
         setLoading(false);
      };
      fetchUsers()
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
                  users.map((user) => {
                     return <TeamCard key={user.id} name={user.name} email={user.email} position={user.position} organization={user.organization} phone={user.phone} experience={user.experience} />
                  })
               )}
            </section>
         </div>
      </main>
   )
}