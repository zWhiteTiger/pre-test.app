'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { FcDislike, FcLike } from 'react-icons/fc';
import { GoReport } from 'react-icons/go';
import { LuRefreshCcw } from 'react-icons/lu';
import VoteButtons from './votebutton';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface Metadata {
    _id: string;
    email: string;
    username: string;
    data: string;
    votes: string[];
    createAt: string;
}

interface Props {
    user: {
        email: string;
        username: string;
    };
}

export default function Posts({ user }: Props) {
    const [posts, setPosts] = useState<Metadata[]>([]);
    const [loading, setLoading] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [reportingPostId, setReportingPostId] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}metadata`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch posts');
            const data: Metadata[] = await res.json();
            data.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
            setPosts(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSaveEdit = async () => {
        if (!editingPostId) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}metadata/${editingPostId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ data: editContent }),
            });

            setPosts((prev) =>
                prev.map((p) => (p._id === editingPostId ? { ...p, data: editContent } : p))
            );
            setEditingPostId(null);
            setEditDialogOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeletePost = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}metadata/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to delete post');
            setPosts((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end mb-4 w-lg gap-5">

                <Button onClick={fetchPosts} disabled={loading}>
                    <LuRefreshCcw />
                    {loading ? 'Loading...' : 'Refresh'}
                </Button>
            </div>

            {posts.length === 0 && !loading && <div>No posts found.</div>}
            {posts.map((post) => {
                const isOwner = post.email === user.email;

                return (
                    <Card key={post._id} className="w-lg">
                        <CardHeader className="flex justify-between items-center">
                            <div>
                                <CardTitle>{post.username}</CardTitle>
                                <CardDescription>
                                    Created at: {new Date(post.createAt).toLocaleString()}
                                </CardDescription>
                            </div>
                            <CardAction>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="text-xl"
                                            title={isOwner ? 'Edit post' : 'Report post'}
                                            onClick={() => {
                                                if (isOwner) {
                                                    setEditContent(post.data);
                                                    setEditingPostId(post._id);
                                                } else {
                                                    setReportingPostId(post._id);
                                                }
                                            }}
                                        >
                                            {isOwner ? <FaPen /> : <GoReport />}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                {isOwner ? 'Edit Post' : 'Report Post'}
                                            </DialogTitle>
                                        </DialogHeader>
                                        {isOwner ? (
                                            <>
                                                <Textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    rows={5}
                                                />
                                                <DialogFooter className="flex justify-between">
                                                    <div className="flex gap-2">
                                                        <DialogClose asChild>
                                                            <Button variant="ghost" onClick={() => handleDeletePost(post._id)}>
                                                                Delete
                                                            </Button>

                                                        </DialogClose>

                                                        <DialogClose asChild>
                                                            <Button onClick={handleSaveEdit}>Save</Button>
                                                        </DialogClose>
                                                    </div>
                                                </DialogFooter>
                                            </>
                                        ) : (
                                            <p>
                                                Thank you for reporting. Our moderators will review
                                                the post.
                                            </p>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </CardAction>
                        </CardHeader>

                        <CardContent className="h-48 max-h-48 overflow-auto">
                            <div className="bg-black/5 flex justify-center items-center h-full p-5 font-bold text-center">
                                {post.data}
                            </div>
                        </CardContent>

                        <CardFooter className="flex items-center space-x-2">
                            <VoteButtons
                                postId={post._id}
                                votes={post.votes}
                                userEmail={user.email}
                                onVoteChange={(newVotes) => {
                                    setPosts((prev) =>
                                        prev.map((p) =>
                                            p._id === post._id
                                                ? { ...p, votes: newVotes }
                                                : p
                                        )
                                    );
                                }}
                            />
                            <span>{post.votes.length} votes</span>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
