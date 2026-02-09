"use client";

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { TrapWithId, PollWithId, DecisionWithId } from '@/types/shared';
import { TrapService } from '@/services/TrapService';
import { PollService } from '@/services/PollService';
import { DecisionService } from '@/services/DecisionService';
import { DashboardSidebar } from './layout/DashboardSidebar';
import { StatsOverview } from './widgets/StatsOverview';
import { ToolsManager } from './widgets/ToolsManager';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

interface UnifiedDashboardProps {
    user: User | null;
    traps: TrapWithId[];
    polls?: PollWithId[];
    decisions?: DecisionWithId[];
    onLogout: () => void;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
    user,
    traps: initialTraps,
    polls: initialPolls = [],
    decisions: initialDecisions = [],
    onLogout
}) => {
    const { theme } = useTheme();
    const [traps, setTraps] = useState(initialTraps);
    const [polls, setPolls] = useState(initialPolls);
    const [decisions, setDecisions] = useState(initialDecisions);
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Sync props with state if they change
    useEffect(() => {
        setTraps(initialTraps);
    }, [initialTraps]);
    useEffect(() => {
        setPolls(initialPolls);
    }, [initialPolls]);
    useEffect(() => {
        setDecisions(initialDecisions);
    }, [initialDecisions]);

    const handleDelete = async (id: string, type: 'trap' | 'poll' | 'decision') => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;

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
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete item.");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'disabled' ? 'active' : 'disabled';
        try {
            // Optimistic update
            setTraps(prev => prev.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
            await TrapService.toggleStatus(id, currentStatus);
        } catch (error) {
            console.error("Status toggle failed", error);
            // Revert
            setTraps(prev => prev.map(t => t.id === id ? { ...t, status: currentStatus as any } : t));
            alert("Failed to update status.");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500 font-sans">

            {/* Sidebar (Desktop) */}
            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={onLogout}
            />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-[var(--card)] border-b-[3px] border-[var(--border)] z-50 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--primary)] rounded-lg border-2 border-black flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white fill-current" />
                    </div>
                    <span className="font-black uppercase tracking-tighter">Chaos Tools</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-[var(--card)] border-l-[3px] border-[var(--border)] p-4 pt-20" onClick={e => e.stopPropagation()}>
                        <div className="space-y-2">
                            {['overview', 'traps', 'polls', 'decisions', 'whispers'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setIsMobileMenuOpen(false); }}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-bold capitalize ${activeTab === tab ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--muted)]'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                            <div className="h-px bg-[var(--border)] my-4" />
                            <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50">
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                                {activeTab === 'overview' ? `Welcome, ${user?.displayName || 'Captain'}` :
                                    activeTab === 'traps' ? 'Mission Control' :
                                        activeTab === 'polls' ? 'Public Opinion' :
                                            activeTab === 'decisions' ? 'Fate & Chance' : 'Whispers'}
                            </h1>
                            <p className="text-[var(--muted-foreground)] font-bold">
                                {activeTab === 'overview' ? 'Here is what is happening in your chaos universe.' :
                                    'Manage your tools and view analytics.'}
                            </p>
                        </div>
                        {activeTab === 'overview' && (
                            <div className="px-4 py-2 bg-[var(--card)] border-2 border-[var(--border)] rounded-xl font-mono text-xs">
                                Theme: <span className="font-bold uppercase text-[var(--primary)]">{theme}</span>
                            </div>
                        )}
                    </div>

                    {/* Stats Overview (Only on Overview tab) */}
                    {activeTab === 'overview' && (
                        <>
                            <StatsOverview traps={traps} polls={polls} decisions={decisions} />

                            {/* Recent Activity / Quick Links */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end border-b-2 border-[var(--border)] pb-2">
                                        <h3 className="font-black uppercase tracking-wider text-xl">Recent Traps</h3>
                                        <button onClick={() => setActiveTab('traps')} className="text-sm font-bold text-[var(--primary)] hover:underline">View All</button>
                                    </div>
                                    <ToolsManager
                                        activeTab="traps"
                                        traps={traps.slice(0, 3)}
                                        polls={[]}
                                        decisions={[]}
                                        onDelete={handleDelete}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end border-b-2 border-[var(--border)] pb-2">
                                        <h3 className="font-black uppercase tracking-wider text-xl">Recent Polls</h3>
                                        <button onClick={() => setActiveTab('polls')} className="text-sm font-bold text-[var(--primary)] hover:underline">View All</button>
                                    </div>
                                    <ToolsManager
                                        activeTab="polls"
                                        traps={[]}
                                        polls={polls.slice(0, 3)}
                                        decisions={[]}
                                        onDelete={handleDelete}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Tools Manager (For specific tabs) */}
                    {activeTab !== 'overview' && (
                        <ToolsManager
                            activeTab={activeTab}
                            traps={traps}
                            polls={polls}
                            decisions={decisions}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    )}

                </div>
            </main>
        </div>
    );
};
