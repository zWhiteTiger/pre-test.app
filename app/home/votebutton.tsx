import { Button } from "@/components/ui/button";
import { FcLike, FcDislike } from "react-icons/fc";
import React, { useState } from "react";

interface Props {
    postId: string;
    votes: string[];
    userEmail: string;
    onVoteChange: (newVotes: string[]) => void;
}

export default function VoteButtons({ postId, votes, userEmail, onVoteChange }: Props) {
    const hasVoted = votes.includes(userEmail);
    const [loading, setLoading] = useState(false);

    const toggleVote = async () => {
        setLoading(true);

        try {
            const res = await fetch(`http://localhost:3333/metadata/${postId}/vote`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to toggle vote");

            const data = await res.json();
            onVoteChange(data.voters);
        } catch (err) {
            console.error(err);
            alert("Error updating vote");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="ghost" onClick={toggleVote} disabled={loading}>
            {hasVoted ? <FcDislike /> : <FcLike />}
        </Button>
    );
}
