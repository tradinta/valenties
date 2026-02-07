"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Drama, Heart, Lock, Sparkles, Rocket } from 'lucide-react';

export const IntroStep = ({ onNext }: { onNext: () => void }) => {
    return (
        <div className="text-center space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-yellow)] border-2 border-black text-black text-sm font-bold shadow-[3px_3px_0_0_#000] rotate-1 mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>Create the perfect trap</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-display text-black dark:text-white leading-tight drop-shadow-[3px_3px_0_rgba(0,0,0,0.1)]">
                    The Heart Lab
                </h1>
                <p className="text-lg md:text-xl text-[var(--foreground-muted)] dark:text-gray-300 font-sans font-medium max-w-xl mx-auto italic">
                    "A collection of enchanted interactive trials for the perfect proposal."
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto py-8"
            >
                <div className="p-6 rounded-2xl bg-[var(--cream)] border-[3px] border-black shadow-[5px_5px_0_0_#000] hover:shadow-[7px_7px_0_0_#000] hover:-translate-y-1 transition-all group rotate-1 hover:rotate-0">
                    <div className="w-12 h-12 bg-[var(--primary)] rounded-xl border-2 border-black flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform shadow-[3px_3px_0_0_#000]">
                        <Drama className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-black mb-2">Cunning Tricks</h3>
                    <p className="text-sm text-gray-800 leading-relaxed font-sans font-medium">
                        Buttons that gracefully dance away, shrink, or fight back against rejection.
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--secondary)] border-[3px] border-black shadow-[5px_5px_0_0_#000] hover:shadow-[7px_7px_0_0_#000] hover:-translate-y-1 transition-all group -rotate-1 hover:rotate-0">
                    <div className="w-12 h-12 bg-[var(--rose)] rounded-xl border-2 border-black flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform shadow-[3px_3px_0_0_#000]">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-black mb-2">Sweet Rewards</h3>
                    <p className="text-sm text-gray-800 leading-relaxed font-sans font-medium">
                        Confetti bursts, growing hearts, and magical effects for the "Yes" moment.
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-[var(--accent)] border-[3px] border-black shadow-[5px_5px_0_0_#000] hover:shadow-[7px_7px_0_0_#000] hover:-translate-y-1 transition-all group rotate-1 hover:rotate-0">
                    <div className="w-12 h-12 bg-black rounded-xl border-2 border-black flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform shadow-[3px_3px_0_0_rgba(255,255,255,0.5)]">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-black mb-2">Secure & Safe</h3>
                    <p className="text-sm text-gray-800 leading-relaxed font-sans font-medium">
                        Protect your question with a secret code, ensuring only they see it.
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
            >
                <Button
                    onClick={onNext}
                    size="lg"
                    className="text-xl px-12 py-8 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white border-[3px] border-black shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 active:shadow-[2px_2px_0_0_#000] active:translate-y-[1px] transition-all duration-200 font-display flex items-center gap-3"
                >
                    Start Creating <Rocket className="w-6 h-6" />
                </Button>

                <div className="mt-8">
                    <a href="/login" className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline transition-colors">
                        Already have an account? Login to Dashboard
                    </a>
                </div>
            </motion.div>
        </div>
    );
};
