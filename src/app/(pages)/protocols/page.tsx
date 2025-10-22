"use client";
import MaterialMeetingCard from "@/components/MaterialMeetingCard";
import SearchInput from "@/components/SearchInput";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, FileText } from "lucide-react";
import { useEffect, useState } from "react";

type Protocol = {
   id: number;
   title: string;
   description: string;
   publishedAt: Date;
   organization: string;
   fileUrl?: string;
}

export default function ProtocolsPage() {
   const [protocols, setProtocols] = useState<Protocol[]>([]);
   const [isloading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchProtocols = async () => {
         const res = await fetch('/api/protocols');
         if (!res.ok) {
            throw new Error('Failed to fetch protocols');
         }
         const data = await res.json();
         setProtocols(data);
         setLoading(false);
      }
      fetchProtocols();
   }, []);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Протоколы</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Официальные протоколы заседаний Технического комитета по стандартизации</p>
            </div>
            <SearchInput />
            <section className="mt-8 gap-10 flex flex-col">
               {isloading ? (
                  <div className="flex flex-col gap-10">
                     <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                        <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[250px]" />
                           <Skeleton className="h-4 w-[200px]" />
                        </div>
                     </div>
                     <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                        <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[250px]" />
                           <Skeleton className="h-4 w-[200px]" />
                        </div>
                     </div>
                     <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                        <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[250px]" />
                           <Skeleton className="h-4 w-[200px]" />
                        </div>
                     </div>
                     <div className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                        <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[250px]" />
                           <Skeleton className="h-4 w-[200px]" />
                        </div>
                     </div>
                  </div>
               ) : (
                  protocols.map((protocol) => {
                     const publishedAtFormatted = new Date(protocol.publishedAt).toLocaleDateString('ru-RU');
                     return <Card className="w-full px-6" key={protocol.id}>
                        <CardHeader className="p-0">
                           <div className="flex gap-3 items-center">
                              <div className="bg-red-pink p-3 rounded-md">
                                 <FileText size={24} color="white" />
                              </div>
                              <div>
                                 <CardTitle className="mb-1">{protocol.title}</CardTitle>
                                 <CardDescription className="text-gray-500 flex gap-1 items-center">
                                    <Calendar size={16} />{publishedAtFormatted}
                                 </CardDescription>
                              </div>
                           </div>
                        </CardHeader>
                        <div>
                           <p className="font-semibold text-sm">Документы:</p>
                           <MaterialMeetingCard name="Протокол заседания" size="245 КБ" />
                           <MaterialMeetingCard name="Утвержденный план работы" size="2.1 МБ" />
                           <MaterialMeetingCard name="Список участников" size="890 КБ" />
                        </div>
                     </Card>
                  })
               )}
            </section>
         </div>
      </main>
   )
}