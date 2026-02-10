"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrapConfig } from '@/types';
import { Loader2, Rocket, Key, HelpCircle, AlertTriangle } from 'lucide-react';

interface SecurityStepProps {
    config: Partial<TrapConfig>;
    updateConfig: (data: Partial<TrapConfig>) => void;
    onSubmit: (finalData?: Partial<TrapConfig>) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export const SecurityStep: React.FC<SecurityStepProps> = ({ config, updateConfig, onSubmit, onBack, isSubmitting }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [hint, setHint] = useState("");
    const [scold, setScold] = useState("");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <div className="inline-block bg-[var(--color-yellow)] text-black border-2 border-black shadow-[3px_3px_0_0_#000] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 -rotate-2">
                    Optional Step
                </div>
                <h2 className="text-4xl font-display font-medium text-black dark:text-white">Lock It Down</h2>
                <p className="text-[var(--foreground-muted)] dark:text-gray-300 font-bold">Protect your trap so only they can see it.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="bg-[var(--card)] dark:bg-zinc-800 p-6 rounded-3xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-4 relative -rotate-1 hover:rotate-0 transition-transform duration-200">
                        <div className="flex items-center gap-2 text-[var(--primary)] border-b-2 border-dashed border-black/10 pb-2 mb-2">
                            <Key className="w-5 h-5 fill-current" />
                            <h3 className="font-bold text-black dark:text-white uppercase tracking-wider text-xs">The Gatekeeper</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-bold text-black dark:text-gray-200 ml-1">Security Question</label>
                                <input
                                    className="w-full bg-white dark:bg-zinc-700 border-2 border-black rounded-xl px-4 py-3 outline-none focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 text-black dark:text-white font-bold"
                                    placeholder="Where was our first date?"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-black dark:text-gray-200 ml-1">The Secret Answer</label>
                                <input
                                    className="w-full bg-white dark:bg-zinc-700 border-2 border-black rounded-xl px-4 py-3 outline-none focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 text-black dark:text-white font-bold"
                                    placeholder="Paris"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--card)] dark:bg-zinc-800 p-6 rounded-3xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-4 relative rotate-1 hover:rotate-0 transition-transform duration-200">
                        <div className="flex items-center gap-2 text-[var(--primary)] border-b-2 border-dashed border-black/10 pb-2 mb-2">
                            <HelpCircle className="w-5 h-5 fill-current" />
                            <h3 className="font-bold text-black dark:text-white uppercase tracking-wider text-xs">Helpers (Optional)</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-bold text-black dark:text-gray-200 ml-1">Hint</label>
                                <input
                                    className="w-full bg-white dark:bg-zinc-700 border-2 border-black rounded-xl px-4 py-3 outline-none focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 text-sm text-black dark:text-white font-bold"
                                    placeholder="It involves croissants..."
                                    value={hint}
                                    onChange={(e) => setHint(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-black dark:text-gray-200 ml-1">Scold Message (If wrong)</label>
                                <input
                                    className="w-full bg-white dark:bg-zinc-700 border-2 border-black rounded-xl px-4 py-3 outline-none focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all placeholder:text-gray-300 dark:placeholder:text-gray-500 text-sm text-black dark:text-white font-bold"
                                    placeholder="How could you forget? Try again!"
                                    value={scold}
                                    onChange={(e) => setScold(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[var(--cream)] border-[3px] border-black shadow-[6px_6px_0_0_#000] p-6 rounded-3xl space-y-4 relative rotate-1 hover:rotate-0 transition-transform duration-200">
                        <div className="flex items-center gap-2 text-[var(--accent)] border-b-2 border-dashed border-black/10 pb-2 mb-2">
                            <AlertTriangle className="w-5 h-5 fill-current text-black" />
                            <h3 className="font-bold text-black uppercase tracking-wider text-xs">Notifications</h3>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed font-bold">
                            We'll email you the moment they say YES (and verify it wasn't an accidental click).
                        </p>
                        <div>
                            <label className="text-sm font-bold text-black ml-1">Your Email</label>
                            <input
                                type="email"
                                className="w-full bg-white border-2 border-black rounded-xl px-4 py-3 outline-none focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all placeholder:text-gray-300 text-black font-bold"
                                placeholder="you@example.com"
                                value={config.creatorEmail || ''}
                                onChange={(e) => updateConfig({ creatorEmail: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Footer for Nav */}
            <div className="sticky bottom-0 left-0 right-0 bg-[var(--card)]/90 backdrop-blur-sm p-4 -m-4 mt-4 border-t-2 border-black/10 flex justify-between items-center z-20 rounded-b-3xl">
                <Button variant="ghost" onClick={onBack} className="text-black dark:text-white font-bold hover:bg-black/10 dark:hover:bg-white/10">Back</Button>
                <Button
                    onClick={() => {
                        const securityData = {
                            security: question && answer ? { question, answer, hint, scold } : undefined,
                            creatorEmail: config.creatorEmail
                        };
                        onSubmit(securityData);
                    }}
                    disabled={isSubmitting}
                    className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-4 text-lg rounded-full border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 active:shadow-[2px_2px_0_0_#000] active:translate-y-[1px] transition-all font-display disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Creating...
                        </>
                    ) : (
                        <>
                            Finish & Copy <Rocket className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
