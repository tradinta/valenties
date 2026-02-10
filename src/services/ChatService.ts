import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    doc,
    setDoc,
    getDocs,
    deleteDoc,
    query,
    orderBy,
    limit,
    where,
    serverTimestamp
} from 'firebase/firestore';
import { Message } from '@/types/chat';

export const ChatService = {

    /**
     * Save a chat session to the user's history
     */
    async saveChatSession(userId: string, partnerId: string, messages: Message[]) {
        if (!messages.length) return;

        try {
            const chatData = {
                partnerId,
                startTime: messages[0].timestamp,
                endTime: Date.now(),
                messageCount: messages.length,
                preview: messages[messages.length - 1].text,
                messages: messages, // Store full history
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, `users/${userId}/chat_history`), chatData);
            return { success: true };
        } catch (error) {
            console.error('Error saving chat:', error);
            return { success: false, error };
        }
    },

    /**
     * Bookmark a stranger to find them later
     */
    async bookmarkStranger(userId: string, strangerId: string, nickname: string) {
        try {
            if (!nickname.trim()) throw new Error("Nickname required");

            await setDoc(doc(db, `users/${userId}/saved_strangers`, strangerId), {
                strangerId,
                nickname,
                savedAt: Date.now(),
                notes: ''
            });
            return { success: true };
        } catch (error) {
            console.error('Error bookmarking:', error);
            return { success: false, error };
        }
    },

    /**
     * Remove a bookmarked stranger
     */
    async removeBookmark(userId: string, strangerId: string) {
        try {
            await deleteDoc(doc(db, `users/${userId}/saved_strangers`, strangerId));
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    },

    /**
     * Get formatted chat history
     */
    async getHistory(userId: string) {
        try {
            const q = query(
                collection(db, `users/${userId}/chat_history`),
                orderBy('createdAt', 'desc'),
                limit(50)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching history:', error);
            return [];
        }
    },

    /**
     * Get saved strangers list
     */
    async getBookmarks(userId: string) {
        try {
            const snapshot = await getDocs(collection(db, `users/${userId}/saved_strangers`));
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            return [];
        }
    }
};
