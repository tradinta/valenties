import React from 'react';
import { Search, MoreHorizontal, Filter } from 'lucide-react';

export default function AdminUsers() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-display tracking-tight">User Management</h1>
                <button className="px-4 py-2 bg-[#1a1817] text-white rounded-lg font-bold text-sm">Add User</button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                </div>
                <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 font-bold text-sm hover:bg-gray-50">
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">User</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Status</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Plan</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Joined</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <tr key={i} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-purple-200"></div>
                                        <div>
                                            <p className="font-bold text-sm">User Name {i}</p>
                                            <p className="text-xs text-gray-400">user{i}@example.com</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Active</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-sm text-gray-600">Free</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">Feb 14, 2026</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
