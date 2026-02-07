"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PersuasionButtonProps {
    onAttempt?: () => void;
}

const PLEAS = [
    "No",
    "Are you sure?",
    "Really?",
    "Think again!",
    "Don't break my heart!",
    "I'll be sad!",
    "Please?",
    "Pretty please?"
];

export const PersuasionButton: React.FC<PersuasionButtonProps> = ({ onAttempt }) => {
    const [index, setIndex] = useState(0);

    const handleInteraction = () => {
        if (onAttempt) onAttempt();
        setIndex(prev => (prev + 1) % PLEAS.length);
    };

    return (
        <Button
            variant="outline"
            size="lg"
            onMouseEnter={handleInteraction}
            onClick={handleInteraction} // Added onClick for mobile
            className="min-w-[120px] transition-all"
        >
            {PLEAS[index]}
        </Button>
    );
};
