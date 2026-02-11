"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Zap, Rocket, Shield, Sparkles, MessageCircle, BarChart3, Image, Mic, Palette, X as XIcon, Loader2, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AdminService, CURRENCY_SYMBOLS, getCurrencyForCountry } from '@/services/AdminService';
import { AdminSettings, PaystackCurrency, UserTier, PlanPricing, Feature, TIER_FEATURES } from '@/types/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Feature list display for each plan
const PLAN_FEATURES: Record<string, { text: string; icon: React.ReactNode }[]> = {
    free: [
        { text: '3 active traps', icon: <Zap className="w-4 h-4" /> },
        { text: 'Basic analytics (views)', icon: <BarChart3 className="w-4 h-4" /> },
        { text: '10 chat sessions/day', icon: <MessageCircle className="w-4 h-4" /> },
        { text: 'Basic polls', icon: <Check className="w-4 h-4" /> },
        { text: 'Kihumba branding on traps', icon: <Shield className="w-4 h-4" /> },
    ],
    starter: [
        { text: '10 active traps', icon: <Zap className="w-4 h-4" /> },
        { text: 'Advanced No-Button tricks', icon: <Sparkles className="w-4 h-4" /> },
        { text: 'Advanced analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { text: 'Share images in chat', icon: <Image className="w-4 h-4" /> },
        { text: 'Remove Kihumba branding', icon: <Shield className="w-4 h-4" /> },
        { text: 'Quiz mode polls', icon: <Check className="w-4 h-4" /> },
    ],
    casual: [
        { text: 'Unlimited traps', icon: <Zap className="w-4 h-4" /> },
        { text: 'All No-Button mechanics', icon: <Sparkles className="w-4 h-4" /> },
        { text: '3 custom themes', icon: <Palette className="w-4 h-4" /> },
        { text: 'Voice notes in chat', icon: <Mic className="w-4 h-4" /> },
        { text: '50 chat sessions/day', icon: <MessageCircle className="w-4 h-4" /> },
        { text: 'Priority whispers', icon: <Crown className="w-4 h-4" /> },
    ],
    premium: [
        { text: 'Everything in Casual', icon: <Check className="w-4 h-4" /> },
        { text: 'Unlimited everything', icon: <Rocket className="w-4 h-4" /> },
        { text: 'All custom themes', icon: <Palette className="w-4 h-4" /> },
        { text: 'Export analytics data', icon: <BarChart3 className="w-4 h-4" /> },
        { text: 'Export poll data', icon: <Check className="w-4 h-4" /> },
        { text: 'Priority support', icon: <Shield className="w-4 h-4" /> },
    ],
};

function PremiumContent() {
    const { firebaseUser, userTier, isLoggedIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const highlightPlan = searchParams?.get('plan');

    const [settings, setSettings] = useState<AdminSettings | null>(null);
    const [currency, setCurrency] = useState<PaystackCurrency>('USD');
    const [loading, setLoading] = useState(true);
    const [processingPlan, setProcessingPlan] = useState<string | null>(null);

    // Load admin settings (prices)
    useEffect(() => {
        const load = async () => {
            const data = await AdminService.getSettings();
            setSettings(data);
            setLoading(false);
        };
        load();
    }, []);

    // Auto-detect or default currency
    useEffect(() => {
        // For now, default to KES as user appears to be in Kenya region (based on error context)
        // In a real app, we'd use IP geolocation here
        setCurrency('KES');
    }, []);



    const getPrice = (plan: 'starter' | 'casual' | 'premium'): string => {
        if (!settings) return '...';
        const pricing = settings.plans[plan].price as PlanPricing;
        const amount = pricing[currency] || pricing.USD;
        const symbol = CURRENCY_SYMBOLS[currency];
        return `${symbol}${amount}`;
    };

    const getPriceLabel = (plan: 'starter' | 'casual' | 'premium'): string => {
        if (!settings) return '';
        const config = settings.plans[plan];
        if (config.type === 'one-time') return `${config.durationDays || 10} days`;
        return '/mo';
    };

    const handleSubscribe = async (plan: 'starter' | 'casual' | 'premium') => {
        if (!isLoggedIn || !firebaseUser?.email) {
            router.push('/login?redirect=/premium');
            return;
        }

        if (!settings) return;
        setProcessingPlan(plan);

        try {


            const body: Record<string, any> = {
                email: firebaseUser.email,
                currency,
                metadata: {
                    uid: firebaseUser.uid,
                    planId: plan,
                },
            };

            const res = await fetch('/api/paystack/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                alert(data.error || 'Payment initialization failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setProcessingPlan(null);
        }
    };

    const isCurrentPlan = (plan: UserTier) => userTier === plan;
    const isUpgrade = (plan: UserTier) => {
        const hierarchy: UserTier[] = ['anonymous', 'free', 'starter', 'casual', 'premium', 'admin'];
        return hierarchy.indexOf(plan) > hierarchy.indexOf(userTier);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }



    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value as PaystackCurrency);
    };

    return (
        <div className="min-h-screen bg-background pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header & Currency Selector */}
                <div className="relative text-center space-y-4">
                    <div className="flex justify-center md:absolute md:top-0 md:right-0 mb-4 md:mb-0">
                        <select
                            value={currency}
                            onChange={handleCurrencyChange}
                            className="bg-card border-2 border-border rounded-lg px-3 py-1 font-bold text-sm shadow-[var(--shadow-brutal-sm)] focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {Object.keys(CURRENCY_SYMBOLS).map((c) => (
                                <option key={c} value={c}>{c} ({CURRENCY_SYMBOLS[c as PaystackCurrency]})</option>
                            ))}
                        </select>
                    </div>

                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-[3px] border-border rounded-full font-black uppercase text-sm shadow-[var(--shadow-brutal-sm)] text-accent-foreground"
                    >
                        <Crown className="w-4 h-4" />
                        Choose Your Power
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-foreground"
                    >
                        Go <span className="text-primary underline decoration-wavy">Legendary</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-bold text-muted-foreground"
                    >
                        Support the chaos. Unlock the full toolkit.
                    </motion.p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-4 gap-6 items-stretch">

                    {/* Free Tier */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`bg-card p-6 rounded-[2rem] border-[3px] transition-all ${isCurrentPlan('free') ? 'border-primary shadow-[var(--shadow-brutal)]' : 'border-border hover:border-primary/50'}`}
                    >
                        <h3 className="text-xl font-black mb-1 text-foreground">Free</h3>
                        <div className="text-4xl font-black text-foreground mb-1">{CURRENCY_SYMBOLS[currency]}0</div>
                        <p className="text-muted-foreground font-medium text-sm mb-6">Forever free</p>
                        <ul className="space-y-3 mb-8">
                            {PLAN_FEATURES.free.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-foreground">
                                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                        {f.icon}
                                    </div>
                                    {f.text}
                                </li>
                            ))}
                        </ul>
                        <button
                            disabled
                            className="w-full py-3 rounded-xl border-2 border-dashed border-border font-bold text-muted-foreground cursor-default"
                        >
                            {isCurrentPlan('free') || isCurrentPlan('anonymous') ? 'Current Plan' : 'Free Forever'}
                        </button>
                    </motion.div>

                    {/* One-Time Pass (Formerly Starter) */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`bg-card p-6 rounded-[2rem] border-[3px] transition-all ${highlightPlan === 'starter' || isCurrentPlan('starter') ? 'border-primary shadow-[var(--shadow-brutal)]' : 'border-border hover:border-primary/50'}`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-xl font-black text-foreground">One-Time Pass</h3>
                            <span className="text-[10px] font-black uppercase bg-accent text-accent-foreground px-2 py-1 rounded-full border border-border">10 Days</span>
                        </div>
                        <div className="text-4xl font-black text-foreground mb-1">{getPrice('starter')}</div>
                        <p className="text-muted-foreground font-medium text-sm mb-6">No subscription. Just 10 days of fun.</p>
                        <ul className="space-y-3 mb-8">
                            {PLAN_FEATURES.starter.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-foreground">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        {f.icon}
                                    </div>
                                    {f.text}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSubscribe('starter')}
                            disabled={isCurrentPlan('starter') || !!processingPlan}
                            className="w-full py-3 rounded-xl bg-foreground text-background font-black hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-brutal-sm)]"
                        >
                            {processingPlan === 'starter' ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : isCurrentPlan('starter') ? 'Current Plan' : 'Get Pass'}
                        </button>
                    </motion.div>

                    {/* Casual Subscription */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className={`bg-card p-6 rounded-[2rem] border-[3px] transition-all relative ${highlightPlan === 'casual' || isCurrentPlan('casual') ? 'border-primary shadow-[var(--shadow-brutal)]' : 'border-border hover:border-primary/50'}`}
                    >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full border-[2px] border-border font-black uppercase text-xs shadow-[var(--shadow-brutal-sm)]">
                            Most Flexible
                        </div>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-xl font-black text-primary">Casual Sub</h3>
                            <span className="text-[10px] font-black uppercase bg-primary/20 text-primary px-2 py-1 rounded-full">Monthly</span>
                        </div>
                        <div className="text-4xl font-black text-foreground mb-1">{getPrice('casual')}</div>
                        <p className="text-muted-foreground font-medium text-sm mb-6">Full access, bill monthly. Cancel anytime.</p>
                        <ul className="space-y-3 mb-8">
                            {PLAN_FEATURES.casual.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-foreground">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        {f.icon}
                                    </div>
                                    {f.text}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSubscribe('casual')}
                            disabled={isCurrentPlan('casual') || !!processingPlan}
                            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-black hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-brutal)]"
                        >
                            {processingPlan === 'casual' ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : isCurrentPlan('casual') ? 'Current Plan' : 'Subscribe'}
                        </button>
                    </motion.div>

                    {/* Premium Tier — Monthly */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`bg-foreground text-background p-6 rounded-[2rem] border-[3px] border-border shadow-[var(--shadow-brutal-lg)] transition-all relative ${highlightPlan === 'premium' ? 'scale-105' : ''}`}
                    >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full border-[2px] border-border font-black uppercase text-xs shadow-[var(--shadow-brutal-sm)] rotate-1">
                            Best Value
                        </div>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-xl font-black text-accent">Premium</h3>
                            <span className="text-[10px] font-black uppercase bg-accent/20 text-accent px-2 py-1 rounded-full">Monthly</span>
                        </div>
                        <div className="text-4xl font-black mb-1">{getPrice('premium')}</div>
                        <p className="font-medium text-sm mb-6 opacity-60">{getPriceLabel('premium')}</p>
                        <ul className="space-y-3 mb-8">
                            {PLAN_FEATURES.premium.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold">
                                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                        {f.icon}
                                    </div>
                                    {f.text}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSubscribe('premium')}
                            disabled={isCurrentPlan('premium') || !!processingPlan}
                            className="w-full py-4 rounded-xl bg-primary text-primary-foreground text-lg font-black hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                        >
                            {processingPlan === 'premium' ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : isCurrentPlan('premium') ? 'Current Plan' : 'Go Premium'}
                        </button>
                    </motion.div>
                </div>

                {/* Current plan indicator */}
                {userTier !== 'anonymous' && userTier !== 'free' && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center bg-card border-2 border-border rounded-2xl p-6 max-w-md mx-auto"
                    >
                        <p className="text-sm text-muted-foreground font-medium">
                            You&apos;re on the <span className="font-black text-primary capitalize">{userTier}</span> plan
                        </p>
                        <Link href="/dashboard" className="text-xs font-bold text-primary hover:underline mt-2 inline-block">
                            Manage subscription →
                        </Link>
                    </motion.div>
                )}

                {/* FAQ */}
                <div className="max-w-2xl mx-auto space-y-6 mt-16">
                    <h2 className="text-3xl font-black text-foreground text-center">FAQ</h2>
                    {[
                        { q: 'Can I cancel anytime?', a: 'Yes! Cancel your subscription anytime. You keep access until the end of your billing period.' },
                        { q: 'What happens when Starter expires?', a: 'After 10 days, you go back to the Free plan. Your traps stay, but advanced features become locked.' },
                        { q: 'Do you store my card info?', a: 'No. All payments are processed securely by Paystack. We never see or store your card details.' },
                        { q: 'Can I switch plans?', a: 'Yes! Upgrade or downgrade anytime. Upgrades take effect immediately.' },
                    ].map((faq, i) => (
                        <div key={i} className="bg-card border-2 border-border rounded-2xl p-5">
                            <h4 className="font-black text-foreground">{faq.q}</h4>
                            <p className="text-sm text-muted-foreground font-medium mt-1">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function PremiumPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <PremiumContent />
        </Suspense>
    );
}
