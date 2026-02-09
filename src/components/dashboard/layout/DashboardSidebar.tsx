"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Heart,
    BarChart3,
    Dices,
    MessageCircle,
    Settings,
    LogOut,
    Crown,
    Zap
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
    isPremium?: boolean;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    onLogout,
    isPremium = false
}) => {
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'traps', label: 'Love Traps', icon: Heart },
        { id: 'polls', label: 'Polls', icon: BarChart3 },
        { id: 'decisions', label: 'Decisions', icon: Dices },
        { id: 'whispers', label: 'Whispers', icon: MessageCircle },
    ];

    return (
        <aside className="w-64 bg-[var(--card)] border-r-[3px] border-[var(--border)] h-screen fixed left-0 top-0 flex flex-col z-50 transition-colors duration-300 hidden md:flex">
            {/* Logo Area */}
            <div className="p-6 border-b-[3px] border-[var(--border)]">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[var(--primary)] rounded-xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                        <Heart className="w-6 h-6 text-white fill-current" />
                    </div>
                    <div>
                        <h1 className="font-black text-xl leading-none uppercase tracking-tighter">Chaos<br /><span className="text-[var(--primary)]">Tools</span></h1>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="mb-6">
                    <p className="px-4 text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-2">Menu</p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                                        ? 'bg-[var(--primary)] text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] border-2 border-black translate-x-1'
                                        : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:translate-x-1'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <div>
                    <p className="px-4 text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-2">System</p>
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[var(--foreground)] hover:bg-[var(--muted)] hover:translate-x-1 transition-all"
                    >
                        <Zap className="w-5 h-5" />
                        Toggle Theme
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 hover:translate-x-1 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                </div>
            </nav>

            {/* Premium Card */}
            {!isPremium && (
                <div className="p-4 border-t-[3px] border-[var(--border)] bg-[var(--background)]">
                    <div className="bg-gradient-to-br from-yellow-100 to-amber-200 border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
                        <div className="absolute -right-4 -top-4 bg-yellow-400 w-16 h-16 rounded-full opacity-50 blur-xl group-hover:scale-150 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Crown className="w-5 h-5 text-black fill-yellow-500" />
                                <span className="font-black text-xs uppercase">Go Premium</span>
                            </div>
                            <p className="text-xs font-bold leading-tight mb-3">Unlock unlimited traps and secret features.</p>
                            <div className="text-xs font-black bg-black text-white px-2 py-1 rounded inline-block">UPGRADE NOW</div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};
