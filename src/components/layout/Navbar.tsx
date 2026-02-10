"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Crown, Heart, LayoutDashboard, LogIn, User, Palette } from 'lucide-react';
import Link from 'next/link';
import { useTheme, Theme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { LogoDroplet } from '@/components/ui/LogoDroplet';

const THEMES: { id: Theme; color: string; label: string; emoji: string }[] = [
    { id: 'classic', color: '#FF0040', label: 'Classic', emoji: '☀️' },
    { id: 'dark', color: '#FF1744', label: 'Noir', emoji: '🌙' },
    { id: 'neon', color: '#FF00FF', label: 'Cyber', emoji: '⚡' },
];

export const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { firebaseUser, isLoggedIn, logout, isAdmin, userTier } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
            <div className="flex justify-between items-center w-full max-w-7xl gap-4 flex-wrap md:flex-nowrap">

                {/* --- PILL 1: LOGO (Desktop) --- */}
                <div className="pill-nav px-5 py-3 min-w-[120px] hidden md:flex pointer-events-auto">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <LogoDroplet className="w-full h-full" />
                        </div>
                        <span className="text-xl font-black font-display tracking-tight text-foreground hidden sm:block">
                            kihumba
                        </span>
                    </Link>
                </div>

                {/* --- PILL 2: LINKS (Desktop) --- */}
                <div className="pill-nav px-6 py-3 hidden md:flex gap-6 pointer-events-auto">
                    <Link href="/premium" className="group flex items-center gap-2 text-sm font-black text-foreground hover:text-primary transition-colors relative">
                        <span className="absolute -inset-2 rounded-full border-[2px] border-transparent group-hover:border-yellow-400/50 group-hover:bg-yellow-50/50 transition-all"></span>
                        <Crown size={16} className="text-yellow-500 fill-yellow-500 animate-pulse relative z-10" />
                        <span className="relative z-10 bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform">Premium</span>
                    </Link>

                    <div className="w-[2px] h-4 bg-foreground/10"></div>

                    <Link href="/donate" className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                        <Heart size={16} className="text-pink-400 group-hover:fill-pink-400 transition-colors" />
                        Donate
                    </Link>

                    <div className="w-[2px] h-4 bg-foreground/10"></div>

                    <Link href="/about" className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                        About
                    </Link>
                </div>

                {/* --- PILL 3: ACTIONS (Desktop) --- */}
                <div className="pill-nav px-5 py-3 hidden md:flex gap-5 pointer-events-auto">

                    {/* Theme Switcher */}
                    <div className="relative group">
                        <button className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                            <div className="p-1.5 rounded-full border-2 border-foreground/20 hover:border-primary/50 transition-colors">
                                <Palette size={14} />
                            </div>
                            <span className="hidden sm:inline">Theme</span>
                        </button>

                        {/* Hover Dropdown */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 bg-card border-[3px] border-border rounded-2xl shadow-[var(--shadow-brutal)] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col p-2 gap-1 z-50">
                            <div className="text-xs font-bold text-center text-muted-foreground uppercase tracking-widest py-1">Select Theme</div>
                            {THEMES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${theme === t.id
                                        ? 'bg-secondary text-primary'
                                        : 'hover:bg-secondary/50 text-foreground'
                                        }`}
                                >
                                    <div className="w-5 h-5 rounded-full border-2 border-foreground/20 shadow-sm flex items-center justify-center text-xs" style={{ backgroundColor: t.color }}>
                                        {theme === t.id && <span className="text-white text-[8px]">✓</span>}
                                    </div>
                                    <span>{t.emoji} {t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-[2px] h-4 bg-foreground/20"></div>

                    {/* Auth */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className="flex items-center gap-2 text-xs font-bold bg-secondary pl-2 pr-3 py-1.5 rounded-full border border-foreground/20 hover:bg-primary hover:text-primary-foreground transition-colors group">
                                <div className="bg-card/50 p-1 rounded-full">
                                    <LayoutDashboard size={12} className="text-foreground" />
                                </div>
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            {/* Tier Badge */}
                            {(['starter', 'casual', 'premium', 'admin'].includes(userTier)) && (
                                <Link href="/premium" className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-[10px] font-black uppercase text-yellow-600 hover:bg-yellow-500 hover:text-yellow-950 transition-colors">
                                    <Crown size={10} strokeWidth={3} />
                                    <span>{userTier}</span>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                            <LogIn size={16} />
                            <span className="hidden sm:inline">Login</span>
                        </Link>
                    )}

                </div>

                {/* --- MOBILE BAR --- */}
                <div className="pill-nav px-4 py-3 flex md:hidden items-center justify-between w-full gap-2 pointer-events-auto">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-1.5">
                        <LogoDroplet className="w-6 h-6" />
                        <span className="text-sm font-black font-display text-foreground">kihumba</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        {/* Dashboard/Login */}
                        {isLoggedIn ? (
                            <Link href="/dashboard" className="flex items-center justify-center gap-1.5 text-[10px] font-black bg-primary text-primary-foreground border-2 border-border rounded-full px-3 py-1.5 active:translate-y-[1px] transition-all">
                                <LayoutDashboard size={12} />
                                <span className="hidden xs:inline">DASHBOARD</span>
                            </Link>
                        ) : (
                            <Link href="/login" className="flex items-center justify-center gap-1.5 text-[10px] font-black bg-primary text-primary-foreground border-2 border-border rounded-full px-3 py-1.5 active:translate-y-[1px] transition-all">
                                <LogIn size={12} />
                                LOGIN
                            </Link>
                        )}

                        {/* Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="bg-foreground text-background p-2 rounded-full border-2 border-primary shrink-0"
                        >
                            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>

            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="pointer-events-auto absolute top-[80px] right-4 bg-card border-[3px] border-border rounded-3xl shadow-[var(--shadow-brutal-lg)] overflow-hidden p-4 flex flex-col gap-2 z-50 w-64"
                    >
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-4 pt-2">Menu</div>
                        <Link href="/premium" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 font-bold hover:bg-secondary rounded-xl transition-colors flex items-center gap-2 text-foreground">
                            <Crown size={16} className="text-yellow-500" /> Premium Access
                        </Link>
                        <Link href="/donate" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 font-bold hover:bg-secondary rounded-xl transition-colors flex items-center gap-2 text-foreground">
                            <Heart size={16} className="text-pink-400" /> Donate
                        </Link>
                        <Link href="/about" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 font-bold hover:bg-secondary rounded-xl transition-colors text-foreground">
                            About Us
                        </Link>

                        <div className="h-[2px] bg-muted my-1 mx-2"></div>

                        {/* Mobile Theme Switcher */}
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-4 pt-2">Themes</div>
                        <div className="flex flex-col gap-1 px-2 pb-2">
                            {THEMES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all ${theme === t.id ? 'bg-secondary ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <div className="w-5 h-5 rounded-full border-2 border-foreground/20" style={{ backgroundColor: t.color }} />
                                    <span className="text-foreground">{t.emoji} {t.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="h-[2px] bg-muted my-1 mx-2"></div>

                        {isLoggedIn && (
                            <button onClick={() => { logout(); setIsMenuOpen(false); }} className="px-4 py-3 font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-left flex items-center gap-2">
                                <User size={16} /> Logout
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
