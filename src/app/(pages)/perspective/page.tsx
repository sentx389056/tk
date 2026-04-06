"use client";

import PDFViewerProvision from "@/components/PDFViewerProvision";
import { useEffect, useState } from "react";

export default function PerspectivePage() {

   const activity = [
      {
         id: 1,
         fileUrl: "/api/files/perspective/Перспективная программа работы ТК по стандартизации.pdf",
      },
   ]

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10 relative">
            <span className="absolute top-0 right-0 text-left">Проект</span>
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">ПЕРСПЕКТИВНАЯ ПРОГРАММА<br />работы ТК «Кинематография» на 2026‒2029 гг.
               </h1>
               {/* <p className="text-center text-base font-light text-gray-700 max-w-180">Планы и проекты Технического комитета по стандартизации в области кинематографии</p> */}
            </div>
            <div className="flex flex-col sm:flex-row mt-16 gap-6">
               {activity.map(order => (
                  <PDFViewerProvision
                     key={order.id}
                     fileUrl={order.fileUrl}
                  />
               ))}
            </div>
         </div>
      </main>
   )
}