"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface YesButtonProps {
    onSuccess: () => void;
    mechanic?: 'simple' | 'magnet' | 'sticky' | 'grow' | 'rewards';
    className?: string;
    text?: string;
}

import { Heart } from 'lucide-react';

export const YesButton: React.FC<YesButtonProps> = ({ onSuccess, mechanic = 'simple', className, text = "Yes" }) => {
    const [scale, setScale] = useState(1);

    // Growth mechanic
    useEffect(() => {
        if (mechanic === 'grow') {
            const interval = setInterval(() => {
                setScale(s => Math.min(s + 0.05, 2.5));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [mechanic]);

    const handleClick = () => {
        var duration = 15 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        var randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            var timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            var particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        onSuccess();
    };

    return (
        <motion.div
            className={cn(
                "inline-block relative z-20 transition-all duration-500",
                className,
                mechanic === 'sticky' && "fixed bottom-8 right-8 z-50 md:static md:bottom-auto md:right-auto"
            )}
            animate={{ scale: scale }}
            whileHover={{ scale: 1.1 + (scale - 1) }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
            <Button
                variant="cupid"
                size="lg"
                onClick={handleClick}
                className="shadow-xl text-xl px-8 py-6 font-bold flex items-center gap-2"
            >
                {text} <Heart className="w-5 h-5 fill-current" />
            </Button>
        </motion.div>
    );
};
