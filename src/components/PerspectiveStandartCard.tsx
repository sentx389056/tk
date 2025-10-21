import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileText } from "lucide-react";

interface PerspectiveStandartCardProps {
   title: string;
   description: string;
   data: string;
}

export default function PerspectiveStandartCard({ title, description, data }: PerspectiveStandartCardProps) {
   return (
      <Card className="w-full px-6">
         <CardHeader className="p-0">
            <div className="flex gap-3 flex-col">
               <div className="flex gap-3">
                  <FileText size={16} className="hidden md:flex" />
                  <CardTitle className="mb-1">{title}</CardTitle>
               </div>
               <CardDescription className="text-gray-500">
                  {description}
               </CardDescription>
            </div>
            <CardAction>
               <Button type="submit" className="w-full bg-red-pink font-medium cursor-pointer"><Download size={16} /><span className="hidden sm:flex">Скачать</span></Button>
            </CardAction>
         </CardHeader>
         <CardContent className="p-0">
            <CardDescription className="text-gray-500 flex gap-2 items-center">
               <Calendar size={16} />
               <p>{data}</p>
            </CardDescription>
         </CardContent>
      </Card>
   )
}