/**
 * WhisperService - Production-grade data access for Whispers
 * 
 * Features:
 * - Vote spam protection via subcollection tracking
 * - Transactional vote operations
 * - Pagination support
 * - Server timestamps
 * - Proper error handling with typed responses
 * - Delete with ownership verification
 */

import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
    onSnapshot,
    Unsubscribe,
    doc,
    runTransaction,
    DocumentSnapshot,
    QueryDocumentSnapshot,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Whisper } from '@/types/shared';

const COLLECTION = 'whispers';
const VOTES_SUBCOLLECTION = 'votes';
const COLORS = ['bg-[#FFD166]', 'bg-[#A7F3D0]', 'bg-[#FF9EB5]', 'bg-[#B8C0FF]', 'bg-[#FFF]'];
const MAX_WHISPER_LENGTH = 280;
const MAX_COMMENT_LENGTH = 500;

// ============================================
// TYPES
// ============================================

export interface ServiceResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PaginatedWhispers {
    whispers: Whisper[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
}

interface VoteRecord {
    type: 'up' | 'down';
    timestamp: Timestamp;
}

// ============================================
// HELPERS
// ============================================

function generateId(): string {
    // Crypto-safe ID generation
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    }
    // Fallback for older environments
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 11);
}

function parseWhisperDoc(doc: DocumentSnapshot): Whisper | null {
    if (!doc.exists()) return null;
    const data = doc.data();
    return {
        id: doc.id,
        text: data?.text ?? '',
        color: data?.color ?? COLORS[0],
        createdAt: data?.createdAt?.toMillis?.() ?? data?.createdAt ?? Date.now(),
        creatorId: data?.creatorId,
        upvotes: data?.upvotes ?? 0,
        downvotes: data?.downvotes ?? 0,
        comments: data?.comments ?? []
    };
}

// ============================================
// SERVICE
// ============================================

export const WhisperService = {
    /**
     * Subscribe to whispers (real-time)
     */
    subscribe(
        callback: (whispers: Whisper[]) => void,
        onError?: (error: Error) => void,
        maxItems = 50
    ): Unsubscribe {
        const q = query(
            collection(db, COLLECTION),
            orderBy('createdAt', 'desc'),
            limit(maxItems)
        );

        return onSnapshot(
            q,
            (snapshot) => {
                const whispers = snapshot.docs
                    .map(doc => parseWhisperDoc(doc))
                    .filter((w): w is Whisper => w !== null);
                callback(whispers);
            },
            (error) => {
                console.error('[WhisperService] Subscription error:', error);
                onError?.(error);
            }
        );
    },

    /**
     * Get paginated whispers with sorting
     */
    async getPaginated(
        pageSize = 20,
        afterDoc?: QueryDocumentSnapshot,
        sortBy: 'newest' | 'top' | 'worst' | 'ratio' = 'newest'
    ): Promise<ServiceResult<PaginatedWhispers>> {
        try {
            let orderByField = 'createdAt';
            let direction: 'desc' | 'asc' = 'desc';

            switch (sortBy) {
                case 'top': orderByField = 'upvotes'; break;
                case 'worst': orderByField = 'downvotes'; break;
                // 'ratio' falls back to newest for fetch, then client sort
            }

            let q = query(
                collection(db, COLLECTION),
                orderBy(orderByField, direction),
                limit(pageSize + 1)
            );

            // If using 'ratio', we just get recent ones and sort them in memory for now
            if (sortBy === 'ratio') {
                q = query(
                    collection(db, COLLECTION),
                    orderBy('createdAt', 'desc'),
                    limit(50) // Fetch more for better sampling
                );
            }

            if (afterDoc && sortBy !== 'ratio') {
                q = query(q, startAfter(afterDoc));
            }

            const snapshot = await getDocs(q);
            let docs = snapshot.docs;
            let hasMore = docs.length > pageSize;

            if (sortBy !== 'ratio' && hasMore) {
                docs = docs.slice(0, -1);
            }

            let whispers = docs
                .map(doc => parseWhisperDoc(doc))
                .filter((w): w is Whisper => w !== null);

            if (sortBy === 'ratio') {
                // Weighted sort: Highest ratio of upvotes, but penalties for low volume
                whispers.sort((a, b) => {
                    const totalA = a.upvotes + a.downvotes;
                    const totalB = b.upvotes + b.downvotes;

                    // Push items with very few votes to the bottom
                    if (totalA < 3) return 1;
                    if (totalB < 3) return -1;

                    const ratioA = a.upvotes / (totalA || 1);
                    const ratioB = b.upvotes / (totalB || 1);

                    // Sort by ratio desc, then total votes desc
                    if (Math.abs(ratioA - ratioB) > 0.1) {
                        return ratioB - ratioA;
                    }
                    return totalB - totalA;
                });
            }

            return {
                success: true,
                data: {
                    whispers,
                    lastDoc: sortBy !== 'ratio' ? (docs[docs.length - 1] ?? null) : null,
                    hasMore: sortBy !== 'ratio' ? hasMore : false
                }
            };
        } catch (error) {
            console.error('[WhisperService] Pagination error:', error);
            return { success: false, error: 'Failed to fetch whispers' };
        }
    },

    /**
     * Create a new whisper with validation
     * [ATTACK_SURFACE] Rate limit this endpoint aggressively
     */
    async create(text: string, creatorId?: string): Promise<ServiceResult<string>> {
        // Validation
        const trimmed = text?.trim();
        if (!trimmed) {
            return { success: false, error: 'Whisper cannot be empty' };
        }
        if (trimmed.length > MAX_WHISPER_LENGTH) {
            return { success: false, error: `Whisper exceeds ${MAX_WHISPER_LENGTH} characters` };
        }

        try {
            const docRef = await addDoc(collection(db, COLLECTION), {
                text: trimmed,
                createdAt: serverTimestamp(),
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                creatorId: creatorId || 'anon',
                upvotes: 0,
                downvotes: 0,
                comments: []
            });

            return { success: true, data: docRef.id };
        } catch (error) {
            console.error('[WhisperService] Create error:', error);
            return { success: false, error: 'Failed to create whisper' };
        }
    },

    /**
     * Vote on a whisper with spam protection
     * Uses a subcollection to track who has voted
     */
    async vote(
        whisperId: string,
        type: 'up' | 'down',
        voterId: string
    ): Promise<ServiceResult<{ newCount: number }>> {
        if (!whisperId || !voterId) {
            return { success: false, error: 'Invalid parameters' };
        }

        const whisperRef = doc(db, COLLECTION, whisperId);
        const voteRef = doc(db, COLLECTION, whisperId, VOTES_SUBCOLLECTION, voterId);

        try {
            const result = await runTransaction(db, async (transaction) => {
                const whisperDoc = await transaction.get(whisperRef);
                if (!whisperDoc.exists()) {
                    throw new Error('Whisper not found');
                }

                const voteDoc = await transaction.get(voteRef);
                const existingVote = voteDoc.data() as VoteRecord | undefined;
                const field = type === 'up' ? 'upvotes' : 'downvotes';
                const oppositeField = type === 'up' ? 'downvotes' : 'upvotes';
                let currentCount = whisperDoc.data()?.[field] ?? 0;

                if (existingVote) {
                    if (existingVote.type === type) {
                        // Same vote = remove vote (toggle off)
                        transaction.delete(voteRef);
                        currentCount = Math.max(0, currentCount - 1);
                        transaction.update(whisperRef, { [field]: currentCount });
                    } else {
                        // Opposite vote = switch vote
                        transaction.update(voteRef, { type, timestamp: serverTimestamp() });
                        const oppositeCount = Math.max(0, (whisperDoc.data()?.[oppositeField] ?? 0) - 1);
                        currentCount += 1;
                        transaction.update(whisperRef, {
                            [field]: currentCount,
                            [oppositeField]: oppositeCount
                        });
                    }
                } else {
                    // New vote
                    transaction.set(voteRef, { type, timestamp: serverTimestamp() });
                    currentCount += 1;
                    transaction.update(whisperRef, { [field]: currentCount });
                }

                return currentCount;
            });

            return { success: true, data: { newCount: result } };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to vote';
            console.error('[WhisperService] Vote error:', error);
            return { success: false, error: message };
        }
    },

    /**
     * Check if user has voted on a whisper
     */
    async getUserVote(whisperId: string, userId: string): Promise<'up' | 'down' | null> {
        if (!whisperId || !userId) return null;

        try {
            const voteRef = doc(db, COLLECTION, whisperId, VOTES_SUBCOLLECTION, userId);
            const voteDoc = await getDoc(voteRef);

            if (!voteDoc.exists()) return null;
            return (voteDoc.data() as VoteRecord).type;
        } catch {
            return null;
        }
    },

    /**
     * Add a comment with validation
     */
    async addComment(
        whisperId: string,
        text: string,
        creatorId?: string
    ): Promise<ServiceResult> {
        const trimmed = text?.trim();
        if (!whisperId || !trimmed) {
            return { success: false, error: 'Invalid parameters' };
        }
        if (trimmed.length > MAX_COMMENT_LENGTH) {
            return { success: false, error: `Comment exceeds ${MAX_COMMENT_LENGTH} characters` };
        }

        try {
            const whisperRef = doc(db, COLLECTION, whisperId);

            await runTransaction(db, async (transaction) => {
                const whisperDoc = await transaction.get(whisperRef);
                if (!whisperDoc.exists()) {
                    throw new Error('Whisper not found');
                }

                const comments = whisperDoc.data()?.comments ?? [];

                // [ATTACK_SURFACE] Cap number of comments?
                if (comments.length >= 50) {
                    throw new Error('Comment limit reached for this whisper');
                }

                const newComment = {
                    id: generateId(),
                    text: trimmed,
                    createdAt: Date.now(),
                    creatorId: creatorId || 'anon'
                };

                transaction.update(whisperRef, {
                    comments: [...comments, newComment]
                });
            });

            return { success: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to add comment';
            console.error('[WhisperService] Comment error:', error);
            return { success: false, error: message };
        }
    },

    /**
     * Delete a whisper (owner only)
     */
    async delete(whisperId: string, requesterId: string): Promise<ServiceResult> {
        if (!whisperId || !requesterId) {
            return { success: false, error: 'Invalid parameters' };
        }

        try {
            const whisperRef = doc(db, COLLECTION, whisperId);
            const whisperDoc = await getDoc(whisperRef);

            if (!whisperDoc.exists()) {
                return { success: false, error: 'Whisper not found' };
            }

            const creatorId = whisperDoc.data()?.creatorId;
            if (creatorId !== requesterId) {
                return { success: false, error: 'Not authorized to delete this whisper' };
            }

            await deleteDoc(whisperRef);
            return { success: true };
        } catch (error) {
            console.error('[WhisperService] Delete error:', error);
            return { success: false, error: 'Failed to delete whisper' };
        }
    }
};
