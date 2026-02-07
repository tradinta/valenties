"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Scroll, AlertCircle } from 'lucide-react';

export const HardEssay = ({ onGiveUp }: { onGiveUp: () => void }) => {
    const [text, setText] = useState("");
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const TARGET = 3000;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="bg-rose-50 p-6 border-b border-rose-100">
                    <h2 className="text-2xl font-display font-bold text-rose-900 flex items-center gap-2">
                        <Scroll className="w-6 h-6" />
                        Formal Rejection Manifesto
                    </h2>
                    <p className="text-rose-700/80 mt-2">
                        To process your rejection, please submit a comprehensive essay detailing your reasoning.
                        Minimum requirement: {TARGET} words.
                    </p>
                </div>

                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    <textarea
                        className="w-full h-full min-h-[400px] p-6 text-lg font-serif leading-relaxed border-2 border-dashed border-gray-200 rounded-xl focus:border-rose-400 focus:ring-0 outline-none resize-none bg-gray-50"
                        placeholder="I, [Name], hereby declare my intention to refuse this Valentine's request because..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="p-6 bg-white border-t border-gray-100 space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                        <span className={wordCount < TARGET ? "text-red-500" : "text-green-500"}>
                            {wordCount} / {TARGET} Words
                        </span>
                        <span>{Math.round((wordCount / TARGET) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-rose-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (wordCount / TARGET) * 100)}%` }}
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button
                            disabled={wordCount < TARGET}
                            className="flex-1 bg-gray-900 text-white hover:bg-black py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {wordCount < TARGET ? "Write More to Submit" : "Submit Rejection"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onGiveUp}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        >
                            Okay fine, YES!
                        </Button>
                    </div>

                    {wordCount < 100 && (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded">
                            <AlertCircle className="w-4 h-4" />
                            Tip: Plagiarism detection is active. Do not copy paste.
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
