"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, ShieldAlert, LogOut } from 'lucide-react';

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin/overview' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: ShieldAlert, label: 'Audit Log', href: '/admin/audit' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export const AdminSidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 glass-panel border-r border-[#1a1817]/10 z-50 flex flex-col">
            <div className="p-6 border-b border-[#1a1817]/10 flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                    A
                </div>
                <span className="font-bold text-lg font-display">Admin Portal</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                                ${isActive
                                    ? 'bg-[var(--primary)] text-white shadow-lg'
                                    : 'text-[var(--foreground)] hover:bg-[#1a1817]/5'
                                }
                            `}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-[#1a1817]/10">
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-red-500 hover:bg-red-50 transition-colors font-medium">
                    <LogOut size={20} />
                    Exit Admin
                </button>
            </div>
        </aside>
    );
};
