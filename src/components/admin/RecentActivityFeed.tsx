"use client";

import React from 'react';
import { AdminTrap, AdminUser } from '@/types/shared';
import { Zap, UserPlus, Clock } from 'lucide-react';

interface RecentActivityFeedProps {
    users: AdminUser[];
    traps: AdminTrap[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ users, traps }) => {
    // Interleave and sort activities
    const activities = React.useMemo(() => {
        const trapEvents = traps.map(t => ({
            type: 'trap_created',
            data: t,
            date: t.createdAt
        }));

        const userEvents = users.map(u => ({
            type: 'user_joined',
            data: u,
            date: u.createdAt
        }));

        const all = [...trapEvents, ...userEvents]
            .sort((a, b) => b.date - a.date)
            .slice(0, 10);

        return all;
    }, [users, traps]);

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-display">Live Feed</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full animate-pulse">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    LIVE
                </div>
            </div>

            <div className="space-y-4 relative">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100" />

                {activities.map((item, i) => {
                    const isTrap = item.type === 'trap_created';
                    const data = item.data as any; // Quick cast

                    return (
                        <div key={i} className="relative flex items-start gap-4 group">
                            <div className={`
                                relative z-10 w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border-4 border-white shadow-sm
                                ${isTrap ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}
                            `}>
                                {isTrap ? <Zap size={18} /> : <UserPlus size={18} />}
                            </div>

                            <div className="flex-1 py-1">
                                <div className="flex justify-between items-start">
                                    <p className="font-bold text-gray-900 leading-tight">
                                        {isTrap ? (
                                            <>
                                                {data.creatorName} <span className="text-gray-400 font-normal">dropped a trap</span>
                                            </>
                                        ) : (
                                            <>
                                                New User <span className="text-blue-600">{data.displayName || 'Anonymous'}</span>
                                            </>
                                        )}
                                    </p>
                                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2 flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {isTrap && (
                                    <p className="text-sm text-gray-500 mt-1 italic">
                                        "{data.message?.substring(0, 50) || 'No message'}..."
                                    </p>
                                )}

                                {!isTrap && data.country && (
                                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500">
                                        📍 {data.country}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
