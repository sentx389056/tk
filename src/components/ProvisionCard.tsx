import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";

interface ProvisionCardProps {
   title: string;
   description: string;
   approvedAt: Date;
   organization: string;
   fileUrl: any;
}

export default function ProvisionCard({ title, description, approvedAt, organization, fileUrl }: ProvisionCardProps) {
   const approvedAtFormatted = approvedAt.toLocaleDateString('ru-RU');

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
            <div className="flex gap-3 items-center">
               <div className="hidden sm:flex">
                  <FileText size={32} color="#CC4E3A" />
               </div>
               <div>
                  <CardTitle className="mb-1">{title}</CardTitle>
                  {(description) && (
                     <CardDescription className="text-gray-500">
                        {description}
                     </CardDescription>
                  )}
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
                  <span className="hidden sm:flex">Скачать</span>
               </Button>
            </CardAction>
         </CardHeader>
         <CardContent className="p-0">
            {(approvedAtFormatted) && (
               <CardDescription className="text-gray-500">
                  <p className="mb-1"><strong>Утвержден:</strong></p>
                  <p>{approvedAtFormatted}</p>
               </CardDescription>
            )}
            {(organization) && (
               <CardDescription className="text-gray-500 mt-4">
                  <p className="mb-1"><strong>Организация:</strong></p>
                  <p>{organization}</p>
               </CardDescription>
            )}
         </CardContent>
      </Card>
   )
}