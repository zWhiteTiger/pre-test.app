'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/me`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Unauthorized');
                }

                // const user = await res.json();
                // console.log('Authenticated user:', user);
                router.push('/home');
            } catch (err) {
                // console.error(err);
                router.push('/');
            }
        };

        checkAuth();
    }, [router]);

    return <div className="p-4">Loading...</div>;
}
