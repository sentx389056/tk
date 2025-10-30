'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DiscussionCard } from "@/components/discussion-card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

import { Discussion } from "@/types/discussions";

export function SectionDiscussions() {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Функция для загрузки обсуждений
    const fetchDiscussions = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page: String(page),
                pageSize: '10',
            });
            if (search) params.append('search', search);

            const res = await fetch(`/api/discussions?${params}`);
            if (!res.ok) throw new Error('Failed to fetch discussions');

            const data = await res.json();
            setDiscussions(data.discussions);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error('Не удалось загрузить обсуждения');
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для создания нового обсуждения
    const handleCreateDiscussion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/discussions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Получаем куки из браузера для аутентификации
                    'Cookie': document.cookie
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: newTitle,
                    content: newContent,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Не удалось создать обсуждение');
                return;
            }

            if (data.discussion) {
                setDiscussions(prev => [data.discussion, ...prev]);
                setNewTitle('');
                setNewContent('');
                setIsDialogOpen(false);
                toast.success('Обсуждение создано');
            } else {
                console.error('Invalid response format:', data);
                toast.error('Неверный формат ответа от сервера');
            }
        } catch (error) {
            toast.error('Не удалось создать обсуждение');
        }
    };

    // Эффект для загрузки обсуждений при изменении страницы или поиска
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDiscussions();
        }, 300);

        return () => clearTimeout(timer);
    }, [page, search]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center max-sm:flex-col">
                <Input
                    placeholder="Поиск обсуждений..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex max-w-sm max-sm:mb-5"
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="max-sm:w-full">Создать обсуждение</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[625px] max-sm:w-full p-5">
                        <form onSubmit={handleCreateDiscussion}>
                            <DialogHeader>
                                <DialogTitle>Новое обсуждение</DialogTitle>
                                <DialogDescription>
                                    Создайте новое обсуждение для обсуждения внутренних вопросов ТК.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Тема</Label>
                                    <Input
                                        id="title"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="content">Содержание</Label>
                                    <Textarea
                                        id="content"
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        rows={5}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Создать</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {
                isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="p-4">
                                <div className="space-y-3">
                                    <Skeleton className="h-4 max-w-[250px] max-sm:w-[125px]" />
                                    <Skeleton className="h-4 max-w-[350px] max-sm:w-[175px]" />
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-4 max-w-[100px] max-sm:w-[50px]" />
                                        <Skeleton className="h-4 w-[100px] max-sm:w-[50px]" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : discussions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Обсуждения не найдены
                    </div>
                ) : (
                    <div className="space-y-4">
                        {discussions.map((discussion) => (
                            <DiscussionCard
                                key={discussion.id}
                                discussion={discussion}
                                onUpdate={() => fetchDiscussions()}
                            />
                        ))}
                    </div>
                )
            }

            <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                    Страница {page} из {totalPages}
                </p>
                <div className="space-x-2">
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
        </div >
    );
}