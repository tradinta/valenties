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

export type UserTier = 'anonymous' | 'free' | 'casual' | 'premium' | 'admin';

export interface UserLimits {
    connections: number;
    images: number; // daily limit
    lastReset: number; // timestamp
}

export interface UserProfileExtension {
    uid: string;
    tier: UserTier;
    gender?: 'male' | 'female' | 'other';
    limits: UserLimits;
    fingerprint?: string;
    createdAt: number;
}

export interface AdminSettings {
    plans: {
        casual: { price: number; active: boolean };
        premium: { price: number; active: boolean };
    };
    maintenanceMode: boolean;
}

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
