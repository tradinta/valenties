import React from 'react';
import { Users, Activity, DollarSign, ArrowUpRight } from 'lucide-react';

export default function AdminOverview() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-display tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Administrator.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Users', value: '1,234', icon: Users, change: '+12%', color: 'bg-blue-500' },
                    { label: 'Active Traps', value: '856', icon: Activity, change: '+5%', color: 'bg-purple-500' },
                    { label: 'Revenue', value: '$12,450', icon: DollarSign, change: '+8%', color: 'bg-green-500' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                            <div className="flex items-center gap-1 mt-2 text-sm text-green-600 font-bold">
                                <ArrowUpRight size={14} /> {stat.change}
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                            <div className="w-10 h-10 rounded-full bg-gray-100"></div>
                            <div>
                                <p className="font-bold text-sm">User {100 + i} created a new trap</p>
                                <p className="text-xs text-gray-400">2 minutes ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
