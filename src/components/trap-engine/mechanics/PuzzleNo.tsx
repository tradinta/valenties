"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PuzzleNoProps {
    onAttempt?: () => void;
}

export const PuzzleNo: React.FC<PuzzleNoProps> = ({ onAttempt }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [shake, setShake] = useState(0);

    const handleClick = () => {
        if (!isOpen) {
            setIsOpen(true);
            if (onAttempt) onAttempt();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        // Frustration logic: Reset if they type 'Yes' or 'Love' or just randomly
        if (Math.random() > 0.8) {
            setShake(prev => prev + 1);
            setInputValue(''); // Clear randomly
            if (onAttempt) onAttempt();
        }
    };

    return (
        <div className="relative inline-block">
            {!isOpen ? (
                <Button variant="outline" size="lg" onClick={handleClick}>
                    No
                </Button>
            ) : (
                <motion.div
                    animate={{ x: shake % 2 === 0 ? -5 : 5 }}
                    transition={{ duration: 0.1 }}
                    className="flex flex-col gap-2 bg-white p-2 rounded shadow border border-pink-200"
                >
                    <label className="text-xs font-bold text-pink-600">To refuse, type: "I hate love"</label>
                    <input
                        autoFocus
                        value={inputValue}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Type here..."
                    />
                    {inputValue.toLowerCase().includes("hate") && (
                        <div className="text-[10px] text-red-500 font-bold">Error: Heart detected. Cannot compute.</div>
                    )}
                </motion.div>
            )}
        </div>
    );
};
