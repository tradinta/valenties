"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import type { Points as PointsType } from 'three';

type ThemeKey = 'cupid' | 'dark-romance' | 'neon-love' | 'pastel-dream' | 'obsidian';

interface ThemeConfig {
    color: string;
    bg: string;
}

const THEME_CONFIG: Record<ThemeKey, ThemeConfig> = {
    'cupid': { color: '#ff69b4', bg: 'bg-[radial-gradient(circle_at_center,_#fff5f5_0%,_#fff0f5_100%)]' },
    'dark-romance': { color: '#8b0000', bg: 'bg-[radial-gradient(circle_at_center,_#2a0a12_0%,_#000000_100%)]' },
    'neon-love': { color: '#00ffaa', bg: 'bg-[radial-gradient(circle_at_center,_#1a0b2e_0%,_#000000_100%)]' },
    'pastel-dream': { color: '#b19cd9', bg: 'bg-[radial-gradient(circle_at_center,_#fdfbf7_0%,_#e6e6fa_100%)]' },
    'obsidian': { color: '#333333', bg: 'bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_100%)]' },
};

const isValidTheme = (theme: string): theme is ThemeKey => {
    return theme in THEME_CONFIG;
};

const Particles = ({ theme }: { theme: string }) => {
    const ref = useRef<PointsType>(null);
    const config = isValidTheme(theme) ? THEME_CONFIG[theme] : THEME_CONFIG['cupid'];
    const sphere = useMemo(() => random.inSphere(new Float32Array(6000), { radius: 1.8 }), []);

    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 15;
            ref.current.rotation.y -= delta / 20;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={config.color}
                    size={0.006}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
};

export const Background3D = ({ theme = 'cupid' }: { theme?: string }) => {
    const config = isValidTheme(theme) ? THEME_CONFIG[theme] : THEME_CONFIG['cupid'];

    return (
        <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-700 ${config.bg}`}>
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Particles theme={theme} />
            </Canvas>
        </div>
    );
};
