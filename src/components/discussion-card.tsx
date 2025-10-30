'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { Discussion } from '@/types/discussions';

export function DiscussionCard({ discussion, onUpdate }: { discussion: Discussion, onUpdate: () => void }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Отправка нового комментария
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/discussions/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': document.cookie
                },
                credentials: 'include',
                body: JSON.stringify({
                    content: newComment,
                    discussionId: discussion.id
                })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Не удалось добавить комментарий');
            }

            setNewComment('');
            toast.success('Комментарий добавлен');
            onUpdate(); // Обновляем список обсуждений
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error(error instanceof Error ? error.message : 'Не удалось добавить комментарий');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-4">
            <div className="space-y-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{discussion.title}</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`px-2 py-1 text-xs rounded-full ${
                            discussion.status === 'open' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        onClick={async () => {
                            try {
                                const res = await fetch(`/api/discussions/${discussion.id}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Cookie': document.cookie
                                    },
                                    credentials: 'include',
                                    body: JSON.stringify({
                                        status: discussion.status === 'open' ? 'closed' : 'open'
                                    })
                                });

                                if (!res.ok) {
                                    throw new Error('Не удалось обновить статус');
                                }

                                onUpdate();
                                toast.success('Статус обсуждения обновлен');
                            } catch (error) {
                                console.error('Error updating status:', error);
                                toast.error(error instanceof Error ? error.message : 'Не удалось обновить статус');
                            }
                        }}
                    >
                        {discussion.status === 'open' ? 'Открыто' : 'Закрыто'}
                    </Button>
                </div>
                <p className="text-gray-600">{discussion.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>
                        {discussion.createdByUser?.member?.name || discussion.createdByUser?.login || 'Пользователь'}
                        {' · '}
                        {new Date(discussion.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        {discussion._count?.comments || 0} комментариев
                    </Button>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 max-md:w-full">
                    <div className="px-6 py-4 border-b">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold break-words">{discussion.title}</DialogTitle>
                        </DialogHeader>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <div className="space-y-4 pb-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm text-gray-500">
                                        {discussion.createdByUser?.member?.name || discussion.createdByUser?.login || 'Пользователь'}
                                        {' · '}
                                        {new Date(discussion.createdAt).toLocaleDateString('ru-RU')}
                                    </div>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap break-words">{discussion.content}</p>
                            </div>

                            {discussion.comments?.map((comment) => (
                                <div key={comment.id} className="bg-white p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-sm text-gray-500">
                                            {comment.createdByUser?.member?.name || comment.createdByUser?.login || 'Пользователь'}
                                            {' · '}
                                            {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t bg-white px-6 py-4">
                        <form onSubmit={handleSubmitComment}>
                            <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Напишите комментарий..."
                                className="mb-2 resize-none"
                                required
                            />
                            <Button type="submit" disabled={isLoading || !newComment.trim()}>
                                Отправить комментарий
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}