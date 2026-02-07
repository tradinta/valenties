import React from 'react';

export const FloatingIcons = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* --- Top Left Cluster --- */}
            <svg className="absolute top-[5%] left-[2%] w-12 h-12 text-[#FFB8D4] animate-float opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <svg className="absolute top-[12%] left-[8%] w-8 h-8 text-[#A5D8FF] animate-spin-slow opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
            </svg>
            <svg className="absolute top-[2%] left-[15%] w-16 h-10 text-[#FFE57F] animate-float-slow opacity-40" viewBox="0 0 50 30" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M40 10c0-10-10-10-10 0 0-10-10-10-10 0 0-10-10-10-10 0 0 5 5 10 15 10s15-5 15-10z" />
            </svg>

            {/* --- Top Right Cluster --- */}
            <svg className="absolute top-[8%] right-[5%] w-14 h-14 text-[#FFCC80] animate-spin-slow opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg className="absolute top-[18%] right-[12%] w-12 h-12 text-[#FF8A80] animate-bounce-soft opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                <path d="M2 2l20 20" /> {/* Arrowish line */}
            </svg>
            <svg className="absolute top-[2%] right-[25%] w-10 h-10 text-[#CFD8DC] animate-float opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
            </svg>

            {/* --- Middle Left Cluster (Dense) --- */}
            <svg className="absolute top-[35%] left-[2%] w-16 h-16 text-[#B39DDB] animate-float opacity-40 rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <svg className="absolute top-[45%] left-[8%] w-10 h-10 text-[#80CBC4] animate-spin-slow opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
            </svg>
            <svg className="absolute top-[38%] left-[15%] w-12 h-12 text-[#FFAB91] animate-bounce-soft opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {/* Flower */}
            <svg className="absolute top-[50%] left-[3%] w-12 h-12 text-[#F48FB1] animate-spin-slow opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C12 2 14 6 17 6C20 6 22 4 22 4C22 4 20 8 20 11C20 14 22 18 22 18C22 18 18 17 15 19C12 21 12 22 12 22C12 22 12 21 9 19C6 17 2 18 2 18C2 18 4 14 4 11C4 8 2 4 2 4C2 4 4 6 7 6C10 6 12 2 12 2Z" />
                <circle cx="12" cy="11" r="2" />
            </svg>


            {/* --- Middle Right Cluster (Dense) --- */}
            <svg className="absolute top-[32%] right-[3%] w-20 h-12 text-[#90CAF9] animate-float-slow opacity-40" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12C1 12 3 2 12 2C21 2 23 12 23 12" /> {/* Rainbow */}
                <path d="M4 12C4 12 5 6 12 6C19 6 20 12 20 12" />
            </svg>
            <svg className="absolute top-[42%] right-[10%] w-12 h-12 text-[#CE93D8] animate-pulse opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
            </svg>
            <svg className="absolute top-[50%] right-[18%] w-16 h-16 text-[#FFCC80] animate-bounce-soft opacity-30 -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                <path d="M2 12h20" /> {/* Strike through heart */}
            </svg>
            <svg className="absolute top-[35%] right-[25%] w-8 h-8 text-[#81D4FA] animate-spin-slow opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
            </svg>

            {/* --- Bottom Scattered --- */}
            <svg className="absolute bottom-[20%] left-[5%] w-14 h-14 text-[#A5D6A7] animate-float opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <svg className="absolute bottom-[10%] left-[20%] w-12 h-12 text-[#FFAB91] animate-spin-slow opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <svg className="absolute bottom-[15%] right-[5%] w-16 h-16 text-[#F48FB1] animate-float-slow opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <svg className="absolute bottom-[5%] right-[20%] w-10 h-10 text-[#FFE082] animate-bounce-soft opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>

            {/* --- More Fillers (Tiny shapes) --- */}
            <div className="absolute top-[15%] left-[30%] w-3 h-3 bg-[#FFCC80] rounded-full animate-ping opacity-40"></div>
            <div className="absolute top-[40%] right-[35%] w-2 h-2 bg-[#81D4FA] rotate-45 animate-pulse opacity-40"></div>
            <div className="absolute bottom-[30%] left-[40%] w-4 h-4 border-2 border-[#A5D6A7] rounded-full animate-bounce-soft opacity-30"></div>
            <div className="absolute bottom-[45%] right-[45%] w-3 h-3 bg-[#F48FB1] rounded-full animate-float opacity-30"></div>
        </div>
    );
};
