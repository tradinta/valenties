"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BarChart2, Share2, Crown, Lock, Globe, Check, X, Trash2, ArrowLeft, Loader2, Smartphone, Eye, Calendar, Image as ImageIcon, Palette, MessageCircle, Copy, CheckCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { PollService } from '@/services/PollService';
import { UserService } from '@/services/UserService';
import { PollWithId, PollConfig, PollOption, UserTier } from '@/types/shared';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BackgroundShapes } from '@/components/ui/BackgroundShapes';

// Lube Color Palette
const LUBE_COLORS = [
    '#FF0040', // Red
    '#3B82F6', // Blue
    '#F59E0B', // Orange
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#EC4899', // Pink
];

const PRESETS = [
    { name: 'Neon', colors: ['#FF0040', '#00E5FF', '#D400FF', '#CCFF00'] },
    { name: 'Pastel', colors: ['#FFB8D4', '#A5D8FF', '#FFF59D', '#C4B5FD'] },
    { name: 'Dark', colors: ['#1F2937', '#374151', '#4B5563', '#6B7280'] },
];

export default function PollsPage() {
    const { firebaseUser, loginAnonymous } = useAuth();
    const [polls, setPolls] = useState<PollWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [userTier, setUserTier] = useState<UserTier>('free');

    // Stats Modal
    const [selectedPollForStats, setSelectedPollForStats] = useState<PollWithId | null>(null);

    // Creation State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createMode, setCreateMode] = useState<'simple' | 'advanced'>('simple');

    // Success/Share Popup State
    const [createdPollId, setCreatedPollId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Comments State
    const [expandedComments, setExpandedComments] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Detailed Form State
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<{ text: string; isCorrect: boolean; image: string; color: string }[]>([
        { text: '', isCorrect: false, image: '', color: LUBE_COLORS[0] },
        { text: '', isCorrect: false, image: '', color: LUBE_COLORS[1] }
    ]);
    const [config, setConfig] = useState<PollConfig>({
        isMultiple: false,
        isQuiz: false,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        visibility: 'public',
        requireAuth: false
    });
    // Date/Time local string for input
    const [expiryInput, setExpiryInput] = useState(() => {
        const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    });

    const [creating, setCreating] = useState(false);

    // Interaction State
    const [votedPolls, setVotedPolls] = useState<Record<string, string[]>>({});
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

    // Helper: Generate share URL
    const getShareUrl = (pollId: string) => typeof window !== 'undefined' ? `${window.location.origin}/tools/polls?id=${pollId}` : '';

    // Copy share link to clipboard
    const copyShareLink = async (pollId: string) => {
        const url = getShareUrl(pollId);
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            alert('Failed to copy link');
        }
    };

    // Submit comment
    const handleSubmitComment = async (pollId: string) => {
        if (!newComment.trim() || !firebaseUser?.uid) return;
        setSubmittingComment(true);
        try {
            await PollService.addComment(pollId, newComment.trim(), firebaseUser.uid);
            setNewComment('');
            loadPolls(); // Refresh to show new comment
        } catch (error) {
            alert('Failed to add comment');
        }
        setSubmittingComment(false);
    };

    useEffect(() => {
        loadPolls();
    }, []);

    useEffect(() => {
        if (firebaseUser) {
            UserService.getProfile(firebaseUser.uid).then(profile => {
                if (profile) setUserTier(profile.tier);
            });
        }
    }, [firebaseUser]);

    const loadPolls = async () => {
        setLoading(true);
        const data = await PollService.getPublicFeed();
        setPolls(data);
        setLoading(false);

        if (firebaseUser) {
            const votes: Record<string, string[]> = {};
            await Promise.all(data.map(async (p) => {
                const voted = await PollService.hasVoted(p.id, firebaseUser.uid);
                if (voted) votes[p.id] = voted;
            }));
            setVotedPolls(votes);
        }
    };

    const handleAddOption = () => {
        if (options.length < 6) {
            setOptions([...options, {
                text: '',
                isCorrect: false,
                image: '',
                color: LUBE_COLORS[options.length % LUBE_COLORS.length]
            }]);
        }
    };

    const handleRemoveOption = (idx: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== idx));
        }
    };

    const resetForm = () => {
        setQuestion('');
        setOptions([
            { text: '', isCorrect: false, image: '', color: LUBE_COLORS[0] },
            { text: '', isCorrect: false, image: '', color: LUBE_COLORS[1] }
        ]);
        setConfig({
            isMultiple: false,
            isQuiz: false,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            visibility: 'public',
            requireAuth: false
        });
        setCreateMode('simple');
    };

    const handleCreate = async () => {
        if (!question.trim() || options.some(o => !o.text.trim() && !o.image)) {
            alert("Please fill in a question and all options (text or image).");
            return;
        }

        if (createMode === 'advanced' && config.isQuiz && !options.some(o => o.isCorrect)) {
            alert('Please select at least one correct answer for Quiz mode.');
            return;
        }

        let userId = firebaseUser?.uid;
        if (!userId) {
            try {
                await loginAnonymous();
                userId = firebaseUser?.uid;
            } catch { return; }
        }

        setCreating(true);
        // Parse expiry from input
        const finalConfig = { ...config, expiresAt: new Date(expiryInput).getTime() };

        try {
            const newPollId = await PollService.create({
                creatorId: userId!,
                question,
                options,
                config: finalConfig,
                theme: 'neo-brutal'
            });
            setIsCreateOpen(false);
            resetForm();
            setCreatedPollId(newPollId); // Show success popup with share link
            loadPolls();
        } catch (err) {
            alert('Failed to create poll');
        }
        setCreating(false);
    };

    const toggleOption = (pollId: string, optionId: string, isMultiple: boolean) => {
        if (votedPolls[pollId]) return;

        setSelectedOptions(prev => {
            const current = prev[pollId] || [];
            if (current.includes(optionId)) {
                return { ...prev, [pollId]: current.filter(id => id !== optionId) };
            }
            if (isMultiple) {
                return { ...prev, [pollId]: [...current, optionId] };
            }
            return { ...prev, [pollId]: [optionId] };
        });
    };

    const submitVote = async (pollId: string) => {
        const selection = selectedOptions[pollId];
        if (!selection || selection.length === 0) return;

        let userId = firebaseUser?.uid;
        if (!userId) {
            try {
                await loginAnonymous();
                userId = firebaseUser?.uid;
            } catch { return; }
        }

        const metadata = { device: 'desktop' as const };
        const result = await PollService.vote(pollId, selection, userId!, metadata);
        if (result.success) {
            setVotedPolls(prev => ({ ...prev, [pollId]: selection }));
            // Optimistic Update
            setPolls(prev => prev.map(p => {
                if (p.id !== pollId) return p;
                return {
                    ...p,
                    totalVotes: p.totalVotes + 1,
                    options: p.options.map(o => ({
                        ...o,
                        votes: selection.includes(o.id) ? o.votes + 1 : o.votes
                    }))
                };
            }));
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF9F0] text-[#1a1817] font-sans relative overflow-x-hidden">
            <BackgroundShapes />

            <div className="relative z-10 max-w-5xl mx-auto py-12 px-4 sm:px-6">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                    <div className="text-center md:text-left">
                        <Link href="/" className="inline-flex items-center gap-2 font-bold opacity-60 hover:opacity-100 transition-opacity mb-2">
                            <ArrowLeft className="w-4 h-4" /> Back Home
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-black text-[#1a1817] leading-[0.8] tracking-tighter drop-shadow-sm font-display">
                            POLLS <span className="text-[#3B82F6]">ON</span><br />
                            <span className="text-[#FF0040]">STEROIDS</span>
                        </h1>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCreateOpen(true)}
                        className="group relative px-6 py-3 bg-[#FF0040] text-white font-black text-xl border-[3px] border-[#1a1817] shadow-[6px_6px_0_0_#1a1817] hover:shadow-[8px_8px_0_0_#1a1817] transition-all rounded-xl flex items-center gap-2"
                    >
                        <Plus className="w-6 h-6 border-2 border-white rounded-full bg-white/20" />
                        <span>CREATE NEW</span>
                    </motion.button>
                </header>

                {/* Feed */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-[#FF0040]" /></div>
                ) : (
                    <div className="grid gap-12">
                        {polls.map((poll) => {
                            const hasVoted = !!votedPolls[poll.id];
                            const selection = selectedOptions[poll.id] || [];
                            const isQuiz = poll.config.isQuiz;
                            const totalVotes = poll.totalVotes || 1;
                            const isCreator = firebaseUser?.uid === poll.creatorId;

                            // Check if image poll
                            const isImagePoll = poll.options.some(o => !!o.image);

                            return (
                                <motion.div
                                    key={poll.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border-[3px] border-[#1a1817] rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_0_#1a1817] relative hover:-translate-y-1 transition-transform"
                                >
                                    {/* Action Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-2">
                                            {isQuiz && <span className="px-3 py-1 bg-[#FFD166] border-2 border-[#1a1817] rounded-full text-xs font-black uppercase flex items-center gap-1"><Crown className="w-3 h-3" /> Quiz</span>}
                                            {poll.config.isMultiple && <span className="px-3 py-1 bg-[#A5D8FF] border-2 border-[#1a1817] rounded-full text-xs font-black uppercase">Multi</span>}
                                            <span className="px-3 py-1 bg-gray-100 border-2 border-[#1a1817] rounded-full text-xs font-bold uppercase text-gray-500">
                                                {new Date(poll.config.expiresAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {isCreator && (
                                            <button onClick={() => setSelectedPollForStats(poll)} className="text-xs font-bold bg-[#1a1817] text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black/80">
                                                <BarChart2 className="w-3 h-3" /> Insights
                                            </button>
                                        )}
                                    </div>

                                    <h3 className="text-3xl font-black mb-8 leading-tight font-display">{poll.question}</h3>

                                    {/* Options Grid/List */}
                                    <div className={`grid gap-4 ${isImagePoll ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                                        {poll.options.map((opt) => {
                                            const isSelected = selection.includes(opt.id);
                                            const percentage = Math.round((opt.votes / totalVotes) * 100);
                                            const wasSelected = votedPolls[poll.id]?.includes(opt.id);

                                            // Dynamic Styles
                                            const baseColor = opt.color || '#F3F4F6';
                                            const isActive = !hasVoted && isSelected;

                                            return (
                                                <button
                                                    key={opt.id}
                                                    disabled={hasVoted}
                                                    onClick={() => toggleOption(poll.id, opt.id, poll.config.isMultiple)}
                                                    className={`
                                                        relative group overflow-hidden border-[3px] border-[#1a1817] rounded-xl transition-all
                                                        ${isImagePoll ? 'aspect-square flex flex-col' : 'h-16 flex items-center'}
                                                        ${isActive ? 'ring-4 ring-[#1a1817] ring-offset-2 scale-[1.02]' : 'hover:brightness-95'}
                                                        ${hasVoted && wasSelected ? 'ring-4 ring-[#1a1817] ring-offset-2' : ''}
                                                    `}
                                                    style={{ backgroundColor: hasVoted ? '#fff' : 'white' }}
                                                >
                                                    {/* Background Progress Bar (Text Only Mode) */}
                                                    {!isImagePoll && (
                                                        <div
                                                            className="absolute inset-0 opacity-20 transition-all duration-1000"
                                                            style={{
                                                                width: hasVoted ? `${percentage}%` : '0%',
                                                                backgroundColor: baseColor
                                                            }}
                                                        />
                                                    )}

                                                    {/* Image Mode Background */}
                                                    {isImagePoll && opt.image && (
                                                        <div className="absolute inset-0">
                                                            <img src={opt.image} alt={opt.text} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                                        </div>
                                                    )}

                                                    {/* Content Overlay */}
                                                    <div className={`relative z-10 w-full p-4 flex ${isImagePoll ? 'mt-auto flex-col items-start text-white' : 'justify-between items-center'}`}>
                                                        <span className={`font-black uppercase truncate ${isImagePoll ? 'text-lg drop-shadow-md' : 'text-lg'}`}>
                                                            {opt.text}
                                                        </span>
                                                        {hasVoted && (
                                                            <span className={`font-bold ${isImagePoll ? 'text-2xl mt-1' : 'text-xl'}`}>
                                                                {percentage}%
                                                            </span>
                                                        )}

                                                        {/* Checkmark for selection */}
                                                        {isActive && (
                                                            <div className="absolute top-2 right-2 bg-[#1a1817] text-white rounded-full p-1">
                                                                <Check className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 pt-4 border-t-2 border-[#1a1817]/10 space-y-4">
                                        {/* Stats Row */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4 text-xs font-bold uppercase opacity-60">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {poll.analytics?.views || 0} Views
                                                </span>
                                                <span>{poll.totalVotes} Votes</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {/* Share Button */}
                                                <button
                                                    onClick={() => copyShareLink(poll.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#3B82F6] text-white text-xs font-bold rounded-full border-2 border-[#1a1817] hover:scale-105 transition-transform shadow-[2px_2px_0_0_#1a1817]"
                                                >
                                                    {copied ? <CheckCircle className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                                                    {copied ? 'Copied!' : 'Share'}
                                                </button>

                                                {/* Comments Toggle */}
                                                <button
                                                    onClick={() => setExpandedComments(expandedComments === poll.id ? null : poll.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-white text-[#1a1817] text-xs font-bold rounded-full border-2 border-[#1a1817] hover:bg-gray-100 transition-colors shadow-[2px_2px_0_0_#1a1817]"
                                                >
                                                    <MessageCircle className="w-3 h-3" />
                                                    {poll.comments?.length || 0}
                                                </button>

                                                {/* Vote Button */}
                                                {!hasVoted && selection.length > 0 && (
                                                    <Button onClick={() => submitVote(poll.id)} className="bg-[#1a1817] text-white border-[3px] border-[#1a1817] font-black hover:bg-black/80 shadow-[4px_4px_0_0_#9CA3AF]">
                                                        CAST VOTE
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Comments Section */}
                                        <AnimatePresence>
                                            {expandedComments === poll.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="bg-gray-50 border-2 border-[#1a1817] rounded-xl p-4 space-y-4">
                                                        {/* Existing Comments */}
                                                        <div className="space-y-3 max-h-48 overflow-y-auto">
                                                            {(poll.comments?.length || 0) === 0 ? (
                                                                <p className="text-sm text-gray-400 italic text-center py-4">No comments yet. Be the first!</p>
                                                            ) : (
                                                                poll.comments.map((comment: { id: string; text: string; createdAt: number; creatorId: string }) => (
                                                                    <div key={comment.id} className="flex gap-3">
                                                                        <div className="w-8 h-8 bg-[#1a1817] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                                            {comment.creatorId.slice(0, 2).toUpperCase()}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="text-sm">{comment.text}</p>
                                                                            <p className="text-xs text-gray-400 mt-1">
                                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>

                                                        {/* Add Comment (Logged in only) */}
                                                        {firebaseUser ? (
                                                            <div className="flex gap-2 pt-3 border-t border-gray-200">
                                                                <input
                                                                    value={newComment}
                                                                    onChange={e => setNewComment(e.target.value)}
                                                                    placeholder="Add a comment..."
                                                                    maxLength={280}
                                                                    className="flex-1 px-3 py-2 text-sm border-2 border-[#1a1817] rounded-lg outline-none focus:ring-2 focus:ring-[#FF0040]"
                                                                    onKeyDown={e => e.key === 'Enter' && handleSubmitComment(poll.id)}
                                                                />
                                                                <button
                                                                    onClick={() => handleSubmitComment(poll.id)}
                                                                    disabled={!newComment.trim() || submittingComment}
                                                                    className="px-4 py-2 bg-[#FF0040] text-white font-bold rounded-lg border-2 border-[#1a1817] disabled:opacity-50 hover:scale-105 transition-transform shadow-[2px_2px_0_0_#1a1817]"
                                                                >
                                                                    {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500 text-center pt-3 border-t border-gray-200">
                                                                <button onClick={() => loginAnonymous()} className="text-[#FF0040] font-bold hover:underline">Log in</button> to add a comment
                                                            </p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Create Modal */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="max-w-3xl bg-[#FFF9F0] border-[4px] border-[#1a1817] shadow-[12px_12px_0_0_#1a1817] p-0 overflow-hidden max-h-[90vh] flex flex-col">
                        <DialogHeader className="p-6 border-b-[3px] border-[#1a1817] bg-white flex flex-row items-center justify-between">
                            <DialogTitle className="text-3xl font-black uppercase font-display">Create Poll</DialogTitle>
                            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg border-2 border-[#1a1817]">
                                <button onClick={() => setCreateMode('simple')} className={`px-4 py-1 rounded font-bold text-xs uppercase transition-all ${createMode === 'simple' ? 'bg-[#1a1817] text-white shadow-md' : 'hover:bg-gray-200'}`}>Simple</button>
                                <button onClick={() => setCreateMode('advanced')} className={`px-4 py-1 rounded font-bold text-xs uppercase transition-all ${createMode === 'advanced' ? 'bg-[#FF0040] text-white shadow-md' : 'hover:bg-gray-200'}`}>Advanced</button>
                            </div>
                        </DialogHeader>

                        <div className="p-6 overflow-y-auto space-y-8 flex-1">
                            {/* Question Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-500">The Question</label>
                                <input
                                    value={question}
                                    onChange={e => setQuestion(e.target.value)}
                                    placeholder="What is the meaning of life?"
                                    className="w-full text-2xl font-black border-b-[3px] border-[#1a1817] bg-transparent outline-none placeholder:text-gray-300 py-2 focus:border-[#FF0040] transition-colors"
                                />
                            </div>

                            {/* Options Grid */}
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-wider text-gray-500 flex justify-between">
                                    <span>Options ({options.length}/6)</span>
                                    {createMode === 'advanced' && <span className="text-[#FF0040]">Advanced Mode Active</span>}
                                </label>

                                <div className="grid gap-4">
                                    {options.map((opt, idx) => (
                                        <div key={idx} className="flex gap-3 items-start group">
                                            <div className="flex-1 space-y-3 p-4 bg-white border-[2px] border-[#1a1817] rounded-xl shadow-[4px_4px_0_0_#E5E7EB] group-hover:shadow-[4px_4px_0_0_#1a1817] transition-all">
                                                {/* Text & Color */}
                                                <div className="flex gap-2">
                                                    <input
                                                        value={opt.text}
                                                        onChange={e => {
                                                            const n = [...options];
                                                            n[idx].text = e.target.value;
                                                            setOptions(n);
                                                        }}
                                                        placeholder={`Option ${idx + 1}`}
                                                        className="flex-1 font-bold outline-none bg-transparent"
                                                    />
                                                    {createMode === 'advanced' && (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="color"
                                                                value={opt.color}
                                                                onChange={e => {
                                                                    const n = [...options];
                                                                    n[idx].color = e.target.value;
                                                                    setOptions(n);
                                                                }}
                                                                className="w-8 h-8 rounded border-2 border-[#1a1817] cursor-pointer"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Advanced : Image URL */}
                                                {createMode === 'advanced' && (
                                                    <div className="flex items-center gap-2 border-t border-gray-100 pt-2">
                                                        <ImageIcon className="w-4 h-4 text-gray-400" />
                                                        <input
                                                            value={opt.image}
                                                            onChange={e => {
                                                                const n = [...options];
                                                                n[idx].image = e.target.value;
                                                                setOptions(n);
                                                            }}
                                                            placeholder="Paste image URL (optional)"
                                                            className="flex-1 text-xs font-mono bg-gray-50 p-1 rounded border border-gray-200 outline-none"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delete Button */}
                                            {options.length > 2 && (
                                                <button onClick={() => handleRemoveOption(idx)} className="mt-4 text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {options.length < 6 && (
                                    <button onClick={handleAddOption} className="w-full py-3 border-[2px] border-dashed border-[#1a1817] rounded-xl text-sm font-bold uppercase hover:bg-white transition-colors flex items-center justify-center gap-2 opacity-60 hover:opacity-100">
                                        <Plus className="w-4 h-4" /> Add Another Option
                                    </button>
                                )}
                            </div>

                            {/* Advanced Config Section */}
                            {createMode === 'advanced' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#E0F2FE] border-[2px] border-[#1a1817] rounded-xl">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 font-bold cursor-pointer">
                                            <div className={`w-6 h-6 border-[2px] border-[#1a1817] rounded flex items-center justify-center transition-colors ${config.isMultiple ? 'bg-[#1a1817]' : 'bg-white'}`}>
                                                {config.isMultiple && <Check className="w-4 h-4 text-white" />}
                                                <input type="checkbox" className="hidden" checked={config.isMultiple} onChange={e => setConfig({ ...config, isMultiple: e.target.checked })} />
                                            </div>
                                            <span>Allow Multiple Selections</span>
                                        </label>

                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase">Deadline</label>
                                            <div className="flex items-center gap-2 bg-white border-[2px] border-[#1a1817] rounded-lg px-3 py-2">
                                                <Calendar className="w-4 h-4" />
                                                <input
                                                    type="datetime-local"
                                                    value={expiryInput}
                                                    onChange={e => setExpiryInput(e.target.value)}
                                                    className="outline-none font-bold text-sm bg-transparent w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 font-bold cursor-pointer">
                                            <div className={`w-6 h-6 border-[2px] border-[#1a1817] rounded flex items-center justify-center transition-colors ${config.isQuiz ? 'bg-[#FFD166]' : 'bg-white'}`}>
                                                {config.isQuiz && <Check className="w-4 h-4 text-[#1a1817]" />}
                                                <input type="checkbox" className="hidden" checked={config.isQuiz} onChange={e => setConfig({ ...config, isQuiz: e.target.checked })} />
                                            </div>
                                            <span>Quiz Mode (Mark Correct Answers)</span>
                                        </label>

                                        <label className="flex items-center gap-3 font-bold cursor-pointer">
                                            <div className={`w-6 h-6 border-[2px] border-[#1a1817] rounded flex items-center justify-center transition-colors ${config.visibility === 'link' ? 'bg-[#A7F3D0]' : 'bg-white'}`}>
                                                {config.visibility === 'link' && <Check className="w-4 h-4 text-[#1a1817]" />}
                                                <input type="checkbox" className="hidden" checked={config.visibility === 'link'} onChange={e => setConfig({ ...config, visibility: e.target.checked ? 'link' : 'public' })} />
                                            </div>
                                            <span>Private (Link Only)</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t-[3px] border-[#1a1817] bg-white">
                            <Button
                                onClick={handleCreate}
                                disabled={creating}
                                className="w-full h-14 text-xl font-black bg-[#FF0040] text-white border-[3px] border-[#1a1817] shadow-[4px_4px_0_0_#1a1817] hover:shadow-[6px_6px_0_0_#1a1817] hover:-translate-y-1 transition-all rounded-xl"
                            >
                                {creating ? <Loader2 className="animate-spin" /> : 'LAUNCH POLL'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Updated Analytics Modal */}
                {selectedPollForStats && (
                    <PollAnalyticsModal
                        poll={selectedPollForStats}
                        isOpen={!!selectedPollForStats}
                        onClose={() => setSelectedPollForStats(null)}
                        userTier={userTier}
                    />
                )}

                {/* Success Popup - Share Link After Creation */}
                <Dialog open={!!createdPollId} onOpenChange={() => setCreatedPollId(null)}>
                    <DialogContent className="max-w-md bg-white border-[4px] border-[#1a1817] shadow-[12px_12px_0_0_#10B981] p-0 overflow-hidden">
                        <div className="p-8 text-center space-y-6">
                            {/* Success Icon */}
                            <div className="mx-auto w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center border-[4px] border-[#1a1817] shadow-[6px_6px_0_0_#1a1817]">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-black uppercase mb-2">Poll Created!</h2>
                                <p className="text-gray-500 font-medium">Share it with the world 🚀</p>
                            </div>

                            {/* Share Link Box */}
                            <div className="bg-gray-100 border-[3px] border-[#1a1817] rounded-xl p-4 space-y-3">
                                <p className="text-xs font-bold uppercase text-gray-500">Your Poll Link</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={createdPollId ? getShareUrl(createdPollId) : ''}
                                        className="flex-1 px-3 py-2 text-sm font-mono bg-white border-2 border-[#1a1817] rounded-lg overflow-x-auto"
                                    />
                                    <button
                                        onClick={() => createdPollId && copyShareLink(createdPollId)}
                                        className="px-4 py-2 bg-[#3B82F6] text-white font-bold rounded-lg border-2 border-[#1a1817] hover:scale-105 transition-transform shadow-[2px_2px_0_0_#1a1817] flex items-center gap-1"
                                    >
                                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCreatedPollId(null)}
                                    className="flex-1 py-3 font-bold border-[2px] border-[#1a1817] rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Close
                                </button>
                                <Link
                                    href={`/tools/polls?id=${createdPollId}`}
                                    onClick={() => setCreatedPollId(null)}
                                    className="flex-1 py-3 bg-[#FF0040] text-white font-bold border-[2px] border-[#1a1817] rounded-xl shadow-[3px_3px_0_0_#1a1817] hover:scale-105 transition-transform text-center"
                                >
                                    View Poll
                                </Link>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

// Rewritten Analytics Modal for Lube Theme
const PollAnalyticsModal = ({ poll, isOpen, onClose, userTier }: { poll: PollWithId, isOpen: boolean, onClose: () => void, userTier: UserTier }) => {
    const isFree = userTier === 'free' || userTier === 'anonymous';
    const isPremium = userTier === 'premium' || userTier === 'admin';

    const topCountries = Object.entries(poll.analytics.countries || {}).sort(([, a], [, b]) => b - a).slice(0, 5);
    const topDevices = Object.entries(poll.analytics.devices || {}).sort(([, a], [, b]) => b - a);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-white border-[4px] border-[#1a1817] shadow-[12px_12px_0_0_#1a1817] p-0 overflow-hidden font-sans">
                <DialogHeader className="p-6 border-b-[3px] border-[#1a1817] bg-[#F9FAFB] flex flex-row items-center gap-4">
                    <div className="bg-[#1a1817] p-3 rounded-lg text-white"><BarChart2 className="w-6 h-6" /></div>
                    <div>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight">Poll Insights</DialogTitle>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Real-time Data</p>
                    </div>
                    {isPremium && <span className="ml-auto bg-[#F59E0B] border-2 border-[#1a1817] px-3 py-1 text-xs font-black uppercase rounded-full">Premium Active</span>}
                </DialogHeader>

                <div className="p-8 grid md:grid-cols-3 gap-8 overflow-y-auto max-h-[70vh]">

                    {/* Column 1: Overview */}
                    <div className="space-y-4">
                        <div className="p-6 bg-[#EFF6FF] border-[2px] border-[#1a1817] rounded-2xl shadow-[4px_4px_0_0_#1a1817]">
                            <div className="text-xs font-black uppercase text-blue-500 mb-2">Total Votes</div>
                            <div className="text-5xl font-black">{poll.totalVotes}</div>
                        </div>
                        <div className="p-6 bg-[#FDF2F8] border-[2px] border-[#1a1817] rounded-2xl shadow-[4px_4px_0_0_#1a1817]">
                            <div className="text-xs font-black uppercase text-pink-500 mb-2">Winning Option</div>
                            <div className="text-xl font-bold leading-tight line-clamp-2">
                                {poll.options.sort((a, b) => b.votes - a.votes)[0]?.text || "No votes yet"}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Geo (Casual+) */}
                    <div className="relative space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4" />
                            <h4 className="font-black uppercase text-sm">Top Locations</h4>
                        </div>

                        <div className={`space-y-2 ${isFree ? 'blur-sm select-none opacity-50' : ''}`}>
                            {topCountries.length > 0 ? topCountries.map(([code, count]) => (
                                <div key={code} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                                    <span className="font-bold text-sm">{code || 'Unknown'}</span>
                                    <span className="font-mono text-xs bg-[#1a1817] text-white px-2 py-0.5 rounded-full">{count}</span>
                                </div>
                            )) : <div className="text-sm italic text-gray-400">No data collected</div>}
                        </div>

                        {isFree && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Link href="/admin/plans" className="bg-[#1a1817] text-white px-6 py-3 rounded-xl font-bold border-[2px] border-white shadow-xl hover:scale-105 transition-transform text-center">
                                    <Lock className="w-6 h-6 mx-auto mb-1" />
                                    Unlock Locations
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Column 3: Deep Stats (Premium) */}
                    <div className="relative space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye className="w-4 h-4" />
                            <h4 className="font-black uppercase text-sm">Traffic Quality</h4>
                        </div>

                        <div className={`p-6 bg-[#1a1817] text-white rounded-2xl border-[2px] border-[#1a1817] space-y-4 ${!isPremium ? 'blur-sm select-none opacity-80' : ''}`}>
                            <div>
                                <div className="text-xs font-bold uppercase text-gray-500">Unique Views</div>
                                <div className="text-3xl font-black">{poll.analytics.views}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase text-gray-500">Conversion</div>
                                <div className="text-3xl font-black text-[#10B981]">
                                    {poll.analytics.views > 0 ? Math.round((poll.totalVotes / poll.analytics.views) * 100) : 0}%
                                </div>
                            </div>
                        </div>

                        {!isPremium && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Link href="/admin/plans" className="bg-[#FF0040] text-white px-6 py-3 rounded-xl font-bold border-[2px] border-[#1a1817] shadow-xl hover:scale-105 transition-transform text-center">
                                    <Crown className="w-6 h-6 mx-auto mb-1" />
                                    Go Premium
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

