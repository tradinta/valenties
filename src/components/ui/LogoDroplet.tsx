import React from 'react';

export const LogoDroplet = ({ className }: { className?: string }) => (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* The Box Trap */}
        <rect x="20" y="20" width="60" height="60" rx="8" stroke="currentColor" strokeWidth="6" className="text-black dark:text-white" fill="none" />

        {/* The Heart Inside */}
        <path d="M50 35 C50 35 35 30 35 45 C35 55 50 65 50 65 C50 65 65 55 65 45 C65 30 50 35 50 35"
            fill="#FF0040"
            stroke="#FF0040"
            strokeWidth="4"
            strokeLinejoin="round"
        />

        {/* The "Bar" or "Door" */}
        <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="4" className="text-black dark:text-white opacity-50" strokeDasharray="4 4" />
    </svg>
);
