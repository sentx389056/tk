"use client";
import ProvisionCard from "@/components/ProvisionCard";
import SearchInput from "@/components/SearchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import MarkdownRenderer from "@/components/markdownRenderer";
import PDFViewer from "@/components/PDFViewer";
import PDFViewerProvision from "@/components/PDFViewerProvision";
import PDFViewerApplications from "@/components/PDFViewerApplications";

export default function ProvisionsPage() {
   const orders = [
      {
         id: 1,
         fileUrl: "/api/files/orders/Приложение 1.pdf",
      },
   ]

   const applications = [
      {
         id: 1,
         fileUrl: "/api/files/orders/Приложение 2. Приложение 1.pdf",
         title: "Приложение 1"
      },
      {
         id: 2,
         fileUrl: "/api/files/orders/Приложение 3. Приложение 2.pdf",
         title: "Приложение 2"
      },
      {
         id: 3,
         fileUrl: "/api/files/orders/Приложение 4. Приложение 3.pdf",
         title: "Приложение 3"
      },

   ]

   return (
      <main className="flex flex-col w-full px-5 xl:px-40 py-10">
         <div className="py-10 relative">
            <div className="flex flex-col items-center">
               <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">ПРИКАЗ <br />О СОЗДАНИИ ТЕХНИЧЕСКОГО КОМИТЕТА<br />ПО СТАНДАРТИЗАЦИИ</h1>
               <p className="text-center mt-5 mb-5 text-3xl font-medium">&quot;Кинематография&quot;</p>
            </div>
            {orders.map(order => (
               <PDFViewerProvision
                  key={order.id}
                  fileUrl={order.fileUrl}
               />
            ))}
            <div className="mt-12">
               <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">Приложения к приказу</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {applications.map(application => (
                     <PDFViewerApplications
                        key={application.id}
                        fileUrl={application.fileUrl}
                        title={application.title}
                     />
                  ))}
               </div>
            </div>
            {/* <section className="mt-8 flex flex-col gap-10">
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
                  </div>
               ) : (
                  <>
                     <div className="flex flex-col gap-10">
                        {provisions.length === 0 ? (
                           <div className="text-center py-8 text-gray-500">
                              Положения не найдены
                           </div>
                        ) : (
                           <>
                              {provisions.map((provision: Provision) => (
                                 <ProvisionCard
                                    key={provision.id}
                                    title={provision.title}
                                    description={provision.description}
                                    approvedAt={new Date(provision.approvedAt)}
                                    organization={provision.organization}
                                    fileUrl={provision.fileUrl}
                                 />
                              ))}

                              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                 <div className="text-sm text-gray-500">
                                    Страница {page} из {totalPages}
                                 </div>
                                 <div className="flex gap-2">
                                    <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => setPage(p => Math.max(1, p - 1))}
                                       disabled={page <= 1 || isLoading}
                                    >
                                       Предыдущая
                                    </Button>
                                    <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                       disabled={page >= totalPages || isLoading}
                                    >
                                       Следующая
                                    </Button>
                                 </div>
                              </div>
                           </>
                        )}
                     </div>
                  </>
               )}
            </section> */}

         </div>
      </main>
   )
}
