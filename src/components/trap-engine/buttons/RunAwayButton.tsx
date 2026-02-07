"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useHoverTrap } from '@/hooks/use-hover-trap';

interface RunAwayButtonProps {
    onAttempt?: () => void;
    label?: string;
}

export const RunAwayButton: React.FC<RunAwayButtonProps> = ({ onAttempt, label = "No" }) => {
    // High difficulty for pure run away
    const { position, evade, teleport } = useHoverTrap({ difficulty: 'hard' });
    const btnRef = useRef<HTMLDivElement>(null);
    const [textIndex, setTextIndex] = useState(0);

    const PHRASES = ["No", "Can't catch me!", "Too slow!", "Nope!"];

    const handleHover = (e: React.MouseEvent | React.TouchEvent) => {
        if (onAttempt) onAttempt();
        setTextIndex(prev => (prev + 1) % PHRASES.length);

        if (Math.random() > 0.8) {
            teleport();
        } else if (btnRef.current) {
            // @ts-ignore
            const cx = e.clientX || e.touches?.[0]?.clientX || 0;
            // @ts-ignore
            const cy = e.clientY || e.touches?.[0]?.clientY || 0;
            evade(cx, cy, btnRef.current.getBoundingClientRect());
        }
    };

    return (
        <motion.div
            ref={btnRef}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute z-10 inline-block"
        >
            <Button variant="outline" size="lg" onMouseEnter={handleHover} onTouchStart={handleHover}>
                {label || PHRASES[textIndex]}
            </Button>
        </motion.div>
    );
};
