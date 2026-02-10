"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/types/chat';
import { Send, Loader2, UserPlus, Zap, Image as LucideImage, Mic, Archive, X, RefreshCw, Reply, GripHorizontal, ChevronRight, Ban, Globe, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { UserService } from '@/services/UserService';
import { ChatService } from '@/services/ChatService';
import { UserTier } from '@/types/shared';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ChatControls from './ChatControls';
import { UploadService } from '@/services/UploadService';
import VoiceRecorder from './VoiceRecorder';
import { Switch } from '@/components/ui/switch';
import { Input } from "@/components/ui/input";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let socket: any;

const COMMON_COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'KE', name: 'Kenya' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'IN', name: 'India' },
];

export default function RandomChat() {
    const { firebaseUser, loginAnonymous } = useAuth();
    const [status, setStatus] = useState<'idle' | 'searching' | 'connected' | 'partner_disconnected'>('idle');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [room, setRoom] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Identity State
    const [fingerprint, setFingerprint] = useState<string | null>(null);
    const [userTier, setUserTier] = useState<UserTier>('anonymous');
    const [myCountry, setMyCountry] = useState<string>('US'); // Default
    const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);

    // Filters (Premium)
    const [filterGender, setFilterGender] = useState<string>('any');
    const [filterCountry, setFilterCountry] = useState<string>('any');

    // Features (Casual+)
    const [autoReconnect, setAutoReconnect] = useState(false);

    // UI State
    const [isTyping, setIsTyping] = useState(false);
    const [partnerTyping, setPartnerTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Partner Info (received on match)
    const [partnerInfo, setPartnerInfo] = useState<{ gender?: string, country?: string, tier?: string } | null>(null);

    // Media & Uploads
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [pendingImage, setPendingImage] = useState<{ file: File, previewUrl: string } | null>(null);

    // Reply
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);

    // Modals
    const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [showBookmarkModal, setShowBookmarkModal] = useState(false);
    const [bookmarkName, setBookmarkName] = useState('');

    // --- Init ---
    useEffect(() => {
        const init = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setFingerprint(result.visitorId);

            // Get Country
            try {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                if (data.country_code) setMyCountry(data.country_code);
            } catch (e) {
                console.log('Failed to detect country');
            }

            if (firebaseUser) {
                const profile = await UserService.getProfile(firebaseUser.uid);
                if (profile) {
                    setUserTier(profile.tier);
                    setGender(profile.gender || null);
                } else {
                    await UserService.initializeProfile(firebaseUser.uid, 'free', result.visitorId);
                }
            } else {
                setUserTier('anonymous');
            }
        };
        init();
    }, [firebaseUser]);

    // --- Socket Setup ---
    useEffect(() => {
        const socketInitializer = async () => {
            await fetch('/api/socket/io');

            // Dynamic import to prevent Illegal Constructor error during render
            const socketIO: any = await import('socket.io-client');
            const io = socketIO.io || socketIO.default;

            socket = io(window.location.origin, {
                path: '/api/socket/io',
                reconnection: true,
            });

            socket.on('connect', () => {
                setIsConnected(true);
                if (firebaseUser?.uid) socket.emit('reconnect_user', { userId: firebaseUser.uid });
            });

            socket.on('disconnect', () => setIsConnected(false));

            socket.on('match_found', (data: { room: string, partnerGender?: string, partnerTier?: string, partnerCountry?: string }) => {
                setStatus('connected');
                setRoom(data.room);
                setMessages([]);
                setPartnerInfo({
                    gender: data.partnerGender,
                    tier: data.partnerTier,
                    country: data.partnerCountry
                });

                const premiumMsg = data.partnerTier === 'premium' ? "✨ Connected with a Premium User!" : "";
                const infoMsg = `Connected! ${data.partnerGender !== 'Anonymous' ? `They represent (${data.partnerGender})` : ''} ${data.partnerCountry ? `from ${data.partnerCountry}` : ''}`;
                addSystemMessage(premiumMsg || infoMsg);
            });

            socket.on('receive_message', (data: any) => {
                setMessages(prev => [...prev, {
                    id: Math.random().toString(),
                    text: data.message,
                    sender: 'them',
                    timestamp: data.timestamp,
                    type: data.type || 'text',
                    replyTo: data.replyTo // Handle reply context
                }]);
                setPartnerTyping(false);
            });

            socket.on('partner_typing', () => setPartnerTyping(true));
            socket.on('partner_stop_typing', () => setPartnerTyping(false));

            socket.on('partner_disconnected', () => {
                setStatus('partner_disconnected');
                setRoom(null);
                addSystemMessage("Partner disconnected.");

                if (autoReconnect) {
                    addSystemMessage("Auto-reconnecting in 3s...");
                    setTimeout(() => {
                        if (status === 'partner_disconnected') findPartner();
                    }, 3000);
                }
            });

            socket.on('error', (data: { message: string }) => {
                addSystemMessage(`Error: ${data.message}`);
                setStatus('idle');
            });
        };

        socketInitializer();
        return () => { if (socket) socket.disconnect(); }
    }, [firebaseUser, autoReconnect]);

    useEffect(() => {
        if (status === 'partner_disconnected' && autoReconnect) {
            const timer = setTimeout(() => {
                findPartner();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, autoReconnect]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, partnerTyping, isUploading, pendingImage]);

    // --- Actions ---
    const findPartner = async () => {
        if (!socket || !socket.connected) {
            addSystemMessage("Connecting to server... please wait.");
            return;
        }

        if (!fingerprint) {
            console.log("Waiting for fingerprint...");
            return;
        }

        let currentUid = firebaseUser?.uid;

        if (!currentUid) {
            console.log("No current UID, attempting login...");
            try {
                const cred = await loginAnonymous();
                currentUid = cred?.user.uid;
                setShowPrivacyBanner(true);
            } catch (err) {
                addSystemMessage("Connection error. Please try again.");
                return;
            }
        }

        if (!currentUid) {
            // Final fallback wait
            const waitUid = await new Promise(r => {
                let count = 0;
                const check = setInterval(() => {
                    if (firebaseUser?.uid || count > 10) {
                        clearInterval(check);
                        r(firebaseUser?.uid);
                    }
                    count++;
                }, 100);
            });
            currentUid = waitUid as string;
        }

        if (!currentUid) {
            addSystemMessage("Identity error. Refreshing...");
            return;
        }

        setStatus('searching');
        console.log("Chat search started for UID:", currentUid);

        const { allowed } = await UserService.checkLimit(currentUid as string, 'connections');
        if (!allowed) {
            setStatus('idle');
            userTier === 'anonymous' ? setShowLimitModal(true) : setShowUpgradeModal(true);
            return;
        }

        await UserService.incrementUsage(currentUid as string, 'connections');
        if (gender) await UserService.setGender(currentUid as string, gender);

        setMessages([]);
        socket.emit('join_queue', {
            userId: currentUid,
            tier: userTier,
            gender: gender,
            country: myCountry,
            filters: { gender: filterGender, country: filterCountry }
        });
    };

    const clearFilters = () => {
        setFilterGender('any');
        setFilterCountry('any');
    };

    const addSystemMessage = (text: string) => {
        setMessages(prev => [...prev, { id: Math.random().toString(), text, sender: 'system', timestamp: Date.now() }]);
    };

    const sendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || status !== 'connected' || !room) return;

        socket.emit('stop_typing', { room });
        setIsTyping(false);

        const payload = {
            room,
            message: input,
            type: 'text',
            replyTo: replyingTo ? { id: replyingTo.id, text: replyingTo.text, sender: replyingTo.sender } : undefined
        };

        socket.emit('send_message', payload);

        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            text: input,
            sender: 'me',
            timestamp: Date.now(),
            type: 'text',
            replyTo: replyingTo || undefined
        }]);

        setInput('');
        setReplyingTo(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setPendingImage({ file, previewUrl });
        // Don't clear input, user might want to add caption
    };

    const cancelImage = () => {
        setPendingImage(null);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const sendPendingImage = async () => {
        if (!pendingImage || !firebaseUser || !room) return;

        const { allowed } = await UserService.checkLimit(firebaseUser.uid, 'images');
        if (!allowed) {
            cancelImage();
            return setShowUpgradeModal(true); // Popup Modal instead of alert
        }

        setIsUploading(true);
        try {
            const url = await UploadService.uploadFile(pendingImage.file, 'image', (percent) => {
                setUploadProgress(percent);
            });
            await UserService.incrementUsage(firebaseUser.uid, 'images');

            // Send Image Message
            socket.emit('send_message', { room, message: url, type: 'image' });
            setMessages(prev => [...prev, { id: Math.random().toString(), text: url, sender: 'me', timestamp: Date.now(), type: 'image' }]);

            // Send Caption if exists
            if (input.trim()) {
                socket.emit('send_message', { room, message: input, type: 'text' });
                setMessages(prev => [...prev, { id: Math.random().toString(), text: input, sender: 'me', timestamp: Date.now(), type: 'text' }]);
                setInput('');
            }

            cancelImage();
        } catch (e) {
            addSystemMessage("Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    // Voice Handler
    const handleVoiceSend = async (blob: Blob) => {
        if (!room) return;
        setIsUploading(true);
        try {
            const url = await UploadService.uploadFile(blob, 'voice', (percent) => setUploadProgress(percent));
            socket.emit('send_message', { room, message: url, type: 'voice' });
            setMessages(prev => [...prev, { id: Math.random().toString(), text: url, sender: 'me', timestamp: Date.now(), type: 'voice' }]);
        } catch (e) { addSystemMessage("Voice upload failed."); }
        finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        if (!isTyping && room) {
            socket.emit('typing', { room });
            setIsTyping(true);
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (room) socket.emit('stop_typing', { room });
            setIsTyping(false);
        }, 1000);
    };

    const handleSaveChat = async () => {
        if (!firebaseUser) return setShowPrivacyBanner(true);
        if (userTier === 'anonymous' || userTier === 'free') return setShowUpgradeModal(true);
        const res = await ChatService.saveChatSession(firebaseUser.uid, 'Stranger', messages);
        if (res?.success) addSystemMessage("Chat saved successfully to history.");
    };

    const handleBookmark = async () => {
        if (!firebaseUser) return setShowPrivacyBanner(true);
        if (userTier === 'anonymous' || userTier === 'free') return setShowUpgradeModal(true);
        setBookmarkName('');
        setShowBookmarkModal(true);
    };

    const confirmBookmark = async () => {
        if (!firebaseUser || !bookmarkName) return;
        const mockId = `user_${Math.random().toString(36).substr(2, 9)}`;
        const res = await ChatService.bookmarkStranger(firebaseUser.uid, mockId, bookmarkName);
        if (res.success) {
            addSystemMessage("Stranger bookmarked!");
            setShowBookmarkModal(false);
        }
    };

    const leaveChat = () => {
        if (socket) socket.emit('leave_chat');
        setStatus('idle');
        setRoom(null);
        setMessages([]);
        setPendingImage(null);
    };

    return (
        <div className="max-w-md mx-auto w-full h-[700px] bg-card/40 backdrop-blur-xl rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-border/5">

            <ChatControls currentSession={messages} />

            {/* Header */}
            <div className={`p-4 flex justify-between items-center relative z-10 transition-colors ${status === 'connected' ? 'bg-card/60' : 'bg-transparent'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_12px_currentColor] transition-all duration-500
                        ${status === 'connected' ? 'bg-green-500 text-green-500' :
                            status === 'searching' ? 'bg-yellow-400 text-yellow-400 animate-pulse' :
                                'bg-red-400 text-red-400'}`} />
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-wider text-foreground">
                            {status === 'idle' ? 'Chaos Connect' : status === 'searching' ? 'Scanning...' : 'Connected'}
                        </h3>
                        {status === 'connected' && partnerInfo && (
                            <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                {partnerInfo.gender || 'Stranger'} • {partnerInfo.country || 'Unknown'}
                                {partnerInfo.tier === 'premium' && <span className="text-orange-500">★</span>}
                            </p>
                        )}
                    </div>
                </div>

                {status === 'connected' && (
                    <div className="flex gap-2">
                        <button onClick={handleSaveChat} className="p-2 hover:bg-foreground/5 rounded-full" title="Save Chat">
                            <Archive className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={handleBookmark} className="p-2 hover:bg-foreground/5 rounded-full" title="Keep Stranger">
                            <UserPlus className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={leaveChat} className="bg-red-100/50 hover:bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs font-black transition-colors">
                            END
                        </button>
                    </div>
                )}
            </div>

            {/* Main Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-0" ref={scrollRef}>
                {status === 'idle' && (
                    <div className="h-full flex flex-col items-center justify-center space-y-6 pt-8 animate-in fade-in zoom-in duration-300">
                        {/* Start Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={findPartner}
                            className="w-32 h-32 bg-gradient-to-br from-card to-muted rounded-full border-[6px] border-card shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center group"
                        >
                            <Zap className="w-12 h-12 text-foreground group-hover:fill-current transition-all" />
                        </motion.button>

                        {/* Filters */}
                        <div className="w-full bg-card/60 backdrop-blur-md rounded-3xl p-6 space-y-4 border border-border/20 shadow-lg">
                            <div className="flex justify-between items-center border-b border-border/10 pb-2">
                                <span className="text-xs font-black uppercase text-muted-foreground">Match Settings</span>
                                {userTier === 'premium' || userTier === 'admin' ? (
                                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">PREMIUM ACTIVE</span>
                                ) : (
                                    <Link href="/premium" className="text-[10px] flex items-center gap-1 text-blue-600 font-bold hover:underline">
                                        <Lock className="w-3 h-3" /> Upgrade to Filter
                                    </Link>
                                )}
                            </div>

                            <div className="space-y-4 pt-2">
                                {/* My Gender */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-wider">I Identify As</label>
                                    <div className="bg-gray-100/80 p-1 rounded-xl flex gap-1">
                                        {['male', 'female'].map(g => (
                                            <button
                                                key={g}
                                                onClick={() => setGender(g as any)}
                                                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase transition-all ${gender === g
                                                    ? 'bg-white shadow-sm text-black scale-100'
                                                    : 'text-gray-400 hover:text-gray-600 scale-95'
                                                    }`}
                                            >
                                                {g === 'male' ? 'M' : 'F'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Gender Filter */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground ml-1 uppercase tracking-wider">Target Gender</label>
                                    <div className="bg-muted/80 p-1 rounded-xl flex gap-1">
                                        {['any', 'male', 'female'].map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    if (userTier !== 'premium' && userTier !== 'admin') return setShowUpgradeModal(true);
                                                    setFilterGender(opt);
                                                }}
                                                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase transition-all ${filterGender === opt
                                                    ? 'bg-card shadow-sm text-foreground scale-100'
                                                    : 'text-muted-foreground hover:text-foreground scale-95'
                                                    }`}
                                            >
                                                {opt === 'any' ? 'All' : opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Country Filter */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase tracking-wider">Target Region (Code)</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <input
                                            value={filterCountry === 'any' ? '' : filterCountry}
                                            onChange={(e) => {
                                                if (userTier !== 'premium' && userTier !== 'admin') return setShowUpgradeModal(true);
                                                const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
                                                setFilterCountry(val || 'any');
                                            }}
                                            placeholder="ANY (Global)"
                                            className="w-full bg-muted/80 focus:bg-card rounded-xl py-3 pl-10 pr-10 text-sm font-black uppercase placeholder:text-muted-foreground transition-all border border-transparent focus:border-border/10 focus:shadow-sm outline-none text-foreground"
                                        />
                                        {filterCountry !== 'any' && (
                                            <button
                                                onClick={() => setFilterCountry('any')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black hover:bg-gray-200 p-1 rounded-full transition-all"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[9px] text-gray-400 pl-2 font-medium">
                                        e.g. US, UK, KE, IN.
                                    </p>
                                </div>
                            </div>

                            {(filterGender !== 'any' || filterCountry !== 'any') && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full py-2 text-[10px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors border-t border-gray-100 mt-2 flex items-center justify-center gap-1"
                                >
                                    <RefreshCw className="w-3 h-3" /> Reset Filters
                                </button>
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={autoReconnect}
                                        onCheckedChange={(checked) => {
                                            if (userTier === 'anonymous') return setShowUpgradeModal(true);
                                            setAutoReconnect(checked);
                                        }}
                                        id="reconnect"
                                    />
                                    <label htmlFor="reconnect" className="text-xs font-bold text-gray-600 cursor-pointer">
                                        Auto-Reconnect
                                    </label>
                                </div>
                                {userTier === 'anonymous' && <Lock className="w-3 h-3 text-muted-foreground" />}
                            </div>
                        </div>
                    </div>
                )}

                {status === 'searching' && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
                        <h3 className="text-2xl font-black mb-2 text-foreground">Scanning...</h3>
                        <p className="text-muted-foreground text-xs">Finding your next chaos connection...</p>
                        <button onClick={leaveChat} className="mt-8 text-xs font-bold text-muted-foreground hover:text-foreground">CANCEL</button>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} mb-4 group`}>
                            {msg.sender === 'system' ? (
                                <div className="w-full text-center my-2">
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">{msg.text}</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 max-w-[85%]">
                                        {msg.sender === 'them' && (
                                            <button
                                                onClick={() => setReplyingTo(msg)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-gray-100 rounded-full hover:bg-black hover:text-white"
                                            >
                                                <Reply className="w-3 h-3" />
                                            </button>
                                        )}

                                        <div className="flex flex-col">
                                            {/* Reply Context */}
                                            {msg.replyTo && (
                                                <div className={`mb-1 px-3 py-1 rounded-lg text-[10px] border-l-2 bg-gray-50/50 ${msg.sender === 'me' ? 'text-right border-white/20' : 'text-left border-black/20'}`}>
                                                    <span className="font-bold opacity-50 block">Replying to {msg.replyTo.sender === 'me' ? 'You' : 'Them'}</span>
                                                    <span className="italic opacity-70 truncate max-w-[150px] inline-block">{msg.replyTo.text}</span>
                                                </div>
                                            )}

                                            {/* Message Bubble */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={`rounded-2xl px-4 py-3 font-medium text-sm shadow-sm ${msg.sender === 'me'
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-card text-foreground rounded-bl-none border border-border/10'
                                                    }`}
                                            >
                                                {msg.type === 'image' ? (
                                                    <img src={msg.text} alt="Shared" className="rounded-lg max-w-full" />
                                                ) : (
                                                    msg.text
                                                )}
                                            </motion.div>
                                        </div>

                                        {msg.sender === 'me' && (
                                            <button
                                                onClick={() => setReplyingTo(msg)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-gray-100 rounded-full hover:bg-black hover:text-white"
                                            >
                                                <Reply className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {partnerTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-center gap-2">
                            <div className="bg-card border border-border/10 rounded-2xl rounded-bl-none px-4 py-2.5 flex gap-1 shadow-sm">
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-100" />
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-200" />
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground animate-pulse">Typing...</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            {status === 'connected' && (
                <div className="bg-white/80 backdrop-blur-md border-t border-gray-100 relative">

                    {/* Progress Bar for non-modal uploads */}
                    {!pendingImage && isUploading && uploadProgress > 0 && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 z-10">
                            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    )}

                    {/* Reply Preview */}
                    {replyingTo && !pendingImage && (
                        <div className="px-4 py-2 bg-muted/80 border-b border-border/10 flex justify-between items-center text-xs animate-in slide-in-from-bottom-2">
                            <div className="flex flex-col border-l-2 border-primary pl-2">
                                <span className="font-bold text-muted-foreground">Replying to {replyingTo.sender === 'me' ? 'Yourself' : 'Stranger'}</span>
                                <span className="truncate max-w-[200px] text-muted-foreground/60">{replyingTo.text}</span>
                            </div>
                            <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-muted rounded-full"><X className="w-4 h-4 text-foreground" /></button>
                        </div>
                    )}

                    {/* Image Preview Overlay */}
                    {pendingImage ? (
                        <div className="p-4 bg-white z-20 space-y-3">
                            <div className="flex gap-4 items-start">
                                <div className="relative group">
                                    <img src={pendingImage.previewUrl} className="w-20 h-20 object-cover rounded-xl shadow-md border border-gray-100" />
                                    <button onClick={cancelImage} className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full shadow-md"><X className="w-3 h-3" /></button>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <TextArea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Add a caption... (optional)"
                                        className="w-full text-sm bg-gray-50 border-none rounded-xl p-2 resize-none h-16 focus:ring-0"
                                    />
                                    {uploadProgress > 0 && (
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-black transition-all duration-300 ease-out"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button onClick={cancelImage} disabled={isUploading} className="text-xs font-bold text-gray-400 px-3 py-2">CANCEL</button>
                                <button
                                    onClick={sendPendingImage}
                                    disabled={isUploading}
                                    className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                    {isUploading ? `UPLOADING ${uploadProgress}%` : 'SEND'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 flex gap-2 items-end">
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*" />

                            <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 h-10 w-10 flex items-center justify-center">
                                <LucideImage className="w-5 h-5" />
                            </button>

                            {userTier === 'premium' || userTier === 'admin' ? (
                                <VoiceRecorder onSend={handleVoiceSend} />
                            ) : (
                                <button onClick={() => setShowUpgradeModal(true)} className="p-2.5 rounded-xl bg-gray-50 text-gray-300 h-10 w-10 flex items-center justify-center">
                                    <Mic className="w-5 h-5" />
                                </button>
                            )}

                            <form onSubmit={sendMessage} className="flex-1 flex gap-2 items-center">
                                <Input
                                    ref={inputRef}
                                    value={input}
                                    onChange={handleTyping}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-muted focus:bg-card border-transparent focus:border-border/10 rounded-xl px-4 py-2.5 font-medium text-sm transition-all focus:ring-0 h-10 text-foreground"
                                    autoFocus
                                />
                                <button type="submit" disabled={!input.trim()} className="bg-primary text-primary-foreground h-10 w-10 rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all shadow-lg active:scale-95 flex items-center justify-center">
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {/* Dialogs */}
            <Dialog open={showBookmarkModal} onOpenChange={setShowBookmarkModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bookmark Stranger</DialogTitle>
                        <DialogDescription>Give them a nickname to find them later.</DialogDescription>
                    </DialogHeader>
                    <Input value={bookmarkName} onChange={e => setBookmarkName(e.target.value)} placeholder="e.g. Piano Girl" />
                    <DialogFooter>
                        <Button onClick={confirmBookmark}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Premium Feature</DialogTitle>
                        <DialogDescription>Upgrade to unlock filters, unlimited chats, and more.</DialogDescription>
                    </DialogHeader>
                    <Link href="/premium" className="w-full">
                        <Button className="w-full bg-black text-white">View Plans</Button>
                    </Link>
                </DialogContent>
            </Dialog>

            {showPrivacyBanner && (
                <div className="absolute top-20 left-4 right-4 bg-yellow-100 border border-yellow-300 p-3 rounded-xl z-50 flex justify-between items-center text-xs font-bold text-yellow-800 shadow-xl">
                    <span>create an account to use this feature!</span>
                    <button onClick={() => setShowPrivacyBanner(false)}><X className="w-4 h-4" /></button>
                </div>
            )}
        </div>
    );
}

// Simple TextArea helper
const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => (
    <textarea ref={ref} {...props} />
));
TextArea.displayName = "TextArea";
