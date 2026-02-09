import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { UserProfileExtension, UserTier } from '@/types/shared';

const TIER_LIMITS = {
    anonymous: { connections: 5, images: 0 },
    free: { connections: 15, images: 0 },
    casual: { connections: 50, images: 30 },
    premium: { connections: 999999, images: 70 }, // Effectively unlimited connections
    admin: { connections: 999999, images: 999999 }, // Full access
};

export const UserService = {

    // Get or Create User Profile
    async getProfile(uid: string): Promise<UserProfileExtension | null> {
        if (!uid) return null;
        try {
            const docRef = doc(db, 'users', uid);
            const snapshot = await getDoc(docRef);

            if (snapshot.exists()) {
                return snapshot.data() as UserProfileExtension;
            }
            return null;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    },

    // Initialize Profile (for new users)
    async initializeProfile(uid: string, tier: UserTier = 'free', fingerprint?: string): Promise<void> {
        if (!uid) return;
        try {
            const docRef = doc(db, 'users', uid);
            const initialData: UserProfileExtension = {
                uid,
                tier,
                fingerprint,
                limits: {
                    connections: 0, // Current usage
                    images: 0,      // Current usage
                    lastReset: Date.now(),
                },
                createdAt: Date.now(),
            };
            await setDoc(docRef, initialData, { merge: true });
        } catch (error) {
            console.error("Error initializing profile:", error);
            throw error;
        }
    },

    // Check if user can perform action
    async checkLimit(uid: string, type: 'connections' | 'images'): Promise<{ allowed: boolean; limit: number; current: number }> {
        if (!uid) return { allowed: false, limit: 0, current: 0 };

        try {
            const profile = await this.getProfile(uid);
            // If no profile, treat as restricted (or auto-init?)
            // Fallback for missing profile
            if (!profile) return { allowed: false, limit: 0, current: 0 };

            // Check for daily reset
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;
            if (now - profile.limits.lastReset > oneDay) {
                await this.resetDailyUsage(uid);
                // Return reset values optimistically
                const limit = TIER_LIMITS[profile.tier][type];
                return { allowed: 0 < limit, limit, current: 0 };
            }

            const limit = TIER_LIMITS[profile.tier][type];
            const current = profile.limits[type];

            return {
                allowed: current < limit,
                limit,
                current
            };
        } catch (error) {
            console.error("Error checking limits:", error);
            return { allowed: false, limit: 0, current: 0 };
        }
    },

    async incrementUsage(uid: string, type: 'connections' | 'images'): Promise<void> {
        if (!uid) return;
        try {
            const docRef = doc(db, 'users', uid);
            await updateDoc(docRef, {
                [`limits.${type}`]: increment(1)
            });
        } catch (error) {
            console.error("Error incrementing usage:", error);
        }
    },

    async resetDailyUsage(uid: string): Promise<void> {
        if (!uid) return;
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, {
            'limits.connections': 0,
            'limits.images': 0,
            'limits.lastReset': Date.now()
        });
    },

    async updateTier(uid: string, tier: UserTier): Promise<void> {
        if (!uid) return;
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, { tier });
    },

    async setGender(uid: string, gender: 'male' | 'female' | 'other'): Promise<void> {
        if (!uid) return;
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, { gender });
    },

    getTierLimits(tier: UserTier) {
        return TIER_LIMITS[tier];
    }
};
