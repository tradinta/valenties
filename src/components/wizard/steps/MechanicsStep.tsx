"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { TrapConfig } from '@/types';
import { Eye, Type, Zap, Ghost, Shuffle, MessageSquare, BrainCircuit, Lock } from 'lucide-react'; // Added icons
import { useFeatureGate } from '@/hooks/useFeatureGate'; // Import default
import { FeatureGate } from '@/components/premium/FeatureGate';

interface MechanicsStepProps {
    config: Partial<TrapConfig>;
    updateConfig: (data: Partial<TrapConfig>) => void;
    onNext: () => void;
    onBack: () => void;
}

// Define mechanics with their required tiers
const MECHANICS = [
    { id: 'run-away', label: 'Run Away', icon: <Zap className="w-5 h-5" />, desc: 'Button flees when hovered', tier: 'free' },
    { id: 'shrink', label: 'Shrink', icon: <Ghost className="w-5 h-5" />, desc: 'Button gets smaller and smaller', tier: 'free' },
    { id: 'teleport', label: 'Teleport', icon: <Shuffle className="w-5 h-5" />, desc: 'Instantly moves to random spot', tier: 'starter' },
    { id: 'guilt-trip', label: 'Guilt Trip', icon: <MessageSquare className="w-5 h-5" />, desc: 'Sad messages before moving', tier: 'starter' },
    { id: 'dsa-quiz', label: 'DSA Quiz', icon: <BrainCircuit className="w-5 h-5" />, desc: 'Must solve coding problem first', tier: 'casual' },
    { id: 'impossible-form', label: 'Impossible Form', icon: <Lock className="w-5 h-5" />, desc: 'Endless bureaucratic checkboxes', tier: 'casual' },
] as const;

export const MechanicsStep: React.FC<MechanicsStepProps> = ({ config, updateConfig, onNext, onBack }) => {
    const { hasFeature } = useFeatureGate();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-display font-medium text-black dark:text-white">The Trap</h2>
                <p className="text-[var(--foreground-muted)] dark:text-gray-300 font-bold">Choose how they can't say no.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Left Column: Mechanics Selection */}
                <div className="space-y-6">
                    <div className="bg-[var(--card)] dark:bg-zinc-800 p-6 rounded-3xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-4">
                        <label className="text-sm font-bold text-black dark:text-white uppercase tracking-wider block mb-2">
                            Select Evasion Mechanic
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {MECHANICS.map((mech) => {
                                const isSelected = config.noMechanic === mech.id;
                                const requiredFeature = mech.tier === 'casual' ? 'trap_expert_mechanics'
                                    : mech.tier === 'starter' ? 'trap_advanced_mechanics'
                                        : null;
                                const isLocked = requiredFeature ? !hasFeature(requiredFeature) : false;

                                // We render the button, wrapping it in FeatureGate if needed
                                const ButtonContent = (
                                    <button
                                        onClick={() => !isLocked && updateConfig({ noMechanic: mech.id as any })}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group relative overflow-hidden ${isSelected
                                            ? 'bg-black text-white border-black shadow-[4px_4px_0_0_#666]'
                                            : 'bg-white text-black border-black hover:bg-gray-50 shadow-[2px_2px_0_0_#000]'
                                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className={`p-2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-black'}`}>
                                            {mech.icon}
                                        </div>
                                        <div>
                                            <div className="font-black text-lg">{mech.label}</div>
                                            <div className={`text-xs font-medium ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{mech.desc}</div>
                                        </div>
                                    </button>
                                );

                                if (requiredFeature) {
                                    return (
                                        <FeatureGate
                                            key={mech.id}
                                            feature={requiredFeature}
                                            inline
                                            silent={false}
                                        >
                                            {ButtonContent}
                                        </FeatureGate>
                                    );
                                }

                                return <div key={mech.id}>{ButtonContent}</div>;
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Visuals (Theme & Labels) */}
                <div className="space-y-6">
                    <div className="bg-[var(--card)] dark:bg-zinc-800 p-6 rounded-3xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-4 relative -rotate-1 hover:rotate-0 transition-transform duration-200">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Visual Theme</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['cupid', 'dark-romance', 'neon-love', 'pastel-dream', 'obsidian'].map((t) => {
                                    const isCustom = t !== 'cupid';
                                    const ThemeButton = (
                                        <button
                                            onClick={() => updateConfig({ theme: t as any })}
                                            className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 ${config.theme === t
                                                ? 'bg-black text-white border-black shadow-[4px_4px_0_0_#666]'
                                                : 'bg-white text-black border-black hover:bg-gray-100 shadow-[2px_2px_0_0_#000]'
                                                }`}
                                        >
                                            {t.replace('-', ' ')}
                                        </button>
                                    );

                                    if (isCustom) {
                                        return (
                                            <FeatureGate key={t} feature="trap_custom_themes" inline>
                                                {ThemeButton}
                                            </FeatureGate>
                                        );
                                    }
                                    return <div key={t}>{ThemeButton}</div>;
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--card)] dark:bg-zinc-800 p-6 rounded-3xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-4 relative rotate-1 hover:rotate-0 transition-transform duration-200">
                        <div className="flex items-center gap-2 text-[var(--primary)] border-b-2 border-dashed border-black/10 pb-2 mb-2">
                            <Type className="w-5 h-5" />
                            <h3 className="font-bold text-black dark:text-white uppercase tracking-wider text-xs">Button Labels (Optional)</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-bold text-black dark:text-gray-200 ml-1">Positive Button</label>
                                <input
                                    className="w-full bg-white dark:bg-zinc-700 border-2 border-black rounded-xl px-4 py-3 outline-none focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 text-black dark:text-white font-bold"
                                    placeholder="Yes"
                                    value={config.customYesLabel || ''}
                                    onChange={(e) => updateConfig({ customYesLabel: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-black dark:text-gray-200 ml-1">Negative Button</label>
                                <input
                                    className="w-full bg-white dark:bg-zinc-700 border-2 border-black rounded-xl px-4 py-3 outline-none focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 text-black dark:text-white font-bold"
                                    placeholder="No"
                                    value={config.customNoLabel || ''}
                                    onChange={(e) => updateConfig({ customNoLabel: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Footer for Nav */}
            <div className="sticky bottom-0 left-0 right-0 bg-[var(--card)]/90 backdrop-blur-sm p-4 -m-4 mt-4 border-t-2 border-black/10 flex justify-between items-center z-20 rounded-b-3xl">
                <Button variant="ghost" onClick={onBack} className="text-black dark:text-white font-bold hover:bg-black/10 dark:hover:bg-white/10">Back</Button>
                <Button
                    onClick={onNext}
                    className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-4 text-lg rounded-full border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 active:shadow-[2px_2px_0_0_#000] active:translate-y-[1px] transition-all font-display"
                >
                    Next: Security
                </Button>
            </div>
        </div>
    );
};
