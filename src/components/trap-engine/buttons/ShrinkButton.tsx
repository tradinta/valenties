"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ShrinkButtonProps {
    onAttempt?: () => void;
    label?: string;
}

export const ShrinkButton: React.FC<ShrinkButtonProps> = ({ onAttempt, label = "No" }) => {
    const [scale, setScale] = useState(1);

    const handleInteraction = () => {
        if (onAttempt) onAttempt();
        // Shrink drastically until it disappears (0)
        setScale(prev => Math.max(0, prev - 0.3));
    };

    return (
        <motion.div
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-block"
        >
            <Button
                variant="outline"
                size="lg"
                onMouseEnter={handleInteraction}
                onClick={handleInteraction} // Handle clicks for mobile/persistence
                className="transition-colors hover:bg-purple-100 border-purple-200"
            >
                {label}
            </Button>
        </motion.div>
    );
};
