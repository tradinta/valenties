"use client";

import React, { useEffect, useState } from 'react';
import { Users, Activity, DollarSign, ArrowUpRight, Zap, Eye, MousePointer } from 'lucide-react';
import { AdminService } from '@/services/AdminService';
import { Loader2 } from 'lucide-react';
import { AdminUser, AdminTrap } from '@/types/shared';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { RecentActivityFeed } from '@/components/admin/RecentActivityFeed';
import { motion } from 'framer-motion';

interface ActivityItem {
    id: string;
    type: string;
    user: string;
    time: number;
}

export default function AdminOverview() {
    const [data, setData] = useState<{ users: AdminUser[], traps: AdminTrap[] }>({ users: [], traps: [] });
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTraps: 0,
        totalViews: 0,
        totalHovers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [users, traps] = await Promise.all([
                AdminService.getAllUsers(),
                AdminService.getAllTraps()
            ]);

            setData({ users, traps });

            // Calculate stats
            const totalViews = traps.reduce((acc, t) => acc + (t.stats?.views || 0), 0);
            const totalHovers = traps.reduce((acc, t) => acc + (t.stats?.hovers || 0), 0);

            setStats({
                totalUsers: users.length,
                totalTraps: traps.length,
                totalViews,
                totalHovers
            });

        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-purple-600 w-10 h-10" />
                <p className="text-gray-400 font-medium animate-pulse">Loading Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black font-display tracking-tighter text-gray-900">
                        Mission Control <span className="text-purple-600">.</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Live system metrics and surveillance.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Status</p>
                    <div className="flex items-center gap-2 justify-end mt-1">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="font-bold text-green-600">Operational</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Targets', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Traps', value: stats.totalTraps, icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Interactions', value: stats.totalHovers.toLocaleString(), icon: MousePointer, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300"
                    >
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-4xl font-black mt-2 text-gray-900">{stat.value}</h3>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                            <stat.icon size={28}
                                strokeWidth={2.5} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Analytics Area (2/3 width on large screens) */}
                <div className="xl:col-span-2">
                    <AnalyticsCharts users={data.users} traps={data.traps} />
                </div>

                {/* Activity Feed (1/3 width) */}
                <div className="xl:col-span-1">
                    <RecentActivityFeed users={data.users} traps={data.traps} />
                </div>
            </div>

            <div className="text-center pt-8 text-gray-300 text-xs font-bold uppercase tracking-widest pb-8">
                Kihumba Admin System v2.0 • Secure Connection
            </div>
        </div>
    );
}
