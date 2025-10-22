"use client";
import ProjectCard from "@/components/ProjectCard";
import SearchInput from "@/components/SearchInput";
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

   useEffect(() => {
      const fetchProjects = async () => {
         const res = await fetch('/api/projects');
         if (!res.ok) {
            throw new Error('Failed to fetch projects');
         }
         const data = await res.json();
         setProjects(data);
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
               {projects.map((project) => {
                  return <ProjectCard
                     key={project.id}
                     title={project.title}
                     description={project.description}
                     startDate={new Date(project.startDate)}
                     endDate={new Date(project.endDate)}
                  />
               })}
            </section>
         </div>
      </main>
   )
}