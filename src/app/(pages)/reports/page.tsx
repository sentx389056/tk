import MainTask from "@/components/MainTask";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Calendar, Download, FileText, TrendingUp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: 'Годовые отчеты | ТК "Кинематография"',
};

export default function ReportsPage() {
   return (
      <main>
         <div className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
               <div className="flex flex-col items-center">
                  <h1 className="text-4xl font-bold text-center mb-2">Годовые отчеты</h1>
                  <p className="text-center text-base font-light text-gray-700 max-w-180">Ежегодные отчеты о деятельности Технического комитета по стандартизации</p>
               </div>
               <section className="mt-8 gap-10 flex flex-col">
                  <Card className="w-full px-6">
                     <CardHeader className="p-0">
                        <div className="flex gap-3 items-center">
                           <div className="bg-red-pink p-3 rounded-md">
                              <FileText size={24} color="white" />
                           </div>
                           <div>
                              <CardTitle className="mb-1">Заседание ТК 191 №1/2024</CardTitle>
                              <CardDescription className="text-gray-500 flex gap-1 items-center">
                                 <Calendar size={16} />15.02.2024
                              </CardDescription>
                           </div>
                        </div>
                        <CardAction>
                           <Button type="submit" className="w-full bg-red-pink font-medium cursor-pointer"><Download size={16} /><span className="hidden sm:flex">Скачать отчет</span></Button>
                        </CardAction>
                        
                     </CardHeader>
                     <div>
                        <p className="font-semibold text-sm flex gap-2 mb-3"><TrendingUp size={20} color="#16A34A" />Основные достижения:</p>
                        <MainTask tasks={
                           [
                              "Утверждены 3 новых национальных стандарта в области цифровой кинематографии",
                              "Проведено 4 заседания ТК с участием 156 экспертов",
                              "Установлено сотрудничество с 5 международными организациями",
                              "Запущена программа цифровизации архивных стандартов"
                           ]
                        } />
                     </div>
                  </Card>
                  <Card className="w-full px-6">
                     <CardHeader className="p-0">
                        <div className="flex gap-3 items-center">
                           <div className="bg-red-pink p-3 rounded-md">
                              <FileText size={24} color="white" />
                           </div>
                           <div>
                              <CardTitle className="mb-1">Заседание ТК 191 №1/2024</CardTitle>
                              <CardDescription className="text-gray-500 flex gap-1 items-center">
                                 <Calendar size={16} />15.02.2024
                              </CardDescription>
                           </div>
                        </div>
                        <CardAction>
                            <Button type="submit" className="w-full bg-red-pink font-medium cursor-pointer"><Download size={16} /><span className="hidden sm:flex">Скачать отчет</span></Button>
                        </CardAction>
                     </CardHeader>
                     <div>
                        <p className="font-semibold text-sm flex gap-2 mb-3"><TrendingUp size={20} color="#16A34A" />Основные достижения:</p>
                        <MainTask tasks={
                           [
                              "Утверждены 3 новых национальных стандарта в области цифровой кинематографии",
                              "Проведено 4 заседания ТК с участием 156 экспертов",
                              "Установлено сотрудничество с 5 международными организациями",
                              "Запущена программа цифровизации архивных стандартов"
                           ]
                        } />
                     </div>
                  </Card>
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