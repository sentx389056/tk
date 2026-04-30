'use client';

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PDFViewerProvision from "@/components/PDFViewerProvision";
import { FileText } from "lucide-react";

export default function ProvisionsPage() {
    const [activeTab, setActiveTab] = useState("");

    const tabDocuments = [
        {
            id: "structure",
            label: "Структура ТК 015",
            fileUrl: "/api/files/team/Структура ТК 015.pdf",
        },
        {
            id: "composition",
            label: "Состав ТК 015",
            fileUrl: "/api/files/team/Состав ТК 015.pdf",
        },
        {
            id: "provision",
            label: "Положение о ТК 015",
            fileUrl: "/api/files/team/Положение о ТК 015.pdf",
        },
    ];

    const orderDocuments = [
        {
            id: 1,
            title: 'Приказ Росстандарта от 28.11.2025 г. № 2602 «О создании технического комитета по стандартизации «Кинематография»',
            fileUrl: "/api/files/team/Приказ Росстандарта от 28.11.2025 г. № 2602 «О создании технического комитета по стандартизации «Кинематография».pdf",
        },
        {
            id: 2,
            title: 'Приказ Росстандарта от 20.04.2026 г. № 773 «О внесении изменений в состав технического комитета по стандартизации, утвержденный приказом Федерального агентства по техническому регулированию и метрологии от 28 ноября 2025 г. № 2602»',
            fileUrl: "/api/files/team/Приказ Росстандарта от 20.04.2026 г.№ 773 «О внесении изменении в состав технического комитета ...».pdf",
        },
    ];

    return (
        <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">
                        ПРИКАЗ<br />О СОЗДАНИИ ТЕХНИЧЕСКОГО КОМИТЕТА<br />ПО СТАНДАРТИЗАЦИИ
                    </h1>
                    <p className="text-center mt-5 mb-8 text-3xl font-medium">&quot;Кинематография&quot;</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-8">
                        {tabDocuments.map((doc) => (
                            <TabsTrigger
                                key={doc.id}
                                value={doc.id}
                                className="cursor-pointer hover:bg-gray-200 hover:text-gray-900 hover:shadow-sm transition-all duration-150"
                            >
                                {doc.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {tabDocuments.map((doc) => (
                        <TabsContent key={doc.id} value={doc.id} className="mt-6">
                            {activeTab === doc.id && <PDFViewerProvision fileUrl={doc.fileUrl} />}
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="mt-12 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
                        Документы о создании ТК
                    </h2>
                    <div className="flex flex-col gap-4">
                        {orderDocuments.map((doc) => (
                            <a
                                key={doc.id}
                                href={doc.fileUrl.replace('/api/files/', '/api/pdf-view/')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
                            >
                                <div className="shrink-0 w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                    <FileText className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium group-hover:text-blue-700 transition-colors">
                                        {doc.title}
                                    </p>
                                </div>
                                <div className="shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                        <polyline points="15 3 21 3 21 9"/>
                                        <line x1="10" y1="14" x2="21" y2="3"/>
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
