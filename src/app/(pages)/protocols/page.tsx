import MaterialMeetingCard from "@/components/MaterialMeetingCard";
import SearchInput from "@/components/SearchInput";
import { Card, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import { Calendar, FileText} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: 'Протоколы | ТК "Кинематография"',
};

export default function ProtocolsPage() {
   return (
         <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
               <div className="flex flex-col items-center">
                  <h1 className="text-4xl font-bold text-center mb-2">Протоколы</h1>
                  <p className="text-center text-base font-light text-gray-700 max-w-180">Официальные протоколы заседаний Технического комитета по стандартизации</p>
               </div>
               <SearchInput />
               <section className="mt-8 gap-10 flex flex-col">
                  <Card className="w-full px-6">
                     <CardHeader className="p-0">
                        <div className="flex gap-3 items-center">
                           <div className="bg-red-pink p-3 rounded-md">
                              <FileText size={24} color="white" />
                           </div>
                           <div>
                              <CardTitle className="mb-1">Протокол заседания ТК 191 №1/2024</CardTitle>
                              <CardDescription className="text-gray-500 flex gap-1 items-center">
                                 <Calendar size={16} />15.02.2024
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
                  <Card className="w-full px-6">
                     <CardHeader className="p-0">
                        <div className="flex gap-3 items-center">
                           <div className="bg-red-pink p-3 rounded-md">
                              <FileText size={24} color="white" />
                           </div>
                           <div>
                              <CardTitle className="mb-1">Протокол заседания ТК 191 №1/2024</CardTitle>
                              <CardDescription className="text-gray-500 flex gap-1 items-center">
                                 <Calendar size={16} />15.02.2024
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
               </section>
            </div>
         </main>
   )
}