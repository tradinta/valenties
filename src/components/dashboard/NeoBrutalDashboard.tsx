"use client";

import React, { useState } from 'react';
import { TrapWithId, PollWithId, DecisionWithId } from '@/types/shared';
import { TrapService } from '@/services/TrapService';
import { PollService } from '@/services/PollService';
import { DecisionService } from '@/services/DecisionService';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
    Star, LogOut, Heart, Eye, Trash2, Clock, X, Loader2, EyeOff, BarChart3, MessageCircle
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NeoBrutalDashboardProps {
    user: User | null;
    traps: TrapWithId[];
    polls?: PollWithId[];
    decisions?: DecisionWithId[];
    onLogout: () => void;
    onSwitchTheme: () => void;
}

export const NeoBrutalDashboard: React.FC<NeoBrutalDashboardProps> = ({
    user,
    traps: initialTraps,
    polls: initialPolls = [],
    decisions: initialDecisions = [],
    onLogout
}) => {
    const [traps, setTraps] = useState(initialTraps);
    const [polls, setPolls] = useState(initialPolls);
    const [decisions, setDecisions] = useState(initialDecisions);
    const [activeTab, setActiveTab] = useState<'traps' | 'polls' | 'decisions'>('traps');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, type: 'trap' | 'poll' | 'decision', e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm("Are you sure? This will delete it permanently.")) return;

        setDeletingId(id);
        try {
            if (type === 'trap') {
                await TrapService.delete(id);
                setTraps(prev => prev.filter(t => t.id !== id));
            } else if (type === 'poll') {
                await PollService.delete(id);
                setPolls(prev => prev.filter(p => p.id !== id));
            } else if (type === 'decision') {
                await DecisionService.delete(id);
                setDecisions(prev => prev.filter(d => d.id !== id));
            }
        } catch {
            alert("Failed to delete :(");
        } finally {
            setDeletingId(null);
        }
    };

    const toggleDisable = async (id: string, currentStatus: string, e: React.MouseEvent) => {
        e.preventDefault();
        const newStatus = currentStatus === 'disabled' ? 'active' : 'disabled';
        try {
            setTraps(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as TrapWithId['status'] } : t));
            await TrapService.toggleStatus(id, currentStatus);
        } catch {
            alert("Failed to update status");
            setTraps(prev => prev.map(t => t.id === id ? { ...t, status: currentStatus as TrapWithId['status'] } : t));
        }
    };

    const getStatusBadge = (trap: TrapWithId) => {
        if (!trap.stats?.views) return { label: 'PENDING', color: 'bg-[var(--muted)] text-[var(--muted-foreground)]', icon: Clock };
        if (trap.status === 'completed') return { label: 'SUCCESS', color: 'bg-green-400 text-black', icon: Heart };
        if (trap.stats.attempts > 0) return { label: 'SAID NO', color: 'bg-red-400 text-black', icon: X };
        return { label: 'VIEWED', color: 'bg-[var(--accent)] text-[var(--accent-foreground)]', icon: Eye };
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans transition-colors duration-500 overflow-x-hidden selection:bg-[var(--primary)] selection:text-white">

            {/* User Header */}
            <div className="fixed top-24 right-4 z-40 flex justify-end pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-4 bg-[var(--card)] border-[3px] border-[var(--border)] px-4 py-2 rounded-xl shadow-[4px_4px_0_0_var(--border)]">
                    <span className="font-bold text-sm hidden md:inline">Hi, {user?.displayName || 'User'}!</span>
                    <button onClick={onLogout} className="p-1.5 rounded-lg hover:bg-[var(--muted)] border-2 border-transparent hover:border-[var(--border)]">
                        <LogOut className="w-4 h-4" />
                    </button>
                    <Link href="/chat">
                        <button className="hidden md:inline-flex items-center justify-center font-bold h-8 px-4 rounded-lg border-[2px] border-[var(--border)] bg-[#FFD166] text-black hover:brightness-110 text-xs transition-transform hover:-translate-y-0.5 shadow-[2px_2px_0_0_var(--border)] mr-2 gap-2">
                            <MessageCircle className="w-3 h-3" /> Chat
                        </button>
                    </Link>
                    <Link href="/poll/create">
                        <button className="hidden md:inline-flex items-center justify-center font-bold h-8 px-4 rounded-lg border-[2px] border-[var(--border)] bg-[#A7F3D0] text-black hover:brightness-110 text-xs transition-transform hover:-translate-y-0.5 shadow-[2px_2px_0_0_var(--border)] mr-2">
                            + Poll
                        </button>
                    </Link>
                    <Link href="/">
                        <button className="hidden md:inline-flex items-center justify-center font-bold h-8 px-4 rounded-lg border-[2px] border-[var(--border)] bg-[var(--secondary)] hover:brightness-110 text-xs transition-transform hover:-translate-y-0.5 shadow-[2px_2px_0_0_var(--border)] text-[var(--secondary-foreground)]">
                            + New Trap
                        </button>
                    </Link>
                </div>
            </div>

            <main className="flex-1 pt-32 pb-20 px-4 relative">
                <div className="max-w-7xl mx-auto space-y-12">

                    {/* Header Text */}
                    <div className="space-y-2">
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                            Your <span className="text-[var(--primary)]">Chaos</span><br />
                            Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-stroke">Center</span>
                        </h1>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[var(--card)] p-6 rounded-2xl border-[3px] border-[var(--border)] shadow-[4px_4px_0_0_var(--border)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--border)] transition-all">
                            <div className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-wider mb-2">Total Traps</div>
                            <div className="text-4xl font-black">{traps.length}</div>
                        </div>
                        <div className="bg-[var(--card)] p-6 rounded-2xl border-[3px] border-[var(--border)] shadow-[4px_4px_0_0_var(--border)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--border)] transition-all">
                            <div className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-wider mb-2">Total Views</div>
                            <div className="text-4xl font-black">
                                {traps.reduce((acc, t) => acc + (t.stats?.views || 0), 0)}
                            </div>
                        </div>
                        <div className="bg-[var(--card)] p-6 rounded-2xl border-[3px] border-[var(--border)] shadow-[4px_4px_0_0_var(--border)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--border)] transition-all">
                            <div className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-wider mb-2">Polls</div>
                            <div className="text-4xl font-black">{polls.length}</div>
                        </div>
                        <div className="bg-[var(--card)] p-6 rounded-2xl border-[3px] border-[var(--border)] shadow-[4px_4px_0_0_var(--border)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--border)] transition-all">
                            <div className="text-[var(--muted-foreground)] font-bold text-xs uppercase tracking-wider mb-2">Decisions</div>
                            <div className="text-4xl font-black">{decisions.length}</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 border-b-4 border-[var(--border)] pb-0">
                        <button
                            onClick={() => setActiveTab('traps')}
                            className={`px-8 py-3 font-black text-xl rounded-t-xl border-t-4 border-x-4 border-[var(--border)] -mb-1 transition-all ${activeTab === 'traps' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'}`}
                        >
                            Traps
                        </button>
                        <button
                            onClick={() => setActiveTab('polls')}
                            className={`px-8 py-3 font-black text-xl rounded-t-xl border-t-4 border-x-4 border-[var(--border)] -mb-1 transition-all ${activeTab === 'polls' ? 'bg-[#A7F3D0] text-black' : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'}`}
                        >
                            Polls
                        </button>
                        <button
                            onClick={() => setActiveTab('decisions')}
                            className={`px-8 py-3 font-black text-xl rounded-t-xl border-t-4 border-x-4 border-[var(--border)] -mb-1 transition-all ${activeTab === 'decisions' ? 'bg-[#B8C0FF] text-black' : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'}`}
                        >
                            Dice
                        </button>
                    </div>

                    {/* Content List */}
                    <div className="space-y-4">
                        {activeTab === 'traps' && (
                            <>
                                {traps.length === 0 ? (
                                    <div className="text-center py-20 bg-[var(--muted)]/20 rounded-3xl border-2 border-dashed border-[var(--border)]">
                                        <p className="font-bold text-[var(--muted-foreground)] text-lg mb-4">No traps yet. You're too nice.</p>
                                        <Link href="/">
                                            <Button className="font-black">CREATE FIRST TRAP</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    traps.map((trap) => {
                                        const status = getStatusBadge(trap);
                                        const StatusIcon = status.icon;
                                        return (
                                            <div key={trap.id} className={`group bg-[var(--card)] p-6 rounded-3xl border-[3px] border-[var(--border)] hover:translate-x-1 hover:shadow-[6px_6px_0_0_var(--border)] transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${trap.status === 'disabled' ? 'opacity-60 grayscale' : ''}`}>

                                                <div className="flex items-center gap-6">
                                                    <div className={`w-16 h-16 rounded-2xl border-[3px] border-[var(--border)] flex items-center justify-center text-3xl shadow-[3px_3px_0_0_var(--border)] ${status.color}`}>
                                                        <StatusIcon className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black uppercase tracking-tight line-clamp-1">{trap.message}</h3>
                                                        <div className="flex gap-3 text-sm font-bold text-[var(--muted-foreground)] mt-1">
                                                            <span className="flex items-center gap-1"><Eye size={14} /> {trap.stats?.views || 0}</span>
                                                            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(trap.createdAt).toLocaleDateString()}</span>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${status.color}`}>{status.label}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 w-full md:w-auto">
                                                    <Link href={`/share/${trap.id}`} className="flex-1 md:flex-none">
                                                        <Button variant="outline" className="w-full">VIEW</Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        onClick={(e) => toggleDisable(trap.id, trap.status, e)}
                                                        title={trap.status === 'disabled' ? "Enable" : "Disable"}
                                                    >
                                                        {trap.status === 'disabled' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={(e) => handleDelete(trap.id, 'trap', e)}
                                                    >
                                                        {deletingId === trap.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </>
                        )}

                        {activeTab === 'polls' && (
                            <>
                                {polls.length === 0 ? (
                                    <div className="text-center py-20 bg-[var(--muted)]/20 rounded-3xl border-2 border-dashed border-[var(--border)]">
                                        <p className="font-bold text-[var(--muted-foreground)] text-lg mb-4">No polls started.</p>
                                        <Link href="/poll/create">
                                            <Button className="font-black bg-[#A7F3D0] text-black hover:bg-[#86efac]">CREATE POLL</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    polls.map((poll) => (
                                        <div key={poll.id} className="group bg-[var(--card)] p-6 rounded-3xl border-[3px] border-[var(--border)] hover:translate-x-1 hover:shadow-[6px_6px_0_0_var(--border)] transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl border-[3px] border-[var(--border)] flex items-center justify-center bg-[#A7F3D0] shadow-[3px_3px_0_0_var(--border)]">
                                                    <BarChart3 className="w-8 h-8 text-black" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black uppercase tracking-tight line-clamp-1">{poll.question}</h3>
                                                    <div className="flex gap-3 text-sm font-bold text-[var(--muted-foreground)] mt-1">
                                                        <span>{poll.totalVotes} Votes</span>
                                                        <span>• {new Date(poll.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 w-full md:w-auto">
                                                <Link href={`/vote/${poll.id}`} className="flex-1 md:flex-none">
                                                    <Button variant="outline" className="w-full">VIEW</Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={(e) => handleDelete(poll.id, 'poll', e)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </>
                        )}

                        {activeTab === 'decisions' && (
                            <>
                                {decisions.length === 0 ? (
                                    <div className="text-center py-20 bg-[var(--muted)]/20 rounded-3xl border-2 border-dashed border-[var(--border)]">
                                        <p className="font-bold text-[var(--muted-foreground)] text-lg mb-4">No decisions recorded.</p>
                                        <Link href="/tools/decision">
                                            <Button className="font-black bg-[#B8C0FF] text-black hover:bg-[#a5b4fc]">ROLL DICE</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    decisions.map((decision) => (
                                        <div key={decision.id} className="group bg-[var(--card)] p-6 rounded-3xl border-[3px] border-[var(--border)] hover:translate-x-1 hover:shadow-[6px_6px_0_0_var(--border)] transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl border-[3px] border-[var(--border)] flex items-center justify-center bg-[#B8C0FF] shadow-[3px_3px_0_0_var(--border)]">
                                                    <Star className="w-8 h-8 text-black" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black uppercase tracking-tight line-clamp-1">Result: <span className="text-[#FF0040]">{decision.result}</span></h3>
                                                    <div className="flex gap-3 text-sm font-bold text-[var(--muted-foreground)] mt-1">
                                                        <span>{decision.question}</span>
                                                        <span>• {new Date(decision.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 w-full md:w-auto">
                                                <Button
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={(e) => handleDelete(decision.id, 'decision', e)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}
