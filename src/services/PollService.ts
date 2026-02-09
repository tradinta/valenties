/**
 * PollService - Production-grade data access for Interactive Polls
 * 
 * Features:
 * - Transactional voting (atomic updates)
 * - Advanced configuration (Quiz, Multiple Choice, Expiry)
 * - Analytics tracking (Views, Devices)
 * - Commenting system
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
    runTransaction,
    serverTimestamp,
    increment,
    DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Poll, PollWithId, PollConfig, PollOption } from '@/types/shared';

const COLLECTION = 'polls';
const VOTES_SUBCOLLECTION = 'votes'; // Track who voted to prevent duplicate votes
const MAX_COMMENT_LENGTH = 280;

// Helper: Generate safe ID
function generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 11);
}

export const PollService = {
    /**
     * Get public polls (active and public visibility)
     */
    async getPublicFeed(limitCount = 20): Promise<PollWithId[]> {
        try {
            const q = query(
                collection(db, COLLECTION),
                where('config.visibility', '==', 'public'),
                where('status', '==', 'active'),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PollWithId));
        } catch (error) {
            console.error('[PollService] Feed Error:', error);
            return [];
        }
    },

    /**
     * Get a single poll by ID and increment view count
     */
    async getById(id: string, viewerId?: string): Promise<PollWithId | null> {
        if (!id) return null;

        const docRef = doc(db, COLLECTION, id);

        try {
            // Atomic logic to fetch AND increment view
            // We optimize by not using transaction for view count to avoid contention
            // Just updateDoc purely for the metric
            updateDoc(docRef, {
                'analytics.views': increment(1)
            }).catch(() => { }); // Fire and forget view count

            const snapshot = await getDoc(docRef);
            if (!snapshot.exists()) return null;

            return { id: snapshot.id, ...snapshot.data() } as PollWithId;
        } catch (error) {
            console.error('[PollService] GetById Error:', error);
            return null;
        }
    },

    /**
     * Create a new poll
     * [ATTACK_SURFACE] Rate limit this endpoint
     */
    async create(data: {
        creatorId: string;
        question: string;
        options: { text: string; isCorrect?: boolean; image?: string; color?: string }[];
        config: PollConfig;
        theme?: string;
    }): Promise<string> {
        // Prepare options with IDs
        const options: PollOption[] = data.options.map(opt => ({
            id: generateId(),
            text: opt.text,
            votes: 0,
            isCorrect: opt.isCorrect,
            image: opt.image,
            color: opt.color
        }));

        const pollData: Omit<Poll, 'id'> = {
            question: data.question,
            options,
            config: data.config,
            analytics: {
                views: 0,
                uniqueVoters: 0,
                countries: {},
                devices: {}
            },
            comments: [],
            creatorId: data.creatorId,
            createdAt: Date.now(),
            theme: data.theme || 'neo-brutal',
            status: 'active',
            totalVotes: 0
        };

        const docRef = await addDoc(collection(db, COLLECTION), pollData);
        return docRef.id;
    },

    /**
     * Cast a vote
     * [ATTACK_SURFACE] High contention point
     */
    async vote(
        pollId: string,
        optionIds: string[],
        voterId: string,
        metadata?: { country?: string; device?: 'mobile' | 'desktop' }
    ): Promise<{ success: boolean; error?: string }> {
        const pollRef = doc(db, COLLECTION, pollId);
        const voteRef = doc(db, COLLECTION, pollId, VOTES_SUBCOLLECTION, voterId);

        try {
            await runTransaction(db, async (transaction) => {
                const pollDoc = await transaction.get(pollRef);
                if (!pollDoc.exists()) throw new Error('Poll not found');

                // Check if user already voted
                const existingVote = await transaction.get(voteRef);
                if (existingVote.exists()) throw new Error('You have already voted');

                const poll = pollDoc.data() as Poll;

                // Validate options
                const validOptionIds = poll.options.map(o => o.id);
                if (!optionIds.every(id => validOptionIds.includes(id))) {
                    throw new Error('Invalid options');
                }

                // Single choice check
                if (!poll.config.isMultiple && optionIds.length > 1) {
                    throw new Error('Multiple selection not allowed');
                }

                // Update options
                const newOptions = poll.options.map(opt => {
                    if (optionIds.includes(opt.id)) {
                        return { ...opt, votes: opt.votes + 1 };
                    }
                    return opt;
                });

                // Update analytics
                const newAnalytics = { ...poll.analytics };
                newAnalytics.uniqueVoters += 1;

                if (metadata?.country) {
                    newAnalytics.countries[metadata.country] = (newAnalytics.countries[metadata.country] || 0) + 1;
                }
                if (metadata?.device) {
                    newAnalytics.devices[metadata.device] = (newAnalytics.devices[metadata.device] || 0) + 1;
                }

                // Commit updates
                transaction.update(pollRef, {
                    options: newOptions,
                    totalVotes: increment(1), // Total voters, not total selections
                    analytics: newAnalytics
                });

                // Record vote
                transaction.set(voteRef, {
                    optionIds,
                    timestamp: serverTimestamp()
                });
            });

            return { success: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Vote failed';
            console.error('[PollService] Vote Error:', error);
            return { success: false, error: message };
        }
    },

    /**
     * Add a comment
     * [ATTACK_SURFACE] Spam target
     */
    async addComment(pollId: string, text: string, creatorId: string): Promise<void> {
        if (!text.trim() || text.length > MAX_COMMENT_LENGTH) {
            throw new Error(`Invalid comment (max ${MAX_COMMENT_LENGTH} chars)`);
        }

        const pollRef = doc(db, COLLECTION, pollId);

        await runTransaction(db, async (transaction) => {
            const snapshot = await transaction.get(pollRef);
            if (!snapshot.exists()) throw new Error('Poll not found');

            const comments = snapshot.data().comments || [];

            // Limit comments to prevent unlimited document growth
            if (comments.length >= 100) throw new Error('Comment limit reached for this poll');

            const newComment = {
                id: generateId(),
                text: text.trim(),
                createdAt: Date.now(),
                creatorId
            };

            transaction.update(pollRef, {
                comments: [...comments, newComment]
            });
        });
    },

    /**
     * Check if user voted (client-side check)
     */
    async hasVoted(pollId: string, userId: string): Promise<string[] | null> {
        if (!userId) return null;
        const voteRef = doc(db, COLLECTION, pollId, VOTES_SUBCOLLECTION, userId);
        const snapshot = await getDoc(voteRef);
        if (snapshot.exists()) {
            return snapshot.data().optionIds as string[];
        }
        return null;
    },

    /**
     * Get all polls created by a user
     */
    async getByCreator(creatorId: string): Promise<PollWithId[]> {
        const q = query(
            collection(db, COLLECTION),
            where('creatorId', '==', creatorId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as PollWithId));
    },

    /**
     * Delete a poll and its subcollections (subcollections must be handled carefully or left)
     * For now, we just delete the parent document.
     */
    async delete(id: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTION, id));
    }
};
