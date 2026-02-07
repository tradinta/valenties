"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { TrapData } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink, CheckCircle } from 'lucide-react';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Users, Globe, Clock, Smartphone, LayoutDashboard, History, MessageCircle, Heart } from 'lucide-react';
import Link from 'next/link';

export default function CreatedPage() {
    const params = useParams();
    const id = params?.id as string;
    const [data, setData] = useState<TrapData | null>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);

    // Fetch Trap Data & Sessions

    // ... (component start)
    const [user, setUser] = useState<any>(null);

    // Auth Listener
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsub();
    }, []);

    // Fetch Trap Data & Sessions
    useEffect(() => {
        if (!id) return;

        // Trap Doc Listener
        const unsubTrap = onSnapshot(doc(db, "traps", id), (doc) => {
            if (doc.exists()) setData(doc.data() as TrapData);
        });
        return () => unsubTrap();
    }, [id]);

    // Sessions Listener (Only if authorized)
    useEffect(() => {
        if (!id || !data || !user) return;

        // Security check
        if (data.creatorId !== user.uid) {
            console.warn("User is not the creator, skipping analytics.");
            return;
        }

        const q = query(collection(db, "traps", id, "sessions"), orderBy("createdAt", "desc"), limit(50));
        const unsubSessions = onSnapshot(q, (snapshot) => {
            const sess = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setSessions(sess);
        }, (error) => {
            console.error("Analytics permission denied", error);
        });

        return () => unsubSessions();
    }, [id, data, user]);

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/${id}` : '';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate Aggregates
    const uniqueCountries = new Set(sessions.map(s => s.country).filter(Boolean)).size;
    const uniqueDevices = new Set(sessions.map(s => s.userAgent || 'unknown')).size; // Simple approx
    const totalViews = sessions.length;
    const avgDuration = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0) / (sessions.length || 1);

    if (!data) return (
        <div className="flex items-center justify-center min-h-screen bg-pink-50 text-pink-600 font-bold animate-pulse">
            Fetching Trap details...
        </div>
    );

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-4 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto">

            {/* Header / Success Banner */}
            <div className="text-center space-y-4 py-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center gap-3 bg-white px-8 py-4 rounded-full shadow-xl border border-pink-100"
                >
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <h1 className="text-3xl font-black text-rose-600 tracking-tight font-display">It's Ready!</h1>
                </motion.div>
                <p className="text-rose-900/60 font-medium">Your trap for <span className="font-bold text-rose-600">{data.partnerName}</span> is live.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Available Actions / Link Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 space-y-6 bg-white/80 backdrop-blur shadow-xl border-white/50">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                                <ExternalLink className="w-3 h-3" /> Share Link
                            </label>
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={shareUrl}
                                    className="flex-1 bg-pink-50/50 border border-pink-100 rounded-lg px-3 py-3 text-sm text-rose-900 font-medium outline-none focus:ring-2 focus:ring-rose-200"
                                />
                                <Button size="icon" onClick={copyToClipboard} className="bg-rose-500 hover:bg-rose-600 text-white shrink-0">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-pink-50 space-y-3">
                            <Button className="w-full bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 font-bold" variant="outline" onClick={() => window.open(shareUrl, '_blank')}>
                                Test It Yourself <ExternalLink className="ml-2 w-4 h-4" />
                            </Button>
                            <Link href="/dashboard" className="block w-full">
                                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-200" size="lg">
                                    <LayoutDashboard className="mr-2 w-4 h-4" /> Monitor on Dashboard
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* Quick Stats Summary */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/60 p-4 rounded-2xl border border-white text-center">
                            <div className="text-3xl font-black text-rose-600">{data.stats?.attempts || 0}</div>
                            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Refusals</div>
                        </div>
                        <div className="bg-white/60 p-4 rounded-2xl border border-white text-center">
                            <div className={`text-xl font-black ${data.status === 'completed' ? 'text-green-500' : 'text-rose-400'}`}>
                                {data.status === 'completed' ? 'CAPTURED' : 'PENDING'}
                            </div>
                            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Status</div>
                        </div>
                    </div>

                    {/* Partner Note Display */}
                    {data.responseNote && (
                        <div className="bg-white/90 p-6 rounded-2xl shadow-xl border border-pink-200 space-y-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Heart className="w-24 h-24 text-rose-500 fill-rose-500" />
                            </div>
                            <div className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" /> Message from {data.partnerName}
                            </div>
                            <p className="text-xl font-medium text-rose-900 italic font-display">"{data.responseNote}"</p>
                        </div>
                    )}
                </div>

                {/* Realtime Analytics Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatsCard icon={Users} label="Total Views" value={totalViews} color="text-blue-500" />
                        <StatsCard icon={Globe} label="Countries" value={uniqueCountries} color="text-indigo-500" />
                        <StatsCard icon={Smartphone} label="Devices" value={uniqueDevices} color="text-purple-500" />
                        <StatsCard icon={Clock} label="Avg Time" value={`${Math.round(avgDuration)}s`} color="text-orange-500" />
                    </div>

                    <Card className="bg-white/80 backdrop-blur shadow-xl border-white/50 overflow-hidden">
                        <div className="p-4 border-b border-pink-50 flex items-center gap-2 bg-pink-50/30">
                            <History className="w-4 h-4 text-rose-400" />
                            <h3 className="font-bold text-rose-900 text-sm uppercase tracking-wider">Live Activity Log</h3>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {sessions.length === 0 ? (
                                <div className="p-8 text-center text-rose-300 italic text-sm">
                                    No visitors yet... send the link!
                                </div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-rose-400 uppercase bg-pink-50/50 sticky top-0 backdrop-blur-sm">
                                        <tr>
                                            <th className="px-6 py-3 font-bold">Time</th>
                                            <th className="px-6 py-3 font-bold">Location</th>
                                            <th className="px-6 py-3 font-bold">Device</th>
                                            <th className="px-6 py-3 font-bold text-right">Attempts</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-pink-50">
                                        {sessions.map((session) => (
                                            <tr key={session.id} className="hover:bg-pink-50/50 transition-colors">
                                                <td className="px-6 py-3 text-rose-800">
                                                    {new Date(session.createdAt?.seconds * 1000 || Date.now()).toLocaleTimeString()}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                                                        {session.country === 'Unknown' ? 'Unknown 🌍' : session.country}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-rose-600">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{session.os}</span>
                                                        <span className="text-[10px] opacity-70">{session.browser}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-right font-bold text-rose-900">
                                                    {session.securityAttempts > 0 && (
                                                        <span className="mr-2 text-xs bg-red-100 text-red-600 px-1 rounded">🔒 {session.securityAttempts}</span>
                                                    )}
                                                    {session.clickCount > 0 ? (
                                                        <span className="text-red-500">{session.clickCount} 🚫</span>
                                                    ) : (
                                                        <span className="text-gray-300">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}

const StatsCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex flex-col items-center justify-center gap-2 text-center">
        <Icon className={`w-5 h-5 ${color}`} />
        <div>
            <div className="text-2xl font-black text-rose-900">{value}</div>
            <div className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">{label}</div>
        </div>
    </div>
);
