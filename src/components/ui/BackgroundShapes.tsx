"use client";

import { motion } from "framer-motion";
import React from "react";

export const BackgroundShapes = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231a1817' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3C!-- Balloon --%3E%3Cellipse cx='50' cy='50' rx='20' ry='25'/%3E%3Cpath d='M50 75 L50 80 Q47 85 53 88 Q47 91 53 94'/%3E%3C!-- Cloud --%3E%3Cpath d='M120 40 Q110 40 110 30 Q110 20 125 20 Q128 10 145 10 Q165 8 168 22 Q175 15 188 20 Q200 25 195 35 Q200 45 180 45 Z'/%3E%3C!-- Sun --%3E%3Ccircle cx='320' cy='60' r='20'/%3E%3Cpath d='M320 30 L320 22 M320 98 L320 90 M290 60 L282 60 M358 60 L350 60 M298 38 L292 32 M348 88 L342 82 M298 82 L292 88 M348 32 L342 38'/%3E%3C!-- Flower --%3E%3Ccircle cx='60' cy='150' r='8'/%3E%3Cellipse cx='60' cy='135' rx='6' ry='10'/%3E%3Cellipse cx='48' cy='145' rx='6' ry='10' transform='rotate(-50 48 145)'/%3E%3Cellipse cx='72' cy='145' rx='6' ry='10' transform='rotate(50 72 145)'/%3E%3Cellipse cx='50' cy='158' rx='6' ry='10' transform='rotate(-20 50 158)'/%3E%3Cellipse cx='70' cy='158' rx='6' ry='10' transform='rotate(20 70 158)'/%3E%3Cpath d='M60 160 L60 180'/%3E%3C!-- Plant in pot --%3E%3Cpath d='M340 140 L340 120 M340 130 Q330 125 328 115 M340 125 Q350 118 352 108'/%3E%3Cpath d='M328 140 L332 160 L348 160 L352 140 Z'/%3E%3C!-- Rainbow arc --%3E%3Cpath d='M150 120 Q150 80 200 80 Q250 80 250 120'/%3E%3Cpath d='M160 120 Q160 90 200 90 Q240 90 240 120'/%3E%3Cpath d='M170 120 Q170 100 200 100 Q230 100 230 120'/%3E%3C!-- Star --%3E%3Cpath d='M300 150 L305 165 L320 165 L308 175 L313 190 L300 180 L287 190 L292 175 L280 165 L295 165 Z'/%3E%3C!-- Confetti --%3E%3Crect x='100' y='180' width='10' height='10' rx='2' transform='rotate(20 105 185)'/%3E%3Ccircle cx='130' y='195' r='6'/%3E%3Crect x='145' y='175' width='8' height='8' rx='1' transform='rotate(-15 149 179)'/%3E%3C!-- Sparkle --%3E%3Cpath d='M50 250 L53 260 L63 263 L53 266 L50 276 L47 266 L37 263 L47 260 Z'/%3E%3C!-- Heart --%3E%3Cpath d='M200 220 Q190 210 200 200 Q210 190 220 200 Q230 190 240 200 Q250 210 240 220 Q225 240 220 250 Q215 240 200 220'/%3E%3C!-- Another balloon --%3E%3Cellipse cx='350' cy='250' rx='18' ry='22'/%3E%3Cpath d='M350 272 L350 278 Q347 282 353 286'/%3E%3C!-- Wavy line decoration --%3E%3Cpath d='M20 320 Q40 310 60 320 Q80 330 100 320 Q120 310 140 320'/%3E%3C!-- Dots cluster --%3E%3Ccircle cx='280' cy='300' r='5' fill='%231a1817'/%3E%3Ccircle cx='295' cy='310' r='4' fill='%231a1817'/%3E%3Ccircle cx='270' cy='315' r='3' fill='%231a1817'/%3E%3C!-- Small cloud --%3E%3Cpath d='M180 340 Q170 340 170 330 Q170 320 185 320 Q188 312 200 312 Q215 310 218 322 Q225 318 235 322 Q245 328 240 338 Z'/%3E%3C!-- Little flower --%3E%3Ccircle cx='350' cy='350' r='6'/%3E%3Ccircle cx='350' cy='340' r='5'/%3E%3Ccircle cx='342' cy='348' r='5'/%3E%3Ccircle cx='358' cy='348' r='5'/%3E%3Ccircle cx='344' cy='358' r='5'/%3E%3Ccircle cx='356' cy='358' r='5'/%3E%3Cpath d='M350 362 L350 380'/%3E%3C!-- Squiggle --%3E%3Cpath d='M60 380 Q70 370 80 380 Q90 390 100 380 Q110 370 120 380'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "400px 400px"
                }}
            />

            {/* Floating Elements */}
            <motion.svg
                className="absolute top-16 right-[12%] w-16 h-16 opacity-80"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
                <circle cx="30" cy="30" r="14" fill="#FFF59D" stroke="#1a1817" strokeWidth="2.5" />
                <path d="M30 8 L30 2" stroke="#1a1817" strokeWidth="3" strokeLinecap="round" />
                <path d="M30 58 L30 52" stroke="#1a1817" strokeWidth="3" strokeLinecap="round" />
                <path d="M8 30 L2 30" stroke="#1a1817" strokeWidth="3" strokeLinecap="round" />
                <path d="M58 30 L52 30" stroke="#1a1817" strokeWidth="3" strokeLinecap="round" />
                <path d="M14 14 L10 10" stroke="#1a1817" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 50 L46 46" stroke="#1a1817" strokeWidth="3" strokeLinecap="round" />
                <path d="M14 46 L10 50" stroke="#1a1817" strokeWidth="3" strokeLinecap="round" />
                <path d="M50 10 L46 14" stroke="#1a1817" strokeWidth="3" strokeLinecap="round" />
                <circle cx="26" cy="28" r="2" fill="#1a1817" />
                <circle cx="34" cy="28" r="2" fill="#1a1817" />
                <path d="M25 34 Q30 38 35 34" stroke="#1a1817" strokeWidth="2" strokeLinecap="round" fill="none" />
            </motion.svg>

            <motion.svg
                className="absolute top-28 left-[8%] w-20 h-12 opacity-70"
                viewBox="0 0 80 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ y: [0, -25, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <path d="M15 35 Q5 35 5 25 Q5 15 18 15 Q20 5 35 5 Q52 3 55 15 Q60 8 72 12 Q85 15 82 28 Q85 38 70 38 Z" fill="white" stroke="#1a1817" strokeWidth="2.5" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg
                className="absolute top-20 right-[30%] w-16 h-10 opacity-60"
                viewBox="0 0 80 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <path d="M15 35 Q5 35 5 25 Q5 15 18 15 Q20 5 35 5 Q52 3 55 15 Q60 8 72 12 Q85 15 82 28 Q85 38 70 38 Z" fill="white" stroke="#1a1817" strokeWidth="2.5" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg
                className="hidden lg:block absolute top-32 left-[20%] w-10 h-14 opacity-75"
                viewBox="0 0 40 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <ellipse cx="20" cy="22" rx="16" ry="20" fill="#FFB8D4" stroke="#1a1817" strokeWidth="2.5" />
                <ellipse cx="14" cy="16" rx="4" ry="6" fill="white" opacity="0.4" />
                <path d="M20 42 L20 45 Q18 48 22 50 Q18 52 22 54 Q18 56 20 58" stroke="#1a1817" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M17 42 L20 45 L23 42" fill="#FFB8D4" stroke="#1a1817" strokeWidth="2" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg
                className="hidden lg:block absolute bottom-32 right-[10%] w-12 h-14 opacity-70"
                viewBox="0 0 50 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            >
                <ellipse cx="25" cy="12" rx="8" ry="10" fill="#FFB8D4" stroke="#1a1817" strokeWidth="2" />
                <ellipse cx="12" cy="22" rx="8" ry="10" fill="#FFB8D4" stroke="#1a1817" strokeWidth="2" transform="rotate(-60 12 22)" />
                <ellipse cx="38" cy="22" rx="8" ry="10" fill="#FFB8D4" stroke="#1a1817" strokeWidth="2" transform="rotate(60 38 22)" />
                <ellipse cx="15" cy="35" rx="8" ry="10" fill="#FFB8D4" stroke="#1a1817" strokeWidth="2" transform="rotate(-30 15 35)" />
                <ellipse cx="35" cy="35" rx="8" ry="10" fill="#FFB8D4" stroke="#1a1817" strokeWidth="2" transform="rotate(30 35 35)" />
                <circle cx="25" cy="25" r="8" fill="#FFF59D" stroke="#1a1817" strokeWidth="2" />
                <path d="M25 33 L25 52" stroke="#1a1817" strokeWidth="3" strokeLinecap="round" />
                <path d="M25 42 Q18 40 15 45" stroke="#1a1817" strokeWidth="2" strokeLinecap="round" fill="none" />
            </motion.svg>

            <motion.svg
                className="hidden lg:block absolute top-40 left-[35%] w-8 h-8 opacity-70"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <path d="M15 2 L17 12 L27 15 L17 18 L15 28 L13 18 L3 15 L13 12 Z" fill="#FFF59D" stroke="#1a1817" strokeWidth="2" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg
                className="hidden lg:block absolute top-28 left-[45%] w-8 h-8"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
            >
                <path d="M25 2 L30 18 L48 18 L34 28 L39 46 L25 35 L11 46 L16 28 L2 18 L20 18 Z" fill="#FFF59D" stroke="#1a1817" strokeWidth="2.5" strokeLinejoin="round" />
            </motion.svg>

            <motion.svg
                className="hidden lg:block absolute bottom-28 left-[30%] w-8 h-8"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
            >
                <path d="M25 45 Q5 30 5 18 Q5 5 17 5 Q25 5 25 15 Q25 5 33 5 Q45 5 45 18 Q45 30 25 45" fill="#FFB8D4" stroke="#1a1817" strokeWidth="2.5" strokeLinejoin="round" />
            </motion.svg>

            {/* Colorful Blurs */}
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#FFB8D4] rounded-full blur-[180px] opacity-20 animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-[#3B82F6] rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FFF59D] rounded-full blur-[200px] opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
    );
};
