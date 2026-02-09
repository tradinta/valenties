import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Heart, MessageSquare, Dices, MessageCircle, ArrowRight, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { CookieConsent } from "@/components/layout/CookieConsent";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF9F0] selection:bg-[#FF0040] selection:text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-[#1a1817] mb-6 leading-[0.9] tracking-tight">
          THE <span className="text-[#FF0040] underline decoration-wavy decoration-4 decoration-black underline-offset-8">CHAOS</span><br />TOOLKIT.
        </h1>
        <p className="text-xl md:text-2xl font-bold text-gray-500 max-w-2xl mx-auto mb-10">
          Digital tools for modern romance. Prank your partner, make decisions, or scream into the void.
        </p>
        <Link href="/dashboard">
          <button className="bg-[#1a1817] text-white px-10 py-5 rounded-2xl text-xl font-black shadow-[8px_8px_0_0_#FF0040] border-[3px] border-black hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#FF0040] transition-all flex items-center gap-3 mx-auto">
            Open Dashboard <ArrowRight strokeWidth={3} />
          </button>
        </Link>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">

          {/* 1. Trap */}
          <Link href="/tools/trap" className="group">
            <div className="bg-[#FF9EB5] border-[4px] border-black rounded-[2.5rem] p-8 h-full shadow-[8px_8px_0_0_#000] group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0_0_#000] transition-all relative overflow-hidden">
              <Heart className="w-32 h-32 absolute -right-6 -bottom-6 text-black/10 rotate-12" />
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white">
                  <Heart className="w-7 h-7 fill-current" />
                </div>
                <h2 className="text-4xl font-black text-black">Valentine Trap</h2>
                <p className="font-bold text-black/70 text-lg">The viral "No button runs away" prank. Send a digital card they literally can't say no to.</p>
              </div>
            </div>
          </Link>

          {/* 2. Chat */}
          <Link href="/chat" className="group">
            <div className="bg-[#A7F3D0] border-[4px] border-black rounded-[2.5rem] p-8 h-full shadow-[8px_8px_0_0_#000] group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0_0_#000] transition-all relative overflow-hidden">
              <MessageCircle className="w-32 h-32 absolute -right-6 -bottom-6 text-black/10 -rotate-12" />
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h2 className="text-4xl font-black text-black">Random Chat</h2>
                <p className="font-bold text-black/70 text-lg">Connect anonymously with strangers. Vent, flirt, or just be weird together.</p>
              </div>
            </div>
          </Link>

          {/* 3. Whispers */}
          <Link href="/tools/whispers" className="group">
            <div className="bg-[#FFD166] border-[4px] border-black rounded-[2.5rem] p-8 h-full shadow-[8px_8px_0_0_#000] group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0_0_#000] transition-all relative overflow-hidden">
              <MessageSquare className="w-32 h-32 absolute -right-6 -bottom-6 text-black/10 rotate-6" />
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h2 className="text-4xl font-black text-black">Whispers</h2>
                <p className="font-bold text-black/70 text-lg">An anonymous confession wall. Leave a secret note for the internet to find.</p>
              </div>
            </div>
          </Link>


          {/* 4. Dice */}
          <Link href="/tools/decision" className="group">
            <div className="bg-[#B8C0FF] border-[4px] border-black rounded-[2.5rem] p-8 h-full shadow-[8px_8px_0_0_#000] group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0_0_#000] transition-all relative overflow-hidden">
              <Dices className="w-32 h-32 absolute -right-6 -bottom-6 text-black/10 -rotate-6" />
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white">
                  <Dices className="w-7 h-7" />
                </div>
                <h2 className="text-4xl font-black text-black">Decision Dice</h2>
                <p className="font-bold text-black/70 text-lg">Can't decide where to eat? Let the chaos engine choose for you.</p>
              </div>
            </div>
          </Link>

          {/* 5. Polls */}
          <Link href="/tools/polls" className="group md:col-span-2">
            <div className="bg-[#3B82F6] border-[4px] border-black rounded-[2.5rem] p-8 h-full shadow-[8px_8px_0_0_#000] group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0_0_#000] transition-all relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <BarChart2 className="w-64 h-64 text-black transform -rotate-12" />
              </div>
              <div className="relative z-10 space-y-4 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center text-white mb-2">
                  <BarChart2 className="w-8 h-8" />
                </div>
                <h2 className="text-5xl font-black text-white drop-shadow-[4px_4px_0_#000]">VOTE OR DIE</h2>
                <p className="font-bold text-black text-xl max-w-lg">
                  Create interactive polls, quizzes, and popularity contests. Watch the results roll in real-time.
                </p>
              </div>
            </div>
          </Link>

        </div>
      </div>

      <Footer />
      <CookieConsent />
    </main>
  );
}
