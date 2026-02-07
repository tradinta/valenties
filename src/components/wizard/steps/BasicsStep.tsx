"use client";

"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { TrapConfig } from '@/types';
import { MultiImageUploader } from '@/components/creation/MultiImageUploader';
import { Camera, Heart, MessageCircle, Star } from 'lucide-react';

interface BasicsStepProps {
    config: Partial<TrapConfig>;
    updateConfig: (data: Partial<TrapConfig>) => void;
    onNext: () => void;
    onBack: () => void;
}

export const BasicsStep: React.FC<BasicsStepProps> = ({ config, updateConfig, onNext, onBack }) => {

    const handleMainImagesUpdate = (urls: string[]) => {
        updateConfig({
            assets: {
                ...config.assets,
                images: urls,
                image: urls[0] || undefined
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-display font-medium text-black dark:text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">The Proposal</h2>
                <p className="text-[var(--foreground-muted)] dark:text-gray-300 font-bold">Set the stage for your question.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Left Column: Text Inputs */}
                <div className="space-y-6">
                    <div className="bg-[var(--card)] dark:bg-zinc-800 p-6 rounded-3xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-4 relative -rotate-1 hover:rotate-0 transition-transform duration-200">
                        <div className="flex items-center gap-2 text-[var(--primary)] mb-2">
                            <Heart className="w-5 h-5 fill-current" />
                            <span className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">The Players</span>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-black dark:text-gray-200 ml-1">To (Partner)</label>
                            <input
                                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 text-lg font-bold focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] outline-none transition-all placeholder:text-gray-400 text-black shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]"
                                placeholder="e.g. Alice"
                                value={config.partnerName || ''}
                                onChange={(e) => updateConfig({ partnerName: e.target.value })}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-black dark:text-gray-200 ml-1">From (You)</label>
                            <input
                                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 text-lg font-bold focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] outline-none transition-all placeholder:text-gray-400 text-black shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]"
                                placeholder="e.g. Bob"
                                value={config.creatorName || ''}
                                onChange={(e) => updateConfig({ creatorName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-[var(--card)] dark:bg-zinc-800 p-6 rounded-3xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-2 h-full relative rotate-1 hover:rotate-0 transition-transform duration-200">
                        <div className="flex items-center gap-2 text-[var(--primary)] mb-2">
                            <MessageCircle className="w-5 h-5 fill-current" />
                            <span className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">The Question</span>
                        </div>
                        <textarea
                            className="w-full h-[180px] bg-white border-2 border-black rounded-xl px-4 py-4 text-xl font-display leading-relaxed focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] outline-none transition-all resize-none placeholder:text-gray-400 text-black shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]"
                            placeholder="Will you be my Valentine?"
                            value={config.message || ''}
                            onChange={(e) => updateConfig({ message: e.target.value })}
                        />
                    </div>

                    <div className="bg-[var(--card)] dark:bg-zinc-800 p-6 rounded-3xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-2 h-full relative -rotate-1 hover:rotate-0 transition-transform duration-200">
                        <div className="flex items-center gap-2 text-[var(--accent)] mb-2">
                            <Star className="w-5 h-5 fill-current text-black" />
                            <span className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">Victory Message</span>
                        </div>
                        <p className="text-xs text-[var(--foreground-muted)] dark:text-gray-400 mb-2 font-medium">What they see after they say YES. (Optional)</p>
                        <textarea
                            className="w-full h-[100px] bg-white border-2 border-black rounded-xl px-4 py-4 text-lg font-bold leading-relaxed focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] outline-none transition-all resize-none placeholder:text-gray-400 text-black shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]"
                            placeholder="I knew you'd say yes! <3"
                            value={config.successMessage || ''}
                            onChange={(e) => updateConfig({ successMessage: e.target.value })}
                        />
                    </div>
                </div>

                {/* Right Column: Images */}
                <div className="space-y-6">
                    <div className="bg-[var(--card)] dark:bg-zinc-800 p-6 rounded-3xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-4 relative rotate-1 hover:rotate-0 transition-transform duration-200">
                        <div className="flex items-center gap-2 text-[var(--primary)] mb-2">
                            <Camera className="w-5 h-5 fill-current" />
                            <span className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">Shared Memories</span>
                        </div>
                        <p className="text-xs text-[var(--foreground-muted)] dark:text-gray-400 mb-4 ml-1 font-medium">These photos will float around your question.</p>

                        <div className="bg-white dark:bg-zinc-700 rounded-xl border-2 border-black p-2">
                            <MultiImageUploader
                                images={config.assets?.images || (config.assets?.image ? [config.assets.image] : [])}
                                onImagesChange={handleMainImagesUpdate}
                                maxImages={4}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Footer for Nav */}
            <div className="sticky bottom-0 left-0 right-0 bg-[var(--card)]/90 backdrop-blur-sm p-4 -m-4 mt-4 border-t-2 border-black/10 flex justify-between items-center z-20 rounded-b-3xl">
                <Button variant="ghost" onClick={onBack} className="text-black dark:text-white font-bold hover:bg-black/10 dark:hover:bg-white/10">
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!config.partnerName || !config.message}
                    className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-4 text-lg rounded-full border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 active:shadow-[2px_2px_0_0_#000] active:translate-y-[1px] transition-all font-display"
                >
                    Next: Choose Your Trap
                </Button>
            </div>
        </div>
    );
};
