import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";

interface ProvisionCardProps {
   title: string;
   description: string;
   approvedAt: Date;
   organization: string;
}

export default function ProvisionCard({ title, description, approvedAt, organization }: ProvisionCardProps) {
   const approvedAtFormatted = approvedAt.toLocaleDateString('ru-RU');
   return (
      <Card className="w-full px-6">
         <CardHeader className="p-0">
            <div className="flex gap-3 items-center">
               <div className="hidden sm:flex">
                  <FileText size={32} color="#CC4E3A" />
               </div>
               <div>
                  <CardTitle className="mb-1">{title}</CardTitle>
                  <CardDescription className="text-gray-500">
                     {description}
                  </CardDescription>
               </div>
            </div>
            <CardAction>
               <Button type="submit" className="w-full bg-red-pink font-medium cursor-pointer"><Download size={16} /><span className="hidden sm:flex">Скачать</span></Button>
            </CardAction>
         </CardHeader>
         <CardContent className="p-0">
            <CardDescription className="text-gray-500">
               <p className="mb-1"><strong>Утвержден:</strong></p>
               <p>{approvedAtFormatted}</p>
            </CardDescription>
            <CardDescription className="text-gray-500 mt-4">
               <p className="mb-1"><strong>Организация:</strong></p>
               <p>{organization}</p>
            </CardDescription>
         </CardContent>
      </Card>
   )
}