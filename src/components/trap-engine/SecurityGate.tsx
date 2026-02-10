"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { AnalyticsEvent } from '@/types';

interface SecurityGateProps {
    question: string;
    answer: string;
    onUnlock: () => void;
    hint?: string;
    scold?: string;
    logEvent: (type: AnalyticsEvent['type'], metadata?: Record<string, unknown>) => void;
}

export const SecurityGate: React.FC<SecurityGateProps> = ({ question, answer, onUnlock, hint, scold, logEvent }) => {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple case-insensitive check
        if (input.trim().toLowerCase() === answer.trim().toLowerCase()) {
            logEvent('attempt_security', { success: true, input });
            onUnlock();
        } else {
            logEvent('attempt_security', { success: false, input });
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 transition-all duration-500">
            <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="max-w-md w-full bg-card rounded-3xl p-8 space-y-6 text-center shadow-brutal border-[3px] border-border"
            >
                <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                    <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black font-display text-foreground tracking-tight uppercase">Security Check</h2>
                    <p className="text-muted-foreground font-bold italic">This trap is protected.</p>
                </div>

                <div className="bg-background p-6 rounded-2xl border-[3px] border-border font-bold text-xl text-foreground shadow-brutal-sm">
                    "{question}"
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className={`w-full border-[3px] rounded-xl px-4 py-4 text-lg outline-none transition-all placeholder:text-muted-foreground font-bold text-center bg-background ${error ? 'border-red-500 text-red-500 ring-2 ring-red-500/20' : 'border-border focus:border-primary focus:shadow-brutal-sm'}`}
                        placeholder="Type the secret answer..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoFocus
                    />

                    {error && scold && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 font-bold text-sm">
                            ⚠️ {scold}
                        </motion.p>
                    )}

                    <Button type="submit" className="w-full bg-primary hover:opacity-90 text-primary-foreground py-6 text-xl rounded-xl font-black border-[3px] border-border shadow-brutal transition-all active:scale-95">
                        UNLOCK 🔓
                    </Button>
                </form>

                {hint && (
                    <div className="pt-2">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="text-xs font-black text-primary hover:text-foreground uppercase tracking-widest hover:underline"
                        >
                            {showHint ? "Hide Hint" : "Need a Hint?"}
                        </button>
                        {showHint && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-foreground mt-2 font-bold italic bg-primary/10 border-2 border-primary/20 p-2 rounded-lg">
                                💡 Psst: {hint}
                            </motion.p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
