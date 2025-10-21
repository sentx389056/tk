'use client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { OctagonAlert, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MemberLoginSectionProps {
    onLogin: (user: any) => void;
}

export default function LoginPage({ onLogin }: MemberLoginSectionProps) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [pendingUser, setPendingUser] = useState<any>(null);

    const demoUsers = [
        {
            id: 1,
            username: '1',
            password: '1',
            name: 'Иванов Сергей Петрович',
            role: 'Председатель ТК',
            organization: 'Госфильмофонд России',
            email: 'ivanov@gosfilmofond.ru',
            lastLogin: null
        },
        {
            id: 2,
            username: 'petrova_ma',
            password: 'expert_2024',
            name: 'Петрова Мария Александровна',
            role: 'Заместитель председателя',
            organization: 'Госфильмофонд России',
            email: 'petrova@gosfilmofond.ru',
            lastLogin: null
        }
    ];

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const user = demoUsers.find(
            u => u.username === credentials.username && u.password === credentials.password
        );

        if (user) {
            setPendingUser(user);
            setShowWarning(true);
        } else {
            setError('Неверный логин или пароль');
        }
    };

    const handleAcceptWarning = () => {
        if (pendingUser) {
            const loginLog = {
                userId: pendingUser.id,
                username: pendingUser.username,
                timestamp: new Date().toISOString(),
                action: 'login',
                ip: 'demo_ip'
            };
            console.log('Login logged:', loginLog);

            onLogin({
                ...pendingUser,
                lastLogin: new Date().toISOString()
            });
        }
    };

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
                                    Внимание! Вы входите в закрытый раздел ТК 191
                                </p>
                                <p className="mb-6 text-base">
                                    <span className="font-semibold">Соблюдение авторских прав: </span>Все материалы в данном разделе защищены авторскими правами. Запрещается их копирование, распространение или использование без письменного разрешения правообладателей.
                                </p>
                                <p className="mb-6 text-base">
                                    <span className="font-semibold">Конфиденциальность: </span>Информация, размещенная в закрытом разделе, является конфиденциальной и предназначена исключительно для членов ТК 191. Разглашение данной информации третьим лицам строго запрещено.
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
                                    <Link href="/securearea">
                                        Я понимаю и принимаю условия
                                    </Link>
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
                                        Доступ к закрытому разделу ТК 191<br />"Кинематография"
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Логин</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Введите логин"
                                            value={credentials.username}
                                            onChange={(e) =>
                                                setCredentials({ ...credentials, username: e.target.value })
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