'use client';

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PDFViewerProvision from "@/components/PDFViewerProvision";

export default function TeamPage() {

    const team = [
      {
         id: 1,
         fileUrl: "/api/files/team/Состав ТК 015.pdf",
      },
   ]

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

    const fetchTeamMember = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/team?pageSize=1000');

            if (!res.ok) {
                throw new Error('Failed to fetch team');
            }

            const data = await res.json();

            // Handle both paginated response and direct array response
            if (Array.isArray(data.teamMembers)) {
                setTeamMember(data.teamMembers);
            } else if (Array.isArray(data.teamMember)) {
                setTeamMember(data.teamMember);
            } else if (Array.isArray(data)) {
                setTeamMember(data);
            } else {
                setTeamMember([]);
            }
        } catch (error) {
            console.error('Error fetching team:', error);
            setTeamMember([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMember();
    }, []);

    return (
        <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">
                        СОСТАВ<br />технического комитета по стандартизации № 015<br />&quot;Кинематография&quot;
                    </h1>
                </div>
                <section className="w-full mt-6 text-[9px] sm:text-[10px] md:text-xs">
                    {team.map(t => (
                        <PDFViewerProvision
                            key={t.id}
                            fileUrl={t.fileUrl}
                        />
                    ))}
                </section>
            </div>
        </main>
    );
}
