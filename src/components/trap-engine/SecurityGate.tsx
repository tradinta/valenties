"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface SecurityGateProps {
    question: string;
    answer: string;
    onUnlock: () => void;
}

export const SecurityGate: React.FC<SecurityGateProps & { hint?: string; scold?: string; logEvent: any }> = ({ question, answer, onUnlock, hint, scold, logEvent }) => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-all">
            <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="max-w-md w-full bg-white rounded-3xl p-8 space-y-6 text-center shadow-2xl border-4 border-pink-200"
            >
                <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 text-pink-500">
                    <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-black font-display text-gray-900 tracking-tight">Security Check</h2>
                    <p className="text-gray-600 font-medium">This trap is protected.</p>
                </div>

                <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 font-bold text-xl text-pink-900 shadow-inner">
                    "{question}"
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className={`w-full border-2 rounded-xl px-4 py-4 text-lg outline-none transition-all placeholder:text-gray-300 font-bold text-center ${error ? 'border-red-500 bg-red-50 text-red-900' : 'border-gray-200 focus:border-pink-500'}`}
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

                    <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 py-6 text-xl rounded-xl font-black shadow-lg hover:shadow-xl transition-all active:scale-95">
                        UNLOCK
                    </Button>
                </form>

                {hint && (
                    <div className="pt-2">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="text-xs font-bold text-pink-400 hover:text-pink-600 uppercase tracking-widest hover:underline"
                        >
                            {showHint ? "Hide Hint" : "Need a Hint?"}
                        </button>
                        {showHint && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-pink-600 mt-2 font-medium italic bg-pink-50 p-2 rounded-lg">
                                💡 Psst: {hint}
                            </motion.p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
