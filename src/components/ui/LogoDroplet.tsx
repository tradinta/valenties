import React from 'react';

export const LogoDroplet = ({ className }: { className?: string }) => (
    <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M50 8 C50 8 15 50 15 65 C15 85 30 95 50 95 C70 95 85 85 85 65 C85 50 50 8 50 8Z" fill="#7DD3FC" stroke="var(--border)" strokeWidth="4" strokeLinejoin="round"></path>
        <ellipse cx="32" cy="55" rx="8" ry="12" fill="white" opacity="0.6"></ellipse>
        <ellipse cx="38" cy="62" rx="7" ry="8" fill="var(--foreground)"></ellipse>
        <circle cx="36" cy="60" r="2.5" fill="white"></circle>
        <ellipse cx="62" cy="62" rx="7" ry="8" fill="var(--foreground)"></ellipse>
        <circle cx="60" cy="60" r="2.5" fill="white"></circle>
        <path d="M42 75 Q50 82 58 75" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" fill="none"></path>
        <ellipse cx="28" cy="72" rx="5" ry="3" fill="#FFB8D4" opacity="0.7"></ellipse>
        <ellipse cx="72" cy="72" rx="5" ry="3" fill="#FFB8D4" opacity="0.7"></ellipse>
    </svg>
);
