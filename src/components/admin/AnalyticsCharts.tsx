"use client";

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';
import { AdminTrap, AdminUser } from '@/types/shared';

interface AnalyticsChartsProps {
    users: AdminUser[];
    traps: AdminTrap[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ users, traps }) => {
    // 1. Process User Growth (Group by Date)
    const userGrowthData = React.useMemo(() => {
        const data: Record<string, number> = {};
        users.forEach(user => {
            if (!user.createdAt) return;
            const date = new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            data[date] = (data[date] || 0) + 1;
        });
        // Sort by date (naive approach for MVP)
        return Object.entries(data).map(([date, count]) => ({ date, count }));
    }, [users]);

    // 2. Process Top Traps by Views
    const topTrapsData = React.useMemo(() => {
        return [...traps]
            .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
            .slice(0, 5)
            .map(t => ({
                name: t.creatorName?.split(' ')[0] || 'Anon',
                views: t.stats?.views || 0,
                hovers: t.stats?.hovers || 0
            }));
    }, [traps]);

    // 3. Process Geography (Mocked + Real mix if available)
    const geoData = React.useMemo(() => {
        const data: Record<string, number> = {};
        users.forEach(user => {
            const country = user.country || 'Unknown';
            data[country] = (data[country] || 0) + 1;
        });
        return Object.entries(data)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [users]);

    const COLORS = ['#EC4899', '#8B5CF6', '#F59E0B', '#10B981', '#6366F1'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Growth Chart */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-lg font-bold mb-4 font-display">User Growth</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={userGrowthData}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                dy={10}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#EC4899', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#EC4899"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorUsers)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Traps Chart */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-lg font-bold mb-4 font-display">Top Traps (Views)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topTrapsData} layout="vertical" margin={{ left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                                width={80}
                            />
                            <Tooltip
                                cursor={{ fill: '#F3F4F6' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="views" radius={[0, 4, 4, 0]} barSize={32}>
                                {topTrapsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all lg:col-span-2">
                <h3 className="text-lg font-bold mb-4 font-display">User Geography</h3>
                <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={geoData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {geoData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
