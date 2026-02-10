import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { UserProfileExtension, UserTier, UserSubscription, TIER_FEATURES } from '@/types/shared';

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
    async initializeProfile(uid: string, tier: UserTier = 'free', fingerprint?: string, email?: string, displayName?: string, photoURL?: string): Promise<void> {
        if (!uid) return;
        try {
            const docRef = doc(db, 'users', uid);

            // Build object dynamically to avoid undefined values
            const initialData: Record<string, any> = {
                uid,
                tier,
                limits: {
                    connections: 0,
                    images: 0,
                    traps: 0,
                    lastReset: Date.now(),
                },
                subscription: {
                    planId: tier,
                    status: 'none',
                },
                createdAt: Date.now(),
            };

            if (fingerprint) initialData.fingerprint = fingerprint;
            if (email) initialData.email = email;
            if (displayName) initialData.displayName = displayName;
            if (photoURL) initialData.photoURL = photoURL;

            await setDoc(docRef, initialData, { merge: true });
        } catch (error) {
            console.error("Error initializing profile:", error);
            throw error;
        }
    },

    // Check if user can perform action based on tier limits
    async checkLimit(uid: string, type: 'connections' | 'images'): Promise<{ allowed: boolean; limit: number; current: number }> {
        if (!uid) return { allowed: false, limit: 0, current: 0 };

        try {
            const profile = await this.getProfile(uid);
            if (!profile) return { allowed: false, limit: 0, current: 0 };

            // Check for daily reset
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;
            if (now - profile.limits.lastReset > oneDay) {
                await this.resetDailyUsage(uid);
                const permissions = TIER_FEATURES[profile.tier];
                const limit = type === 'connections' ? permissions.maxDailyConnections : permissions.maxDailyImages;
                return { allowed: 0 < limit, limit, current: 0 };
            }

            const permissions = TIER_FEATURES[profile.tier];
            const limit = type === 'connections' ? permissions.maxDailyConnections : permissions.maxDailyImages;
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

    // Check active trap limit
    async checkTrapLimit(uid: string): Promise<{ allowed: boolean; limit: number; current: number }> {
        if (!uid) return { allowed: false, limit: 0, current: 0 };

        try {
            const profile = await this.getProfile(uid);
            if (!profile) return { allowed: false, limit: 0, current: 0 };

            const permissions = TIER_FEATURES[profile.tier];
            const current = profile.limits.traps || 0;

            return {
                allowed: current < permissions.maxActiveTraps,
                limit: permissions.maxActiveTraps,
                current
            };
        } catch (error) {
            console.error("Error checking trap limits:", error);
            return { allowed: false, limit: 0, current: 0 };
        }
    },

    async incrementUsage(uid: string, type: 'connections' | 'images' | 'traps'): Promise<void> {
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

    async decrementUsage(uid: string, type: 'connections' | 'images' | 'traps'): Promise<void> {
        if (!uid) return;
        try {
            const docRef = doc(db, 'users', uid);
            await updateDoc(docRef, {
                [`limits.${type}`]: increment(-1)
            });
        } catch (error) {
            console.error("Error decrementing usage:", error);
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

    // Update full subscription object
    async updateSubscription(uid: string, subscription: Partial<UserSubscription>): Promise<void> {
        if (!uid) return;
        const docRef = doc(db, 'users', uid);
        const updates: Record<string, any> = {};
        for (const [key, value] of Object.entries(subscription)) {
            updates[`subscription.${key}`] = value;
        }
        await updateDoc(docRef, updates);
    },

    // Update just the subscription status
    async updateSubscriptionStatus(uid: string, status: UserSubscription['status']): Promise<void> {
        if (!uid) return;
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, { 'subscription.status': status });
    },

    // Activate a subscription after successful payment
    async activateSubscription(uid: string, tier: UserTier, subscription: UserSubscription): Promise<void> {
        if (!uid) return;
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, {
            tier,
            subscription,
        });
    },

    async setGender(uid: string, gender: 'male' | 'female' | 'other'): Promise<void> {
        if (!uid) return;
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, { gender });
    },

    async setCountry(uid: string, country: string): Promise<void> {
        if (!uid) return;
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, { country });
    },

    getTierLimits(tier: UserTier) {
        return TIER_FEATURES[tier];
    }
};
