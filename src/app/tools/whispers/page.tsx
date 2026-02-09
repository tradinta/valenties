"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, ArrowLeft, Flame, HeartCrack, MessageCircle, Share2, Trash2, ChevronDown, Plus, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { WhisperService } from '@/services/WhisperService';
import { Whisper } from '@/types/shared';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type SortOption = 'newest' | 'top' | 'worst' | 'ratio';

export default function WhispersPage() {
    const { firebaseUser, loginAnonymous } = useAuth();
    const [whispers, setWhispers] = useState<Whisper[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    // Creation State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newWhisper, setNewWhisper] = useState('');
    const [sending, setSending] = useState(false);

    // Interaction State
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
    const [hiddenWhispers, setHiddenWhispers] = useState<Set<string>>(new Set());

    const loadWhispers = async () => {
        setLoading(true);
        const result = await WhisperService.getPaginated(50, undefined, sortBy);
        if (result.success && result.data) {
            setWhispers(result.data.whispers);
        }
        setLoading(false);
    }

    useEffect(() => {
        // Initial load
        loadWhispers();
        // Set up real-time listener ONLY for 'newest' to avoid jumping rows in other sorts
        if (sortBy === 'newest') {
            const unsubscribe = WhisperService.subscribe((data) => {
                setWhispers(data);
                setLoading(false);
            }, undefined, 50);
            return () => unsubscribe();
        }
    }, [sortBy]);

    // Load user votes
    useEffect(() => {
        if (!firebaseUser) return;
        const loadVotes = async () => {
            const votes: Record<string, 'up' | 'down' | null> = {};
            await Promise.all(whispers.slice(0, 20).map(async (w) => {
                votes[w.id] = await WhisperService.getUserVote(w.id, firebaseUser.uid);
            }));
            setUserVotes(votes);
        };
        loadVotes();
    }, [firebaseUser, whispers]);

    const handleCreate = async () => {
        if (!newWhisper.trim()) return;

        let userId = firebaseUser?.uid;
        if (!userId) {
            try {
                await loginAnonymous();
                userId = firebaseUser?.uid;
            } catch {
                return;
            }
        }

        setSending(true);
        const result = await WhisperService.create(newWhisper, userId);
        if (result.success) {
            setNewWhisper('');
            setIsCreateOpen(false);
            if (sortBy === 'newest') {
                // Real-time will handle update, or we can optimistic prepend
            } else {
                setSortBy('newest'); // Switch to newest to see post
            }
        } else {
            alert(result.error || 'Failed to post');
        }
        setSending(false);
    };

    const handleVote = async (whisperId: string, type: 'up' | 'down') => {
        let userId = firebaseUser?.uid;
        if (!userId) {
            try {
                await loginAnonymous();
                userId = firebaseUser?.uid;
            } catch { return; }
        }
        if (!userId) return;

        const currentVote = userVotes[whisperId];
        let newVote: 'up' | 'down' | null = type;
        if (currentVote === type) newVote = null;

        setUserVotes(prev => ({ ...prev, [whisperId]: newVote }));

        // Optimistic UI update for counters
        setWhispers(prev => prev.map(w => {
            if (w.id !== whisperId) return w;
            let up = w.upvotes;
            let down = w.downvotes;

            // Remove old vote
            if (currentVote === 'up') up--;
            if (currentVote === 'down') down--;

            // Add new vote
            if (newVote === 'up') up++;
            if (newVote === 'down') down++;

            return { ...w, upvotes: up, downvotes: down };
        }));

        const result = await WhisperService.vote(whisperId, type, userId);
        if (!result.success) {
            // Revert would go here, omitting for brevity in prototype
        }
    };

    const handleHide = (id: string) => {
        setHiddenWhispers(prev => new Set(prev).add(id));
    };

    const handleDelete = async (whisperId: string) => {
        if (!firebaseUser) return;
        if (!confirm('Delete this whisper forever?')) return;
        const result = await WhisperService.delete(whisperId, firebaseUser.uid);
        if (result.success) {
            setWhispers(prev => prev.filter(w => w.id !== whisperId));
        } else {
            alert(result.error);
        }
    };

    const handleComment = async (whisperId: string) => {
        if (!commentText.trim()) return;
        const result = await WhisperService.addComment(whisperId, commentText, firebaseUser?.uid);
        if (result.success) {
            setCommentText('');
            // Re-fetch or optimistic update needed for comments
            // For now, we rely on re-fetch or parent update if in real-time mode
        }
    };

    const copyLink = (id: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/tools/whispers?id=${id}`);
        // Toast placeholder
    };

    return (
        <div className="min-h-screen bg-[#FFF9F0] pt-24 pb-20 px-4 font-sans text-[#1a1817]">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b-2 border-black/10">
                    <div className="space-y-3">
                        <Link href="/" className="inline-flex items-center gap-2 font-bold hover:underline opacity-60 hover:opacity-100 transition-opacity text-sm">
                            <ArrowLeft className="w-4 h-4" /> Back Home
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter">
                            The <span className="text-[#FF0040]">Void</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {/* Filter Pills */}
                        {(['newest', 'top', 'ratio', 'worst'] as SortOption[]).map((option) => (
                            <button
                                key={option}
                                onClick={() => setSortBy(option)}
                                className={`px-4 py-2 rounded-full font-bold text-sm border-2 border-black transition-all ${sortBy === option
                                        ? 'bg-black text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]'
                                        : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                {option === 'newest' && '🔥 Newest'}
                                {option === 'top' && '🏆 Top'}
                                {option === 'ratio' && '⚖️ Spicy'}
                                {option === 'worst' && '💀 Cursed'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAB */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCreateOpen(true)}
                    className="fixed bottom-8 right-8 z-40 bg-[#FF0040] text-white p-4 rounded-full border-[3px] border-black shadow-[6px_6px_0_0_#000] flex items-center gap-2 font-black text-lg"
                >
                    <Plus className="w-6 h-6" /> WHISPER
                </motion.button>

                {/* Creation Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="bg-[#FFD166] border-[4px] border-black shadow-[8px_8px_0_0_#000]">
                        <DialogHeader>
                            <DialogTitle className="text-3xl uppercase tracking-widest">Secrets, Secrets...</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <textarea
                                value={newWhisper}
                                onChange={(e) => setNewWhisper(e.target.value)}
                                placeholder="Cast your whisper into the void..."
                                className="w-full h-40 bg-white border-[3px] border-black rounded-xl p-4 text-lg font-bold focus:shadow-[4px_4px_0_0_#000] focus:outline-none transition-shadow resize-none placeholder:text-gray-400"
                                maxLength={280}
                            />
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold opacity-60">{newWhisper.length}/280</span>
                                <Button
                                    onClick={handleCreate}
                                    disabled={!newWhisper.trim() || sending}
                                    className="bg-black text-white hover:bg-white hover:text-black border-2 border-transparent hover:border-black transition-all"
                                >
                                    {sending ? <Loader2 className="animate-spin" /> : 'SCREAM IT'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Feed */}
                {loading ? (
                    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        <AnimatePresence mode="popLayout">
                            {whispers
                                .filter(w => !hiddenWhispers.has(w.id))
                                .map((whisper, i) => {
                                    const isOwner = firebaseUser?.uid === whisper.creatorId;
                                    const userVote = userVotes[whisper.id];
                                    const isExpanded = expandedId === whisper.id;

                                    return (
                                        <motion.div
                                            key={whisper.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            className={`bg-white border-[3px] border-black rounded-2xl shadow-[5px_5px_0_0_#000] overflow-hidden flex flex-col`}
                                        >
                                            <div className={`p-6 ${whisper.color} flex-1`}>
                                                <p className="font-black text-xl leading-snug break-words">"{whisper.text}"</p>
                                                <div className="mt-4 flex justify-between items-center text-[10px] font-bold opacity-50 uppercase">
                                                    <span>{new Date(whisper.createdAt).toLocaleDateString()}</span>
                                                    <button onClick={() => handleHide(whisper.id)} className="hover:opacity-100 flex items-center gap-1">
                                                        <EyeOff className="w-3 h-3" /> Hide
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="p-3 bg-white border-t-[3px] border-black flex justify-between items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    {/* Voting */}
                                                    <button onClick={() => handleVote(whisper.id, 'up')} className={`p-2 rounded-lg hover:bg-green-100 transition-colors ${userVote === 'up' ? 'bg-green-100' : ''}`}>
                                                        <div className="flex items-center gap-1">
                                                            <Flame className={`w-4 h-4 ${userVote === 'up' ? 'fill-green-600 text-green-600' : 'text-gray-400'}`} />
                                                            <span className="text-xs font-black">{whisper.upvotes}</span>
                                                        </div>
                                                    </button>
                                                    <button onClick={() => handleVote(whisper.id, 'down')} className={`p-2 rounded-lg hover:bg-red-100 transition-colors ${userVote === 'down' ? 'bg-red-100' : ''}`}>
                                                        <div className="flex items-center gap-1">
                                                            <HeartCrack className={`w-4 h-4 ${userVote === 'down' ? 'text-red-600' : 'text-gray-400'}`} />
                                                            <span className="text-xs font-black">{whisper.downvotes}</span>
                                                        </div>
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setExpandedId(isExpanded ? null : whisper.id)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                        <MessageCircle className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => copyLink(whisper.id)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                        <Share2 className="w-4 h-4" />
                                                    </button>
                                                    {isOwner && (
                                                        <button onClick={() => handleDelete(whisper.id)} className="p-2 hover:bg-red-100 text-red-500 rounded-lg">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Comments */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: 'auto' }}
                                                        exit={{ height: 0 }}
                                                        className="bg-gray-50 border-t-[3px] border-black overflow-hidden"
                                                    >
                                                        <div className="p-3 space-y-2">
                                                            {(whisper.comments || []).map((c, idx) => (
                                                                <div key={idx} className="bg-white p-2 rounded-lg border border-black/10 text-xs font-bold">
                                                                    {c.text}
                                                                </div>
                                                            ))}
                                                            <div className="flex gap-2 pt-2">
                                                                <input
                                                                    className="flex-1 px-3 py-1 text-sm border-2 border-black rounded-lg"
                                                                    placeholder="Reply..."
                                                                    value={commentText}
                                                                    onChange={(e) => setCommentText(e.target.value)}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleComment(whisper.id)}
                                                                />
                                                                <button onClick={() => handleComment(whisper.id)} className="bg-black text-white p-2 rounded-lg">
                                                                    <Send className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
