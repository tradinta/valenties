"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, LogOut, ExternalLink, Activity, Heart, Star, Sparkles, Lock, Crown, Mail, Image as ImageIcon, BarChart3, Box, Zap, Rocket, Github, MessageCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { TrapConfig, TrapStats } from '@/types';

interface TrapWithId extends TrapConfig {
    id: string;
    stats?: TrapStats;
}

interface CosmosDashboardProps {
    user: User | null;
    traps: TrapWithId[];
    onLogout: () => void;
    onSwitchTheme: () => void;
}

// --- ICONS & ASSETS ---
const AstroBear = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 200 200" className={className}>
        {/* Space Helmet Glass */}
        <circle cx="100" cy="100" r="85" fill="#E0F7FA" opacity="0.5" stroke="#A5D8FF" strokeWidth="4" />

        {/* Bear Head */}
        <circle cx="50" cy="60" r="25" fill="#D4A373" />
        <circle cx="150" cy="60" r="25" fill="#D4A373" />
        <circle cx="100" cy="100" r="70" fill="#D4A373" />
        <ellipse cx="100" cy="115" rx="35" ry="25" fill="#FFF0F3" />
        <ellipse cx="100" cy="105" rx="12" ry="8" fill="#4B3B32" />
        <circle cx="75" cy="90" r="6" fill="#4B3B32" />
        <circle cx="125" cy="90" r="6" fill="#4B3B32" />

        {/* Helmet Reflection */}
        <path d="M60 60 Q 100 20 140 60" fill="none" stroke="white" strokeWidth="8" opacity="0.6" strokeLinecap="round" />
    </svg>
);

export const CosmosDashboard: React.FC<CosmosDashboardProps> = ({ user, traps, onLogout, onSwitchTheme }) => {
    const [showPremium, setShowPremium] = useState(false);
    const [isPremium, setIsPremium] = useState(false); // Mock state

    return (
        <div className="min-h-screen w-full relative font-sans text-[#2D3436] cosmos-bear selection:bg-[#FF9EB5] selection:text-white overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <style jsx global>{`
                    body {
                        background-color: #FFFBF5;
                        background-image: 
                            radial-gradient(at 0% 0%, rgba(165, 216, 255, 0.4) 0px, transparent 50%),
                            radial-gradient(at 100% 0%, rgba(255, 158, 181, 0.3) 0px, transparent 50%),
                            radial-gradient(at 0% 100%, rgba(255, 209, 102, 0.3) 0px, transparent 50%);
                        background-attachment: fixed;
                    }
                    .glass-card {
                        background: rgba(255, 255, 255, 0.65);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.8);
                        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
                    }
                `}</style>
            </div>

            {/* User Header (Replaces Navbar) */}
            <div className="fixed top-20 right-4 z-40 flex justify-end pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-2 glass-card rounded-full px-4 py-2 mt-4">
                    <span className="hidden md:inline text-sm font-bold text-[#2D3436] mr-2">Hi, {user?.displayName || 'Captain'}</span>
                    <Button onClick={onLogout} variant="ghost" size="sm" className="rounded-full hover:bg-neutral-100 h-8 w-8 p-0">
                        <LogOut size={14} />
                    </Button>
                    <Link href="/">
                        <button className="bg-[#2D3436] text-white px-4 py-1.5 rounded-full font-bold text-xs hover:bg-[#FF7596] transition-colors shadow-lg shadow-[#FF9EB5]/20 flex items-center gap-2">
                            <Plus size={14} /> New
                        </button>
                    </Link>
                </div>
            </div>

            <main className="relative z-10 pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">

                    {/* Header / Hero Section */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-4 py-1.5 rounded-full bg-[#FFD166]/20 text-[#FFBA08] font-bold text-sm mb-6 border border-[#FFD166]/20">
                                ✨ Mission Control
                            </div>
                            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-[#2D3436] leading-[1.1] mb-6">
                                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9EB5] to-[#FFD166]">Universes</span>
                            </h1>
                            <p className="text-xl text-[#636E72] font-sans leading-relaxed mb-8 max-w-lg">
                                Manage your deployed traps. Each one is a sovereign chain of love. Monitor activity, check stats, and broadcast upgrades.
                            </p>

                            {!isPremium && (
                                <div onClick={() => setShowPremium(true)} className="glass-card p-4 rounded-2xl inline-flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform">
                                    <div className="w-10 h-10 bg-[#A5D8FF] rounded-xl flex items-center justify-center text-white shadow-lg">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">Upgrade to Mainnet</div>
                                        <div className="text-xs text-[#636E72]">Unlock full analytics & support</div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        <div className="relative flex justify-center">
                            <motion.div
                                animate={{ y: [-20, 20, -20] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="w-64 h-64 md:w-80 md:h-80 relative z-10"
                            >
                                <AstroBear className="w-full h-full drop-shadow-2xl" />

                                {/* Orbiting Elements */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border border-dashed border-[#FF9EB5]/30"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-40px] rounded-full border border-dashed border-[#A5D8FF]/30"
                                />

                                <motion.div
                                    className="absolute top-0 right-0 glass-card p-3 rounded-xl flex items-center gap-2 animate-bounce"
                                    style={{ animationDuration: '3s' }}
                                >
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white"><Box size={16} /></div>
                                    <span className="font-bold text-xs">{traps.length} Nodes</span>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Traps Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {traps.map((trap, i) => (
                            <motion.div
                                key={trap.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card rounded-[2rem] p-8 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${trap.status === 'completed' ? 'from-green-400 to-green-200' : 'from-[#FF9EB5] to-[#FFD166]'}`}></div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${trap.status === 'completed' ? 'bg-green-400' : 'bg-[#FF9EB5]'}`}>
                                        {trap.status === 'completed' ? <Heart size={24} fill="currentColor" /> : <Rocket size={24} />}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${trap.status === 'completed'
                                        ? 'bg-green-50 border-green-200 text-green-600'
                                        : 'bg-white border-white text-[#FF9EB5]'
                                        }`}>
                                        {trap.status === 'completed' ? 'Finalized' : 'In Progress'}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="text-xs font-bold text-[#636E72] uppercase tracking-widest mb-1">Target Node</div>
                                    <h3 className="font-display font-bold text-2xl text-[#2D3436] truncate">{trap.partnerName}</h3>
                                </div>

                                {trap.responseNote && (
                                    <div className="mb-6 bg-white/40 p-4 rounded-2xl border border-white/50 relative overflow-hidden">
                                        <p className="text-sm text-[#2D3436] font-medium italic relative z-10">"{trap.responseNote}"</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/30 p-3 rounded-xl">
                                        <div className="text-xs font-bold text-[#636E72] uppercase">Refusals</div>
                                        <div className="text-xl font-display font-bold text-[#FF7596]">{trap.stats?.attempts || 0}</div>
                                    </div>
                                    <div className="bg-white/30 p-3 rounded-xl relative overflow-hidden">
                                        {!isPremium && <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center"><Lock size={14} className="text-[#636E72]" /></div>}
                                        <div className="text-[10px] font-bold text-[#636E72] uppercase">Packets</div>
                                        <div className="text-xl font-display font-bold text-[#FF7596]">{trap.stats?.views || 0}</div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Link href={`/share/${trap.id}`} target="_blank" className="flex-1">
                                        <Button className="w-full bg-white hover:bg-white/80 text-[#2D3436] rounded-xl font-bold shadow-sm border border-white/50">
                                            Visit Link
                                        </Button>
                                    </Link>
                                    <Link href={`/created/${trap.id}`} className="flex-1">
                                        <Button className="w-full bg-[#2D3436] hover:bg-[#FF7596] text-white rounded-xl font-bold shadow-lg">
                                            Console
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}

                        {traps.length === 0 && (
                            <div className="md:col-span-3 text-center py-20 bg-white/30 rounded-[3rem] border-2 border-dashed border-[#FF9EB5]/30">
                                <div className="mb-6 inline-block p-6 bg-white rounded-full shadow-lg">
                                    <Rocket size={48} className="text-[#FF9EB5]" />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-[#2D3436] mb-2">No Universes Detected</h3>
                                <p className="text-[#636E72] mb-8">Start your first mission to capture a heart.</p>
                                <Link href="/">
                                    <button className="px-8 py-4 bg-[#FF9EB5] hover:bg-[#FF7596] text-white rounded-2xl font-display font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                                        Launch New Mission
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Premium Modal */}
            <AnimatePresence>
                {showPremium && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#2D3436]/30 backdrop-blur-md"
                            onClick={() => setShowPremium(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#FFFBF5] relative z-10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white"
                        >
                            {/* Decorative header bg */}
                            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#FFD166]/20 to-transparent pointer-events-none" />

                            <div className="p-8 relative">
                                <button onClick={() => setShowPremium(false)} className="absolute top-8 right-8 p-2 bg-white rounded-full hover:bg-neutral-100 transition-colors text-[#2D3436]">
                                    X
                                </button>

                                <div className="text-center mb-10 mt-4">
                                    <div className="inline-flex p-4 bg-[#FFD166] rounded-2xl mb-4 shadow-lg shadow-[#FFD166]/30 rotate-3">
                                        <Crown size={32} className="text-white" />
                                    </div>
                                    <h2 className="text-4xl font-display font-black text-[#2D3436] mb-2">Upgrade Your Fleet</h2>
                                    <p className="text-[#636E72]">Get mainnet performance and enterprise features.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div onClick={() => setIsPremium(true)} className="glass-card p-6 rounded-3xl border-2 border-[#FFD166] bg-[#FFD166]/10 cursor-pointer relative overflow-hidden transition-transform hover:scale-[1.02]">
                                        <div className="absolute top-0 right-0 bg-[#FFD166] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">Best Value</div>
                                        <h3 className="font-bold text-lg text-[#2D3436]">One-Time Love</h3>
                                        <div className="flex items-baseline gap-1 my-2">
                                            <span className="text-3xl font-black text-[#2D3436]">$2.99</span>
                                            <span className="text-[#636E72] font-medium text-sm">forever</span>
                                        </div>
                                        <button className="w-full mt-4 py-3 bg-[#FFD166] text-[#2D3436] font-bold rounded-xl shadow-lg">Select Plan</button>
                                    </div>

                                    <div onClick={() => setIsPremium(true)} className="glass-card p-6 rounded-3xl border-2 border-white bg-white/50 cursor-pointer transition-transform hover:scale-[1.02]">
                                        <h3 className="font-bold text-lg text-[#2D3436]">Secret Admirer</h3>
                                        <div className="flex items-baseline gap-1 my-2">
                                            <span className="text-3xl font-black text-[#2D3436]">$1.50</span>
                                            <span className="text-[#636E72] font-medium text-sm">/ month</span>
                                        </div>
                                        <button className="w-full mt-4 py-3 bg-[#2D3436] text-white font-bold rounded-xl shadow-lg">Select Plan</button>
                                    </div>
                                </div>

                                <div className="bg-white/50 rounded-2xl p-6 border border-white">
                                    <div className="grid grid-cols-2 gap-3 text-sm font-bold text-[#636E72]">
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Unlimited Nodes</div>
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Custom Assets</div>
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Priority RPC</div>
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Full Log History</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
// Helper for pricing cards can be removed or kept defined
const PricingCard = ({ title, price, period, popular, features, onClick }: any) => (
    <div
        onClick={onClick}
        className={`cursor-pointer p-6 rounded-3xl border-2 transition-all hover:scale-[1.02] ${popular ? 'border-amber-400 bg-amber-50/50' : 'border-slate-100 hover:border-rose-200 bg-white'}`}
    >
        {popular && <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Best Value</div>}
        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
        <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-black text-slate-900">{price}</span>
            <span className="text-slate-400 font-medium text-sm">{period}</span>
        </div>
        <ul className="space-y-2 mt-4 opacity-70">
            {features.map((f: string) => (
                <li key={f} className="text-xs font-bold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {f}
                </li>
            ))}
        </ul>
        <Button className={`w-full mt-6 rounded-xl font-bold ${popular ? 'bg-amber-400 hover:bg-amber-500 text-white shadow-amber-200' : 'bg-slate-900 text-white'}`}>
            Select
        </Button>
    </div>
);
