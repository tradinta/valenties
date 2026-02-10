// Shared Types - Used across components
// Centralized to avoid duplication

import { TrapConfig, TrapStats } from './index';
import { LucideIcon } from 'lucide-react';
import { User } from 'firebase/auth';

// ============================================
// TRAP TYPES
// ============================================

export interface TrapWithId extends TrapConfig {
    id: string;
    stats?: TrapStats;
    status: 'active' | 'completed' | 'disabled';
}

// ============================================
// USER & ADMIN TYPES
// ============================================

export type UserTier = 'anonymous' | 'free' | 'starter' | 'casual' | 'premium' | 'admin';

export type PaystackCurrency = 'USD' | 'KES' | 'NGN' | 'GHS' | 'ZAR';

export interface UserLimits {
    connections: number;
    images: number; // daily usage count
    traps: number; // active trap count
    lastReset: number; // timestamp
}

export interface UserSubscription {
    planId: UserTier;
    paystackCustomerCode?: string;
    paystackSubscriptionCode?: string;
    paystackAuthorizationCode?: string;
    status: 'active' | 'non-renewing' | 'cancelled' | 'expired' | 'none';
    startDate?: number;
    expiresAt?: number; // For one-time (starter) plans
    lastPaymentDate?: number;
    lastPaymentRef?: string;
    currency?: PaystackCurrency;
}

export interface UserProfileExtension {
    uid: string;
    tier: UserTier;
    gender?: 'male' | 'female' | 'other';
    limits: UserLimits;
    subscription?: UserSubscription;
    fingerprint?: string;
    createdAt: number;
    email?: string;
    displayName?: string;
    photoURL?: string;
    country?: string;
}

export interface AdminUser extends UserProfileExtension {
    id: string; // same as uid
}

export interface AdminTrap extends TrapWithId {
    creatorId: string;
}

// Multi-currency pricing for a single plan
export interface PlanPricing {
    USD: number;
    KES: number;
    NGN: number;
    GHS: number;
    ZAR: number;
}

export interface PlanConfig {
    price: PlanPricing;
    active: boolean;
    type: 'one-time' | 'subscription';
    interval?: 'monthly' | 'annually'; // For subscriptions
    durationDays?: number; // For one-time plans (e.g., 10 days for starter)
    paystackPlanCodes?: Partial<Record<PaystackCurrency, string>>; // Currency-specific Paystack plan codes
}

export interface AdminSettings {
    plans: {
        starter: PlanConfig;
        casual: PlanConfig;
        premium: PlanConfig;
    };
    maintenanceMode: boolean;
}

// ============================================
// FEATURE GATING
// ============================================

export type Feature =
    | 'trap_create'
    | 'trap_advanced_mechanics' // teleport, guilt-trip
    | 'trap_expert_mechanics' // dsa-quiz, impossible-form
    | 'trap_custom_themes'
    | 'trap_remove_branding'
    | 'analytics_basic' // views, yes/no count
    | 'analytics_advanced' // device, location, heatmap
    | 'analytics_export'
    | 'chat_basic'
    | 'chat_images'
    | 'chat_voice'
    | 'chat_save_history'    // Save transcripts to cloud
    | 'chat_save_stranger'   // Bookmark partner for reconnect
    | 'chat_auto_reconnect'  // Auto-find new partner on disconnect
    | 'chat_reactions'       // React to messages with emoji
    | 'chat_nickname'        // Set display nickname
    | 'chat_filter_gender'   // Filter by gender preference
    | 'chat_filter_country'  // Filter by country
    | 'chat_read_receipts'   // See when messages are read
    | 'chat_themes'          // Custom chat bubble themes
    | 'chat_translate'       // Auto-translate messages
    | 'polls_basic'
    | 'polls_quiz'
    | 'polls_export'
    | 'whispers_priority'
    | 'priority_support';

export interface TierPermissions {
    maxActiveTraps: number;
    maxDailyConnections: number;
    maxDailyImages: number;
    features: Feature[];
}

// Central source of truth for what each tier can do
export const TIER_FEATURES: Record<UserTier, TierPermissions> = {
    anonymous: {
        maxActiveTraps: 1,
        maxDailyConnections: 5,
        maxDailyImages: 0,
        features: ['trap_create', 'analytics_basic', 'chat_basic', 'polls_basic'],
    },
    // Note: anonymous users get minimal chat features (no save, no filters)
    free: {
        maxActiveTraps: 3,
        maxDailyConnections: 10,
        maxDailyImages: 0,
        features: ['trap_create', 'analytics_basic', 'chat_basic', 'polls_basic'],
    },
    starter: { // NOW "Casual One-Time"
        maxActiveTraps: 50,
        maxDailyConnections: 50,
        maxDailyImages: 30,
        features: [
            'trap_create', 'trap_advanced_mechanics', 'trap_expert_mechanics', 'trap_custom_themes', 'trap_remove_branding',
            'analytics_basic', 'analytics_advanced',
            'chat_basic', 'chat_images', 'chat_voice',
            'chat_save_history', 'chat_save_stranger', 'chat_auto_reconnect', 'chat_reactions', 'chat_nickname',
            'polls_basic', 'polls_quiz',
            'whispers_priority',
        ],
    },
    casual: {
        maxActiveTraps: 999,
        maxDailyConnections: 50,
        maxDailyImages: 30,
        features: [
            'trap_create', 'trap_advanced_mechanics', 'trap_expert_mechanics', 'trap_custom_themes', 'trap_remove_branding',
            'analytics_basic', 'analytics_advanced',
            'chat_basic', 'chat_images', 'chat_voice',
            'chat_save_history', 'chat_save_stranger', 'chat_auto_reconnect', 'chat_reactions', 'chat_nickname',
            'polls_basic', 'polls_quiz',
            'whispers_priority',
        ],
    },
    premium: {
        maxActiveTraps: 999999,
        maxDailyConnections: 999999,
        maxDailyImages: 999999,
        features: [
            'trap_create', 'trap_advanced_mechanics', 'trap_expert_mechanics', 'trap_custom_themes', 'trap_remove_branding',
            'analytics_basic', 'analytics_advanced', 'analytics_export',
            'chat_basic', 'chat_images', 'chat_voice',
            'chat_save_history', 'chat_save_stranger', 'chat_auto_reconnect', 'chat_reactions', 'chat_nickname',
            'chat_filter_gender', 'chat_filter_country', 'chat_read_receipts', 'chat_themes', 'chat_translate',
            'polls_basic', 'polls_quiz', 'polls_export',
            'whispers_priority', 'priority_support',
        ],
    },
    admin: {
        maxActiveTraps: 999999,
        maxDailyConnections: 999999,
        maxDailyImages: 999999,
        features: [
            'trap_create', 'trap_advanced_mechanics', 'trap_expert_mechanics', 'trap_custom_themes', 'trap_remove_branding',
            'analytics_basic', 'analytics_advanced', 'analytics_export',
            'chat_basic', 'chat_images', 'chat_voice',
            'chat_save_history', 'chat_save_stranger', 'chat_auto_reconnect', 'chat_reactions', 'chat_nickname',
            'chat_filter_gender', 'chat_filter_country', 'chat_read_receipts', 'chat_themes', 'chat_translate',
            'polls_basic', 'polls_quiz', 'polls_export',
            'whispers_priority', 'priority_support',
        ],
    },
};

// ============================================
// POLL TYPES
// ============================================

export interface PollConfig {
    isMultiple: boolean;
    isQuiz: boolean;
    expiresAt: number; // timestamp
    visibility: 'public' | 'link';
    requireAuth: boolean;
}

export interface PollAnalytics {
    views: number;
    uniqueVoters: number;
    countries: Record<string, number>; // "US": 120
    devices: Record<string, number>; // "mobile": 80
}

export interface PollComment {
    id: string;
    text: string;
    createdAt: number;
    creatorId: string;
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
    isCorrect?: boolean; // For quiz mode
    image?: string;
    color?: string;
}

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    config: PollConfig;
    analytics: PollAnalytics;
    comments: PollComment[];
    creatorId: string;
    createdAt: number;
    theme?: string;
    status: 'active' | 'ended';
    totalVotes: number;
}

export interface PollWithId extends Poll { }

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color?: string;
}

export interface LegalLayoutProps {
    children: React.ReactNode;
    title: string;
    icon: LucideIcon;
}

export interface DashboardProps {
    user: User | null;
    traps: TrapWithId[];
    polls?: PollWithId[];
    onLogout: () => void;
    onSwitchTheme: () => void;
}

// ============================================
// STATUS ENUMS (to replace magic strings)
// ============================================

export const TrapStatus = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    DISABLED: 'disabled',
} as const;

export type TrapStatusType = typeof TrapStatus[keyof typeof TrapStatus];

export const PollStatus = {
    ACTIVE: 'active',
    ENDED: 'ended',
    SCHEDULED: 'scheduled',
} as const;

export type PollStatusType = typeof PollStatus[keyof typeof PollStatus];

// ============================================
// ANALYTICS SESSION (properly typed)
// ============================================

export interface AnalyticsSessionData {
    visitorId: string;
    trapId: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    country?: string;
    city?: string;
    region?: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    browser: string;
    os: string;
    userAgent: string;
    securityAttempts: number;
    hoverCount: number;
    clickCount: number;
}

// ============================================
// WHISPER TYPES
// ============================================

export interface Whisper {
    id: string;
    text: string;
    color: string;
    createdAt: number;
    creatorId?: string;
    upvotes: number;
    downvotes: number;
    comments: {
        id: string;
        text: string;
        createdAt: number;
        creatorId?: string;
    }[];
}

// ============================================
// DECISION TYPES
// ============================================

export interface Decision {
    id?: string;
    question: string;
    options: string[];
    result: string;
    creatorId: string;
    createdAt: number;
}

export interface DecisionWithId extends Decision {
    id: string;
}
