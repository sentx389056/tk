
import MaterialMeetingCard from "@/components/MaterialMeetingCard";
import SearchInput from "@/components/SearchInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FlagTriangleRight, MapPin } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: 'Заседания | ТК "Кинематография"',
};

export default function MeetingsPage() {
   return (
         <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
               <div className="flex flex-col items-center">
                  <h1 className="text-4xl font-bold text-center mb-2">Заседания</h1>
                  <p className="text-center text-base font-light text-gray-700 max-w-180">Информация о проведенных и планируемых заседаниях Технического комитета</p>
               </div>
               <SearchInput />
               <section className="mt-8 gap-10 flex flex-col">
                  <Card className="w-full px-6">
                     <CardHeader className="p-0">
                        <div className="flex gap-3 items-center">
                           <div className="bg-red-pink p-3 rounded-md">
                              <Calendar size={24} color="white" />
                           </div>
                           <div>
                              <CardTitle className="mb-1">Заседание ТК 191 №1/2024</CardTitle>
                              <CardDescription className="text-gray-500 flex gap-1 items-center">
                                 <Calendar size={16} />15.02.2024
                              </CardDescription>
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent className="p-0 flex gap-80 max-sm:gap-15">
                        <CardDescription className="text-black font-semibold flex flex-col gap-2">
                           <p className="mb-1 flex items-center gap-2"><FlagTriangleRight size={16} />Формат</p>
                           <p className="text-gray-500 font-medium">Очно</p>
                        </CardDescription>
                        <CardDescription className="text-black font-semibold flex flex-col gap-2">
                           <p className="mb-1 flex items-center gap-2"><MapPin size={16} />Место</p>
                           <p className="text-gray-500 font-medium">Конференц-зал Госфильмофонда</p>
                        </CardDescription>
                     </CardContent>
                     <div>
                        <p className="font-semibold text-sm">Материалы заседания:</p>
                        <MaterialMeetingCard name="Повестка дня" size="245 КБ" />
                        <MaterialMeetingCard name="Презентация по цифровой кинематографии" size="2.1 МБ" />
                        <MaterialMeetingCard name="Протокол заседания" size="890 КБ" />
                     </div>
                  </Card>
                  <Card className="w-full px-6">
                     <CardHeader className="p-0">
                        <div className="flex gap-3 items-center">
                           <div className="bg-red-pink p-3 rounded-md">
                              <Calendar size={24} color="white" />
                           </div>
                           <div>
                              <CardTitle className="mb-1">Заседание ТК 191 №1/2024</CardTitle>
                              <CardDescription className="text-gray-500 flex gap-1 items-center">
                                 <Calendar size={16} />15.02.2024
                              </CardDescription>
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent className="p-0 flex gap-80 max-sm:gap-15">
                        <CardDescription className="text-black font-semibold flex flex-col gap-2">
                           <p className="mb-1 flex items-center gap-2"><FlagTriangleRight size={16} />Формат</p>
                           <p className="text-gray-500 font-medium">Очно</p>
                        </CardDescription>
                        <CardDescription className="text-black font-semibold flex flex-col gap-2">
                           <p className="mb-1 flex items-center gap-2"><MapPin size={16} />Место</p>
                           <p className="text-gray-500 font-medium">Конференц-зал Госфильмофонда</p>
                        </CardDescription>
                     </CardContent>
                     <div>
                        <p className="font-semibold text-sm">Материалы заседания:</p>
                        <MaterialMeetingCard name="Повестка дня" size="245 КБ" />
                        <MaterialMeetingCard name="Презентация по цифровой кинематографии" size="2.1 МБ" />
                        <MaterialMeetingCard name="Протокол заседания" size="890 КБ" />
                     </div>
                  </Card>
               </section>
            </div>
         </main>
   )
}