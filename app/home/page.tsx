'use client';

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MdOutlineWhereToVote } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { FaPaperPlane } from 'react-icons/fa';
import { GoReport } from 'react-icons/go';
import Posts from './posts';

type User = {
    email: string;
    username?: string;
};

export default function Home() {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [text, setText] = useState('');

    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/me`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!res.ok) {
                    throw new Error(`Failed to fetch user: ${res.status}`);
                }
                const data = await res.json();
                setUser(data.user);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    router.push('/');
                    setError(err.message);
                } else {
                    setError('Unknown error');
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);


    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:3333/metadata/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: text,
                    email: user?.email,
                    username: user?.username,
                }),
            });

            const result = await res.json();
            console.log('Post result:', result);
            setText('');
        } catch (err) {
            console.error('Error posting metadata:', err);
        }
    };

    return (
        <>

            <div className='w-screen h-screen'>
                <div className='flex justify justify-center'>

                    <Card className='w-lg'>
                        <CardHeader>
                            <CardTitle>Hello, {user?.username}!</CardTitle>
                            <CardDescription>what's your special word?</CardDescription>
                        </CardHeader>
                        <CardContent className="h-30 max-h-30">
                            <Textarea
                                className="h-30 resize-none"
                                placeholder="Type your message here."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </CardContent>

                        <CardFooter className='flex justify-between'>
                            <div>
                                Account: {user?.email}
                            </div>
                            <Button onClick={handleSubmit}> <FaPaperPlane />
                                Post
                            </Button>
                        </CardFooter>
                    </Card>

                </div>

                <div className='flex justify justify-center mt-5'>

                    {/* <Card className='w-lg'>
                        <CardHeader className='items-center flex justify-between'>
                            <div>
                                <CardTitle>who create?</CardTitle>
                                <CardDescription>create at?</CardDescription>
                            </div>
                            <CardAction>
                                <GoReport className='text-xl' />
                            </CardAction>
                        </CardHeader>

                        <CardContent className="h-48 max-h-48">
                            <Card className='bg-black/5 flex justify-center items-center max-h-48 h-full text-center p-5 font-bold'>
                                what's data
                            </Card>
                        </CardContent>

                        <CardFooter>
                            <MdOutlineWhereToVote /> how many vote?
                        </CardFooter>
                    </Card> */}


                    <Posts user={{
                        email: user?.email!,
                        username: user?.username!
                    }} />
                </div>

            </div>
        </>
    )
}