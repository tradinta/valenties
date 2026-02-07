"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'cosmos' | 'neo' | 'valentine' | 'deep-red';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('deep-red');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load legacy preference first if exists, otherwise default
        const saved = localStorage.getItem('kihumba_theme') as Theme;
        if (saved && (saved === 'cosmos' || saved === 'neo' || saved === 'valentine' || saved === 'deep-red')) {
            setThemeState(saved);
            // Apply the saved theme immediately to prevent flash
            const root = document.documentElement;
            root.classList.remove('cosmos-bear', 'neo-brutal', 'valentine-lube', 'deep-red');
            if (saved === 'cosmos') root.classList.add('cosmos-bear');
            else if (saved === 'neo') root.classList.add('neo-brutal');
            else if (saved === 'valentine') root.classList.add('valentine-lube');
            else if (saved === 'deep-red') root.classList.add('deep-red');
        } else {
            setThemeState('deep-red'); // Force default to deep-red
            document.documentElement.classList.add('deep-red');
        }
        setMounted(true);
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('kihumba_theme', newTheme);

        // Update document class for global styles if needed
        const root = document.documentElement;
        root.classList.remove('cosmos-bear', 'neo-brutal', 'valentine-lube', 'deep-red'); // Clear all

        if (newTheme === 'cosmos') {
            root.classList.add('cosmos-bear');
        } else if (newTheme === 'neo') {
            root.classList.add('neo-brutal');
        } else if (newTheme === 'valentine') {
            root.classList.add('valentine-lube');
        } else if (newTheme === 'deep-red') {
            root.classList.add('deep-red');
        }
    };

    const toggleTheme = () => {
        if (theme === 'valentine') setTheme('deep-red');
        else if (theme === 'deep-red') setTheme('cosmos');
        else if (theme === 'cosmos') setTheme('neo');
        else setTheme('valentine');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {mounted ? (
                children
            ) : (
                <div style={{ visibility: 'hidden' }}>{children}</div>
            )}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
