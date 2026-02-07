"use client";

import React, { useState } from 'react';
import {
    Star, LogOut, Heart, Eye, Trash2, Clock, X, Loader2, EyeOff
} from 'lucide-react';
import { User } from 'firebase/auth';
import { TrapConfig, TrapStats } from '@/types';
import Link from 'next/link';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Added updateDoc
import { db } from '@/lib/firebase';
import { Button } from '../ui/button';

interface TrapWithId extends TrapConfig {
    id: string;
    stats?: TrapStats;
    status: 'active' | 'completed' | 'disabled'; // Update type here manually to match global types if generic mismatch
}

interface NeoBrutalDashboardProps {
    user: User | null;
    traps: TrapWithId[];
    onLogout: () => void;
    onSwitchTheme: () => void;
}

export const NeoBrutalDashboard: React.FC<NeoBrutalDashboardProps> = ({ user, traps: initialTraps, onLogout, onSwitchTheme }) => {
    const [traps, setTraps] = useState(initialTraps);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm("Are you sure? This will delete the trap and all images permanently.")) return;

        setDeletingId(id);
        try {
            await deleteDoc(doc(db, "traps", id));
            setTraps(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert("Failed to delete trap :(");
        } finally {
            setDeletingId(null);
        }
    };

    const toggleDisable = async (id: string, currentStatus: string, e: React.MouseEvent) => {
        e.preventDefault();
        const newStatus = currentStatus === 'disabled' ? 'active' : 'disabled';
        try {
            // Optimistic update
            setTraps(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
            await updateDoc(doc(db, "traps", id), { status: newStatus });
        } catch (err) {
            // Revert on error
            alert("Failed to update status");
            setTraps(prev => prev.map(t => t.id === id ? { ...t, status: currentStatus as any } : t));
        }
    };

    const getStatusBadge = (trap: TrapWithId) => {
        // Pending: No views at all
        if (!trap.stats?.views) {
            return { label: 'PENDING', color: 'bg-[var(--muted)] text-[var(--muted-foreground)]', icon: Clock };
        }

        // Completed: They said YES
        if (trap.status === 'completed') {
            return { label: 'SUCCESS', color: 'bg-green-400 text-black', icon: Heart };
        }

        // Viewed but not completed
        if (trap.stats.attempts > 0) {
            return { label: 'SAID NO', color: 'bg-red-400 text-black', icon: X };
        }

        // Viewed but no attempts
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
                    <Link href="/">
                        <button className="hidden md:inline-flex items-center justify-center font-bold h-8 px-4 rounded-lg border-[2px] border-[var(--border)] bg-[var(--secondary)] hover:brightness-110 text-xs transition-transform hover:-translate-y-0.5 shadow-[2px_2px_0_0_var(--border)] text-[var(--secondary-foreground)]">
                            + New Trap
                        </button>
                    </Link>
                </div>
            </div>

            <main className="flex-1 pt-32 pb-20 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-16 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] border-[3px] border-[var(--border)] text-sm font-bold mb-6 shadow-[4px_4px_0_0_var(--border)] text-[var(--accent-foreground)]">
                            <Star className="w-5 h-5" />
                            <span>Mission Control Center</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black leading-[1] mb-2">
                            Your <span className="text-[var(--primary)]">Love Traps.</span>
                        </h1>
                    </div>

                    {/* Traps Grid */}
                    {traps.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {traps.map((trap) => {
                                const status = getStatusBadge(trap);
                                const StatusIcon = status.icon;

                                return (
                                    <div key={trap.id} className="group relative bg-[var(--card)] border-[4px] border-[var(--border)] rounded-[2.5rem] p-6 shadow-[8px_8px_0_0_var(--border)] hover:shadow-[5px_5px_0_0_var(--border)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 flex flex-col">

                                        {/* Header: Status Badge */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`px-3 py-1.5 rounded-lg border-2 border-[var(--border)] font-black uppercase text-[10px] tracking-wider flex items-center gap-1.5 ${trap.status === 'disabled' ? 'bg-gray-200 text-gray-500' : status.color}`}>
                                                {trap.status === 'disabled' ? <EyeOff size={12} strokeWidth={3} /> : <StatusIcon size={12} strokeWidth={3} />}
                                                {trap.status === 'disabled' ? 'DISABLED' : status.label}
                                            </div>

                                            {/* Delete Button */}
                                            <div className="flex gap-2 -mt-2 -mr-2">
                                                {/* Disable/Enable Toggle */}
                                                <button
                                                    onClick={(e) => toggleDisable(trap.id, trap.status, e)}
                                                    className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-full transition-colors"
                                                    title={trap.status === 'disabled' ? "Enable Link" : "Disable Link"}
                                                >
                                                    {trap.status === 'disabled' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={(e) => handleDelete(trap.id, e)}
                                                    disabled={deletingId === trap.id}
                                                    className="p-2 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete Trap"
                                                >
                                                    {deletingId === trap.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Main Content */}
                                        <div className="mb-6 flex-1">
                                            <h3 className="text-2xl font-black mb-1 truncate text-[var(--card-foreground)]" title={trap.partnerName}>{trap.partnerName}</h3>
                                            <p className="font-bold text-[var(--muted-foreground)] text-xs uppercase tracking-wider">Theme: {trap.theme}</p>
                                        </div>

                                        {/* Note Preview (if exists) */}
                                        {trap.responseNote && (
                                            <div className="mb-6 bg-[var(--muted)] p-3 rounded-xl border-2 border-[var(--border)] text-xs font-bold italic relative text-[var(--muted-foreground)]">
                                                <p className="line-clamp-2">"{trap.responseNote}"</p>
                                                <div className="absolute -bottom-2 right-4 bg-[var(--card)] border-2 border-[var(--border)] px-1 rounded text-[8px] font-black uppercase text-[var(--card-foreground)]">Note</div>
                                            </div>
                                        )}

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="p-3 bg-[var(--background)] border-2 border-[var(--border)] rounded-xl text-center">
                                                <div className="text-xl font-black text-[var(--foreground)]">{trap.stats?.views || 0}</div>
                                                <div className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase">Views</div>
                                            </div>
                                            <div className="p-3 bg-[var(--background)] border-2 border-[var(--border)] rounded-xl text-center">
                                                <div className="text-xl font-black text-red-500">{trap.stats?.attempts || 0}</div>
                                                <div className="text-[9px] font-bold text-[var(--muted-foreground)] uppercase">Refusals</div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 mt-auto">
                                            <Link href={`/created/${trap.id}`} className="flex-1">
                                                <button className="w-full py-2.5 bg-[var(--foreground)] text-[var(--background)] font-bold rounded-xl border-2 border-[var(--border)] hover:opacity-90 transition-opacity text-sm">
                                                    Console
                                                </button>
                                            </Link>
                                            <Link href={`/share/${trap.id}`} target="_blank" className="flex-1">
                                                <button className="w-full py-2.5 bg-[var(--card)] text-[var(--foreground)] font-bold rounded-xl border-2 border-[var(--border)] hover:bg-[var(--muted)] transition-colors text-sm">
                                                    Visit
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20 text-center border-[4px] border-dashed border-[var(--border)] opacity-50 rounded-[3rem]">
                            <p className="text-xl font-bold text-[var(--muted-foreground)] mb-6">No active traps found.</p>
                            <Link href="/">
                                <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] font-bold px-8 py-6 rounded-2xl text-lg hover:shadow-[4px_4px_0_0_var(--foreground)] transition-all">
                                    Create Your First Trap
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
