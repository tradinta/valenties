"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calendar, Settings, Lock, Globe, BarChart3, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'; // Import needed
import { db } from '@/lib/firebase'; // Import needed
import { Poll, PollOption } from '@/types';

export default function CreatePollPage() {
    const { firebaseUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<PollOption[]>([
        { id: '1', text: '', votes: 0 },
        { id: '2', text: '', votes: 0 }
    ]);
    const [config, setConfig] = useState({
        allowMultiple: false,
        requireAuth: false,
        isPublic: true,
        collectLocation: true
    });

    const addOption = () => {
        setOptions([...options, { id: Math.random().toString(36).substr(2, 9), text: '', votes: 0 }]);
    };

    const removeOption = (id: string) => {
        if (options.length > 2) {
            setOptions(options.filter(o => o.id !== id));
        }
    };

    const updateOption = (id: string, text: string) => {
        setOptions(options.map(o => o.id === id ? { ...o, text } : o));
    };

    const handleCreate = async () => {
        if (!firebaseUser) return alert("Please login first!");

        setLoading(true);
        try {
            const pollData: Omit<Poll, 'id'> = {
                creatorId: firebaseUser.uid,
                question,
                options: options.filter(o => o.text.trim() !== ''),
                config,
                createdAt: Date.now(),
                status: 'active',
                totalVotes: 0,
                views: 0,
                theme: 'neo-brutal'
            };

            const docRef = await addDoc(collection(db, "polls"), pollData);
            router.push(`/vote/${docRef.id}`);
        } catch {
            alert("Failed to create poll");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4 font-sans text-[#1a1817]">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#A7F3D0] border-[3px] border-black rounded-full font-black uppercase text-sm shadow-[4px_4px_0_0_#000]">
                        <BarChart3 className="w-4 h-4" />
                        New Poll
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black">Ask the Audience</h1>
                    <p className="font-bold text-gray-500">Settle arguments, pick dates, or just roast each other.</p>
                </div>

                {/* Main Card */}
                <div className="bg-white p-8 rounded-[2rem] border-[4px] border-black shadow-[8px_8px_0_0_#000]">

                    {/* Question */}
                    <div className="space-y-4 mb-8">
                        <label className="text-lg font-black uppercase ml-1">The Question</label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g. Who is the better cook?"
                            className="w-full h-32 bg-gray-50 border-[3px] border-black rounded-xl p-4 text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-[#A7F3D0] resize-none"
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-4 mb-8">
                        <label className="text-lg font-black uppercase ml-1">Options</label>
                        {options.map((opt, idx) => (
                            <div key={opt.id} className="flex gap-2 animate-in slide-in-from-left-2">
                                <span className="flex items-center justify-center w-12 font-black text-gray-400 bg-gray-100 rounded-xl border-2 border-transparent">
                                    {idx + 1}
                                </span>
                                <input
                                    value={opt.text}
                                    onChange={(e) => updateOption(opt.id, e.target.value)}
                                    placeholder={`Option ${idx + 1}`}
                                    className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#000] focus:-translate-y-1 transition-all"
                                />
                                {options.length > 2 && (
                                    <button
                                        onClick={() => removeOption(opt.id)}
                                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addOption}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl font-bold text-gray-400 hover:border-black hover:text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Option
                        </button>
                    </div>

                    {/* Settings Toggles */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <div
                            onClick={() => setConfig(prev => ({ ...prev, allowMultiple: !prev.allowMultiple }))}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${config.allowMultiple ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-500 hover:border-black'}`}
                        >
                            <div className="p-2 bg-white/10 rounded-lg"><Settings className="w-5 h-5" /></div>
                            <div className="text-sm font-bold">Multiple Choice</div>
                        </div>

                        <div
                            onClick={() => setConfig(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${config.isPublic ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-500 hover:border-black'}`}
                        >
                            <div className="p-2 bg-white/10 rounded-lg"><Globe className="w-5 h-5" /></div>
                            <div className="text-sm font-bold">Public Poll</div>
                        </div>
                    </div>

                    {/* Action */}
                    <Button
                        onClick={handleCreate}
                        disabled={loading || !question || options.some(o => !o.text)}
                        className="w-full py-6 text-xl bg-[#A7F3D0] text-black font-black rounded-xl border-[3px] border-black shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-0 active:shadow-none transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <span className="flex items-center gap-2">
                                Launch Poll <ArrowRight className="w-5 h-5" strokeWidth={3} />
                            </span>
                        )}
                    </Button>

                </div>
            </div>
        </div>
    );
}
