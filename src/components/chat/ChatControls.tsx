"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { History, Download, Trash2, X, Users, MessageSquare } from 'lucide-react';
import { Message } from '@/types/chat';
import { ChatService } from '@/services/ChatService';
import { useAuth } from '@/context/AuthContext';

interface ChatSession {
    id: string;
    partnerId: string;
    startTime: number;
    messages: Message[];
    preview: string;
    createdAt?: any;
}

interface SavedStranger {
    id: string;
    nickname: string;
    savedAt: number;
    strangerId: string;
}

interface ChatControlsProps {
    currentSession: Message[];
}

export default function ChatControls({ currentSession }: ChatControlsProps) {
    const { firebaseUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'history' | 'bookmarks'>('history');
    const [history, setHistory] = useState<ChatSession[]>([]);
    const [bookmarks, setBookmarks] = useState<SavedStranger[]>([]);
    const [loading, setLoading] = useState(false);

    // Load Data
    useEffect(() => {
        if (!isOpen || !firebaseUser) return;

        const loadData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'history') {
                    const res = await ChatService.getHistory(firebaseUser.uid);
                    setHistory(res as any);
                } else {
                    const res = await ChatService.getBookmarks(firebaseUser.uid);
                    setBookmarks(res as any);
                }
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [isOpen, activeTab, firebaseUser]);

    const downloadChat = (session: ChatSession) => {
        const text = session.messages.map(m => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.sender}: ${m.text}`).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-${new Date(session.startTime || Date.now()).toISOString()}.txt`;
        a.click();
    };

    const removeBookmark = async (id: string) => {
        if (!firebaseUser || !confirm("Remove this bookmark?")) return;
        setBookmarks(prev => prev.filter(b => b.id !== id));
        await ChatService.removeBookmark(firebaseUser.uid, id);
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-16 z-40 bg-card/50 hover:bg-card transition-colors backdrop-blur-sm border border-border/10"
                onClick={() => setIsOpen(!isOpen)}
                title="History & Bookmarks"
            >
                {isOpen ? <X className="w-5 h-5" /> : <History className="w-5 h-5" />}
            </Button>

            {isOpen && (
                <div className="absolute top-0 right-0 w-80 h-full bg-card/95 backdrop-blur-xl border-l border-border/10 z-30 flex flex-col pt-16 shadow-2xl animate-in slide-in-from-right duration-300">

                    {/* Tabs */}
                    <div className="flex border-b border-border/10 px-4 gap-4">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`pb-2 text-xs font-black uppercase tracking-wider transition-colors ${activeTab === 'history' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
                        >
                            History
                        </button>
                        <button
                            onClick={() => setActiveTab('bookmarks')}
                            className={`pb-2 text-xs font-black uppercase tracking-wider transition-colors ${activeTab === 'bookmarks' ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground'}`}
                        >
                            Saved Users
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading && <div className="text-center text-xs text-gray-400 py-4">Loading stats...</div>}

                        {!loading && activeTab === 'history' && (
                            <>
                                {currentSession.length > 0 && (
                                    <div className="p-3 bg-secondary/30 rounded-xl border border-secondary/50 mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black text-secondary-foreground uppercase">Live Session</span>
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        </div>
                                        <p className="text-xs text-foreground/80 truncate">{currentSession[currentSession.length - 1]?.text}</p>
                                    </div>
                                )}

                                {history.map((session) => (
                                    <div key={session.id} className="p-3 bg-muted/20 rounded-xl border border-border/10 hover:border-primary/20 transition-all shadow-sm group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                {session.startTime ? new Date(session.startTime).toLocaleDateString() : 'Unknown Date'}
                                            </span>
                                            <button onClick={() => downloadChat(session)} className="text-muted-foreground hover:text-foreground transition-colors" title="Download">
                                                <Download className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-foreground truncate font-medium mb-1">{session.preview}</p>
                                        <div className="flex gap-2 text-[9px] text-muted-foreground">
                                            <span>{session.messages?.length || 0} msgs</span>
                                        </div>
                                    </div>
                                ))}
                                {history.length === 0 && currentSession.length === 0 && <div className="text-center text-muted-foreground text-xs italic py-10">No chat history found.</div>}
                            </>
                        )}

                        {!loading && activeTab === 'bookmarks' && (
                            <>
                                {bookmarks.map((b) => (
                                    <div key={b.id} className="p-3 bg-muted/20 rounded-xl border border-border/10 hover:border-primary/20 transition-all shadow-sm flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground">{b.nickname}</h4>
                                            <span className="text-[10px] text-muted-foreground">Saved {new Date(b.savedAt).toLocaleDateString()}</span>
                                        </div>
                                        <button onClick={() => removeBookmark(b.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {bookmarks.length === 0 && <div className="text-center text-muted-foreground text-xs italic py-10">No saved users yet.</div>}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
