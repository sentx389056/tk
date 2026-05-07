import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

const documents = [
    {
        id: 1,
        date: "26.02.2026",
        label: "Протокол 1-го заседания ТК 015 «Кинематография»",
        fileUrl: "/api/pdf-view/activity/26.02.2026 г.  Протокол 1го заседания ТК 015 Кинематография.pdf",
    },
    {
        id: 2,
        date: "22.04.2026",
        label: "Повестка 2-го заседания ТК 015 «Кинематография»",
        fileUrl: "/api/pdf-view/activity/Протокол 2-го заседания ТК 015 Кинематография.pdf",
    },
];

export default function ActivityPage() {
    return (
        <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">Деятельность</h1>
                </div>
                <div className="mt-16 flex flex-col gap-4">
                    {documents.map(doc => (
                        <Card key={doc.id} className="w-full px-6 hover:shadow-md transition-shadow">
                            <CardHeader className="p-0">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:flex shrink-0">
                                            <FileText size={32} color="#CC4E3A" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">{doc.date} г.</p>
                                            <CardTitle className="text-base font-semibold leading-snug">
                                                {doc.label}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0"
                                    >
                                        <Button className="bg-red-pink font-medium cursor-pointer" type="button">
                                            <ExternalLink size={16} />
                                            <span className="hidden sm:inline">Открыть</span>
                                        </Button>
                                    </a>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}