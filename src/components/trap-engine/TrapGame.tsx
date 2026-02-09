"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NoButton } from '@/components/trap-engine/NoButton';
import { YesButton } from '@/components/trap-engine/YesButton';
import { MechanicDispatcher } from '@/components/trap-engine/MechanicDispatcher';
import { ChaosLayer } from '@/components/trap-engine/ChaosLayer';
import { TrapData, AnalyticsEvent } from '@/types';
import { TrapService } from '@/services/TrapService';
import { Heart } from 'lucide-react';

interface TrapGameProps {
    data: TrapData;
    id: string;
    logEvent: (type: AnalyticsEvent['type'], metadata?: Record<string, unknown>) => void;
}

export const TrapGame: React.FC<TrapGameProps> = ({ data, id, logEvent }) => {
    const [attempts, setAttempts] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const hasCompleted = useRef(false);

    const handleAttempt = () => {
        setAttempts(prev => prev + 1);
        logEvent('click_no', { mechanic: data.noMechanic });
    };

    const [hasPlayedBefore, setHasPlayedBefore] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem(`trap_complete_${id}`)) {
            setHasPlayedBefore(true);
        }
    }, [id]);

    const handleSuccess = async () => {
        if (hasCompleted.current) return;
        hasCompleted.current = true;
        setIsSuccess(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`trap_complete_${id}`, 'true');
        }

        logEvent('click_yes', { attempts });

        try {
            // Use TrapService instead of raw Firestore
            await TrapService.markCompleted(id, attempts);
        } catch {
            // Silently fail - don't expose errors to partner
        }
    };

    const [note, setNote] = useState('');
    const [noteSent, setNoteSent] = useState(false);

    const saveNote = async () => {
        if (!note.trim()) return;
        try {
            await TrapService.saveResponseNote(id, note);
            setNoteSent(true);
        } catch {
            // Silently fail
        }
    }

    if (hasPlayedBefore) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl max-w-md mx-auto"
            >
                <Heart className="w-16 h-16 text-rose-400 fill-rose-100" />
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-rose-900 font-display">You already said YES!</h2>
                    <p className="text-rose-800/70">The trap has been sprung. Using this device, you've already accepted the love.</p>
                </div>
                <button
                    onClick={() => setHasPlayedBefore(false)}
                    className="px-6 py-3 bg-white border-2 border-rose-200 text-rose-600 font-bold rounded-full hover:bg-rose-50 transition-colors"
                >
                    Relive the Experience ↺
                </button>
            </motion.div>
        );
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 max-w-lg mx-auto p-4"
            >
                <div className="flex items-center gap-4">
                    <h2 className="text-6xl font-black text-rose-600 font-display">YAY!</h2>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                    >
                        <Heart className="w-16 h-16 text-rose-600 fill-rose-600" />
                    </motion.div>
                </div>
                <div className="text-2xl text-rose-800 font-medium space-y-2 font-display">
                    <p>{data.successMessage || "You said YES!"}</p>
                    <p className="text-base opacity-75">It only took you {attempts} tries to refuse...</p>
                </div>

                {/* Note Section */}
                {!noteSent ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="w-full space-y-3 bg-white/50 p-6 rounded-2xl border border-pink-200 backdrop-blur-sm shadow-xl"
                    >
                        <label className="block text-sm font-bold text-rose-700 uppercase tracking-wider">
                            Leave a sweet note for {data.creatorName || 'them'}?
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full p-3 rounded-xl border border-pink-200 bg-white/80 focus:ring-2 focus:ring-rose-400 focus:outline-none text-rose-900 placeholder:text-rose-300 min-h-[100px]"
                            placeholder="Type something nice..."
                        />
                        <button
                            onClick={saveNote}
                            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95"
                        >
                            Send Note 💌
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="bg-white/80 px-6 py-4 rounded-xl text-rose-600 font-bold shadow-lg border border-pink-100"
                    >
                        Message Sent! 🦅
                    </motion.div>
                )}
            </motion.div>
        );
    }

    return (
        <div className="relative w-full min-h-[60vh] flex flex-col items-center justify-center gap-12">
            <ChaosLayer mode={data.chaosMode || 'none'} />

            {/* The Question */}
            <div className="relative z-10 text-center space-y-8 bg-white/30 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black text-rose-600 drop-shadow-sm">
                        {data.partnerName},
                    </h2>
                    <p className="text-2xl md:text-3xl font-medium text-rose-900/90 whitespace-pre-wrap max-w-xl mx-auto leading-relaxed">
                        {data.message}
                    </p>
                </div>

                {data.assets?.image && (
                    <motion.div
                        initial={{ rotate: -2 }}
                        whileHover={{ rotate: 2 }}
                        className="w-64 h-64 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-lg rotate-[-2deg]"
                    >
                        <img src={data.assets.image} alt="Us" className="w-full h-full object-cover" />
                    </motion.div>
                )}
            </div>

            {/* The Buttons Container */}
            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16 z-20">
                <YesButton onSuccess={handleSuccess} mechanic={data.yesMechanic || 'simple'} />

                <div className="relative w-32 h-16 flex items-center justify-center">
                    <MechanicDispatcher
                        mechanic={data.noMechanic || 'run-away'}
                        difficulty={data.difficulty}
                        onAttempt={handleAttempt}
                        onSuccess={handleSuccess}
                    />
                </div>
            </div>

        </div>
    );
};
