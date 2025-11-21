'use client'
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlanDocument() {
    const [markdown, setMarkdown] = useState<string | null>(null);

    useEffect(() => {
        fetch("/content/provisions.md")
            .then((res) => (res.ok ? res.text() : Promise.reject()))
            .then(setMarkdown)
            .catch(() => setMarkdown(""));
    }, []);

    // Скелетон — имитирует A4
    if (markdown === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-8 pb-20 px-4">
                <div className="w-full max-w-5xl space-y-5">
                    <Skeleton className="h-12 w-96 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-4 w-10/12" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        );
    }

    if (!markdown) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-8 pb-20 px-4">
            {/* Контейнер = ширина A4 при печати ≈ 210 мм ≈ 794px */}
            <article className="w-full max-w-6xl bg-white shadow-lg ring-1 ring-black/5">
                <div className="px-12 py-16">
                    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-strong:font-semibold">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                                // Таблицы как в официальных документах
                                table: ({ children }) => (
                                    <div className="overflow-x-auto my-8 -mx-12">
                                        <table className="min-w-full border-2 border-gray-400">
                                            {children}
                                        </table>
                                    </div>
                                ),
                                th: ({ children }) => (
                                    <th className="border border-gray-400 bg-gray-100 px-4 py-3 text-left font-bold text-sm">
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className="border border-gray-400 px-4 py-4 text-sm align-top">
                                        {children}
                                    </td>
                                ),
                            }}
                        >
                            {markdown}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>
        </div>
    );
}