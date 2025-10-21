import Contacts from "@/components/Contacts";
import Map from "@/components/Map";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: 'Контакты | ТК "Кинематография"',
};

export default function ContactsPage() {
   return (
         <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
               <div className="flex flex-col items-center">
                  <h1 className="text-4xl font-bold text-center mb-2">Контакты</h1>
                  <p className="text-center text-base font-light text-gray-700 max-w-180">Свяжитесь с нами для получения информации или консультаций</p>
               </div>
               <div className="flex flex-col sm:flex-row mt-16 gap-6">
                     <Contacts />
                  <section className="w-full">
                     <Map />
                  </section>
               </div>
            </div>
         </main>
   )
}