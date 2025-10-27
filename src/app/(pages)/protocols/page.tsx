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

export default function ProtocolsPage() {
   const [protocols, setProtocols] = useState<Protocol[]>([]);
   const [isloading, setLoading] = useState<boolean>(true);
   const [search, setSearch] = useState<string>('');
   const [filtered, setFiltered] = useState<Protocol[]>([]);

   useEffect(() => {
      const fetchProtocols = async () => {
         const res = await fetch('/api/protocols');
         if (!res.ok) {
            throw new Error('Failed to fetch protocols');
         }
         const data = await res.json();
         setProtocols(data);
            setFiltered(data);
         setLoading(false);
      }
      fetchProtocols();
   }, []);

   useEffect(() => {
      const t = setTimeout(() => {
         if (!search) {
            setFiltered(protocols);
            return;
         }

         const q = search.trim().toLowerCase();
         const result = protocols.filter((p) => p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
         setFiltered(result);
      }, 200);

      return () => clearTimeout(t);
   }, [search, protocols]);

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2">Протоколы</h1>
               <p className="text-center text-base font-light text-gray-700 max-w-180">Официальные протоколы заседаний Технического комитета по стандартизации</p>
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
                  filtered.map((protocol) => {
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
                     </Card>
                  })
               )}
            </section>
         </div>
      </main>
   )
}