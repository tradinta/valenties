"use client";

import React, { useEffect, useState } from 'react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { ModerationService } from '@/services/ModerationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShieldAlert, Ban, Globe } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BanRecord {
    id: string; // firestore id
    type: 'user' | 'ip';
    value: string;
    reason: string;
    timestamp: number;
}

export default function AdminModeration() {
    const [bannedWords, setBannedWords] = useState<string[]>([]);
    const [newWord, setNewWord] = useState('');
    const [bans, setBans] = useState<BanRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        // Ensure service is init
        await ModerationService.init();
        setBannedWords(Array.from(ModerationService.bannedWords));

        // Load Bans from Firestore directly for details
        const snap = await getDocs(collection(db, 'moderation_bans'));
        const loadedBans: BanRecord[] = [];
        snap.forEach(d => {
            loadedBans.push({ id: d.id, ...d.data() } as BanRecord);
        });
        setBans(loadedBans);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddWord = async () => {
        if (!newWord.trim()) return;
        await ModerationService.addBannedWord(newWord);
        setNewWord('');
        loadData();
    };

    const handleRemoveWord = async (word: string) => {
        await ModerationService.removeBannedWord(word);
        loadData();
    };

    const handleUnban = async (ban: BanRecord) => {
        if (confirm(`Unban ${ban.value}?`)) {
            await ModerationService.unban(ban.value);
            loadData();
        }
    };

    return (
        <AdminGuard>
            <div className="p-8 space-y-8">
                <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <ShieldAlert className="w-8 h-8 text-black" /> Moderation
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Word Filter */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Ban className="w-5 h-5 text-red-500" /> Banned Words (Regex)
                        </h2>
                        <div className="flex gap-2 mb-4">
                            <Input
                                value={newWord}
                                onChange={e => setNewWord(e.target.value)}
                                placeholder="Add word phrase..."
                                onKeyDown={e => e.key === 'Enter' && handleAddWord()}
                            />
                            <Button onClick={handleAddWord}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                            {bannedWords.map(word => (
                                <span key={word} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium flex items-center gap-2 border border-red-100">
                                    {word}
                                    <button onClick={() => handleRemoveWord(word)} className="hover:text-red-800"><Trash2 className="w-3 h-3" /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Active Bans */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-black" /> Active Bans
                        </h2>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {bans.length === 0 && <p className="text-gray-400 italic">No active bans.</p>}
                            {bans.map(ban => (
                                <div key={ban.id} className="p-3 border border-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-50">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${ban.type === 'ip' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {ban.type}
                                            </span>
                                            <span className="font-mono text-sm">{ban.value}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Reason: {ban.reason}</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => handleUnban(ban)} className="text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                                        Unban
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
