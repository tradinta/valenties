"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Frown, HeartCrack } from 'lucide-react';

const SAD_GIFS = [
    "https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif", // Crying Pikachu
    "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif", // Crying Dawson
    "https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif"  // Crying Cat
];

const GUILT_TEXTS = [
    "Are you really going to break my heart into a million tiny pixelated pieces?",
    "I made this website just for you... and this is how you repay me?",
    "Every time you click No, a puppy loses its favorite chew toy.",
    "Think of the memories! The love! The free food!"
];

export const GuiltTripModal = ({ onGiveUp, onCancel }: { onGiveUp: () => void, onCancel: () => void }) => {
    const randomGif = SAD_GIFS[Math.floor(Math.random() * SAD_GIFS.length)];
    const randomText = GUILT_TEXTS[Math.floor(Math.random() * GUILT_TEXTS.length)];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl text-center"
            >
                <div className="h-48 overflow-hidden bg-gray-100">
                    <img src={randomGif} alt="Sadness" className="w-full h-full object-cover opacity-80" />
                </div>

                <div className="p-6 space-y-4">
                    <div className="mx-auto w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                        <HeartCrack className="w-6 h-6 text-rose-500" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">Why are you doing this?</h3>
                    <p className="text-gray-600 italic">"{randomText}"</p>

                    <div className="grid gap-3 pt-4">
                        <Button
                            onClick={onGiveUp}
                            className="bg-rose-600 hover:bg-rose-700 text-white w-full py-6 text-lg"
                        >
                            Okay, I'm Sorry (YES) 🥺
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                        >
                            I have no soul (Close)
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
