import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, query, where, orderBy, getDoc } from 'firebase/firestore';
import { Decision, DecisionWithId } from '@/types/shared';

const COLLECTION_NAME = 'decisions';

export const DecisionService = {
    // Create new decision
    async create(question: string, options: string[], result: string, creatorId: string): Promise<string> {
        const decisionData: Decision = {
            question,
            options,
            result,
            creatorId,
            createdAt: Date.now()
        };
        const docRef = await addDoc(collection(db, COLLECTION_NAME), decisionData);
        return docRef.id;
    },

    // Get all decisions by creator
    async getByCreator(creatorId: string): Promise<DecisionWithId[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('creatorId', '==', creatorId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as DecisionWithId));
    },

    // Delete a decision
    async delete(id: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    }
};
