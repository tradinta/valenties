"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { TrapWithId, PollWithId, DecisionWithId } from '@/types/shared';
import { Button } from '@/components/ui/button';
import {
    Eye,
    EyeOff,
    Trash2,
    MoreHorizontal,
    Share2,
    BarChart3,
    MessageCircle,
    Clock,
    CheckCircle,
    XCircle,
    Copy
} from 'lucide-react';


interface ToolsManagerProps {
    activeTab: string;
    traps: TrapWithId[];
    polls: PollWithId[];
    decisions: DecisionWithId[];
    onDelete: (id: string, type: 'trap' | 'poll' | 'decision') => void;
    onToggleStatus: (id: string, currentStatus: string) => void;
}

export const ToolsManager: React.FC<ToolsManagerProps> = ({
    activeTab,
    traps,
    polls,
    decisions,
    onDelete,
    onToggleStatus
}) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (id: string, type: 'share' | 'poll') => {
        const url = `${window.location.origin}/${type === 'share' ? 'share' : 'vote'}/${id}`;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (activeTab === 'overview') {
        return null; // Handled by parent to show stats + recent activity
    }

    const renderEmptyState = (type: string, createLink: string, createLabel: string) => (
        <div className="flex flex-col items-center justify-center p-12 bg-[var(--card)] border-[3px] border-[var(--border)] border-dashed rounded-3xl text-center">
            <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-xl font-black mb-2">No {type} Found</h3>
            <p className="text-[var(--muted-foreground)] mb-6 max-w-md">
                You haven't created any {type} yet. Start something chaotic!
            </p>
            <Link href={createLink}>
                <Button className="font-bold">{createLabel}</Button>
            </Link>
        </div>
    );

    /* --- TRAPS LIST --- */
    if (activeTab === 'traps') {
        if (traps.length === 0) return renderEmptyState('Traps', '/', 'Create New Trap');

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black">Your Traps</h2>
                    <Link href="/">
                        <Button size="sm" className="font-bold">+ New Trap</Button>
                    </Link>
                </div>
                <div className="grid gap-4">
                    {traps.map(trap => (
                        <div key={trap.id} className={`group bg-[var(--card)] p-4 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${trap.status === 'disabled' ? 'opacity-60 grayscale' : ''}`}>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg truncate">{trap.partnerName || 'Unknown Target'}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest ${trap.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        trap.status === 'disabled' ? 'bg-gray-100 text-gray-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {trap.status}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--muted-foreground)] truncate">"{trap.message}"</p>
                                <div className="flex items-center gap-4 mt-2 text-xs font-bold text-[var(--muted-foreground)]">
                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {trap.stats?.views || 0}</span>
                                    <span className="flex items-center gap-1"><XCircle className="w-3 h-3" /> {trap.stats?.attempts || 0}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(trap.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 md:flex-none gap-2"
                                    onClick={() => handleCopy(trap.id!, 'share')}
                                >
                                    {copiedId === trap.id ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    {copiedId === trap.id ? 'Copied' : 'Copy Link'}
                                </Button>

                                <Link href={`/created/${trap.id}`}>
                                    <Button variant="ghost" size="icon" title="Analytics">
                                        <BarChart3 className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href={`/share/${trap.id}`} target="_blank">
                                    <Button variant="ghost" size="icon" title="View Trap">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onToggleStatus(trap.id!, trap.status)}
                                    title={trap.status === 'disabled' ? 'Enable' : 'Disable'}
                                >
                                    {trap.status === 'disabled' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => onDelete(trap.id!, 'trap')}
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* --- POLLS LIST --- */
    if (activeTab === 'polls') {
        if (polls.length === 0) return renderEmptyState('Polls', '/poll/create', 'Create Poll');

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black">Your Polls</h2>
                    <Link href="/poll/create">
                        <Button size="sm" className="font-bold">+ New Poll</Button>
                    </Link>
                </div>
                <div className="grid gap-4">
                    {polls.map(poll => (
                        <div key={poll.id} className="group bg-[var(--card)] p-4 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg truncate mb-1">{poll.question}</h3>
                                <div className="flex items-center gap-4 mt-2 text-xs font-bold text-[var(--muted-foreground)]">
                                    <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {poll.totalVotes} Votes</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(poll.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Link href={`/tools/polls?id=${poll.id}`}>
                                    <Button variant="outline" size="sm">View Results</Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => onDelete(poll.id!, 'poll')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* --- DECISIONS LIST --- */
    if (activeTab === 'decisions') {
        if (decisions.length === 0) return renderEmptyState('Decisions', '/tools/decision', 'Roll Dice');

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black">Dice & Decisions</h2>
                    <Link href="/tools/decision">
                        <Button size="sm" className="font-bold">New Roll</Button>
                    </Link>
                </div>
                <div className="grid gap-4">
                    {decisions.map(decision => (
                        <div key={decision.id} className="group bg-[var(--card)] p-4 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] transition-all flex items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-lg mb-1">
                                    Result: <span className="text-[var(--primary)]">{decision.result}</span>
                                </h3>
                                <p className="text-sm text-[var(--muted-foreground)]">{decision.question}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs font-bold text-[var(--muted-foreground)]">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(decision.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => onDelete(decision.id!, 'decision')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* --- WHISPERS (Placeholder) --- */
    if (activeTab === 'whispers') {
        return renderEmptyState('Whispers', '/tools/whispers', 'Post Whisper');
    }

    return null;
};
