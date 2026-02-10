"use client";

import React, { useState, useEffect } from 'react';
import { PageShell } from '@/components/ui/PageShell';
import { Footer } from '@/components/layout/Footer';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Dices, MessageCircle, ArrowRight, BarChart2, Sparkles, Shield, Zap, Users, ChevronDown, Star, Send, Play } from 'lucide-react';
import Link from 'next/link';

// ---- DATA ----
const FEATURES = [
  {
    title: 'Valentine Trap',
    description: 'The viral "No button runs away" prank. Send a digital card they literally can\'t say no to.',
    icon: Heart,
    href: '/tools/trap',
    color: 'var(--primary)',
    gradient: 'from-rose-500 to-pink-600',
    tag: '🔥 MOST POPULAR',
  },
  {
    title: 'Random Chat',
    description: 'Connect anonymously with strangers. Vent, flirt, or just be weird together.',
    icon: MessageCircle,
    href: '/chat',
    color: 'var(--accent)',
    gradient: 'from-emerald-400 to-teal-500',
    tag: null,
  },
  {
    title: 'Whispers',
    description: 'An anonymous confession wall. Leave a secret note for the internet to find.',
    icon: MessageSquare,
    href: '/tools/whispers',
    color: 'var(--shape-fill-alt)',
    gradient: 'from-amber-400 to-orange-500',
    tag: null,
  },
  {
    title: 'Decision Dice',
    description: "Can't decide where to eat? Let the chaos engine choose for you.",
    icon: Dices,
    href: '/tools/decision',
    color: 'var(--glow-2)',
    gradient: 'from-indigo-400 to-purple-500',
    tag: null,
  },
  {
    title: 'Vote or Die',
    description: 'Create interactive polls, quizzes, and popularity contests. Watch results roll in.',
    icon: BarChart2,
    href: '/tools/polls',
    color: 'var(--ring)',
    gradient: 'from-blue-500 to-cyan-500',
    tag: '✨ NEW',
    wide: true,
  },
];

const STATS = [
  { value: '12K+', label: 'Traps Sent' },
  { value: '97%', label: 'Said Yes' },
  { value: '250K+', label: 'Laughs Caused' },
  { value: '50+', label: 'Countries' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create', description: 'Customize your trap with a message, mechanics, and media. It takes 60 seconds.', icon: Sparkles },
  { step: '02', title: 'Share', description: 'Send the unique link to your target. Watch them try to click "No".', icon: Send },
  { step: '03', title: 'Celebrate', description: 'They say "Yes" (they always do). Confetti explodes. Love wins.', icon: Heart },
];

const TESTIMONIALS = [
  { text: "My girlfriend literally couldn't stop laughing. She tried to click No 47 times 😂", name: "Alex K.", avatar: "🧑" },
  { text: "Used the DSA Quiz mechanic. My CS boyfriend had to solve binary tree problems to say No. He gave up and said Yes.", name: "Maria S.", avatar: "👩" },
  { text: "The Guilt Trip modal made my partner feel so bad for trying to say No. 10/10 emotional manipulation.", name: "Jordan T.", avatar: "🧑‍🦱" },
];

// ---- COMPONENTS ----

const HeroSection = () => {
  const [trappedCount, setTrappedCount] = useState(12847);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrappedCount(prev => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 text-center">
      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card-brutal px-5 py-2 mb-8 flex items-center gap-2 text-sm font-bold"
      >
        <span className="animate-heartbeat inline-block">❤️</span>
        <span className="text-muted-foreground">{trappedCount.toLocaleString()} people trapped & counting</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tight text-foreground mb-6"
      >
        THE{' '}
        <span className="relative inline-block">
          <span className="gradient-text-valentine">CHAOS</span>
          <motion.svg
            className="absolute -bottom-2 left-0 w-full h-3 text-primary"
            viewBox="0 0 200 12" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            <motion.path
              d="M2 8 Q50 2 100 8 T198 8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </motion.svg>
        </span>
        <br />
        <span className="text-foreground">TOOLKIT</span>
        <span className="gradient-text-valentine">.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg md:text-xl font-bold text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
      >
        Digital tools for modern romance. Prank your partner, make decisions together, or scream into the void. It's chaos — but it's <span className="text-primary font-black">your</span> chaos.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <Link href="/tools/trap">
          <button className="btn-brutal text-lg px-10 py-5 gap-3 group">
            Create a Trap
            <Heart className="w-5 h-5 fill-current group-hover:animate-heartbeat" />
          </button>
        </Link>
        <Link href="/dashboard">
          <button className="btn-brutal text-lg px-10 py-5 gap-3 bg-card text-foreground hover:bg-secondary">
            Open Dashboard
            <ArrowRight className="w-5 h-5" strokeWidth={3} />
          </button>
        </Link>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
};

const StatsBar = () => (
  <section className="py-12 px-4">
    <div className="max-w-5xl mx-auto card-brutal px-8 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-3xl md:text-4xl font-black text-primary">{stat.value}</div>
            <div className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ToolsGrid = () => (
  <section className="py-20 px-4">
    <div className="max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="card-brutal px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary inline-block mb-4">
          ⚡ The Arsenal
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
          Pick Your <span className="gradient-text-valentine">Weapon</span>
        </h2>
      </motion.div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={feature.wide ? 'md:col-span-2' : ''}
          >
            <Link href={feature.href} className="group block">
              <div className="card-brutal p-8 h-full relative overflow-hidden">
                {/* Background icon */}
                <feature.icon
                  className="w-32 h-32 absolute -right-4 -bottom-4 opacity-[0.07] rotate-12 transition-transform group-hover:rotate-6 group-hover:scale-110"
                  style={{ color: feature.color }}
                />

                <div className="relative z-10 space-y-4">
                  {/* Tag */}
                  {feature.tag && (
                    <span className="inline-block text-xs font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                      {feature.tag}
                    </span>
                  )}

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground border-2 border-border"
                    style={{ background: feature.color }}
                  >
                    <feature.icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-3xl md:text-4xl font-black text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="font-bold text-muted-foreground text-lg max-w-md">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-sm font-black text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2">
                    Try it <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="py-20 px-4">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="card-brutal px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary inline-block mb-4">
          💡 How It Works
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
          Three Steps to <span className="gradient-text-valentine">Victory</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {HOW_IT_WORKS.map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative"
          >
            <div className="card-brutal p-8 text-center h-full">
              {/* Step Number */}
              <div className="text-6xl font-black text-primary/10 absolute top-4 right-6">{item.step}</div>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-center">
                <item.icon className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-2xl font-black text-foreground mb-3">{item.title}</h3>
              <p className="font-bold text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Connector Arrow (between cards, desktop) */}
            {i < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-20 px-4">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="card-brutal px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary inline-block mb-4">
          💬 Wall of Love
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
          What <span className="gradient-text-valentine">Trappers</span> Say
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="card-brutal p-6 h-full flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-bold text-foreground leading-relaxed flex-1 mb-4">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/20">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl border-2 border-border/20">
                  {t.avatar}
                </div>
                <span className="font-black text-sm text-muted-foreground">{t.name}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="py-24 px-4">
    <div className="max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="card-brutal p-12 md:p-16 relative overflow-hidden">
          {/* Corner decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-bl-[80px] opacity-20" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent rounded-tr-[60px] opacity-20" />

          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Heart className="w-16 h-16 text-primary fill-primary mx-auto" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              Ready to Trap Someone?
            </h2>
            <p className="font-bold text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Create your first Valentine Trap in 60 seconds. Free. No signup required.
            </p>

            <Link href="/tools/trap">
              <button className="btn-brutal text-xl px-12 py-6 gap-3 group">
                Start Creating
                <Sparkles className="w-5 h-5 group-hover:animate-spin-slow" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// ---- MAIN PAGE ----
export default function Home() {
  return (
    <PageShell padTop={false}>
      <HeroSection />
      <StatsBar />
      <ToolsGrid />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </PageShell>
  );
}
