import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrapWithId, PollWithId, DecisionWithId } from '@/types/shared';
import { Eye, Heart, BarChart3, Dices, X } from 'lucide-react';

interface StatsOverviewProps {
    traps: TrapWithId[];
    polls: PollWithId[];
    decisions: DecisionWithId[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ traps, polls, decisions }) => {

    const totalViews = traps.reduce((acc, t) => acc + (t.stats?.views || 0), 0) +
        polls.reduce((acc, p) => acc + (p.analytics?.views || 0), 0);

    const totalVotes = polls.reduce((acc, p) => acc + (p.totalVotes || 0), 0);

    const activeTraps = traps.filter(t => t.status === 'active').length;

    // Calculate total rejections (from traps)
    const totalRejections = traps.reduce((acc, t) => acc + (t.stats?.attempts || 0), 0);

    const stats = [
        {
            label: "Total Views",
            value: totalViews,
            icon: Eye,
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            border: "border-blue-200 dark:border-blue-800"
        },
        {
            label: "Active Traps",
            value: activeTraps,
            icon: Heart,
            color: "text-rose-500",
            bg: "bg-rose-100 dark:bg-rose-900/30",
            border: "border-rose-200 dark:border-rose-800"
        },
        {
            label: "Total Votes",
            value: totalVotes,
            icon: BarChart3,
            color: "text-emerald-500",
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
            border: "border-emerald-200 dark:border-emerald-800"
        },
        {
            label: "Rejection Attempts",
            value: totalRejections,
            icon: X,
            color: "text-red-500",
            bg: "bg-red-100 dark:bg-red-900/30",
            border: "border-red-200 dark:border-red-800"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className={`bg-[var(--card)] border-[3px] border-[var(--border)] rounded-2xl p-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.1)] transition-all`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-widest">
                                {stat.label}
                            </span>
                        </div>
                        <div className="text-3xl font-black text-[var(--foreground)]">
                            {stat.value.toLocaleString()}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
