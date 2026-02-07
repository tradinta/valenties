"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { TrapConfig } from '@/types';
import { motion } from 'framer-motion';
import { PersonStanding, FileWarning, Scroll, BrainCircuit, Heart, MessageCircle, AlertOctagon, Laugh, Check, X, Play } from 'lucide-react';
import { MechanicDispatcher } from '@/components/trap-engine/MechanicDispatcher';

interface ChallengeStepProps {
    config: Partial<TrapConfig>;
    updateConfig: (data: Partial<TrapConfig>) => void;
    onNext: () => void;
    onBack: () => void;
}

const CHALLENGES = [
    {
        id: 'run-away',
        title: 'Run Away',
        desc: 'The button evades the cursor.',
        Icon: PersonStanding,
        color: 'bg-rose-500 text-white'
    },
    // Teleport removed as requested
    {
        id: 'shrink',
        title: 'Shrink Ray',
        desc: 'Disappears into nothingness.',
        Icon: MessageCircle,
        color: 'bg-purple-500 text-white'
    },
    {
        id: 'fake-no',
        title: 'Secret Yes',
        desc: 'Clicking acts as a YES!',
        Icon: Heart,
        color: 'bg-yellow-400 text-black'
    },
    {
        id: 'many-yes',
        title: 'Yes Shower',
        desc: 'Spawns 50 Yes buttons on click.',
        Icon: Laugh,
        color: 'bg-orange-500 text-white'
    },
    {
        id: 'persuasion',
        title: 'Persuasion',
        desc: 'Guilt trips them with text.',
        Icon: MessageCircle,
        color: 'bg-pink-500 text-white'
    },
    {
        id: 'dsa-quiz',
        title: 'DSA Quiz',
        desc: '10 hard questions, 2 mins.',
        Icon: BrainCircuit,
        color: 'bg-indigo-600 text-white'
    },
    {
        id: 'essay-hard',
        title: 'The Manifesto',
        desc: '3000 words required.',
        Icon: Scroll,
        color: 'bg-emerald-500 text-white'
    },
    {
        id: 'impossible-form',
        title: 'Impossible Form',
        desc: 'Bureaucracy from hell.',
        Icon: FileWarning,
        color: 'bg-amber-500 text-black'
    }
];

export const ChallengeStep: React.FC<ChallengeStepProps> = ({ config, updateConfig, onNext, onBack }) => {
    const [previewId, setPreviewId] = React.useState<string | null>(null);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-display font-medium text-black dark:text-white">The Obstacle</h2>
                <p className="text-[var(--foreground-muted)] dark:text-gray-300 font-bold">What happens if they try to refuse?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px] overflow-y-auto pr-2 custom-scrollbar p-2 pb-20">
                {CHALLENGES.map((challenge, index) => {
                    const Icon = challenge.Icon;
                    const isSelected = config.noMechanic === challenge.id;

                    return (
                        <div key={challenge.id} className="relative group perspective-1000">
                            {/* 
                                "Tick" Sticker for Preview
                                Always visible, looks like a physical sticker attached to the card 
                             */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewId(challenge.id);
                                }}
                                className="absolute -top-3 -right-3 z-30 bg-green-500 text-white px-3 py-1 rounded-sm font-black text-[10px] uppercase tracking-widest border-2 border-white shadow-[3px_3px_0_0_rgba(0,0,0,0.3)] transform rotate-6 hover:rotate-3 hover:scale-110 transition-all flex items-center gap-1 hover:bg-green-400 group-hover:animate-pulse"
                                title="Preview this effect"
                            >
                                <Check size={12} strokeWidth={4} /> Preview
                            </button>

                            <motion.button
                                whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => updateConfig({ noMechanic: challenge.id as any })}
                                className={`w-full p-4 rounded-3xl border-[3px] border-black text-left transition-all relative shadow-[4px_4px_0_0_#000] overflow-hidden ${isSelected
                                        ? 'shadow-[6px_6px_0_0_#000] scale-[1.02] ring-4 ring-offset-2 ring-black'
                                        : 'hover:shadow-[6px_6px_0_0_#000]'
                                    }`}
                            >
                                {/* Fully Colored Background */}
                                <div className={`absolute inset-0 ${challenge.color} opacity-100`} />

                                {/* Texture Overlay */}
                                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')] mix-blend-overlay" />

                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="bg-white/90 p-3 rounded-2xl border-2 border-black shadow-sm shrink-0">
                                        <Icon className="w-6 h-6 text-black" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-black text-xl mb-0.5 truncate ${challenge.color.includes('text-black') ? 'text-black' : 'text-white drop-shadow-md'}`}>
                                            {challenge.title}
                                        </h3>
                                        <p className={`font-bold text-xs leading-tight ${challenge.color.includes('text-black') ? 'text-black/80' : 'text-white/90'}`}>
                                            {challenge.desc}
                                        </p>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/20 shadow-sm z-10">
                                        <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                                        Selected
                                    </div>
                                )}
                            </motion.button>
                        </div>
                    );
                })}
            </div>

            {/* Sticky Mobile Footer for Nav */}
            <div className="sticky bottom-0 left-0 right-0 bg-[var(--card)]/90 backdrop-blur-sm p-4 -m-4 mt-4 border-t-2 border-black/10 flex justify-between items-center z-20 rounded-b-3xl">
                <Button variant="ghost" onClick={onBack} className="text-black dark:text-white font-bold hover:bg-black/10 dark:hover:bg-white/10">Back</Button>
                <Button
                    onClick={onNext}
                    className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-4 text-lg rounded-full border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 active:shadow-[2px_2px_0_0_#000] active:translate-y-[1px] transition-all font-display"
                >
                    Next: Visuals
                </Button>
            </div>

            {/* PREVIEW MODAL */}
            {previewId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[var(--cream)] w-full max-w-2xl h-[450px] md:h-[550px] rounded-3xl border-[4px] border-black shadow-[10px_10px_0_0_#000] relative overflow-hidden flex flex-col">

                        {/* Modal Header */}
                        <div className="bg-black text-white p-4 flex justify-between items-center shrink-0">
                            <h3 className="font-display text-xl font-bold flex items-center gap-2">
                                <Play size={18} className="fill-current text-yellow-400" />
                                Preview: {CHALLENGES.find(c => c.id === previewId)?.title}
                            </h3>
                            <button
                                onClick={() => setPreviewId(null)}
                                className="hover:text-red-400 transition-colors bg-white/10 p-1 rounded-full"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Sandbox Area */}
                        <div className="flex-1 relative flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] p-8 overflow-hidden group select-none">

                            {/* Instruction Hint */}
                            <div className="absolute top-4 left-0 right-0 text-center pointer-events-none opacity-50">
                                <p className="text-xs font-bold uppercase tracking-widest text-black/50">Try clicking "No" below</p>
                            </div>

                            {/* The Trap Mechanism */}
                            <div className="relative z-10 p-12 w-full flex items-center justify-center h-full">
                                <MechanicDispatcher
                                    mechanic={previewId}
                                    difficulty="medium"
                                    onAttempt={() => console.log('Attempted')}
                                    onSuccess={() => {
                                        // Optional: Feedback on success
                                    }}
                                />
                            </div>

                        </div>

                        {/* Footer Note */}
                        <div className="bg-white border-t-2 border-black p-3 text-center text-xs font-bold text-gray-500 shrink-0">
                            This is exactly how it will behave for your Valentine.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
