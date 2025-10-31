import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileText } from "lucide-react";

interface PerspectiveStandartCardProps {
   title: string;
   description: string;
   startDate: Date;
   endDate: Date;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   fileUrl?: any;
}

export default function PerspectiveStandartCard({ title, description, startDate, endDate, fileUrl }: PerspectiveStandartCardProps) {
   const getFileNameFromUrl = (url: string) => {
      try {
         const withoutQuery = url.split('?')[0];
         const parts = withoutQuery.split('/').filter(Boolean);
         const last = parts.length ? parts[parts.length - 1] : withoutQuery;
         return decodeURIComponent(last);
      } catch (e) {
         return 'Файл';
      }
   }

   const handleDownload = () => {
      if (!fileUrl) return;

      try {
         let urls: { fileUrl: string, fileName?: string }[] = [];

         if (typeof fileUrl === 'string') {
            const trimmed = fileUrl.trim();
            if ((trimmed.startsWith('[') || trimmed.startsWith('{'))) {
               const parsed = JSON.parse(trimmed);
               urls = Array.isArray(parsed) ? parsed : [parsed];
            } else if (trimmed) {
               urls = [{ fileUrl: trimmed }];
            }
         } else if (Array.isArray(fileUrl)) {
            urls = fileUrl;
         } else if (fileUrl && typeof fileUrl === 'object') {
            urls = [fileUrl];
         }

         for (const url of urls) {
            if (!url.fileUrl) continue;
            const a = document.createElement('a');
            a.href = url.fileUrl; // прямой переход на наш серверный роут
            a.download = url.fileName || getFileNameFromUrl(url.fileUrl);
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            a.remove();
         }
      } catch (error) {
         console.error('Ошибка при скачивании:', error);
      }
   };
   return (
      <Card className="w-full px-6">
         <CardHeader className="p-0">
            <div className="flex gap-3 flex-col">
               <div className="flex gap-3">
                  <FileText size={16} className="hidden md:flex" />
                  <CardTitle className="mb-1">{title}</CardTitle>
               </div>
               {(description) && (
                  <CardDescription className="text-gray-500">
                     {description}
                  </CardDescription>
               )}
            </div>
            <CardAction>
               <Button
                  type="button"
                  className="w-full bg-red-pink font-medium cursor-pointer"
                  onClick={handleDownload}
                  disabled={!fileUrl}
               >
                  <Download size={16} />
                  <span className="hidden sm:flex">Скачать</span>
               </Button>
            </CardAction>
         </CardHeader>
         {(startDate && endDate) && (
            <CardContent className="p-0">
               <CardDescription className="text-gray-500 flex gap-2 items-center">
                  <Calendar size={16} />
                  <p>Дата принятия: {startDate.toLocaleDateString()}</p>
                  <Calendar size={16} />
                  <p>Дата окончания: {endDate.toLocaleDateString()}</p>
               </CardDescription>
            </CardContent>
         )}
      </Card>
   )
}