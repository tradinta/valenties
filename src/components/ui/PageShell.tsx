"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageShell - Unified background wrapper for ALL pages.
 * Provides: background pattern, floating shapes, ambient glow.
 * Every page wrapped in this will look cohesive.
 */
export const PageShell = ({
    children,
    className = '',
    padTop = true,
}: {
    children: React.ReactNode;
    className?: string;
    padTop?: boolean;
}) => {
    return (
        <div className={`relative min-h-screen w-full overflow-hidden bg-background selection:bg-primary selection:text-primary-foreground ${className}`}>

            {/* Subtle Cross Pattern */}
            <div className="absolute inset-0 bg-pattern opacity-40 pointer-events-none" />

            {/* Ambient Glow Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-[180px] animate-pulse-glow"
                    style={{ background: 'var(--glow-1)' }}
                />
                <div
                    className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px] animate-pulse-glow"
                    style={{ background: 'var(--glow-2)', animationDelay: '1s' }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[200px] animate-pulse-glow"
                    style={{ background: 'var(--glow-3)', animationDelay: '2s' }}
                />
            </div>

            {/* Floating SVG Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Floating Heart (top-left) */}
                <motion.svg
                    className="absolute top-24 left-[8%] w-10 h-10 opacity-60"
                    viewBox="0 0 50 50" fill="none"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <path
                        d="M25 45 Q5 30 5 18 Q5 5 17 5 Q25 5 25 15 Q25 5 33 5 Q45 5 45 18 Q45 30 25 45"
                        fill="var(--shape-fill)" stroke="var(--shape-stroke)" strokeWidth="2.5" strokeLinejoin="round"
                    />
                </motion.svg>

                {/* Cloud (top-right) */}
                <motion.svg
                    className="absolute top-28 right-[12%] w-20 h-12 opacity-50"
                    viewBox="0 0 80 45" fill="none"
                    animate={{ x: [0, 20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <path
                        d="M15 35 Q5 35 5 25 Q5 15 18 15 Q20 5 35 5 Q52 3 55 15 Q60 8 72 12 Q85 15 82 28 Q85 38 70 38 Z"
                        fill="var(--card)" stroke="var(--shape-stroke)" strokeWidth="2.5" strokeLinejoin="round"
                    />
                </motion.svg>

                {/* Spinning Sparkle (mid-left) */}
                <motion.svg
                    className="hidden lg:block absolute top-40 left-[20%] w-8 h-8 opacity-60"
                    viewBox="0 0 30 30" fill="none"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <path
                        d="M15 2 L17 12 L27 15 L17 18 L15 28 L13 18 L3 15 L13 12 Z"
                        fill="var(--shape-fill-alt)" stroke="var(--shape-stroke)" strokeWidth="2" strokeLinejoin="round"
                    />
                </motion.svg>

                {/* Balloon (desktop, mid-right) */}
                <motion.svg
                    className="hidden lg:block absolute top-[30%] right-[10%] w-10 h-14 opacity-50"
                    viewBox="0 0 40 60" fill="none"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                    <ellipse cx="20" cy="22" rx="16" ry="20" fill="var(--shape-fill)" stroke="var(--shape-stroke)" strokeWidth="2.5" />
                    <ellipse cx="14" cy="16" rx="4" ry="6" fill="var(--card)" opacity="0.4" />
                    <path d="M20 42 L20 45 Q18 48 22 50 Q18 52 22 54" stroke="var(--shape-stroke)" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M17 42 L20 45 L23 42" fill="var(--shape-fill)" stroke="var(--shape-stroke)" strokeWidth="2" strokeLinejoin="round" />
                </motion.svg>

                {/* Star (bottom-left, desktop) */}
                <motion.svg
                    className="hidden lg:block absolute bottom-32 left-[15%] w-8 h-8 opacity-50"
                    viewBox="0 0 50 50" fill="none"
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
                >
                    <path
                        d="M25 2 L30 18 L48 18 L34 28 L39 46 L25 35 L11 46 L16 28 L2 18 L20 18 Z"
                        fill="var(--shape-fill-alt)" stroke="var(--shape-stroke)" strokeWidth="2.5" strokeLinejoin="round"
                    />
                </motion.svg>

                {/* Spinning Sun (top-center, desktop) */}
                <motion.svg
                    className="hidden lg:block absolute top-16 right-[30%] w-12 h-12 opacity-50"
                    viewBox="0 0 60 60" fill="none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <circle cx="30" cy="30" r="12" fill="var(--shape-fill-alt)" stroke="var(--shape-stroke)" strokeWidth="2.5" />
                    <path d="M30 10 L30 4" stroke="var(--shape-stroke)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M30 56 L30 50" stroke="var(--shape-stroke)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M10 30 L4 30" stroke="var(--shape-stroke)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M56 30 L50 30" stroke="var(--shape-stroke)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M16 16 L12 12" stroke="var(--shape-stroke)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M48 48 L44 44" stroke="var(--shape-stroke)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M16 44 L12 48" stroke="var(--shape-stroke)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M48 12 L44 16" stroke="var(--shape-stroke)" strokeWidth="3" strokeLinecap="round" />
                </motion.svg>

                {/* Flower (bottom-right, desktop) */}
                <motion.svg
                    className="hidden lg:block absolute bottom-28 right-[18%] w-12 h-14 opacity-50"
                    viewBox="0 0 50 55" fill="none"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                >
                    <ellipse cx="25" cy="12" rx="8" ry="10" fill="var(--shape-fill)" stroke="var(--shape-stroke)" strokeWidth="2" />
                    <ellipse cx="12" cy="22" rx="8" ry="10" fill="var(--shape-fill)" stroke="var(--shape-stroke)" strokeWidth="2" transform="rotate(-60 12 22)" />
                    <ellipse cx="38" cy="22" rx="8" ry="10" fill="var(--shape-fill)" stroke="var(--shape-stroke)" strokeWidth="2" transform="rotate(60 38 22)" />
                    <ellipse cx="15" cy="35" rx="8" ry="10" fill="var(--shape-fill)" stroke="var(--shape-stroke)" strokeWidth="2" transform="rotate(-30 15 35)" />
                    <ellipse cx="35" cy="35" rx="8" ry="10" fill="var(--shape-fill)" stroke="var(--shape-stroke)" strokeWidth="2" transform="rotate(30 35 35)" />
                    <circle cx="25" cy="25" r="8" fill="var(--shape-fill-alt)" stroke="var(--shape-stroke)" strokeWidth="2" />
                    <path d="M25 33 L25 52" stroke="var(--shape-stroke)" strokeWidth="3" strokeLinecap="round" />
                </motion.svg>

                {/* Tiny Dots */}
                <div className="absolute top-[15%] left-[30%] w-3 h-3 rounded-full animate-pulse opacity-40" style={{ background: 'var(--shape-fill-alt)' }} />
                <div className="absolute top-[40%] right-[35%] w-2 h-2 rotate-45 animate-pulse opacity-30" style={{ background: 'var(--shape-fill)' }} />
                <div className="absolute bottom-[30%] left-[40%] w-4 h-4 border-2 rounded-full animate-bounce-soft opacity-25" style={{ borderColor: 'var(--shape-fill-alt)' }} />
            </div>

            {/* Main Content */}
            <div className={`relative z-10 w-full min-h-screen flex flex-col ${padTop ? 'pt-24' : ''}`}>
                {children}
            </div>
        </div>
    );
};
