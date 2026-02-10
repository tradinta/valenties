"use client";

import { useAuth } from '@/context/AuthContext';
import { Feature, TIER_FEATURES, UserTier } from '@/types/shared';
import { useCallback, useMemo } from 'react';

/**
 * useFeatureGate - Central hook for feature gating.
 * 
 * Usage:
 *   const { hasFeature, canCreate, requiredTier, tierName } = useFeatureGate();
 *   if (!hasFeature('chat_voice')) { showUpgradeModal(); }
 */
export function useFeatureGate() {
    const { firebaseUser, isLoggedIn } = useAuth();
    // We need the user's tier. Let's get it from the profile in AuthContext.
    // For now, we'll use a simple approach — the AuthContext should expose userTier.
    // We'll add that. For now, default to what we have.

    // Get the effective tier from auth context
    const { userTier } = useAuth() as any; // Will be typed after we update AuthContext
    const tier: UserTier = userTier || (isLoggedIn ? 'free' : 'anonymous');

    const permissions = useMemo(() => TIER_FEATURES[tier], [tier]);

    const hasFeature = useCallback((feature: Feature): boolean => {
        return permissions.features.includes(feature);
    }, [permissions]);

    const canCreateMoreTraps = useCallback((currentActiveTrapCount: number): boolean => {
        return currentActiveTrapCount < permissions.maxActiveTraps;
    }, [permissions]);

    const canChat = useCallback((): boolean => {
        return hasFeature('chat_basic');
    }, [hasFeature]);

    // Returns the minimum tier required for a given feature
    const requiredTierFor = useCallback((feature: Feature): UserTier => {
        const tiers: UserTier[] = ['anonymous', 'free', 'starter', 'casual', 'premium'];
        for (const t of tiers) {
            if (TIER_FEATURES[t].features.includes(feature)) {
                return t;
            }
        }
        return 'premium';
    }, []);

    const tierDisplayName = useCallback((t: UserTier): string => {
        const names: Record<UserTier, string> = {
            anonymous: 'Guest',
            free: 'Free',
            starter: 'Starter',
            casual: 'Casual',
            premium: 'Premium',
            admin: 'Admin',
        };
        return names[t];
    }, []);

    return {
        tier,
        permissions,
        hasFeature,
        canCreateMoreTraps,
        canChat,
        requiredTierFor,
        tierDisplayName,
        isAnonymous: tier === 'anonymous',
        isFree: tier === 'free',
        isPaid: ['starter', 'casual', 'premium', 'admin'].includes(tier),
    };
}
