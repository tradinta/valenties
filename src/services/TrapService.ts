/**
 * TrapService - Centralized data access for Traps
 * Reduces Firestore reads by caching and batching where possible.
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TrapConfig, TrapStats } from '@/types';
import { TrapWithId } from '@/types/shared';

const COLLECTION = 'traps';

export const TrapService = {
    /**
     * Get all traps for a user
     */
    async getByCreator(creatorId: string): Promise<TrapWithId[]> {
        const q = query(
            collection(db, COLLECTION),
            where('creatorId', '==', creatorId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as TrapWithId));
    },

    /**
     * Get a single trap by ID
     */
    async getById(id: string): Promise<TrapWithId | null> {
        const docRef = doc(db, COLLECTION, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as TrapWithId;
    },

    /**
     * Create a new trap
     */
    async create(data: Omit<TrapConfig, 'id'> & { creatorId: string }): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION), {
            ...data,
            createdAt: Date.now(),
            status: 'active',
            stats: { views: 0, attempts: 0, hovers: 0, timeToYes: 0, completedAt: 0 }
        });
        return docRef.id;
    },

    /**
     * Update trap fields
     */
    async update(id: string, data: Partial<TrapWithId>): Promise<void> {
        const docRef = doc(db, COLLECTION, id);
        await updateDoc(docRef, data);
    },

    /**
     * Mark trap as completed
     */
    async markCompleted(id: string, attempts: number): Promise<void> {
        await this.update(id, {
            status: 'completed',
            completedAt: Date.now(),
            finalAttempts: attempts
        } as any);
    },

    /**
     * Toggle trap status (active/disabled)
     */
    async toggleStatus(id: string, currentStatus: string): Promise<string> {
        const newStatus = currentStatus === 'disabled' ? 'active' : 'disabled';
        await this.update(id, { status: newStatus as any });
        return newStatus;
    },

    /**
     * Increment view count (optimized: single field update)
     */
    async incrementViews(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION, id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            const currentStats = snapshot.data().stats || { views: 0 };
            await updateDoc(docRef, {
                'stats.views': (currentStats.views || 0) + 1
            });
        }
    },

    /**
     * Delete a trap
     */
    async delete(id: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTION, id));
    },

    /**
     * Save response note from partner
     */
    async saveResponseNote(id: string, note: string): Promise<void> {
        await this.update(id, { responseNote: note });
    }
};
