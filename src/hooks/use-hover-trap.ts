import { useState, useCallback, useEffect } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';

interface TrapConfig {
    difficulty: Difficulty;
    distanceMultiplier?: number;
}

export const useHoverTrap = ({ difficulty = 'medium' }: TrapConfig) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isTrapped, setIsTrapped] = useState(false); // If currently running away

    // Sensitivity based on difficulty
    const sensitivity = {
        easy: 50,
        medium: 100,
        hard: 200,
        impossible: 300,
    }[difficulty];

    const teleport = useCallback(() => {
        // Calculate safe bounds (viewport) - keep button somewhat visible 
        // Logic: Move to a random spot within 80% of window width/height
        if (typeof window === 'undefined') return;

        const maxX = window.innerWidth * 0.8;
        const maxY = window.innerHeight * 0.8;

        // Random sign
        const rX = (Math.random() - 0.5) * maxX; // relative to center if using transform, or absolute?
        // Let's assume absolute or relative transform. 
        // Simple approach: Return new X/Y offsets.

        const newX = (Math.random() * maxX) - (maxX / 2);
        const newY = (Math.random() * maxY) - (maxY / 2);

        setPosition({ x: newX, y: newY });
    }, []);

    const evade = useCallback((cursorX: number, cursorY: number, buttonRect: DOMRect) => {
        // Basic vector math to move AWAY from cursor
        const btnX = buttonRect.left + buttonRect.width / 2;
        const btnY = buttonRect.top + buttonRect.height / 2;

        const deltaX = btnX - cursorX;
        const deltaY = btnY - cursorY;

        // Normalize
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (dist === 0) return; // Cursor exactly on center

        // Move away by a fixed jump or proportional
        const jump = sensitivity + (Math.random() * 50);

        const moveX = (deltaX / dist) * jump;
        const moveY = (deltaY / dist) * jump;

        setPosition(prev => ({
            x: prev.x + moveX,
            y: prev.y + moveY
        }));
    }, [sensitivity]);

    return { position, evade, teleport, setPosition };
};
