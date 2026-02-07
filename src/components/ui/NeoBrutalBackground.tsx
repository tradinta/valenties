"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const NeoBrutalBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[var(--cream)] selection:bg-[var(--primary)] selection:text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF0040' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            {/* Floating Shapes Container */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Top Left Balloon */}
                <motion.svg
                    initial={{ y: 0 }}
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-[10%] w-24 h-32 opacity-80"
                    viewBox="0 0 50 60"
                    fill="none"
                >
                    <path d="M25 45 Q15 45 10 35 Q5 25 5 15 Q15 5 25 5 Q35 5 45 15 Q45 35 25 45 Z" fill="var(--primary)" stroke="black" strokeWidth="2.5" />
                    <path d="M25 45 L25 55" stroke="black" strokeWidth="2.5" />
                    <ellipse cx="18" cy="18" rx="4" ry="6" fill="white" opacity="0.4" />
                </motion.svg>

                {/* Top Right Cloud */}
                <motion.svg
                    initial={{ x: 0 }}
                    animate={{ x: [0, 20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-32 right-[15%] w-32 h-20 opacity-80"
                    viewBox="0 0 100 60"
                    fill="none"
                >
                    <path d="M20 50 Q10 50 10 40 Q10 30 25 30 Q30 15 50 15 Q70 15 75 30 Q90 30 90 40 Q90 50 80 50 Z" fill="white" stroke="black" strokeWidth="3" />
                </motion.svg>

                {/* Bottom Left Heart */}
                <motion.svg
                    initial={{ scale: 1, rotate: -10 }}
                    animate={{ scale: [1, 1.1, 1], rotate: [-10, 0, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-40 left-[8%] w-20 h-20 opacity-90"
                    viewBox="0 0 50 50"
                    fill="none"
                >
                    <path d="M25 45 Q5 30 5 15 Q5 5 17 5 Q25 5 25 15 Q25 5 33 5 Q45 5 45 15 Q45 30 25 45" fill="var(--rose)" stroke="black" strokeWidth="2.5" />
                    <circle cx="15" cy="15" r="2" fill="white" opacity="0.6" />
                </motion.svg>

                {/* Bottom Right Sparkle */}
                <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-32 right-[10%] w-24 h-24 opacity-60"
                    viewBox="0 0 50 50"
                    fill="none"
                >
                    <path d="M25 5 L28 22 L45 25 L28 28 L25 45 L22 28 L5 25 L22 22 Z" fill="var(--gold)" stroke="black" strokeWidth="2" />
                </motion.svg>

                {/* Random Small Elements */}
                <div className="absolute top-1/2 left-[20%] w-4 h-4 rounded-full bg-black animate-bounce delay-700" />
                <div className="absolute top-1/3 right-[30%] w-6 h-6 rounded-full border-[3px] border-black bg-transparent" />
                <div className="absolute bottom-1/4 left-[40%] w-3 h-3 rotate-45 bg-[var(--primary)]" />

            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    );
};
