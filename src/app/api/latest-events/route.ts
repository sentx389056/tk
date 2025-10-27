import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch latest items from each type
        const [standards, protocols, meetings, reports, provisions, projects] = await Promise.all([
            prisma.standardFund.findMany({
                orderBy: { createdAt: 'desc' },
                take: 3,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                }
            }),
            prisma.protocol.findMany({
                orderBy: { createdAt: 'desc' },
                take: 3,
                select: {
                    id: true,
                    title: true,
                    attachments: true,
                    createdAt: true,
                }
            }),
            prisma.meeting.findMany({
                orderBy: { createdAt: 'desc' },
                take: 3,
                select: {
                    id: true,
                    title: true,
                    location: true,
                    createdAt: true,
                }
            }),
            prisma.annualReport.findMany({
                orderBy: { createdAt: 'desc' },
                take: 3,
                select: {
                    id: true,
                    title: true,
                    keyAchievements: true,
                    createdAt: true,
                }
            }),
            prisma.technicalCommitteeRegulation.findMany({
                orderBy: { createdAt: 'desc' },
                take: 3,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                }
            }),
            prisma.standardProject.findMany({
                orderBy: { createdAt: 'desc' },
                take: 3,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                }
            })
        ]);

        // Combine all items with type annotation in the transformation
        const allEvents = [
            ...standards.map(s => ({
                ...s,
                type: 'standard' as const,
                description: s.description || 'Добавлен новый стандарт',
            })),
            ...protocols.map(p => ({
                ...p,
                type: 'protocol' as const,
                description: 'Опубликован новый протокол заседания',
            })),
            ...meetings.map(m => ({
                ...m,
                type: 'meeting' as const,
                description: `Место проведения: ${m.location}`,
            })),
            ...reports.map(r => ({
                ...r,
                type: 'report' as const,
                description: r.keyAchievements || 'Опубликован годовой отчёт',
            })),
            ...provisions.map(p => ({
                ...p,
                type: 'regulation' as const,
                description: p.description || 'Добавлено новое положение',
            })),
            ...projects.map(p => ({
                ...p,
                type: 'project' as const,
                description: p.description || 'Добавлен новый проект',
            }))
        ];

        // Sort by createdAt and take latest 3
        const latestEvents = allEvents
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 3)
            .map(event => ({
                ...event,
                createdAt: event.createdAt.toISOString(),
            }));

        return NextResponse.json(latestEvents);
    } catch (error) {
        console.error('Error fetching latest events:', error);
        return NextResponse.json({ error: 'Failed to fetch latest events' }, { status: 500 });
    }
}