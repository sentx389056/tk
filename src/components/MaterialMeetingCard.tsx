import { Download, FileText } from "lucide-react";

interface MaterialMeetingCardProps {
   name: string;
   size: string;
}

export default function MaterialMeetingCard({ name, size }: MaterialMeetingCardProps) {
   return (
      <div className="flex items-center gap-6 bg-blue-light py-3 px-4 rounded-md mt-3">
         <FileText size={20} className="hidden sm:flex" />
         <div>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-gray-500 uppercase">{size}</p>
         </div>
         <div className="ml-auto">
            <Download size={18} color="#16A34A"/>
         </div>
      </div>
   )
}