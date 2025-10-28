"use client";
import MaterialMeetingCard from "@/components/MaterialMeetingCard";
import SearchInput from "@/components/SearchInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, FlagTriangleRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

type Meeting = {
   id: number;
   title: string;
   location: string;
   format: string;
   publishedAt: Date;
   attachments: { fileName: string; fileUrl: string }[];
}

export default function MeetingsPage() {
   const [meetings, setMeetings] = useState<Meeting[]>([]);
   const [isloading, setLoading] = useState<boolean>(true);
   const [search, setSearch] = useState<string>('');
   const [filtered, setFiltered] = useState<Meeting[]>([]);

   useEffect(() => {
      const fetchMeetings = async () => {
         const res = await fetch('/api/meetings');
         if (!res.ok) {
            throw new Error('Failed to fetch meetings');
         }
         const data = await res.json();
         setMeetings(data);
         setFiltered(data);
         setLoading(false);
      }
      fetchMeetings();
   }, []);

   useEffect(() => {
      const t = setTimeout(() => {
         if (!search) {
            setFiltered(meetings);
            return;
         }

         const q = search.trim().toLowerCase();
         const result = meetings.filter((m) => m.title.toLowerCase().includes(q) || m.location.toLowerCase().includes(q));
         setFiltered(result);
      }, 200);

      return () => clearTimeout(t);
   }, [search, meetings]);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Заседания</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Информация о проведенных и планируемых заседаниях Технического комитета</p>
            </div>
            <SearchInput value={search} onChange={setSearch} count={filtered.length} />
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
                  filtered.map((meeting) => {
                     const publishedAtFormatted = new Date(meeting.publishedAt).toLocaleDateString('ru-RU');
                     return <Card className="w-full px-6" key={meeting.id}>
                        <CardHeader className="p-0">
                           <div className="flex gap-3 items-center">
                              <div className="bg-red-pink p-3 rounded-md">
                                 <Calendar size={24} color="white" />
                              </div>
                              <div>
                                 <CardTitle className="mb-1">{meeting.title}</CardTitle>
                                 {(publishedAtFormatted) && (
                                    <CardDescription className="text-gray-500 flex gap-1 items-center">
                                       <Calendar size={16} />{publishedAtFormatted}
                                    </CardDescription>
                                 )}
                              </div>
                           </div>
                        </CardHeader>
                        <CardContent className="p-0 flex gap-80 max-sm:gap-15">
                           {(meeting.format) && (
                              <CardDescription className="text-black font-semibold flex flex-col gap-2">
                                 <p className="mb-1 flex items-center gap-2"><FlagTriangleRight size={16} />Формат</p>
                                 <p className="text-gray-500 font-medium">{meeting.format}</p>
                              </CardDescription>
                           )}
                           {(meeting.location) && (
                              <CardDescription className="text-black font-semibold flex flex-col gap-2">
                                 <p className="mb-1 flex items-center gap-2"><MapPin size={16} />Место</p>
                                 <p className="text-gray-500 font-medium">{meeting.location}</p>
                              </CardDescription>
                           )}
                        </CardContent>
                        {(meeting.attachments && meeting.attachments.length > 0) && (
                           <div>
                              <p className="font-semibold text-sm">Материалы заседания:</p>
                              {Array.isArray(meeting.attachments) && meeting.attachments.length > 0 ? (
                                 meeting.attachments.map((att, idx) => (
                                    <MaterialMeetingCard key={idx} name={att.fileName || `Файл ${idx + 1}`} size={'—'} fileUrl={att.fileUrl} />
                                 ))
                              ) : (
                                 <MaterialMeetingCard name="Повестка дня" size="245 КБ" />
                              )}
                           </div>
                        )}
                     </Card>
                  })
               )
               }



            </section>
         </div>
      </main>
   )
}