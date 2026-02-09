"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import RandomChat from '@/components/chat/RandomChat';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
    const { firebaseUser } = useAuth();
    const router = useRouter();

    // Optional: Protect route
    if (!firebaseUser) {
        // return <LoginRedirect />
    }

    return (
        <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4 font-sans text-[#1a1817]">
            <div className="max-w-4xl mx-auto mb-8">
                <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold hover:underline mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="text-5xl font-black uppercase leading-[0.9]">
                            Random <span className="text-[#FF0040]">Love</span> Chat
                        </h1>
                        <p className="text-xl font-bold text-gray-500">
                            Connect with strangers who are also procrastinating on finding a real date.
                        </p>

                        <div className="bg-white p-6 rounded-2xl border-[3px] border-black shadow-[6px_6px_0_0_#000] space-y-4">
                            <h3 className="font-black text-lg">The Rules</h3>
                            <ul className="space-y-2 font-medium text-sm text-gray-600">
                                <li className="flex gap-2"><span className="text-green-500">✓</span> Be nice (or playfully mean).</li>
                                <li className="flex gap-2"><span className="text-red-500">✕</span> No creeper behavior.</li>
                                <li className="flex gap-2"><span className="text-blue-500">ℹ</span> Chats are not saved.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <RandomChat />
                        {/* Blob decoration */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#A7F3D0] rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FF0040] rounded-full blur-3xl opacity-30 -z-10 animate-pulse delay-700"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
