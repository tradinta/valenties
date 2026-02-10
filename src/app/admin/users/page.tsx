"use client";

import React, { useEffect, useState } from 'react';
import { Search, MoreHorizontal, Filter, Loader2, UserX, UserCheck, Shield, Trash2 } from 'lucide-react';
import { AdminService } from '@/services/AdminService';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AdminUser } from '@/types/shared';

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, admin, premium

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const data = await AdminService.getAllUsers();
        setUsers(data);
        setLoading(false);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            user.uid.includes(searchTerm);

        const matchesFilter = filter === 'all' || user.tier === filter;

        return matchesSearch && matchesFilter;
    });

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-display tracking-tight">User Management</h1>
                <div className="text-sm font-bold text-gray-500">
                    Total: {users.length}
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'admin', 'premium', 'casual', 'free'].map(f => (
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

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">User</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Role</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Usage</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500">Created</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase text-gray-500"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.uid} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center font-bold text-purple-700 text-xs">
                                            {user.displayName?.[0] || user.email?.[0] || '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{user.displayName || 'No Name'}</p>
                                            <p className="text-xs text-gray-400 font-mono">{user.email || user.uid.substring(0, 8) + '...'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${user.tier === 'admin' ? 'bg-red-100 text-red-700' :
                                        user.tier === 'premium' ? 'bg-yellow-100 text-yellow-700' :
                                            user.tier === 'casual' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {user.tier || 'free'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs font-medium text-gray-500 space-y-1">
                                        <div>Conn: {user.limits?.connections || 0}</div>
                                        <div>Imgs: {user.limits?.images || 0}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <UserCheck className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Shield className="mr-2 h-4 w-4" /> Change Role
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-medium">
                                    No users found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
