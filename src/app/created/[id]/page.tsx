"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, orderBy, limit, collectionGroup } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { TrapData, AnalyticsSession } from '@/types';
import { Loader2, Heart, Copy, CheckCircle, Share2, Eye, Monitor, Smartphone, Tablet, Globe, MousePointer, Clock, Activity, RefreshCw, XCircle, ThumbsUp, HelpCircle, MapPin, ShieldAlert, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NeoBrutalBackground } from '@/components/ui/NeoBrutalBackground';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityLogItem {
    id: string;
    type: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
    sessionId?: string;
}

export default function CreatedPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [user, setUser] = useState<User | null>(null);
    const [data, setData] = useState<TrapData | null>(null);
    const [sessions, setSessions] = useState<AnalyticsSession[]>([]);
    const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [permissionError, setPermissionError] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/${id}` : '';

    // Check authentication first
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const fetchData = async () => {
        if (!id || !user) return;

        try {
            // Fetch trap data
            const docRef = doc(db, "traps", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const trapData = docSnap.data() as TrapData;

                // Verify ownership
                if (trapData.creatorId !== user.uid) {
                    setPermissionError(true);
                    setLoading(false);
                    return;
                }

                setData(trapData);
            } else {
                setLoading(false);
                return;
            }

            // Fetch sessions (analytics)
            const sessionsRef = collection(db, "traps", id, "sessions");
            const sessionsSnap = await getDocs(query(sessionsRef, orderBy("startTime", "desc"), limit(50)));
            const sessionsData = sessionsSnap.docs.map(d => ({ ...d.data(), id: d.id } as AnalyticsSession & { id: string }));
            setSessions(sessionsData);

            // Fetch events from ALL sessions and aggregate
            const allEvents: ActivityLogItem[] = [];
            for (const session of sessionsData.slice(0, 20)) { // Limit to recent 20 sessions
                try {
                    const eventsRef = collection(db, "traps", id, "sessions", session.id, "events");
                    const eventsSnap = await getDocs(query(eventsRef, orderBy("timestamp", "desc"), limit(10)));
                    const sessionEvents = eventsSnap.docs.map(d => ({
                        ...d.data(),
                        id: d.id,
                        sessionId: session.id
                    } as ActivityLogItem));
                    allEvents.push(...sessionEvents);
                } catch {
                    // Skip sessions we can't read
                }
            }

            // Sort all events by timestamp descending
            allEvents.sort((a, b) => b.timestamp - a.timestamp);
            setActivityLog(allEvents.slice(0, 50)); // Keep top 50

        } catch (error) {
            console.error('Error fetching trap data:', error);
            setPermissionError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchData();
        } else if (!authLoading && !user) {
            router.push('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, user, authLoading]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            alert('Failed to copy link');
        }
    };

    // Analytics calculations
    const totalViews = data?.stats?.views || sessions.length;
    const totalAttempts = data?.stats?.attempts || sessions.reduce((acc, s) => acc + (s.clickCount || 0), 0);
    const totalHovers = data?.stats?.hovers || sessions.reduce((acc, s) => acc + (s.hoverCount || 0), 0);

    // Device breakdown
    const deviceBreakdown = sessions.reduce((acc, s) => {
        const device = s.deviceType || 'unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Country breakdown
    const countryBreakdown = sessions.reduce((acc, s) => {
        const country = s.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Outcome calculation
    const completedSessions = sessions.filter(s => s.endTime);
    const yesCount = activityLog.filter(e => e.type === 'click_yes').length;
    const abandonedCount = sessions.length - yesCount;

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'view': return <Eye className="w-4 h-4 text-blue-500" />;
            case 'hover_no': return <MousePointer className="w-4 h-4 text-orange-500" />;
            case 'click_no': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'click_yes': return <ThumbsUp className="w-4 h-4 text-green-500" />;
            case 'attempt_security': return <HelpCircle className="w-4 h-4 text-purple-500" />;
            default: return <Activity className="w-4 h-4 text-gray-500" />;
        }
    };

    const getEventLabel = (type: string) => {
        switch (type) {
            case 'view': return 'Page View';
            case 'hover_no': return 'Hovered "No"';
            case 'click_no': return 'Tried to click "No"';
            case 'click_yes': return 'Clicked "Yes" 💕';
            case 'attempt_security': return 'Security question attempt';
            default: return type;
        }
    };

    const getDeviceIcon = (device: string) => {
        switch (device) {
            case 'mobile': return <Smartphone className="w-4 h-4" />;
            case 'tablet': return <Tablet className="w-4 h-4" />;
            default: return <Monitor className="w-4 h-4" />;
        }
    };

    if (loading || authLoading) {
        return (
            <NeoBrutalBackground>
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="animate-spin text-[var(--primary)] w-12 h-12" />
                </div>
            </NeoBrutalBackground>
        );
    }

    if (permissionError) {
        return (
            <NeoBrutalBackground>
                <div className="flex h-screen items-center justify-center p-4">
                    <div className="text-center space-y-4 p-8 bg-white border-[3px] border-red-500 rounded-3xl shadow-[8px_8px_0_0_#ef4444] max-w-md">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                        <p className="text-gray-600">You don't have permission to view this trap's analytics. Only the creator can access this page.</p>
                        <div className="pt-4 space-x-3">
                            <Link href="/dashboard">
                                <Button className="bg-gray-900 text-white">Go to Dashboard</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </NeoBrutalBackground>
        );
    }

    if (!data) {
        return (
            <NeoBrutalBackground>
                <div className="flex h-screen items-center justify-center">
                    <div className="text-center space-y-4 p-8 bg-white border-[3px] border-black rounded-3xl shadow-[8px_8px_0_0_#000]">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto" />
                        <h1 className="text-2xl font-bold">Trap Not Found</h1>
                        <p className="text-gray-500">This trap may have been deleted or doesn't exist.</p>
                        <Link href="/tools/trap">
                            <Button className="bg-[var(--primary)] text-white border-2 border-black">Create a New Trap</Button>
                        </Link>
                    </div>
                </div>
            </NeoBrutalBackground>
        );
    }

    return (
        <NeoBrutalBackground>
            <div className="min-h-screen p-4 pt-24 pb-12">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white border-[4px] border-black rounded-3xl shadow-[8px_8px_0_0_#000] p-6"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                    <span className="text-sm font-bold uppercase text-green-600">Trap Active</span>
                                </div>
                                <h1 className="text-3xl font-display text-black">
                                    {data.partnerName ? `Trap for ${data.partnerName}` : 'Your Valentine Trap'}
                                </h1>
                                <p className="text-gray-500 mt-1 italic">"{data.message}"</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="px-4 py-2 bg-gray-100 text-black font-bold rounded-xl border-2 border-black hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                                <Link href={`/share/${id}`}>
                                    <button className="px-4 py-2 bg-blue-500 text-white font-bold rounded-xl border-2 border-black hover:bg-blue-600 transition-colors flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Share Link */}
                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="flex-1 px-4 py-3 bg-gray-100 border-2 border-black rounded-xl font-mono text-sm"
                            />
                            <button
                                onClick={copyLink}
                                className="px-6 py-3 bg-[var(--primary)] text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all flex items-center gap-2"
                            >
                                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Views', value: totalViews, icon: <Eye className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
                            { label: 'Reject Attempts', value: totalAttempts, icon: <XCircle className="w-6 h-6" />, color: 'bg-red-100 text-red-600' },
                            { label: '"No" Hovers', value: totalHovers, icon: <MousePointer className="w-6 h-6" />, color: 'bg-orange-100 text-orange-600' },
                            { label: 'Said Yes!', value: yesCount, icon: <ThumbsUp className="w-6 h-6" />, color: 'bg-green-100 text-green-600' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0_0_#000]"
                            >
                                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-black">{stat.value}</div>
                                <div className="text-sm font-bold text-gray-500 uppercase">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Activity Log */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0_0_#000] overflow-hidden"
                        >
                            <div className="p-4 border-b-2 border-black bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-[var(--primary)]" />
                                    <h2 className="font-bold uppercase text-sm tracking-wider">Activity Log</h2>
                                </div>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
                                {activityLog.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No activity yet. Share your trap!</p>
                                    </div>
                                ) : (
                                    activityLog.map((event, i) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${event.type === 'click_yes' ? 'bg-green-50' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${event.type === 'click_yes' ? 'bg-green-100' :
                                                event.type === 'attempt_security' ? (event.metadata?.success ? 'bg-green-100' : 'bg-red-100') :
                                                    'bg-gray-100'
                                                }`}>
                                                {getEventIcon(event.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-sm">{getEventLabel(event.type)}</span>
                                                    {event.type === 'attempt_security' && (
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${event.metadata?.success
                                                            ? 'bg-green-200 text-green-800'
                                                            : 'bg-red-200 text-red-800'
                                                            }`}>
                                                            {event.metadata?.success ? '✓ Correct' : '✗ Wrong'}
                                                        </span>
                                                    )}
                                                    {event.type === 'click_yes' && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-black bg-pink-200 text-pink-800">
                                                            💕 Success!
                                                        </span>
                                                    )}
                                                </div>


                                                {event.type === 'attempt_security' && event.metadata?.input ? (
                                                    <div className="mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono truncate">
                                                        Answered: &quot;{String(event.metadata.input)}&quot;
                                                    </div>
                                                ) : null}

                                                {event.type === 'click_yes' && typeof event.metadata?.attempts === 'number' ? (
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        After {event.metadata.attempts} &quot;No&quot; attempts
                                                    </div>
                                                ) : null}

                                                <div className="text-xs text-gray-400 mt-1">
                                                    {new Date(event.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>

                        {/* Devices & Countries */}
                        <div className="space-y-6">
                            {/* Devices */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0_0_#000] overflow-hidden"
                            >
                                <div className="p-4 border-b-2 border-black bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <Monitor className="w-5 h-5 text-[var(--primary)]" />
                                        <h2 className="font-bold uppercase text-sm tracking-wider">Devices</h2>
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    {Object.keys(deviceBreakdown).length === 0 ? (
                                        <p className="text-gray-400 text-center py-4">No device data yet</p>
                                    ) : (
                                        Object.entries(deviceBreakdown).map(([device, count]) => (
                                            <div key={device} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="flex items-center gap-2">
                                                    {getDeviceIcon(device)}
                                                    <span className="font-bold capitalize">{device}</span>
                                                </div>
                                                <span className="bg-[var(--primary)] text-white px-3 py-1 rounded-full text-sm font-bold">
                                                    {count}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>

                            {/* Countries */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0_0_#000] overflow-hidden"
                            >
                                <div className="p-4 border-b-2 border-black bg-gray-50">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-[var(--primary)]" />
                                        <h2 className="font-bold uppercase text-sm tracking-wider">Countries</h2>
                                    </div>
                                </div>
                                <div className="p-4 space-y-3 max-h-[200px] overflow-y-auto">
                                    {Object.keys(countryBreakdown).length === 0 ? (
                                        <p className="text-gray-400 text-center py-4">No location data yet</p>
                                    ) : (
                                        Object.entries(countryBreakdown)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([country, count]) => (
                                                <div key={country} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        <span className="font-bold">{country}</span>
                                                    </div>
                                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                        {count}
                                                    </span>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Outcome Summary */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-gradient-to-r from-pink-100 to-red-100 border-[3px] border-black rounded-2xl shadow-[6px_6px_0_0_#000] p-6"
                    >
                        <h2 className="font-bold uppercase text-sm tracking-wider mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-[var(--primary)]" />
                            Outcome Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-black text-center">
                                <ThumbsUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <div className="text-2xl font-black text-green-600">{yesCount}</div>
                                <div className="text-sm font-bold text-gray-500">Said YES! 💕</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-black text-center">
                                <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <div className="text-2xl font-black text-gray-600">{abandonedCount}</div>
                                <div className="text-sm font-bold text-gray-500">Left Without Answer</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-black text-center">
                                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                <div className="text-2xl font-black text-red-600">{totalAttempts}</div>
                                <div className="text-sm font-bold text-gray-500">Reject Attempts</div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </NeoBrutalBackground>
    );
}
