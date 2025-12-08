'use client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { OctagonAlert, Shield } from "lucide-react";
// import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ login: '', password: '' });
    const [error, setError] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pendingUser, setPendingUser] = useState<any>(null);
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data?.error || 'Неверный логин или пароль');
                return;
            }

            setPendingUser(data.user);
            setShowWarning(true);
        } catch (err) {
            console.error(err);
            setError('Серверная ошибка');
        }
    };

    const handleAcceptWarning = () => {
        if (pendingUser) {
            // cookie is set by the login API; just navigate into secure area
            router.push('/securearea');
        }
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (!mounted) return;
                if (!res.ok) {
                    setCurrentUser(null);
                    setLoadingUser(false);
                    return;
                }
                const data = await res.json();
                setCurrentUser(data.user);
            } catch (e) {
                console.error('Error fetching auth status', e);
                setCurrentUser(null);
            } finally {
                if (mounted) setLoadingUser(false);
            }
        })();
        return () => { mounted = false };
    }, []);

    if (showWarning) {
        return (
            <div className="py-10">
                <section className="flex justify-center">
                    <Card className="w-xl px-6">
                        <CardHeader className="p-0">
                            <div className="flex gap-3 items-center flex-col text-center">
                                <div className="bg-red-100 p-3 rounded-md mb-3">
                                    <OctagonAlert size={32} color="#cc4e3a" />
                                </div>
                                <div>
                                    <CardTitle className="mb-2 text-2xl font-semibold">Предупреждение о конфиденциальности</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-amber-100 p-5 rounded-md border-amber-300 border mb-6">
                                <p className="mb-6 font-semibold text-base">
                                    Внимание! Вы входите в закрытый раздел ТК 015
                                </p>
                                <p className="mb-6 text-base">
                                    <span className="font-semibold">Соблюдение авторских прав: </span>Все материалы в данном разделе защищены авторскими правами. Запрещается их копирование, распространение или использование без письменного разрешения правообладателей.
                                </p>
                                <p className="mb-6 text-base">
                                    <span className="font-semibold">Конфиденциальность: </span>Информация, размещенная в закрытом разделе, является конфиденциальной и предназначена исключительно для членов ТК 015. Разглашение данной информации третьим лицам строго запрещено.
                                </p>
                                <p className="mb-6 text-base">
                                    <span className="font-semibold">Ответственность: </span>Нарушение условий использования может повлечь административную и уголовную ответственность в соответствии с законодательством РФ.
                                </p>
                                <p className="mb-6 text-base">
                                    <span className="font-semibold">Мониторинг: </span>Все действия в закрытом разделе регистрируются и сохраняются в журнале активности.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    className="bg-red-pink cursor-pointer"
                                    onClick={handleAcceptWarning}
                                >
                                    Я понимаю и принимаю условия
                                </Button>
                            </div>
                        </CardContent>
                        {error && (
                            <div className="text-red-600 text-center mb-4">
                                {error}
                            </div>
                        )}
                    </Card>
                </section>
            </div>

        );
    }

    // If we know the user is already authenticated, show alternate content
    if (!loadingUser && currentUser) {
        return (
            <main className="flex flex-col w-full px-5 xl:px-40 py-10">
                <div className="py-10">
                    <section className="flex justify-center">
                        <Card className="w-xl px-6">
                            <CardHeader className="p-0">
                                <div className="flex gap-3 items-center flex-col text-center">
                                    <div className="bg-green-100 p-3 rounded-md mb-3">
                                    </div>
                                    <div>
                                        <CardTitle className="mb-2">Вы уже авторизованы</CardTitle>
                                        <CardDescription className="text-gray-500">Вы вошли как <strong>{currentUser.login}</strong></CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3 items-center justify-center">
                                    <Button className="bg-red-pink" onClick={() => router.push('/securearea')}>Перейти в закрытый раздел</Button>
                                    <Button className="" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.reload(); }}>Выйти</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>
        )
    }

    return (
        <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
                <section className="flex justify-center">
                    <Card className="w-xl px-6">
                        <CardHeader className="p-0">
                            <div className="flex gap-3 items-center flex-col text-center">
                                <div className="bg-red-100 p-3 rounded-md mb-3">
                                    <Shield size={32} color="#cc4e3a" />
                                </div>
                                <div>
                                    <CardTitle className="mb-2">Вход для членов ТК</CardTitle>
                                    <CardDescription className="text-gray-500 flex gap-1 items-center">
                                        Доступ к закрытому разделу ТК 191<br />&quot;Кинематография&quot;
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="login">Логин</Label>
                                        <Input
                                            id="login"
                                            type="text"
                                            placeholder="Введите логин"
                                            value={credentials.login}
                                            onChange={(e) =>
                                                setCredentials({ ...credentials, login: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Пароль</Label>
                                        </div>
                                        <Input id="password" type="password" placeholder="Введите пароль" required
                                            value={credentials.password}
                                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
                                    </div>
                                    <Button type="submit" className="w-full bg-red-pink cursor-pointer">
                                        Войти
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        {error && (
                            <div className="text-red-600 text-center mb-4">
                                {error}
                            </div>
                        )}
                    </Card>
                </section>
            </div>
        </main>
    )
}