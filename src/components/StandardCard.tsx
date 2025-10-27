import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { useCallback } from 'react';

interface StandardCardProps {
   title: string;
   description: string;
   approvedAt: Date;
   organization: string;
   fileUrl?: any;
}

export default function StandardCard({ title, description, approvedAt, organization, fileUrl }: StandardCardProps) {

   const approvedAtFormatted = approvedAt.toLocaleDateString('ru-RU');

   const getFileNameFromUrl = (url: string) => {
      try {
         const withoutQuery = url.split('?')[0];
         const parts = withoutQuery.split('/').filter(Boolean);
         const last = parts.length ? parts[parts.length - 1] : withoutQuery;
         return decodeURIComponent(last);
      } catch (e) {
         return 'file';
      }
   }

   const resolveFile = useCallback(() => {
      if (!fileUrl) return null;
      try {
         if (typeof fileUrl === 'string') {
            const trimmed = fileUrl.trim();
            if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
               const parsed = JSON.parse(trimmed);
               if (Array.isArray(parsed) && parsed[0]) return parsed[0];
               if (parsed && parsed.fileUrl) return parsed;
            }
            return { fileUrl: trimmed, fileName: getFileNameFromUrl(trimmed) };
         }
         if (Array.isArray(fileUrl) && fileUrl[0]) return fileUrl[0];
         if (fileUrl && typeof fileUrl === 'object' && fileUrl.fileUrl) return fileUrl;
      } catch (e) {
         return null;
      }
      return null;
   }, [fileUrl]);

   const handleDownload = useCallback(() => {
      const f = resolveFile();
      if (!f || !f.fileUrl) return;
      const url = f.fileUrl;
      const name = f.fileName || getFileNameFromUrl(url);

      // Create an anchor and trigger download (works for same-origin files)
      try {
         const a = document.createElement('a');
         a.href = url;
         a.download = name;
         a.target = '_blank';
         document.body.appendChild(a);
         a.click();
         a.remove();
      } catch (err) {
         // Fallback: open in new tab
         window.open(url, '_blank');
      }
   }, [resolveFile]);

   return (
      <Card className="w-full px-6">
         <CardHeader className="p-0">
            <div className="flex gap-3 items-center">
               <FileText size={32} color="#CC4E3A" className="hidden md:flex" />
               <div>
                  <CardTitle className="mb-1">{title}</CardTitle>
                  <CardDescription className="text-gray-500">
                     {description}
                  </CardDescription>
               </div>
            </div>
            <CardAction>
               <Button type="button" onClick={handleDownload} className="w-full bg-red-pink font-medium cursor-pointer"><Download size={16} /><span className="hidden sm:flex">Скачать</span></Button>
            </CardAction>
         </CardHeader>
         <CardContent className="p-0">
            <CardDescription className="text-gray-500">
               <p className="mb-1"><strong>Принят:</strong></p>
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