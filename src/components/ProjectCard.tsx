import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileText } from "lucide-react";

type StandardCardProps = {
   title: string;
   description: string;
   startDate: Date;
   endDate: Date;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   fileUrl?: any;
}

export default function ProjectCard({ title, description, startDate, endDate, fileUrl }: StandardCardProps) {
   const startDateFormatted = startDate.toLocaleDateString('ru-RU');
   const endDateFormatted = endDate.toLocaleDateString('ru-RU');

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

   const handleDownload = async () => {
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

            const response = await fetch(url.fileUrl);
            if (!response.ok) throw new Error('Failed to download file');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = url.fileName || getFileNameFromUrl(url.fileUrl);
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
         }
      } catch (error) {
         console.error('Ошибка при скачивании:', error);
      }
   };
   
   return (
      <Card className="w-full px-6">
         <CardHeader className="p-0">
            <div className="flex gap-3 flex-col">
               <div className="flex gap-3 items-center mb-7">
                  <FileText size={32} color="#CC4E3A" className="hidden sm:flex" />
                  <div className="flex flex-col">
                     <CardTitle className="mb-3">{title}</CardTitle>
                     {(description) && (
                        <CardDescription className="text-gray-500">
                           {description}
                        </CardDescription>
                     )}
                  </div>
               </div>
            </div>
            <CardAction>
               <Button
                  type="button"
                  className="w-full bg-red-pink font-medium cursor-pointer"
                  onClick={handleDownload}
                  disabled={!fileUrl}
               >
                  <Download size={16} />
                  <span className="hidden sm:flex">Скачать проект</span>
               </Button>
            </CardAction>
         </CardHeader>
         {(startDateFormatted && endDateFormatted) && (
            <CardContent className="p-0 flex items-center gap-30 flex-wrap sm:flex-nowrap max-sm:gap-4">
               <CardDescription className="text-gray-500 flex gap-2 items-center">
                  <Calendar size={16} />
                  <p>Начало:</p>
                  <p>{startDateFormatted}</p>
               </CardDescription>
               <CardDescription className="text-gray-500 flex gap-2 items-center">
                  <Calendar size={16} />
                  <p>Окончание:</p>
                  <p>{endDateFormatted}</p>
               </CardDescription>
            </CardContent>
         )}
      </Card>
   )
}