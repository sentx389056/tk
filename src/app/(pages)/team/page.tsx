'use client';

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamPage() {

    interface teamMembers {
        id: number;
        orgName: string;
        contactsInfo: string;
    }

    type PaginatedResponse = {
        teamMembers: teamMembers[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };

    const [teamMember, setTeamMember] = useState<teamMembers[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchTeamMember = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString()
            });
            const res = await fetch(`/api/team?${params}`);

            if (!res.ok) {
                throw new Error('Failed to fetch team');
            }

            const data: PaginatedResponse = await res.json();

            setTeamMember(data.teamMembers);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching team:', error);
            // Fallback to mock data if API fails
            await new Promise(resolve => setTimeout(resolve, 500));
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedNews = teamMember.slice(startIndex, endIndex);
            setTeamMember(paginatedNews);
            setTotal(teamMember.length);
            setTotalPages(Math.ceil(teamMember.length / pageSize));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMember();
    }, [page]);

    return (
        <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">
                        СОСТАВ<br />технического комитета по стандартизации<br />&quot;Кинематография&quot;
                    </h1>
                </div>
                <section className="w-full mt-6 text-[9px] sm:text-[10px] md:text-xs">
                    <div className="overflow-x-auto border border-gray-200 rounded-md">
                        <table className="w-full min-w-[720px] table-fixed border border-gray-300 border-collapse text-gray-900">

                            <colgroup>
                                <col className="w-12" />
                                <col className="w-[45%]" />
                                <col className="w-[45%]" />
                            </colgroup>
                            <thead className="bg-[#F2F4F7] text-[8px] sm:text-[8px] md:text-[10px] tracking-wide text-gray-700">

                                <tr>
                                    <th className="px-3 py-3 text-center align-middle border border-gray-300 text-sm">№ п/п</th>
                                    <th className="px-3 py-3 text-center align-middle border border-gray-300 text-sm">Наименование организации</th>
                                    <th className="px-3 py-3 text-center align-middle border border-gray-300 text-sm">Контактные данные организации</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    // Skeleton loading states
                                    Array.from({ length: pageSize }).map((_, index) => (
                                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="px-3 py-3 text-center align-top border border-gray-300 text-sm">
                                                <Skeleton className="h-4 w-4 mx-auto" />
                                            </td>
                                            <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words text-sm">
                                                <Skeleton className="h-4 w-full" />
                                            </td>
                                            <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words text-sm">
                                                <Skeleton className="h-4 w-full" />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    teamMember.map((member, index) => (
                                        <tr key={member.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="px-3 py-3 text-center align-top border border-gray-300 text-sm">{member.id}</td>
                                            <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words text-sm">{member.orgName}</td>
                                            <td className="px-3 py-3 align-top border border-gray-300 leading-snug break-words text-sm">{member.contactsInfo}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
}