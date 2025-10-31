"use client";
import MaterialMeetingCard from "@/components/MaterialMeetingCard";
import SearchInput from "@/components/SearchInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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

type PaginatedMeetings = {
   meetings: Meeting[];
   total: number;
   page: number;
   pageSize: number;
   totalPages: number;
}

export default function MeetingsPage() {
   const [meetings, setMeetings] = useState<Meeting[]>([]);
   const [isloading, setLoading] = useState<boolean>(true);
   const [search, setSearch] = useState<string>('');
   const [page, setPage] = useState(1);
   const [pageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [total, setTotal] = useState(0);

   useEffect(() => {
      const fetchMeetings = async () => {
         setLoading(true);
         try {
            const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
            if (search) params.append('search', search);
            const res = await fetch(`/api/meetings?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch meetings');
            const data: PaginatedMeetings = await res.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (Array.isArray((data as any).meetings)) {
               setMeetings(data.meetings);
               setTotal(data.total || 0);
               setTotalPages(data.totalPages || 1);
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } else if (Array.isArray(data as any)) {
               // fallback if API returns array
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               setMeetings(data as any);
            } else {
               setMeetings([]);
            }
         } catch (err) {
            console.error('Failed to fetch meetings:', err);
            setMeetings([]);
         } finally {
            setLoading(false);
         }
      }

      // debounce to avoid spamming API on typing
      const t = setTimeout(() => {
         fetchMeetings();
      }, 350);

      return () => clearTimeout(t);
   }, [page, search]);

   // reset to first page when the search query changes
   useEffect(() => {
      setPage(1);
   }, [search]);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Заседания</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Информация о проведенных и планируемых заседаниях Технического комитета</p>
            </div>
            <SearchInput value={search} onChange={setSearch} count={total} />
            <section className="mt-8 gap-10 flex flex-col">
               {isloading ? (
                  <div className="flex flex-col gap-10">
                     {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3 border-1 rounded-xl p-5">
                           <Skeleton className="h-5 w-xl rounded-xl max-sm:w-xs" />
                           <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                           </div>
                        </div>
                     ))}
                  </div>
               ) : meetings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                     Заседания не найдены
                  </div>
               ) : (
                  <div className="flex flex-col gap-10">
                     {meetings.map((meeting: Meeting) => {
                        const publishedAtFormatted = new Date(meeting.publishedAt).toLocaleDateString('ru-RU');
                        return (
                           <Card className="w-full px-6" key={meeting.id}>
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
                                          <MaterialMeetingCard key={idx} name={att.fileName.length > 20 ? att.fileName.slice(0, 20) + '...' : att.fileName || `Файл ${idx + 1}`} size={'—'} fileUrl={att.fileUrl} />
                                       ))
                                    ) : (
                                       <MaterialMeetingCard name="Повестка дня" size="245 КБ" />
                                    )}
                                 </div>
                              )}
                           </Card>
                        );
                     })}

                     {/* Pagination controls */}
                     {meetings.length > 0 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                           <div className="text-sm text-gray-500">Страница {page} из {totalPages}</div>
                           <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1 || isloading}>
                                 Предыдущая
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages || isloading}>
                                 Следующая
                              </Button>
                           </div>
                        </div>
                     )}
                  </div>
               )}
            </section>
         </div>
      </main>
   );
}