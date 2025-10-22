'use client';
import ManagementCard from "@/components/ManagementCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type Executive = {
  person: {
    name: string;
    position: string;
    organization: string;
    email: string;
    phone: string;
    experience: string;
  };
  id: number;
  biography: string;
  education: string;
  achievements: string;
  awards: string;
};

export default function ManagementPage() {
  const [executive, setExecutive] = useState<Executive[]>([]);
  const [isloading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExecutives = async () => {
      const res = await fetch('/api/executive');
      if (!res.ok) {
        throw new Error('Failed to fetch executives');
      }
      const data = await res.json();
      setExecutive(data);
      setLoading(false);
    };
    fetchExecutives();
  }, []);

  return (
    <main className="flex flex-col w-full px-5 xl:px-40 py-10">
      <div className="py-10">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mb-2">Руководство</h1>
          <p className="text-center text-base font-light text-gray-700 max-w-180">
            Команда профессионалов, возглавляющая ТК &quot;Кинематография&quot;
          </p>
        </div>
        <section className="mt-16 flex gap-12 flex-col">
          {isloading ? (
            <div>
              <div className="flex gap-12 max-[640]:flex-col">
                <Skeleton className="w-2xl h-[365] rounded-xl" />
                <Skeleton className="w-full h-[365] rounded-xl" />
              </div>
              <div className="flex gap-12 mt-16 flex-row-reverse max-[640]:flex-col">
                <Skeleton className="w-2xl h-[365] rounded-xl" />
                <Skeleton className="w-full h-[365] rounded-xl" />
              </div>
              <div className="flex gap-12 mt-16 max-[640]:flex-col">
                <Skeleton className="w-2xl h-[365] rounded-xl" />
                <Skeleton className="w-full h-[365] rounded-xl" />
              </div>
            </div>
          ) : (
            executive.map((exec, index) => {
              const achievements = exec.achievements ? JSON.parse(exec.achievements) : [];
              const awards = exec.awards ? JSON.parse(exec.awards) : [];
              const reverse = index % 2 === 1;

              return (
                <ManagementCard
                  key={exec.id}
                  name={exec.person.name}
                  position={exec.person.position}
                  organization={exec.person.organization}
                  email={exec.person.email}
                  phone={exec.person.phone}
                  experience={exec.person.experience}
                  biography={exec.biography}
                  education={exec.education}
                  achievements={achievements}
                  awards={awards}
                  reverse={reverse}
                />
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}