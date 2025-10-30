"use client";
import MainTask from "@/components/MainTask";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Download, FileText, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

type Report = {
   id: number;
   title: string;
   publishedAt: Date;
   keyAchievements: string;
   fileUrl?: string;
};

export default function ReportsPage() {
   const [reports, setReports] = useState<Report[]>([]);
   const [isLoading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchReports = async () => {
         const res = await fetch('/api/reports');
         if (!res.ok) {
            throw new Error('Failed to fetch reports');
         }
         const data = await res.json();
         setReports(data);
         setLoading(false);
      };
      fetchReports();
   }, [])

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

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const resolveAttachments = (raw: any) => {
      if (!raw) return [] as { fileUrl: string; fileName?: string }[];
      try {
         if (typeof raw === 'string') {
            const trimmed = raw.trim();
            if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
               const parsed = JSON.parse(trimmed);
               if (Array.isArray(parsed)) return parsed;
               if (parsed && parsed.fileUrl) return [parsed];
            }
            // plain url
            return [{ fileUrl: trimmed, fileName: getFileNameFromUrl(trimmed) }];
         }

         if (Array.isArray(raw)) return raw;

         if (raw && typeof raw === 'object' && raw.fileUrl) return [raw];
      } catch (e) {
         return [];
      }
      return [] as { fileUrl: string; fileName?: string }[];
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const handleDownload = async (raw: any) => {
      const at = resolveAttachments(raw);
      if (!at.length) return;

      // try to download each file; if cross-origin prevents download attribute, fallback to open in new tab
      for (const a of at) {
         try {
            const url = a.fileUrl;
            const name = a.fileName || getFileNameFromUrl(url);
            const el = document.createElement('a');
            el.href = url;
            el.download = name;
            el.target = '_blank';
            document.body.appendChild(el);
            el.click();
            el.remove();
         } catch (err) {
            window.open(a.fileUrl, '_blank');
         }
      }
   }

   return (
      <main>
         <div className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
               <div className="flex flex-col items-center">
                  <h1 className="text-4xl font-bold text-center mb-2">Годовые отчеты</h1>
                  <p className="text-center text-base font-light text-gray-700 max-w-180">Ежегодные отчеты о деятельности Технического комитета по стандартизации</p>
               </div>
               <section className="mt-8 gap-10 flex flex-col">
                  {isLoading ? (
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
                     reports.map((report) => {
                        const publishedAtFormatted = new Date(report.publishedAt).toLocaleDateString('ru-RU');
                        const achievements = (() => {
                           const s = report.keyAchievements;
                           if (!s) return [] as string[];
                           try {
                              const parsed = JSON.parse(s);
                              return Array.isArray(parsed) ? parsed : [String(parsed)];
                           } catch (e) {
                              // Not valid JSON — fallback to splitting by newlines or return raw string
                              const parts = String(s).split(/\r?\n/).map(p => p.trim()).filter(Boolean);
                              return parts.length ? parts : [String(s)];
                           }
                        })();
                        return <Card className="w-full px-6" key={report.id}>
                           <CardHeader className="p-0">
                              <div className="flex gap-3 items-center">
                                 <div className="bg-red-pink p-3 rounded-md">
                                    <FileText size={24} color="white" />
                                 </div>
                                 <div>
                                    <CardTitle className="mb-1">{report.title}</CardTitle>
                                    {(publishedAtFormatted) && (
                                       <CardDescription className="text-gray-500 flex gap-1 items-center">
                                          <Calendar size={16} />{publishedAtFormatted}
                                       </CardDescription>
                                    )}
                                 </div>
                              </div>
                              <CardAction>
                                 <Button type="button" onClick={() => handleDownload(report.fileUrl)} className="w-full bg-red-pink font-medium cursor-pointer" disabled={!report.fileUrl}><Download size={16} /><span className="hidden sm:flex">Скачать отчет</span></Button>
                              </CardAction>

                           </CardHeader>
                           {(achievements.length > 0) && (
                              <div>
                                 <p className="font-semibold text-sm flex gap-2 mb-3"><TrendingUp size={20} color="#16A34A" />Основные достижения:</p>
                                 <MainTask tasks={
                                    achievements
                                 } />
                              </div>
                           )}
                        </Card>
                     })
                  )}
               </section>
            </div>
         </div>

         <section className="w-full bg-gray-200 px-5 xl:px-40 py-9 grid grid-cols-1 xl:grid-cols-2 gap-8 mb-0 h-auto">
            <div className="p-8 bg-white rounded-md">
               <h2 className="font-bold text-lg mb-4">Структура отчетов</h2>
               <MainTask tasks={
                  [
                     "Анализ выполнения плана работы",
                     "Статистика разработки стандартов",
                     "Международная деятельность",
                     "Финансовые показатели"
                  ]
               } />
            </div>
            <div className="p-8 bg-white rounded-md">
               <h2 className="font-bold text-lg mb-4">Публикация отчетов</h2>
               <MainTask tasks={
                  [
                     "Ежегодная публикация до 31 марта",
                     "Открытый доступ для всех заинтересованных лиц",
                     "Утверждение на заседании ТК",
                     "Архивное хранение всех отчетов"
                  ]
               } />
            </div>
         </section>
      </main>
   )
}