"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const EssayChallenge = ({ onGiveUp }: { onGiveUp: () => void }) => {
    const [text, setText] = useState("");
    const [wordCount, setWordCount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        setWordCount(e.target.value.trim().split(/\s+/).length);
    };

    // Evil deletion logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (text.length > 10 && Math.random() > 0.6) {
                setText(prev => prev.slice(0, -Math.floor(Math.random() * 5))); // Delete random chars from end
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 space-y-4"
            >
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-red-600">Rejection requires an explanation.</h3>
                    <p className="text-sm text-gray-600">Please write a 400-word essay on why you are making this choice.</p>
                </div>

                <div className="relative">
                    <textarea
                        className="w-full h-48 border-2 border-red-100 rounded-lg p-4 focus:ring-2 focus:ring-red-500 outline-none resize-none font-serif"
                        placeholder="Start typin... hey wait where did my text go?"
                        value={text}
                        onChange={handleChange}
                    />
                    <div className="absolute bottom-4 right-4 text-xs font-bold text-red-400">
                        {wordCount} / 400 words
                    </div>
                </div>

                <Button disabled className="w-full bg-gray-300 cursor-not-allowed">
                    Submit Essay (Minimum 400 words)
                </Button>

                <button onClick={onGiveUp} className="w-full text-center text-sm text-pink-500 hover:underline pt-2">
                    This is too hard, take me back to Yes
                </button>
            </motion.div>
        </div>
    );
};
