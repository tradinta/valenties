"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageUploader } from './ImageUploader';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { LivePreview } from './LivePreview';

export const ConfigForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        partnerName: '',
        message: 'Will you be my Valentine?',
        creatorName: '',
        creatorEmail: '',
        theme: 'cupid',
        imageUrl: '',
        difficulty: 'hard',
        noMechanic: 'run-away',
        yesMechanic: 'simple',
        chaosMode: 'none'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const docRef = await addDoc(collection(db, "traps"), {
                ...form,
                createdAt: Date.now(),
                status: 'active',
                stats: { attempts: 0, hovers: 0, timeToYes: 0 }
            });
            // Redirect to dashboard/success page
            router.push(`/created/${docRef.id}`);
        } catch (error) {
            console.error("Error creating trap:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-xl mx-auto p-6 md:p-8 space-y-8 bg-white/90 backdrop-blur-md shadow-xl border-pink-200">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                    Craft Your Trap
                </h2>
                <p className="text-muted-foreground">Make it impossible to say no!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Image Upload Section */}
                <ImageUploader
                    onUploadComplete={(url) => setForm({ ...form, imageUrl: url })}
                    currentImage={form.imageUrl}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-pink-700">Their Name</label>
                        <input
                            required
                            className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                            placeholder="e.g. Alice"
                            value={form.partnerName}
                            onChange={(e) => setForm({ ...form, partnerName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-pink-700">Your Name</label>
                        <input
                            required
                            className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                            placeholder="e.g. Bob"
                            value={form.creatorName}
                            onChange={(e) => setForm({ ...form, creatorName: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-pink-700">Your Email (for notifications)</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                        placeholder="you@example.com"
                        value={form.creatorEmail}
                        onChange={(e) => setForm({ ...form, creatorEmail: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-pink-700">The Question</label>
                    <textarea
                        className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none transition-all resize-none h-24"
                        placeholder="Will you be my Valentine?"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-pink-700">Theme</label>
                    <div className="grid grid-cols-4 gap-2">
                        {['cupid', 'dark-romance', 'neon-love', 'pastel-dream'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setForm({ ...form, theme: t })}
                                className={`h-10 rounded-full text-xs font-bold transition-transform hover:scale-105 border-2 ${form.theme === t ? 'border-pink-500 scale-105 shadow-md' : 'border-transparent opacity-70'
                                    }`}
                                style={{
                                    background: t === 'cupid' ? 'pink'
                                        : t === 'dark-romance' ? '#2a0a10'
                                            : t === 'neon-love' ? '#ff00ff'
                                                : '#e0f7fa',
                                    color: t === 'dark-romance' ? 'white' : 'black'
                                }}
                            >
                                {t.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-pink-100">
                    <h3 className="text-lg font-semibold text-pink-600">Trap Mechanics ⚙️</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-pink-700">No Button Behavior</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none"
                                value={form.noMechanic}
                                onChange={(e) => setForm({ ...form, noMechanic: e.target.value })}
                            >
                                <optgroup label="🏃 Evasion">
                                    <option value="run-away">Run Away</option>
                                    <option value="teleport">Teleport</option>
                                    <option value="shrink">Shrink</option>
                                </optgroup>
                                <optgroup label="🧠 Psychological">
                                    <option value="fake-no">Secret Yes (Tricks them)</option>
                                    <option value="persuasion">Persuasion Mode</option>
                                    <option value="guilt-trip">Guilt Trip</option>
                                    <option value="many-yes">Many Yes Shower</option>
                                </optgroup>
                                <optgroup label="🔥 Hardcore Challenges">
                                    <option value="dsa-quiz">DSA Quiz (2 mins)</option>
                                    <option value="essay-hard">3000 Word Essay</option>
                                    <option value="impossible-form">Impossible Form</option>
                                </optgroup>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-pink-700">Difficulty</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none"
                                value={form.difficulty}
                                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                            >
                                <option value="easy">Easy (They might catch it)</option>
                                <option value="medium">Medium (Standard Evasion)</option>
                                <option value="hard">Hard (Very Fast)</option>
                                <option value="impossible">Impossible (Teleport Only)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Live Preview Section */}
                <div className="pt-6">
                    {/* @ts-ignore */}
                    <LivePreview config={form} />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Generate Trap Link</span>}
                </Button>
            </form>
        </Card>
    );
};
