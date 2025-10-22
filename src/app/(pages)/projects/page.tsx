"use client";
import ProjectCard from "@/components/ProjectCard";
import SearchInput from "@/components/SearchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type Project = {
   id: number;
   title: string;
   description: string;
   startDate: Date;
   endDate: Date;
}

export default function ProjectsPage() {
   const [projects, setProjects] = useState<Project[]>([]);
   const [isLoading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchProjects = async () => {
         const res = await fetch('/api/projects');
         if (!res.ok) {
            throw new Error('Failed to fetch projects');
         }
         const data = await res.json();
         setProjects(data);
         setLoading(false);
      }
      fetchProjects();
   }, []);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Проекты стандартов</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Проекты национальных стандартов, разрабатываемые Техническим комитетом</p>
            </div>
            <SearchInput />
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
                  projects.map((project) => {
                     return <ProjectCard
                        key={project.id}
                        title={project.title}
                        description={project.description}
                        startDate={new Date(project.startDate)}
                        endDate={new Date(project.endDate)}
                     />
                  })
               )}
            </section>
         </div>
      </main>
   )
}