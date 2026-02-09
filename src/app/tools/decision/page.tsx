"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Trash2, Plus, ArrowRight, ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { DecisionService } from '@/services/DecisionService';
import { AuthModal } from '@/components/auth/AuthModal';

export default function DecisionPage() {
    const { firebaseUser } = useAuth();
    const [options, setOptions] = useState([
        { id: '1', text: '' },
        { id: '2', text: '' }
    ]);
    const [result, setResult] = useState<string | null>(null);
    const [rolling, setRolling] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [savedId, setSavedId] = useState<string | null>(null);

    const addOption = () => {
        setOptions([...options, { id: Math.random().toString(), text: '' }]);
    };

    const removeOption = (id: string) => {
        setOptions(options.filter(o => o.id !== id));
    };

    const updateOption = (id: string, text: string) => {
        setOptions(options.map(o => o.id === id ? { ...o, text } : o));
    };

    const handleRoll = () => {
        const validOptions = options.filter(o => o.text.trim() !== '');
        if (validOptions.length < 2) return alert("Need at least 2 options!");

        setRolling(true);
        setResult(null);
        setSavedId(null);

        // Fake rolling animation time
        setTimeout(() => {
            const winner = validOptions[Math.floor(Math.random() * validOptions.length)];
            setRolling(false);
            setResult(winner.text);
        }, 1500);
    };

    const handleSave = async () => {
        if (!firebaseUser) {
            setShowAuthModal(true);
            return;
        }

        if (!result) return;

        setSaving(true);
        try {
            const validOptions = options.filter(o => o.text.trim() !== '').map(o => o.text);
            const id = await DecisionService.create(
                "Decision Dice Roll", // Default question/title since we don't have one
                validOptions,
                result,
                firebaseUser.uid
            );
            setSavedId(id);
        } catch {
            alert("Failed to save result");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4 font-sans text-[#1a1817] flex justify-center">
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                toolName="Decision Dice"
            />

            <div className="max-w-lg w-full space-y-8">

                <div className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 font-bold hover:underline opacity-60 hover:opacity-100 transition-opacity">
                        <ArrowLeft className="w-4 h-4" /> Back Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black uppercase">Decision <span className="text-[#A7F3D0] bg-black px-2">Dice</span></h1>
                    <p className="font-bold text-gray-500">Stop arguing about dinner. Let chaos decide.</p>
                </div>

                <div className="bg-white border-[4px] border-black rounded-[2rem] p-8 shadow-[8px_8px_0_0_#000]">

                    {!result && !rolling && (
                        <div className="space-y-4">
                            {options.map((opt, i) => (
                                <div key={opt.id} className="flex gap-2">
                                    <input
                                        value={opt.text}
                                        onChange={(e) => updateOption(opt.id, e.target.value)}
                                        placeholder={`Option ${i + 1}`}
                                        className="flex-1 bg-gray-50 border-2 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:bg-[#A7F3D0]/20"
                                        autoFocus={i === options.length - 1} // Auto-focus new field
                                    />
                                    {options.length > 2 && (
                                        <button onClick={() => removeOption(opt.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addOption}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl font-bold text-gray-400 hover:border-black hover:text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Add Option
                            </button>

                            <button
                                onClick={handleRoll}
                                disabled={options.filter(o => o.text.trim()).length < 2}
                                className="w-full py-4 mt-4 bg-black text-white text-xl font-black rounded-xl shadow-[4px_4px_0_0_#A7F3D0] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#A7F3D0] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:transform-none"
                            >
                                Roll the Dice
                            </button>
                        </div>
                    )}

                    {/* Rendering Logic for Rolling/Result */}
                    <AnimatePresence mode="wait">
                        {rolling && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-20 text-center"
                                key="rolling"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                                    className="inline-block"
                                >
                                    <Dices className="w-20 h-20 text-black" />
                                </motion.div>
                                <h3 className="text-2xl font-black mt-6">Rolling...</h3>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-10 space-y-8"
                                key="result"
                            >
                                <div>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">The Universe Chose</p>
                                    <h2 className="text-4xl md:text-5xl font-black text-[#FF0040] break-words">{result}</h2>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => setResult(null)}
                                        className="w-full px-8 py-3 bg-white border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white transition-colors"
                                    >
                                        Roll Again
                                    </button>

                                    {!savedId ? (
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full px-8 py-3 bg-[#A7F3D0] border-2 border-black rounded-xl font-bold hover:brightness-105 transition-all flex items-center justify-center gap-2"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {saving ? 'Saving...' : 'Save Result'}
                                        </button>
                                    ) : (
                                        <div className="w-full px-8 py-3 bg-green-100 text-green-700 rounded-xl font-bold flex items-center justify-center gap-2">
                                            Saved to Dashboard!
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
