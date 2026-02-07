"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Crown, Heart, LayoutDashboard, LogIn, User } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { LogoDroplet } from '@/components/ui/LogoDroplet';

export const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { isLoggedIn, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Theme colors for the dots
    const themes = [
        { id: 'valentine', color: '#FF0040', label: 'Classic' },
        { id: 'cosmos', color: '#A5D8FF', label: 'Cosmos' },
        { id: 'neo', color: '#EC4899', label: 'Neo' },
        { id: 'deep-red', color: '#2D0509', label: 'Dark' },
    ];

    const pillBase = "pointer-events-auto bg-white/80 backdrop-blur-md border-[3px] border-[var(--foreground)] rounded-full shadow-[4px_4px_0_0_var(--foreground)] flex items-center justify-center transition-all duration-300 hover:shadow-[6px_6px_0_0_var(--foreground)] hover:-translate-y-[1px]";

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
            <div className="flex justify-between items-center w-full max-w-7xl gap-4 flex-wrap md:flex-nowrap">

                {/* --- PILL 1: LOGO (Hidden on Mobile) --- */}
                <div className={`${pillBase} px-5 py-3 min-w-[120px] hidden md:flex`}>
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <LogoDroplet className="w-full h-full" />
                        </div>
                        <span className="text-xl font-black font-display tracking-tight text-[var(--foreground)] hidden sm:block">
                            kihumba
                        </span>
                    </Link>
                </div>

                {/* --- PILL 2: LINKS --- */}
                <div className={`${pillBase} px-6 py-3 hidden md:flex gap-6`}>
                    <Link href="/premium" className="group flex items-center gap-2 text-sm font-black text-[var(--foreground)] hover:text-[var(--primary)] transition-colors relative">
                        <span className="absolute -inset-2 rounded-full border-[2px] border-transparent group-hover:border-yellow-400/50 group-hover:bg-yellow-50/50 transition-all"></span>
                        <Crown size={16} className="text-yellow-500 fill-yellow-500 animate-pulse relative z-10" />
                        <span className="relative z-10 bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform">Premium</span>
                    </Link>

                    <div className="w-[2px] h-4 bg-[var(--foreground)]/10"></div>

                    <Link href="/donate" className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                        <Heart size={16} className="text-pink-400 group-hover:fill-pink-400 transition-colors" />
                        Donate
                    </Link>

                    <div className="w-[2px] h-4 bg-[var(--foreground)]/10"></div>

                    <Link href="/about" className="text-sm font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                        About
                    </Link>
                </div>

                {/* --- PILL 3: ACTIONS & THEME --- */}
                <div className={`${pillBase} px-5 py-3 hidden md:flex gap-5 pointer-events-auto`}>

                    {/* Premium / Theme Dropdown Trigger */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                            <div className="bg-gradient-to-tr from-yellow-400 to-yellow-600 text-white p-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                                <Crown size={14} className="fill-white" />
                            </div>
                            <span className="hidden sm:inline">Themes</span>
                        </button>

                        {/* Hover Dropdown for Themes */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-white dark:bg-zinc-800 border-[3px] border-[var(--foreground)] rounded-2xl shadow-[4px_4px_0_0_var(--foreground)] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col p-2 gap-1 z-50">
                            <div className="text-xs font-bold text-center text-gray-400 uppercase tracking-widest py-1">Select Theme</div>
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id as any)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${theme === t.id ? 'bg-[var(--secondary)] text-[var(--primary)]' : 'hover:bg-gray-100 dark:hover:bg-zinc-700 text-[var(--foreground)]'}`}
                                >
                                    <div className="w-4 h-4 rounded-full border border-black/20 shadow-sm" style={{ backgroundColor: t.color }}></div>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-[2px] h-4 bg-[var(--foreground)]/20"></div>

                    {/* Auth */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className="flex items-center gap-2 text-xs font-bold bg-[var(--secondary)] pl-2 pr-3 py-1.5 rounded-full border border-[var(--foreground)] hover:bg-[var(--primary)] hover:text-white transition-colors group">
                                <div className="bg-white/50 p-1 rounded-full">
                                    <LayoutDashboard size={12} className="text-[var(--foreground)]" />
                                </div>
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                            <LogIn size={16} />
                            <span className="hidden sm:inline">Login</span>
                        </Link>
                    )}

                </div>

                {/* --- MOBILE: VISIBLE BAR (Premium + Dashboard + Menu) --- */}
                <div className={`${pillBase} px-4 py-3 flex md:hidden items-center justify-between w-full gap-2`}>

                    {/* Premium - Full Text */}
                    <Link href="/premium" className="flex-1 flex items-center justify-center gap-2 text-xs font-black bg-yellow-400 text-yellow-900 border-2 border-yellow-600 rounded-full py-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none transition-all">
                        <Crown size={14} className="fill-yellow-900" />
                        PREMIUM
                    </Link>

                    {/* Dashboard/Login - Full Text */}
                    {isLoggedIn ? (
                        <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-2 text-xs font-black bg-[var(--primary)] text-white border-2 border-black rounded-full py-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none transition-all">
                            <LayoutDashboard size={14} />
                            DASHBOARD
                        </Link>
                    ) : (
                        <Link href="/login" className="flex-1 flex items-center justify-center gap-2 text-xs font-black bg-[var(--primary)] text-white border-2 border-black rounded-full py-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none transition-all">
                            <LogIn size={14} />
                            LOGIN
                        </Link>
                    )}

                    {/* Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="bg-[var(--foreground)] text-[var(--background)] p-2 rounded-full border-2 border-[var(--primary)] shrink-0"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>


            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="pointer-events-auto absolute top-[80px] right-4 bg-white dark:bg-zinc-800 border-[3px] border-[var(--foreground)] rounded-3xl shadow-[8px_8px_0_0_var(--foreground)] overflow-hidden p-4 flex flex-col gap-2 z-50 w-64"
                    >
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 pt-2">Menu</div>
                        <Link href="/premium" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 font-bold hover:bg-[var(--secondary)] rounded-xl transition-colors flex items-center gap-2 text-[var(--foreground)]">
                            <Crown size={16} className="text-yellow-500" /> Premium Access
                        </Link>
                        <Link href="/donate" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 font-bold hover:bg-[var(--secondary)] rounded-xl transition-colors flex items-center gap-2 text-[var(--foreground)]">
                            <Heart size={16} className="text-pink-400" /> Donate
                        </Link>
                        <Link href="/about" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 font-bold hover:bg-[var(--secondary)] rounded-xl transition-colors text-[var(--foreground)]">
                            About Us
                        </Link>

                        <div className="h-[2px] bg-gray-100 dark:bg-zinc-700 my-1 mx-2"></div>

                        {/* Mobile Theme Switcher */}
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 pt-2">Themes</div>
                        <div className="grid grid-cols-4 gap-2 px-2 pb-2">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id as any)}
                                    className={`aspect-square rounded-full border-2 border-[var(--foreground)] flex items-center justify-center transition-all ${theme === t.id ? 'scale-110 shadow-md ring-2 ring-offset-2 ring-[var(--primary)]' : 'opacity-70'}`}
                                    style={{ backgroundColor: t.color }}
                                />
                            ))}
                        </div>

                        <div className="h-[2px] bg-gray-100 dark:bg-zinc-700 my-1 mx-2"></div>

                        {isLoggedIn && (
                            <button onClick={() => { logout(); setIsMenuOpen(false); }} className="px-4 py-3 font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left flex items-center gap-2">
                                <User size={16} /> Logout
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
