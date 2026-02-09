"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ChaosLayerProps {
    mode: 'none' | 'maze' | 'distractions' | 'fill-screen';
}

import { Ban, X, Frown, ShieldAlert, Skull, LucideIcon } from 'lucide-react';

interface ChaosElement {
    id: number;
    x: number;
    y: number;
    Icon: LucideIcon;
}

export const ChaosLayer: React.FC<ChaosLayerProps> = ({ mode }) => {
    const [elements, setElements] = useState<ChaosElement[]>([]);

    useEffect(() => {
        if (mode === 'distractions' || mode === 'fill-screen') {
            const icons = [Ban, X, Frown, ShieldAlert, Skull];
            const interval = setInterval(() => {
                setElements(prev => [
                    ...prev.slice(-10), // Keep last 10
                    {
                        id: Date.now(),
                        x: Math.random() * 90,
                        y: Math.random() * 90,
                        Icon: icons[Math.floor(Math.random() * icons.length)]
                    }
                ]);
            }, 800);
            return () => clearInterval(interval);
        }
    }, [mode]);

    if (mode === 'none') return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Distractions */}
            {elements.map(el => {
                const Icon = el.Icon;
                return (
                    <motion.div
                        key={el.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                        transition={{ duration: 2 }}
                        style={{ left: `${el.x}%`, top: `${el.y}%`, position: 'absolute' }}
                        className="text-rose-300"
                    >
                        <Icon className="w-12 h-12" />
                    </motion.div>
                );
            })}

            {/* Maze Overlay (SVG) - visual only for now */}
            {mode === 'maze' && (
                <svg className="absolute inset-0 w-full h-full opacity-10">
                    <pattern id="maze" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M0 20 h40 M20 0 v40" stroke="currentColor" strokeWidth="2" fill="none" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#maze)" />
                </svg>
            )}
        </div>
    );
};
