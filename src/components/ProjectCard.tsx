import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileText } from "lucide-react";

interface StandardCardProps {
   title: string;
   subtitle: string;
   description: string;
   accept_in: string;
   accept_out: string;
}

export default function ProjectCard({ title, subtitle, description, accept_in, accept_out }: StandardCardProps) {
   return (
      <Card className="w-full px-6">
         <CardHeader className="p-0">
            <div className="flex gap-3 flex-col">
               <div className="flex gap-3 items-center mb-7">
                  <FileText size={32} color="#CC4E3A" className="hidden sm:flex"/>
                  <div className="flex flex-col">
                     <CardTitle className="mb-3">{title}</CardTitle>
                     <CardTitle>{subtitle}</CardTitle>
                  </div>
               </div>
               <div>
                  <CardDescription className="text-gray-500">
                     {description}
                  </CardDescription>
               </div>
            </div>
            <CardAction>
               <Button type="submit" className="w-full bg-red-pink font-medium cursor-pointer"><Download size={16} /><span className="hidden sm:flex">Скачать проект</span></Button>
            </CardAction>
         </CardHeader>
         <CardContent className="p-0 flex items-center gap-30 flex-wrap sm:flex-nowrap max-sm:gap-4">
            <CardDescription className="text-gray-500 flex gap-2 items-center">
               <Calendar size={16} />
               <p>Начало:</p>
               <p>{accept_in}</p>
            </CardDescription>
            <CardDescription className="text-gray-500 flex gap-2 items-center">
               <Calendar size={16} />
               <p>Окончание:</p>
               <p>{accept_out}</p>
            </CardDescription>
         </CardContent>
      </Card>
   )
}