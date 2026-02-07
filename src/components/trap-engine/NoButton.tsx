"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { useHoverTrap } from '@/hooks/use-hover-trap';

interface NoButtonProps {
    difficulty?: 'easy' | 'medium' | 'hard' | 'impossible';
    mechanic?: string;
    onAttempt?: () => void;
    onClick?: () => void;
    labelOverride?: string;
}

const PHRASES = [
    "No", "Are you sure?", "Really?", "Think again!",
    "Last chance!", "Don't do it!", "Have a heart!", "Try looking left"
];

export const NoButton: React.FC<NoButtonProps> = ({ difficulty = 'medium', mechanic = 'run-away', onAttempt, onClick, labelOverride }) => {
    const { position, evade, teleport } = useHoverTrap({ difficulty });
    const btnRef = useRef<HTMLDivElement>(null);
    const [textIndex, setTextIndex] = useState(0);
    const [scale, setScale] = useState(1);

    const handleHover = (e: React.MouseEvent | React.TouchEvent) => {
        if (onAttempt) onAttempt();

        // Cycle text
        setTextIndex(prev => (prev + 1) % PHRASES.length);

        if (mechanic === 'shrink') {
            setScale(prev => Math.max(0.1, prev - 0.2));
        }

        // --- STATIC MECHANICS (Do not move) ---
        if (mechanic === 'static' || mechanic === 'persuasion' || mechanic === 'fake-no') {
            return;
        }

        // Logic split based on mechanic or difficulty
        if (mechanic === 'teleport' || difficulty === 'impossible' || Math.random() > 0.7) {
            teleport();
        } else {
            if (btnRef.current) {
                // @ts-ignore
                const cx = e.clientX || e.touches?.[0]?.clientX || 0;
                // @ts-ignore
                const cy = e.clientY || e.touches?.[0]?.clientY || 0;
                evade(cx, cy, btnRef.current.getBoundingClientRect());
            }
        }
    };

    return (
        <motion.div
            ref={btnRef}
            animate={{ x: position.x, y: position.y, scale: scale }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute z-10 inline-block"
            style={{ touchAction: 'none' }}
        >
            <Button
                variant="outline"
                size="lg"
                onMouseEnter={handleHover}
                onTouchStart={handleHover}
                onClick={onClick}
                className={`min-w-[100px] bg-white/80 backdrop-blur transition-all duration-300 ${mechanic === 'fake-no' ? 'hover:bg-rose-500 hover:text-white hover:border-rose-500' : ''}`}
            >
                {labelOverride || PHRASES[textIndex]}
            </Button>
        </motion.div>
    );
};
