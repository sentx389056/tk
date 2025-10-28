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
   fileUrl?: any;
   attachments?: any;
}

type PaginatedResponse = {
   protocols: Protocol[];
   total: number;
   page: number;
   pageSize: number;
   totalPages: number;
};

export default function ProtocolsPage() {

   const [protocols, setProtocols] = useState<Protocol[]>([]);
   const [isloading, setLoading] = useState<boolean>(true);
   const [search, setSearch] = useState<string>('');
   const [page, setPage] = useState(1);
   const [pageSize] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [total, setTotal] = useState(0);

   const fetchProtocols = async () => {
      setLoading(true);
      try {
         const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
         });
         
         if (search) {
            params.append('search', search);
         }

         const res = await fetch(`/api/protocols?${params}`);
         if (!res.ok) {
            throw new Error('Failed to fetch protocols');
         }
         const data: PaginatedResponse = await res.json();
         setProtocols(data.protocols);
         setTotal(data.total);
         setTotalPages(data.totalPages);
      } catch (error) {
         console.error('Error:', error);
         setProtocols([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      const timer = setTimeout(() => {
         fetchProtocols();
      }, 350);

      return () => clearTimeout(timer);
   }, [page, search]);

   // reset to first page when search changes
   useEffect(() => {
      setPage(1);
   }, [search]);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Протоколы</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Официальные протоколы заседаний Технического комитета по стандартизации</p>
            </div>
            <SearchInput value={search} onChange={setSearch} count={total} />
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
               ) : protocols.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                     Протоколы не найдены
                  </div>
               ) : (
                  <div className="flex flex-col gap-10">
                     {protocols.map((protocol) => {
                        const publishedAtFormatted = new Date(protocol.publishedAt).toLocaleDateString('ru-RU');
                        return (
                           <Card className="w-full px-6" key={protocol.id}>
                              <CardHeader className="p-0">
                                 <div className="flex gap-3 items-center">
                              <div className="bg-red-pink p-3 rounded-md">
                                 <FileText size={24} color="white" />
                              </div>
                              <div>
                                 <CardTitle className="mb-1">{protocol.title}</CardTitle>
                                 {(publishedAtFormatted) && (
                                    <CardDescription className="text-gray-500 flex gap-1 items-center">
                                       <Calendar size={16} />{publishedAtFormatted}
                                    </CardDescription>
                                 )}
                              </div>
                           </div>
                        </CardHeader>
                        {(protocol.attachments.length > 0) && (
                           <div>
                              <p className="font-semibold text-sm">Документы:</p>
                              {(() => {
                                 try {
                                    const raw = protocol.attachments ?? protocol.fileUrl;
                                    if (!raw) return <MaterialMeetingCard name="Без файлов" size="—" />;

                                    // Try to parse if it's a JSON string
                                    let parsed = raw;
                                    if (typeof raw === 'string') {
                                       const trimmed = raw.trim();
                                       if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                                          parsed = JSON.parse(trimmed);
                                       }
                                    }

                                    // If parsed is an array of attachments
                                    if (Array.isArray(parsed) && parsed.length > 0) {
                                       return parsed.map((att: any, idx: number) => (
                                          <MaterialMeetingCard key={idx} name={att.fileName || `Файл ${idx + 1}`} size={att.fileSize || '—'} fileUrl={att.fileUrl} />
                                       ));
                                    }

                                    // If parsed is object with fileUrl
                                    if (parsed && typeof parsed === 'object' && parsed.fileUrl) {
                                       return <MaterialMeetingCard name={parsed.fileName || 'Файл'} size={parsed.fileSize || '—'} fileUrl={parsed.fileUrl} />;
                                    }

                                    // If parsed is a plain string URL
                                    if (typeof parsed === 'string') {
                                       return <MaterialMeetingCard name={parsed.split('/').pop() || 'Файл'} size={'—'} fileUrl={parsed} />;
                                    }

                                    return <MaterialMeetingCard name="Без файлов" size="—" />;
                                 } catch (e) {
                                    return <MaterialMeetingCard name="Без файлов" size="—" />;
                                 }
                              })()}
                           </div>
                        )}
                     </Card>
                        );
                     })}
                     
                     {/* Pagination controls */}
                     {protocols.length > 0 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                           <div className="text-sm text-gray-500">Страница {page} из {totalPages}</div>
                           <div className="flex gap-2">
                              <button
                                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => setPage(p => Math.max(1, p - 1))}
                                 disabled={page <= 1 || isloading}
                              >
                                 Предыдущая
                              </button>
                              <button
                                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                 onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                 disabled={page >= totalPages || isloading}
                              >
                                 Следующая
                              </button>
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