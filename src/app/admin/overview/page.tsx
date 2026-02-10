"use client";

import React, { useEffect, useState } from 'react';
import { Users, Activity, DollarSign, ArrowUpRight, Zap, Eye, MousePointer } from 'lucide-react';
import { AdminService } from '@/services/AdminService';
import { Loader2 } from 'lucide-react';
import { AdminUser, AdminTrap } from '@/types/shared';

interface ActivityItem {
    id: string;
    type: string;
    user: string;
    time: number;
}

export default function AdminOverview() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTraps: 0,
        totalViews: 0,
        totalHovers: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [users, traps] = await Promise.all([
                AdminService.getAllUsers(),
                AdminService.getAllTraps()
            ]);

            // Calculate stats
            const totalViews = traps.reduce((acc, t) => acc + (t.stats?.views || 0), 0);
            const totalHovers = traps.reduce((acc, t) => acc + (t.stats?.hovers || 0), 0);

            setStats({
                totalUsers: users.length,
                totalTraps: traps.length,
                totalViews,
                totalHovers
            });

            // Mock recent activity from traps
            const activity: ActivityItem[] = traps.slice(0, 5).map(t => ({
                id: t.id,
                type: 'new_trap',
                user: t.creatorName || (users.find(u => u.uid === t.creatorId)?.displayName) || 'Anonymous',
                time: t.createdAt || Date.now()
            }));
            setRecentActivity(activity);

        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-display tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500">Live system metrics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
                    { label: 'Active Traps', value: stats.totalTraps, icon: Zap, color: 'bg-purple-500' },
                    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'bg-green-500' },
                    { label: 'Total Hovers', value: stats.totalHovers.toLocaleString(), icon: MousePointer, color: 'bg-orange-500' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Latest Traps</h3>
                <div className="space-y-4">
                    {recentActivity.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 rounded-lg px-2 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">
                                T
                            </div>
                            <div>
                                <p className="font-bold text-sm">{item.user} created a new trap</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(item.time).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    {recentActivity.length === 0 && <p className="text-gray-400">No recent activity.</p>}
                </div>
            </div>
        </div>
    );
}
