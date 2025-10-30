'use client';

import { useEffect, useState } from 'react';

export function UserHeader() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true
        async function fetchMe() {
            try {
                const res = await fetch('/api/auth/me');
                if (!res.ok) {
                    setUser(null)
                    setLoading(false)
                    return
                }
                const data = await res.json()
                if (mounted) {
                    // Support both string and object user shapes
                    if (typeof data.user === 'string') {
                        setUser({ login: data.user })
                    } else {
                        setUser(data.user)
                    }
                }
            } catch (e) {
                console.error('Error fetching current user', e)
                if (mounted) setUser(null)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchMe()

        return () => { mounted = false }
    }, [])

    if (loading) return null

    if (!user) return null

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
        } catch (e) {
            console.error('Logout request failed', e)
        } finally {
            // Force redirect to login after logout
            window.location.href = '/login'
        }
    }

    const displayName = user?.member?.name || user.login;

    return (
        <div className="flex items-center gap-2 text-white">
            <span>Пользователь: {displayName}</span>
            <button onClick={handleLogout} className="underline ml-4 opacity-80 hover:opacity-100">
                Выйти
            </button>
        </div>
    )
}