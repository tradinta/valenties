import { auth, db } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';

export const TrackingService = {
    /**
     * Ensures the current user is signed in anonymously if not already.
     */
    async ensureAnonymousSession() {
        if (!auth.currentUser) {
            await signInAnonymously(auth);
        }
        return auth.currentUser?.uid;
    },

    /**
     * Logs a 'view' event and increments the trap's total view count.
     */
    async logView(trapId: string) {
        const userId = await this.ensureAnonymousSession();
        if (!userId) return;

        // Log granular event
        await addDoc(collection(db, `traps/${trapId}/events`), {
            type: 'view',
            userId,
            timestamp: Date.now()
        });

        // Increment aggregate stats
        // Note: 'hovers' was used as proxy for views in dashboard earlier, 
        // but we should probably add a real 'views' field or use 'hovers' for actual hovers.
        // For now, let's increment a new 'views' field if schema allows, or just log event.
        // The dashboard reads 'hovers' as '(est)'. Let's update hovers for now or add views.
        // Let's safe update 'hovers' as a 'view' proxy for minimal schema change, or add 'views'.
        const trapRef = doc(db, "traps", trapId);
        await updateDoc(trapRef, {
            "stats.views": increment(1)
        }).catch(() => {
            // Field might not exist, ignore or use dot notation to create
        });
    },

    /**
     * Logs an interaction (hover, attempt, click).
     */
    async logAction(trapId: string, type: 'hover' | 'attempt' | 'click_no' | 'click_yes', metadata?: any) {
        const userId = await this.ensureAnonymousSession();

        await addDoc(collection(db, `traps/${trapId}/events`), {
            type,
            userId,
            metadata,
            timestamp: Date.now()
        });

        const trapRef = doc(db, "traps", trapId);

        if (type === 'attempt' || type === 'click_no') {
            await updateDoc(trapRef, { "stats.attempts": increment(1) });
        }
        if (type === 'hover') {
            await updateDoc(trapRef, { "stats.hovers": increment(1) });
        }
    }
};
