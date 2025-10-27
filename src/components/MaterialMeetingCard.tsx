import { Download, FileText } from "lucide-react";
import { useCallback } from 'react';

interface MaterialMeetingCardProps {
   name: string;
   size: string;
   fileUrl?: string;
}

export default function MaterialMeetingCard({ name, size, fileUrl }: MaterialMeetingCardProps) {
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

   const handleDownload = useCallback(() => {
      if (!fileUrl) return;
      const name = getFileNameFromUrl(fileUrl);
      try {
         const a = document.createElement('a');
         a.href = fileUrl;
         a.download = name;
         a.target = '_blank';
         document.body.appendChild(a);
         a.click();
         a.remove();
      } catch (err) {
         window.open(fileUrl, '_blank');
      }
   }, [fileUrl]);

   return (
      <div className="flex items-center gap-6 bg-blue-light py-3 px-4 rounded-md mt-3">
         <FileText size={20} className="hidden sm:flex" />
         <div>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-gray-500 uppercase">{size}</p>
         </div>
         <div className="ml-auto">
            <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 text-green-600">
               <Download size={18} />
            </button>
         </div>
      </div>
   )
}