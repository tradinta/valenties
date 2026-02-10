"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

// 3 Unified Themes
export type Theme = 'classic' | 'dark' | 'neon';

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
    'cosmos': 'neon',
    'cosmos-bear': 'neon',
    'deep-red': 'dark',
    'obsidian': 'dark',
    'classic': 'classic',
    'dark-romance': 'dark',
    'neon-love': 'neon',
    'dark': 'dark',
    'neon': 'neon',
};

const THEME_CLASSES: Record<Theme, string> = {
    'classic': '', // Default, no class needed
    'dark': 'dark',
    'neon': 'neon',
};

const THEME_ORDER: Theme[] = ['classic', 'dark', 'neon'];

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

    const setTheme = (newTheme: any) => {
        const migrated = THEME_MIGRATION[newTheme] || 'classic';
        setThemeState(migrated);
        localStorage.setItem('kihumba_theme', migrated);
        applyThemeClass(migrated);
    };

    const toggleTheme = () => {
        const currentIndex = THEME_ORDER.indexOf(theme);
        const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
        setTheme(THEME_ORDER[nextIndex]);
    };

    const isDark = theme === 'dark' || theme === 'neon';

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
