"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Crown, Sparkles, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { Feature, UserTier } from '@/types/shared';

interface FeatureGateProps {
    /** The feature required to access this content */
    feature: Feature;
    /** What to render when user has access */
    children: React.ReactNode;
    /** Optional: custom fallback when locked */
    fallback?: React.ReactNode;
    /** If true, renders nothing when locked (no upgrade prompt) */
    silent?: boolean;
    /** If true, shows inline upgrade badge instead of modal overlay */
    inline?: boolean;
}

/**
 * FeatureGate - Wraps any content that requires a specific plan.
 * If the user doesn't have the right tier, shows an upgrade prompt.
 *
 * Usage:
 *   <FeatureGate feature="chat_voice">
 *     <VoiceRecorder />
 *   </FeatureGate>
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
    feature,
    children,
    fallback,
    silent = false,
    inline = false,
}) => {
    const { hasFeature, requiredTierFor, tierDisplayName } = useFeatureGate();
    const [showModal, setShowModal] = useState(false);

    if (hasFeature(feature)) {
        return <>{children}</>;
    }

    if (silent) return null;

    if (fallback) return <>{fallback}</>;

    const requiredTier = requiredTierFor(feature);
    const planName = tierDisplayName(requiredTier);

    if (inline) {
        return (
            <button
                onClick={() => setShowModal(true)}
                className="relative group cursor-pointer"
            >
                <div className="opacity-40 pointer-events-none blur-[1px]">
                    {children}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-card/90 backdrop-blur-md border-2 border-primary rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg group-hover:scale-105 transition-transform">
                        <Lock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-foreground">
                            {planName}+
                        </span>
                    </div>
                </div>

                <UpgradeModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    requiredTier={requiredTier}
                    feature={feature}
                    planName={planName}
                />
            </button>
        );
    }

    // Default: locked overlay
    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="relative group cursor-pointer w-full"
            >
                <div className="opacity-30 pointer-events-none blur-[2px] select-none">
                    {children}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                        Requires <span className="text-primary">{planName}</span> plan
                    </p>
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                        Upgrade <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </button>

            <UpgradeModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                requiredTier={requiredTier}
                feature={feature}
                planName={planName}
            />
        </>
    );
};

// ============================================
// UPGRADE MODAL
// ============================================

const FEATURE_LABELS: Record<Feature, string> = {
    trap_create: 'Create Traps',
    trap_advanced_mechanics: 'Advanced No-Button Mechanics',
    trap_expert_mechanics: 'Expert Mechanics (DSA Quiz, Impossible Form)',
    trap_custom_themes: 'Custom Trap Themes',
    trap_remove_branding: 'Remove Kihumba Branding',
    analytics_basic: 'Basic Analytics',
    analytics_advanced: 'Advanced Analytics (Device, Location)',
    analytics_export: 'Export Analytics Data',
    chat_basic: 'Anonymous Chat',
    chat_images: 'Share Images in Chat',
    chat_voice: 'Voice Notes in Chat',
    polls_basic: 'Create Polls',
    polls_quiz: 'Quiz Mode Polls',
    polls_export: 'Export Poll Data',
    whispers_priority: 'Priority Whisper Visibility',
    priority_support: 'Priority Support',
};

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    requiredTier: UserTier;
    feature: Feature;
    planName: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
    isOpen,
    onClose,
    requiredTier,
    feature,
    planName,
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-card w-full max-w-sm rounded-[2rem] border-[3px] border-border shadow-[var(--shadow-brutal-lg)] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-primary/10 p-6 text-center relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-primary/20 transition-colors"
                        >
                            <X className="w-5 h-5 text-foreground" />
                        </button>
                        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-3">
                            <Crown className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-black text-foreground">
                            Unlock {FEATURE_LABELS[feature]}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium mt-1">
                            Available on <span className="text-primary font-bold">{planName}</span> and above
                        </p>
                    </div>

                    {/* Plans */}
                    <div className="p-6 space-y-3">
                        {(['starter', 'casual', 'premium'] as UserTier[]).map((t) => {
                            const isRequired = t === requiredTier;
                            return (
                                <Link
                                    key={t}
                                    href={`/premium?plan=${t}`}
                                    className={`block p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${isRequired
                                        ? 'border-primary bg-primary/10 shadow-[var(--shadow-brutal-sm)]'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className={`w-5 h-5 ${isRequired ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <div>
                                                <span className="font-bold text-foreground capitalize">{t}</span>
                                                {isRequired && (
                                                    <span className="ml-2 text-[10px] font-black uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                                        Recommended
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight className={`w-4 h-4 ${isRequired ? 'text-primary' : 'text-muted-foreground'}`} />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="px-6 pb-6">
                        <Link href="/premium">
                            <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black text-lg hover:opacity-90 transition-opacity shadow-[var(--shadow-brutal)]">
                                View All Plans
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FeatureGate;
