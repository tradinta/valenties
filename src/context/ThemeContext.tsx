"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

// 3 Unified Themes
export type Theme = 'classic' | 'dark-romance' | 'neon-love';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Map old theme keys to new ones for backward compat
const THEME_MIGRATION: Record<string, Theme> = {
    'valentine': 'classic',
    'neo': 'classic',
    'cosmos': 'neon-love',
    'deep-red': 'dark-romance',
    'classic': 'classic',
    'dark-romance': 'dark-romance',
    'neon-love': 'neon-love',
};

const THEME_CLASSES: Record<Theme, string> = {
    'classic': '', // Default, no class needed
    'dark-romance': 'dark-romance',
    'neon-love': 'neon-love',
};

const THEME_ORDER: Theme[] = ['classic', 'dark-romance', 'neon-love'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('classic');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('kihumba_theme');
        const migrated = saved ? THEME_MIGRATION[saved] || 'classic' : 'classic';
        setThemeState(migrated);
        applyThemeClass(migrated);
        setMounted(true);
    }, []);

    const applyThemeClass = (newTheme: Theme) => {
        const root = document.documentElement;
        // Remove all theme classes
        Object.values(THEME_CLASSES).forEach(cls => {
            if (cls) root.classList.remove(cls);
        });
        // Add new theme class
        const cls = THEME_CLASSES[newTheme];
        if (cls) root.classList.add(cls);
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('kihumba_theme', newTheme);
        applyThemeClass(newTheme);
    };

    const toggleTheme = () => {
        const currentIndex = THEME_ORDER.indexOf(theme);
        const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
        setTheme(THEME_ORDER[nextIndex]);
    };

    const isDark = theme === 'dark-romance' || theme === 'neon-love';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark }}>
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
