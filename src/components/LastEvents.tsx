/* import { prisma } from '@/lib/prisma';
import { TrendingUp } from 'lucide-react';

interface DbEvent {
    id: number;
    title: string;
    description?: string;
    createdAt: Date;
}

interface DbMeeting extends DbEvent {
    location?: string;
}

interface DbReport extends DbEvent {
    keyAchievements?: string;
}

interface FormattedEvent {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    type: 'standard' | 'protocol' | 'meeting' | 'report' | 'regulation' | 'project';
}

export default async function LastEvents() {
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
            }) as Promise<DbMeeting[]>,
            prisma.annualReport.findMany({
                orderBy: { createdAt: 'desc' },
                take: 3,
                select: {
                    id: true,
                    title: true,
                    keyAchievements: true,
                    createdAt: true,
                }
            }) as Promise<DbReport[]>,
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

        const events = [
            ...standards.map(s => ({
                id: s.id,
                title: s.title,
                type: 'standard' as const,
                description: s.description || 'Добавлен новый стандарт',
                createdAt: s.createdAt
            })),
            ...protocols.map(p => ({
                id: p.id,
                title: p.title,
                type: 'protocol' as const,
                description: 'Опубликован новый протокол заседания',
                createdAt: p.createdAt
            })),
            ...meetings.map(m => ({
                id: m.id,
                title: m.title,
                type: 'meeting' as const,
                description: `Место проведения: ${m.location || 'Не указано'}`,
                createdAt: m.createdAt
            })),
            ...reports.map(r => ({
                id: r.id,
                title: r.title,
                type: 'report' as const,
                description: r.keyAchievements || 'Опубликован годовой отчёт',
                createdAt: r.createdAt
            })),
            ...provisions.map(p => ({
                id: p.id,
                title: p.title,
                type: 'regulation' as const,
                description: p.description || 'Добавлено новое положение',
                createdAt: p.createdAt
            })),
            ...projects.map(p => ({
                id: p.id,
                title: p.title,
                type: 'project' as const,
                description: p.description || 'Добавлен новый проект',
                createdAt: p.createdAt
            }))
        ];

        const latestEvents = events
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 3)
            .map(event => ({
                ...event,
                createdAt: event.createdAt.toISOString()
            })) as FormattedEvent[];

        if (!latestEvents?.length) {
            return null;
        }

        return (
            <div className="mb-8">
                <div className="flex gap-3">
                    <TrendingUp size={32} color="#16A34A" />
                    <h2 className="text-2xl font-bold mb-4">Последние события</h2>
                </div>

                <ul className="space-y-6">
                    {latestEvents.map((event: FormattedEvent) => (
                        <li key={event.id} className="pl-4 border-l-3 border-red-pink">
                            <h3 className="mb-1 font-semibold">{event.title}</h3>
                            <p className="text-gray-500 text-sm mb-2">{event.description}</p>
                            <p className="text-gray-500 text-xs mb-4">
                                {new Date(event.createdAt).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    } catch (error) {
        console.error('Error fetching latest events:', error);
        return null;
    }
}
*/
