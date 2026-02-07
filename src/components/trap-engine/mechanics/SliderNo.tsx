"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface SliderNoProps {
    onAttempt?: () => void;
}

export const SliderNo: React.FC<SliderNoProps> = ({ onAttempt }) => {
    const [value, setValue] = useState(0);
    const [rotation, setRotation] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = parseInt(e.target.value);

        // If they try to slide towards the right (confirming No?)
        if (newVal > value) {
            if (onAttempt) onAttempt();

            // Spin out of control
            setRotation(prev => prev + 360);

            // Randomly jump back
            if (Math.random() > 0.5) {
                setValue(0);
            } else {
                setValue(newVal); /* Allow small movement but then... */
                setTimeout(() => setValue(0), 200);
            }
        } else {
            setValue(newVal);
        }
    };

    return (
        <div className="relative w-48 h-12 flex items-center justify-center bg-white/50 backdrop-blur rounded-full px-4 border border-pink-200">
            <span className="absolute left-4 text-xs font-bold text-pink-400">Wait</span>
            <span className="absolute right-4 text-xs font-bold text-gray-400">Refuse</span>

            <motion.input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={handleChange}
                animate={{ rotate: rotation }}
                transition={{ type: "spring" }}
                className="w-full z-10 cursor-pointer accent-gray-500"
            />
        </div>
    );
};
