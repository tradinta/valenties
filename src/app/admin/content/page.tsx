"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Loader2, Trash2, Eye, ExternalLink } from 'lucide-react';
import { AdminService } from '@/services/AdminService';
import { AdminTrap, TrapStatus } from '@/types/shared';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminContent() {
    const [traps, setTraps] = useState<AdminTrap[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, completed

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        const data = await AdminService.getAllTraps();
        setTraps(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this trap?')) return;
        try {
            await AdminService.deleteTrap(id);
            setTraps(traps.filter(t => t.id !== id));
        } catch (error) {
            alert('Failed to delete trap');
        }
    };

    const filteredTraps = traps.filter(trap => {
        const matchesSearch = (trap.creatorName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (trap.message?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            trap.id.includes(searchTerm);

        const matchesFilter = filter === 'all' || trap.status === filter;

        return matchesSearch && matchesFilter;
    });

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-display tracking-tight">Content Management</h1>
                <div className="text-sm font-bold text-gray-500">
                    Total Traps: {traps.length}
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search traps by creator, message, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'active', 'completed', 'disabled'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${filter === f
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Traps Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Preview</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Details</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Stats</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Status</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Date</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTraps.map((trap) => (
                            <tr key={trap.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                        {/* Simple preview since accessing assets might vary */}
                                        <span className="text-xs text-gray-400 font-mono">IMG</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="max-w-[200px]">
                                        <p className="font-bold text-sm text-gray-900 truncate" title={trap.message}>"{trap.message}"</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            By: <span className="font-semibold text-gray-700">{trap.creatorName}</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">ID: {trap.id.substring(0, 8)}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs font-medium text-gray-500 space-y-1">
                                        <div title="Views">👁️ {trap.stats?.views || 0}</div>
                                        <div title="Attempts">🖱️ {trap.stats?.attempts || 0}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${trap.status === 'active' ? 'bg-green-100 text-green-700' :
                                            trap.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {trap.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {trap.createdAt ? new Date(trap.createdAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/tools/trap?id=${trap.id}`} target="_blank">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(trap.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
