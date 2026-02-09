"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, increment, arrayUnion, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Poll, PollOption } from '@/types';
import { Loader2, Share2, BarChart3, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function VotePage() {
    const params = useParams();
    const id = params?.id as string;
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [voted, setVoted] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchPoll = async () => {
            if (!id) return;
            const docRef = doc(db, "polls", id);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setPoll({ id: snap.id, ...snap.data() } as Poll);
                // Simple local storage check for voting
                if (localStorage.getItem(`voted_${id}`)) {
                    setVoted(true);
                }
            }
            setLoading(false);
        };
        fetchPoll();
    }, [id]);

    const handleVote = async () => {
        if (selectedOptions.length === 0) return;

        // Optimistic Update
        setVoted(true);
        localStorage.setItem(`voted_${id}`, 'true');

        try {
            const pollRef = doc(db, "polls", id);

            // Note: In a real app, you'd use a transaction or batch to update individual option counts
            // For simplicity here, we assume options array structure but Firestore makes updating array objects hard
            // So we might technically need to read-modify-write or use a subcollection for votes.
            // Simplified approach: Update totalVotes and maybe we rely on a subcollection for valid counting later.
            // actually, updating deeply nested array objects is tricky. 
            // Better schema: 'options' as a subcollection or map. 
            // For this MVP, we will re-fetch and update the whole array (race condition risk but ok for MVP).

            // Re-fetch fresh to minimize race
            const freshSnap = await getDoc(pollRef);
            const freshPoll = freshSnap.data() as Poll;

            const updatedOptions = freshPoll.options.map(opt => {
                if (selectedOptions.includes(opt.id)) {
                    return { ...opt, votes: opt.votes + 1 };
                }
                return opt;
            });

            await updateDoc(pollRef, {
                options: updatedOptions,
                totalVotes: increment(selectedOptions.length)
            });

            // Refresh local state
            setPoll(prev => prev ? { ...prev, options: updatedOptions, totalVotes: prev.totalVotes + selectedOptions.length } : null);

        } catch {
            alert("Vote failed to record.");
        }
    };

    const toggleOption = (optId: string) => {
        if (voted) return;

        if (poll?.config.allowMultiple) {
            setSelectedOptions(prev =>
                prev.includes(optId) ? prev.filter(id => id !== optId) : [...prev, optId]
            );
        } else {
            setSelectedOptions([optId]);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!poll) return <div className="h-screen flex items-center justify-center font-bold">Poll not found</div>;

    const totalVotes = poll.totalVotes || 1; // avoid div/0

    return (
        <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4 font-sans text-[#1a1817]">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Question */}
                <div className="bg-white p-8 rounded-[2rem] border-[4px] border-black shadow-[8px_8px_0_0_#000]">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase rounded mb-4">
                            {voted ? 'Results' : 'Vote Now'}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black leading-tight">{poll.question}</h1>
                        <p className="mt-2 text-gray-500 font-bold text-sm">
                            {poll.config.allowMultiple ? 'Select multiple options' : 'Select one option'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {poll.options.map((opt) => {
                            const percent = Math.round((opt.votes / totalVotes) * 100);
                            const isSelected = selectedOptions.includes(opt.id);

                            return (
                                <motion.div
                                    key={opt.id}
                                    onClick={() => toggleOption(opt.id)}
                                    className={`relative overflow-hidden p-4 rounded-xl border-[3px] transition-all cursor-pointer ${voted
                                        ? 'border-gray-200 bg-gray-50'
                                        : isSelected
                                            ? 'border-black bg-black text-white shadow-[4px_4px_0_0_#A7F3D0]'
                                            : 'border-black bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    {/* Progress Bar (Only if voted) */}
                                    {voted && (
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            className="absolute inset-y-0 left-0 bg-[#A7F3D0]/30 z-0"
                                        />
                                    )}

                                    <div className="relative z-10 flex justify-between items-center">
                                        <span className="font-bold text-lg">{opt.text}</span>
                                        {voted && <span className="font-black">{percent}%</span>}
                                        {!voted && isSelected && <Check className="w-5 h-5 text-[#A7F3D0]" strokeWidth={4} />}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {!voted && (
                        <Button
                            onClick={handleVote}
                            disabled={selectedOptions.length === 0}
                            className="w-full mt-8 py-4 text-xl bg-[#A7F3D0] text-black font-black rounded-xl border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-0 active:shadow-none transition-all"
                        >
                            Submit Vote
                        </Button>
                    )}

                    {voted && (
                        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-center text-sm font-bold text-gray-400">
                            <span>Total Votes: {poll.totalVotes}</span>
                            <button className="flex items-center gap-2 hover:text-black transition-colors">
                                <Share2 className="w-4 h-4" /> Share Poll
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
