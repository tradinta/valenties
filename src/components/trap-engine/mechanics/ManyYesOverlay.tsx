"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ManyYesOverlay = ({ onSelect }: { onSelect: () => void }) => {
    // Generate 30 random positions
    const items = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // vw
        y: Math.random() * 100, // vh
        delay: Math.random() * 0.5,
        scale: 0.8 + Math.random() * 0.5
    }));

    // Auto-select after a while? Or just force them to click one?
    // Let's force click.

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm pointer-events-auto">
            {items.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ scale: 0, opacity: 0, y: 100 }}
                    animate={{ scale: item.scale, opacity: 1, y: 0 }}
                    transition={{ delay: item.delay, type: 'spring' }}
                    style={{
                        position: 'absolute',
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                    }}
                >
                    <Button
                        onClick={onSelect}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-4 rounded-full shadow-xl flex items-center gap-2 animate-bounce"
                    >
                        YES! <Heart className="w-5 h-5 fill-current" />
                    </Button>
                </motion.div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h2 className="text-4xl md:text-6xl font-black text-rose-500 drop-shadow-lg bg-white/80 p-4 rounded-xl rotate-[-5deg]">It's raining YES!</h2>
            </div>
        </div>
    );
};
