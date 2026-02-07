"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { TrapConfig } from '@/types';
import { Eye, Type } from 'lucide-react';

interface MechanicsStepProps {
    config: Partial<TrapConfig>;
    updateConfig: (data: Partial<TrapConfig>) => void;
    onNext: () => void;
    onBack: () => void;
}

export const MechanicsStep: React.FC<MechanicsStepProps> = ({ config, updateConfig, onNext, onBack }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-display font-medium text-black dark:text-white">Visuals & Branding</h2>
                <p className="text-[var(--foreground-muted)] dark:text-gray-300 font-bold">Customize the look and feel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Left Column: Theme & Text */}
                <div className="space-y-6">
                    <div className="bg-[var(--card)] dark:bg-zinc-800 p-6 rounded-3xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-4 relative -rotate-1 hover:rotate-0 transition-transform duration-200">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Visual Theme</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['cupid', 'dark-romance', 'neon-love', 'pastel-dream', 'obsidian'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => updateConfig({ theme: t as any })}
                                        className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 ${config.theme === t
                                            ? 'bg-black text-white border-black shadow-[4px_4px_0_0_#666]'
                                            : 'bg-white text-black border-black hover:bg-gray-100 shadow-[2px_2px_0_0_#000] dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600'
                                            }`}
                                    >
                                        {t.replace('-', ' ')}
                                    </button>
                                ))}
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

                {/* Right Column: Preview Info (No Live Preview) */}
                <div className="bg-[var(--cream)] p-8 rounded-3xl border-[3px] border-dashed border-black flex flex-col items-center justify-center text-center h-full min-h-[300px] relative">
                    <div className="w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center mb-4 text-white border-[3px] border-black shadow-[4px_4px_0_0_#000]">
                        <Eye className="w-10 h-10" />
                    </div>
                    <div className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold mb-4 rotate-2">
                        COMING SOON
                    </div>
                    <h3 className="text-2xl font-display font-bold text-black mb-2">Preview Mode</h3>
                    <p className="text-gray-600 max-w-xs leading-relaxed font-bold">
                        Once you finish creating your trap, you'll get a secret link to test it yourself before sending it out.
                    </p>
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
