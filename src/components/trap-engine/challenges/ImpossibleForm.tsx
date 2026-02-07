"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FileWarning, X } from 'lucide-react';

export const ImpossibleForm = ({ onGiveUp }: { onGiveUp: () => void }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (Math.random() > 0.4 && step > 1) {
                alert("Error 418: I'm a teapot. Please submit form 808-Z first.");
                setStep(1);
            } else {
                setStep(s => s + 1);
            }
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
            <motion.div
                layout
                className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden font-mono text-sm border-2 border-gray-300 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-gray-100 border-b p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <FileWarning className="w-5 h-5 text-red-600" />
                        <span className="font-bold text-gray-700">Form 143-N (Rejection Request)</span>
                    </div>

                    {/* Explicit Close Button for Preview Safety */}
                    <button onClick={onGiveUp} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Bar (Fake) */}
                <div className="w-full bg-gray-200 h-1">
                    <div
                        className="bg-red-500 h-1 transition-all duration-500"
                        style={{ width: `${(step / 10) * 100}%` }}
                    />
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    <div className="flex justify-between items-center text-xs text-gray-400 uppercase font-bold">
                        <span>Page {step} of {Math.floor(Math.random() * 50) + 10}</span>
                        <span>Ref: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                    </div>

                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8 fade-in">
                            <h3 className="font-bold text-lg text-gray-900 border-b pb-2">Part I: Preliminary Regret</h3>

                            <div className="space-y-2">
                                <label className="block text-xs uppercase font-bold text-gray-500">Nature of Rejection</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="reason" className="accent-red-500" />
                                        <span>I am making a terrible mistake</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="reason" className="accent-red-500" />
                                        <span>I hate fun and happiness</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                                        <input type="radio" name="reason" className="accent-red-500" />
                                        <span>I clicked logic by accident</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs uppercase font-bold text-gray-500">Essay: Why? (Min 500 chars)</label>
                                <textarea className="w-full border p-2 h-24 focus:ring-2 focus:ring-red-500 outline-none" placeholder="I am making a mistake because..." />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8 fade-in">
                            <h3 className="font-bold text-lg text-gray-900 border-b pb-2">Part II: Consequence Acknowledgment</h3>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            Did you know that 98% of people who click "No" report immediate feelings of intense regret?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input type="checkbox" className="mt-1 accent-red-500" />
                                    <span>I acknowledge that my Valentine is awesome.</span>
                                </label>
                                <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input type="checkbox" className="mt-1 accent-red-500" />
                                    <span>I accept full responsibility for the sadness caused.</span>
                                </label>
                                <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input type="checkbox" className="mt-1 accent-red-500" />
                                    <span>I agree to pay the emotional damages tax ($500.00).</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {step >= 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8 fade-in">
                            <h3 className="font-bold text-lg text-gray-900 border-b pb-2">Part III: Final Verification</h3>

                            <div className="space-y-2">
                                <label className="block text-xs uppercase font-bold text-gray-500">Upload Notarized Affidavit (PDF only)</label>
                                <input type="file" className="w-full border p-2 bg-gray-50" disabled />
                                <p className="text-[10px] text-red-500 font-bold">* Server is currently crying. Please try again later.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs uppercase font-bold text-gray-500">Captcha</label>
                                <div className="bg-gray-100 p-4 text-center border font-serif italic text-lg select-none">
                                    Please solve: <span className="font-bold">∫ (Heartache) dx from 0 to ∞</span>
                                </div>
                                <input type="text" className="w-full border p-2" placeholder="Answer..." />
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t flex flex-col gap-3">
                        <Button
                            variant="default"
                            className="bg-gray-800 hover:bg-gray-900 w-full disabled:opacity-50"
                            onClick={handleNext}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Next Page >"}
                        </Button>

                        <button onClick={onGiveUp} className="w-full text-center text-xs text-pink-500 hover:underline hover:text-pink-600 py-2">
                            Stop this madness. I'll just say YES.
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
