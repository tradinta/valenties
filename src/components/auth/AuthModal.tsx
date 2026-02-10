"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    toolName?: string;
}

export const AuthModal = ({ isOpen, onClose, toolName }: AuthModalProps) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { loginAnonymous } = useAuth();

    // Auto-login for demo purposes since user requested "easy"
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username) {
            await loginAnonymous(username);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white border-[3px] border-[var(--foreground)] rounded-3xl overflow-hidden shadow-[8px_8px_0_0_var(--foreground)]"
                    >
                        {/* Header */}
                        <div className="bg-[var(--secondary)] p-6 border-b-[3px] border-[var(--foreground)] flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-black font-display text-[var(--foreground)]">
                                    {isLogin ? 'Welcome Back!' : 'Join the Club'}
                                </h3>
                                <p className="text-sm font-bold opacity-70 mt-1 pb-4">
                                    ? `Login to save your "${toolName}" results.`
                                        : 'Login to track your chaotic stats.'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-white border-[2px] border-[var(--foreground)] rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 bg-[var(--background)]">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-black uppercase mb-2 ml-1">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={20} />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-white border-[3px] border-[var(--foreground)] rounded-xl py-3 pl-12 pr-4 font-bold focus:outline-none focus:shadow-[4px_4px_0_0_var(--foreground)] transition-shadow"
                                            placeholder="Casanova123"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black uppercase mb-2 ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={20} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white border-[3px] border-[var(--foreground)] rounded-xl py-3 pl-12 pr-4 font-bold focus:outline-none focus:shadow-[4px_4px_0_0_var(--foreground)] transition-shadow"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 w-full py-4 bg-[var(--primary)] text-white font-black text-lg rounded-xl border-[3px] border-[var(--foreground)] shadow-[4px_4px_0_0_var(--foreground)] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--foreground)] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 group"
                                >
                                    {isLogin ? 'Login' : 'Create Account'}
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm font-bold text-gray-500">
                                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-[var(--foreground)] underline decoration-wavy decoration-2 underline-offset-2 hover:text-[var(--primary)]"
                                    >
                                        {isLogin ? 'Sign Up' : 'Login'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
