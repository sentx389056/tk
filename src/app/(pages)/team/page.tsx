'use client';
import TeamCard from "@/components/TeamCard";
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

   useEffect(() => {
      const fetchUsers = async () => {
            const res = await fetch('/api/users');
            if (!res.ok) {
               throw new Error('Failed to fetch users');
            }
            const data = await res.json();
            setUsers(data);
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
                  <section className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-10 mt-15">
                     {users.map((user) => {
                        return <TeamCard key={user.id} name={user.name} email={user.email} position={user.position} organization={user.organization} phone={user.phone} experience={user.experience} />
                     })}
                  </section>
               </div>
            </main>
         )
      }