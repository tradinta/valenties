"use client";

import React, { useState } from 'react';
import {
  ArrowRight, Heart, Sparkles, MessageCircle, BarChart2,
  Flame, Timer, ScrollText, Users, Calculator,
  ShieldAlert, Dices, Gavel, Scale
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FloatingIcons } from '@/components/ui/FloatingIcons';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState('');

  const handleToolClick = (e: React.MouseEvent, toolLink: string, toolName: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setSelectedTool(toolName);
      setIsAuthModalOpen(true);
    } else {
      // If logged in, let the Link handle navigation normally
      // or if logic needed: router.push(toolLink);
    }
  };

  const tools = [
    {
      id: 'trap',
      title: "Valentine's Trap",
      desc: "The classic. Send a link, they can't say no. Literally.",
      icon: <Heart className="w-8 h-8 text-white" fill="currentColor" />,
      color: "bg-[#FF0040]", // Hardcoded Red to ensure visibility
      textColor: "text-white",
      span: "lg:col-span-2 md:col-span-2",
      badge: "Most Popular",
      link: "/tools/trap",
      rotate: "-rotate-1"
    },
    {
      id: '100s',
      title: "100s Soulmate",
      desc: "Make a friend in < 100 seconds. Speed dating for the attention span deficient.",
      icon: <Timer className="w-8 h-8 text-[#1a1817]" />,
      color: "bg-[#B8F4D8]", // Mint
      textColor: "text-[#1a1817]",
      span: "",
      link: "/tools/100s",
      rotate: "rotate-2"
    },
    {
      id: 'flame',
      title: "Flame Calculator",
      desc: "Scientific proof that you & your crush are doomed (or destined).",
      icon: <Flame className="w-8 h-8 text-[#1a1817]" fill="#FF5722" />,
      color: "bg-[#FFF59D]", // Yellow
      textColor: "text-[#1a1817]",
      span: "",
      link: "/tools/flame",
      rotate: "-rotate-1"
    },
    {
      id: 'polls',
      title: "Date Polls",
      desc: "Settle the 'Where do you want to eat?' fight before it starts.",
      icon: <BarChart2 className="w-8 h-8 text-[#1a1817]" />,
      color: "bg-[#FFB8D4]", // Pink
      textColor: "text-[#1a1817]",
      span: "",
      link: "/tools/polls",
      rotate: "rotate-1"
    },
    {
      id: 'petty',
      title: "Petty Pass",
      desc: "Issue official citations for 'Leaving the towel on the floor'.",
      icon: <Gavel className="w-8 h-8 text-[#1a1817]" />,
      color: "bg-[#E0E0E0]", // Grey
      textColor: "text-[#1a1817]",
      span: "",
      link: "/tools/petty",
      rotate: "-rotate-2"
    },
    {
      id: 'letter',
      title: "Love Letter AI",
      desc: "Generate perfectly cringy romance novels about your relationship.",
      icon: <ScrollText className="w-8 h-8 text-[#1a1817]" />,
      color: "bg-[#D1C4E9]", // Lavender
      textColor: "text-[#1a1817]",
      span: "md:col-span-2",
      link: "/tools/letter",
      rotate: "rotate-1"
    },
    {
      id: 'whispers',
      title: "Whispers",
      desc: "Anonymous confessions. Tell them you ate their leftovers.",
      icon: <MessageCircle className="w-8 h-8 text-[#1a1817]" />,
      color: "bg-[#FFCC80]", // Orange
      textColor: "text-[#1a1817]",
      span: "",
      link: "/tools/whispers",
      rotate: "-rotate-1"
    },
    {
      id: 'third-wheel',
      title: "Third Wheel Test",
      desc: "Are you the problem? A self-awareness quiz for the squad.",
      icon: <Users className="w-8 h-8 text-[#1a1817]" />,
      color: "bg-[#80DEEA]", // Cyan
      textColor: "text-[#1a1817]",
      span: "",
      link: "/tools/thirdwheel",
      rotate: "rotate-2"
    },
    {
      id: 'proposal',
      title: "Proposal Odds",
      desc: "Calculates probability based on nail polish & season.",
      icon: <Calculator className="w-8 h-8 text-[#1a1817]" />,
      color: "bg-[#FFAB91]", // Deep Orange
      textColor: "text-[#1a1817]",
      span: "",
      link: "/tools/proposal",
      rotate: "-rotate-1"
    },
    {
      id: 'exblocker',
      title: "The Ex-Blocker",
      desc: "Digital shield. Redirects texts to your mom.",
      icon: <ShieldAlert className="w-8 h-8 text-[#1a1817]" />,
      color: "bg-[#FF8A80]", // Red accent
      textColor: "text-[#1a1817]",
      span: "",
      link: "/tools/exblocker",
      rotate: "rotate-1"
    },
    {
      id: 'roulette',
      title: "Date Roulette",
      desc: "Spin the wheel. Fate decides dinner (and who pays).",
      icon: <Dices className="w-8 h-8 text-[#1a1817]" />,
      color: "bg-[#CFD8DC]", // Blue Grey
      textColor: "text-[#1a1817]",
      span: "",
      link: "/tools/roulette",
      rotate: "-rotate-2"
    },
    {
      id: 'conflict',
      title: "Conflict Bot",
      desc: "AI arbitrator for petty arguments. Who is actually right?",
      icon: <Scale className="w-8 h-8 text-[#1a1817]" />,
      color: "bg-[#C5E1A5]", // Light Green
      textColor: "text-[#1a1817]",
      span: "",
      link: "/tools/conflict",
      rotate: "rotate-1"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] overflow-x-hidden font-sans transition-colors duration-500">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        toolName={selectedTool}
      />

      <main className="flex-1 relative">

        {/* Background Pattern & Icons */}
        <div className="absolute inset-0 bg-pattern-valentine opacity-40 pointer-events-none fixed"></div>
        <FloatingIcons />

        {/* --- HEADER --- */}
        <div className="relative pt-32 pb-10 px-4 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card)] border-[3px] border-[var(--foreground)] text-[var(--foreground)] text-sm font-bold mb-6 shadow-[4px_4px_0_0_var(--foreground)] animate-slide-up">
            <Sparkles size={16} className="text-[var(--primary)]" />
            <span>No fluff. Just tools.</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] font-display mb-4 animate-slide-up stagger-1">
            The Love <span className="text-[var(--primary)] underline decoration-wavy decoration-4 underline-offset-4">Toolkit</span>
          </h1>
          <p className="text-xl text-[var(--foreground)] opacity-80 max-w-2xl mx-auto animate-slide-up stagger-2 font-medium">
            Pick your weapon. We have a tool for every stage of (bad) romance.
          </p>
        </div>

        {/* --- TOOLS GRID --- */}
        <section className="relative px-4 sm:px-6 lg:px-8 pb-32 z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            {tools.map((tool, index) => (
              <Link
                href={tool.link}
                key={tool.id}
                className={`${tool.span || ''} group block h-full`}
                onClick={(e) => handleToolClick(e, tool.link, tool.title)}
              >
                <div className={`
                            h-full rounded-[2.5rem] border-[3px] border-[var(--foreground)] p-8 flex flex-col justify-between
                            transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_var(--foreground)] shadow-[4px_4px_0_0_var(--foreground)]
                            ${tool.color} ${tool.rotate} hover:rotate-0
                        `}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 rounded-2xl border-[3px] border-[var(--foreground)] ${tool.textColor === 'text-white' ? 'bg-white/20' : 'bg-white'} flex items-center justify-center shadow-sm`}>
                      {tool.icon}
                    </div>
                    {tool.badge && (
                      <span className="px-3 py-1 bg-white border-[2px] border-[var(--foreground)] rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_0_var(--foreground)] animate-pulse text-black">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className={`text-2xl font-black mb-2 ${tool.textColor}`}>{tool.title}</h3>
                    <p className={`font-bold opacity-90 leading-snug ${tool.textColor}`}>{tool.desc}</p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <div className={`w-10 h-10 rounded-full border-[3px] border-[var(--foreground)] flex items-center justify-center bg-white group-hover:bg-[var(--foreground)] group-hover:text-white transition-colors`}>
                      <ArrowRight size={20} strokeWidth={3} className="text-black group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <footer className="py-12 border-t-[3px] border-[var(--foreground)] bg-[var(--card)] relative z-10 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-display font-black text-2xl lowercase text-[var(--foreground)]">kihumba</div>
          <p className="font-bold text-sm text-[var(--foreground)]">&copy; 2026 Kihumba. Built for love (and chaos).</p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'TikTok'].map(social => (
              <a key={social} href="#" className="font-bold text-[var(--foreground)] hover:text-[var(--primary)] uppercase text-sm tracking-wider underline decoration-2 underline-offset-4">{social}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
