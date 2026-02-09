"use client";

import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/types/chat';
import { Send, Loader2, UserPlus, Zap, Image as ImageIcon, Sparkles, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { UserService } from '@/services/UserService';
import { UserTier } from '@/types/shared';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let socket: any;

export default function RandomChat() {
    const { firebaseUser, loginAnonymous } = useAuth();
    const [status, setStatus] = useState<'idle' | 'searching' | 'connected' | 'partner_disconnected'>('idle');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [room, setRoom] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // New Feature States
    const [fingerprint, setFingerprint] = useState<string | null>(null);
    const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
    const [showPrivacyBanner, setShowPrivacyBanner] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [userTier, setUserTier] = useState<UserTier>('anonymous');

    // Initialize Fingerprint & Profile
    useEffect(() => {
        const init = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setFingerprint(result.visitorId);

            if (firebaseUser) {
                // Ensure profile exists
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

    useEffect(() => {
        const socketInitializer = async () => {
            await fetch('/api/socket/io');
            socket = io(window.location.origin, {
                path: '/api/socket/io',
            });

            socket.on('match_found', (data: { room: string, partnerGender?: string, partnerTier?: string }) => {
                setStatus('connected');
                setRoom(data.room);
                setMessages([]);

                // Tier-specific effects
                if (data.partnerTier === 'premium') {
                    // Trigger effect (simplified for now)
                    addSystemMessage("✨ You connected with a Premium User! ✨");
                } else {
                    addSystemMessage("You're connected! Say hi.");
                }

                if (data.partnerGender) {
                    addSystemMessage(`Partner identifies as: ${data.partnerGender}`);
                }
            });

            socket.on('receive_message', (data: { message: string, senderId: string, timestamp: number, type?: 'text' | 'image' }) => {
                setMessages(prev => [...prev, {
                    id: Math.random().toString(),
                    text: data.message, // For images this will be URL
                    sender: 'them',
                    timestamp: data.timestamp,
                    type: data.type || 'text'
                }]);
            });

            socket.on('partner_disconnected', () => {
                setStatus('partner_disconnected');
                setRoom(null);
                addSystemMessage("Partner disconnected.");
            });
        };

        socketInitializer();

        return () => {
            if (socket) socket.disconnect();
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const addSystemMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            text,
            sender: 'system',
            timestamp: Date.now()
        }]);
    };

    const findPartner = async () => {
        if (!fingerprint) return;

        // Auto-login anonymous if needed
        let currentUid = firebaseUser?.uid;
        if (!firebaseUser) {
            try {
                await loginAnonymous();
                setShowPrivacyBanner(true);
                currentUid = 'anon_pending'; // Will be set by auth state change
            } catch (error) {
                alert("Could not start anonymous session.");
                return;
            }
        }

        // Wait slightly for auth to settle if just logged in, then check limits
        setTimeout(async () => {
            const uid = firebaseUser?.uid || 'anon'; // fallback

            // CHECK LIMITS
            const { allowed, limit, current } = await UserService.checkLimit(uid, 'connections');
            if (!allowed) {
                if (userTier === 'anonymous') {
                    // Anon hit limit -> Force login
                    setShowLimitModal(true);
                } else {
                    // Logged in hit limit -> Upsell
                    setShowUpgradeModal(true);
                }
                return;
            }

            // Allowed -> Proceed
            await UserService.incrementUsage(uid, 'connections');
            if (gender) await UserService.setGender(uid, gender);

            setStatus('searching');
            setMessages([]);
            socket.emit('join_queue', {
                userId: uid,
                tier: userTier,
                gender: gender
            });
        }, 800);
    };

    const sendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || status !== 'connected' || !room) return;

        socket.emit('send_message', { room, message: input, type: 'text' });
        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            text: input,
            sender: 'me',
            timestamp: Date.now(),
            type: 'text'
        }]);
        setInput('');
    };

    const handleImageUpload = async () => {
        if (userTier === 'anonymous' || userTier === 'free') {
            setShowUpgradeModal(true);
            return;
        }

        if (!firebaseUser) return;

        const { allowed } = await UserService.checkLimit(firebaseUser.uid, 'images');
        if (!allowed) {
            alert("Daily image limit reached!");
            return;
        }

        // Placeholder for actual image upload logic
        // In a real app, we'd open file picker -> upload to storage -> get URL -> send as message
        const mockUrl = "https://via.placeholder.com/300"; // Mock for now

        await UserService.incrementUsage(firebaseUser.uid, 'images');
        socket.emit('send_message', { room, message: mockUrl, type: 'image' });
        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            text: mockUrl,
            sender: 'me',
            timestamp: Date.now(),
            type: 'image'
        }]);
    };

    const leaveChat = () => {
        socket.emit('leave_chat');
        setStatus('idle');
        setRoom(null);
        setMessages([]);
    };

    return (
        <div className="max-w-md mx-auto w-full h-[600px] bg-white rounded-[2rem] border-[4px] border-black shadow-[8px_8px_0_0_#000] overflow-hidden flex flex-col relative">

            {/* Privacy Banner */}
            {showPrivacyBanner && (
                <div className="absolute top-14 left-0 right-0 bg-[#A7F3D0] border-b-[3px] border-black p-3 z-20 flex justify-between items-start">
                    <div className="text-xs font-bold pr-2">
                        <span className="uppercase font-black">Privacy:</span> Login to save history & increase limits.
                    </div>
                    <button onClick={() => setShowPrivacyBanner(false)} className="p-1 hover:bg-black/10 rounded font-black">X</button>
                </div>
            )}

            {/* Upgrade Modal */}
            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase">Level Up!</DialogTitle>
                        <DialogDescription className="font-bold text-gray-500">
                            You've hit your limit for the {userTier} tier.
                            Upgrade to Casual or Premium for more chats and image sharing!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-100 p-4 rounded-xl border-2 border-transparent">
                            <h4 className="font-black">Casual</h4>
                            <ul className="text-xs mt-2 space-y-1">
                                <li>50 chats/day</li>
                                <li>30 images/day</li>
                            </ul>
                        </div>
                        <div className="bg-[#FFD166] p-4 rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000]">
                            <h4 className="font-black">Premium</h4>
                            <ul className="text-xs mt-2 space-y-1">
                                <li>Unlimited chats</li>
                                <li>70 images/day</li>
                                <li>Visual effects</li>
                            </ul>
                        </div>
                    </div>
                    <Link href="/premium" className="w-full">
                        <Button className="w-full mt-6 bg-black text-white font-black h-12 rounded-xl">VIEW PLANS</Button>
                    </Link>
                </DialogContent>
            </Dialog>

            {/* Limit Modal */}
            <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase text-red-500">Daily Limit Reached</DialogTitle>
                        <DialogDescription className="font-bold">
                            Anonymous users get 5 chats per day. Please create a free account to continue chatting!
                        </DialogDescription>
                    </DialogHeader>
                    <Link href="/" className="w-full">
                        <Button className="w-full mt-4 h-12 font-black rounded-xl">Create Account</Button>
                    </Link>
                </DialogContent>
            </Dialog>


            {/* Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center border-b-[3px] border-black relative z-30">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${status === 'connected' ? 'bg-[#A7F3D0]' : status === 'searching' ? 'bg-yellow-400' : 'bg-red-500'}`} />
                    <span className="font-black uppercase tracking-wider text-sm">
                        {status === 'idle' ? 'Random Chat' : status === 'searching' ? 'Searching...' : 'Connected'}
                    </span>
                    {userTier === 'premium' && <Sparkles className="w-4 h-4 text-yellow-400" />}
                </div>
                {status === 'connected' && (
                    <button onClick={leaveChat} className="text-xs font-bold hover:text-red-400 uppercase">Leave</button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 relative z-10" ref={scrollRef}>
                {status === 'idle' && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-[#FFD166] border-[3px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_0_#000]">
                            <Zap className="w-10 h-10 text-black" fill="black" />
                        </div>

                        <div>
                            {/* Gender Selector */}
                            <div className="bg-white p-1 rounded-lg border-2 border-black inline-flex gap-1 mb-4">
                                {['male', 'female', 'other'].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGender(g as any)}
                                        className={`px-3 py-1 rounded text-xs font-black uppercase transition-all ${gender === g ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                            <h3 className="text-2xl font-black">Find a match</h3>
                            <p className="text-gray-500 font-bold text-sm">
                                {userTier === 'anonymous' ? '5 chats/day remaining' : 'Ready to connect'}
                            </p>
                        </div>

                        <button
                            onClick={findPartner}
                            className="bg-black text-white font-black px-8 py-4 rounded-xl shadow-[4px_4px_0_0_#A7F3D0] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#A7F3D0] border-2 border-transparent hover:border-black active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" /> Start Searching
                        </button>
                    </div>
                )}

                {status === 'searching' && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-16 h-16 animate-spin text-black mb-4" />
                        <h3 className="text-xl font-black">Looking for someone...</h3>
                        <button onClick={leaveChat} className="mt-8 text-xs font-bold text-gray-400 hover:text-black">Cancel</button>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender === 'system' ? (
                                <div className="w-full text-center my-2">
                                    <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-200 px-3 py-1 rounded-full">{msg.text}</span>
                                </div>
                            ) : (
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 font-bold text-sm border-2 ${msg.sender === 'me'
                                    ? 'bg-black text-white border-black rounded-tr-none'
                                    : 'bg-white text-black border-black rounded-tl-none shadow-[2px_2px_0_0_rgba(0,0,0,0.1)]'
                                    }`}>
                                    {msg.type === 'image' ? (
                                        <img src={msg.text} alt="Shared" className="rounded-lg max-w-full" />
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            {status === 'connected' && (
                <form onSubmit={sendMessage} className="p-4 bg-white border-t-[3px] border-black flex gap-2">
                    <button
                        type="button"
                        onClick={handleImageUpload}
                        className="p-3 rounded-xl border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-colors"
                        title={userTier === 'free' || userTier === 'anonymous' ? "Upgrade to send images" : "Send Image"}
                    >
                        {userTier === 'free' || userTier === 'anonymous' ? <Lock className="w-5 h-5 text-gray-400" /> : <ImageIcon className="w-5 h-5" />}
                    </button>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Say something nice..."
                        className="flex-1 bg-gray-100 border-2 border-transparent focus:border-black rounded-xl px-4 py-3 font-bold text-sm focus:outline-none transition-colors"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-[#A7F3D0] text-black p-3 rounded-xl border-2 border-black hover:bg-[#86efac] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-y-[2px]"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            )}
        </div>
    );
}
