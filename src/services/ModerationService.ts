import { db } from '@/lib/firebase'; // Assuming firebase init is here or similar
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

export const ModerationService = {
    // Cache
    bannedWords: new Set<string>(),
    userBans: new Set<string>(),
    ipBans: new Set<string>(),
    initialized: false,

    async init() {
        if (this.initialized) return;
        try {
            // Load Banned Words
            const settingsDoc = await getDoc(doc(db, 'moderation', 'settings'));
            if (settingsDoc.exists()) {
                const data = settingsDoc.data();
                if (data.bannedWords) {
                    data.bannedWords.forEach((w: string) => this.bannedWords.add(w));
                }
            }

            // Load Bans
            const bansSnapshot = await getDocs(collection(db, 'moderation_bans'));
            bansSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.type === 'user') this.userBans.add(data.value);
                if (data.type === 'ip') this.ipBans.add(data.value);
            });

            this.initialized = true;
            console.log('[Moderation] Service Initialized');
        } catch (error) {
            console.error('[Moderation] Init Failed', error);
        }
    },

    filterMessage(text: string): { clean: string; triggered: boolean } {
        // Ensure init if not (though strictly this is sync, so best effort)
        // In real app, call init() at server start

        let cleanText = text;
        let triggered = false;

        this.bannedWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            if (regex.test(cleanText)) {
                triggered = true;
                cleanText = cleanText.replace(regex, '*'.repeat(word.length));
            }
        });

        return { clean: cleanText, triggered };
    },

    isBanned(userId: string, ip?: string): boolean {
        if (this.userBans.has(userId)) return true;
        if (ip && this.ipBans.has(ip)) return true;
        return false;
    },

    async banUser(userId: string, reason: string) {
        this.userBans.add(userId);
        await addDoc(collection(db, 'moderation_bans'), { type: 'user', value: userId, reason, timestamp: Date.now() });
    },

    async banIp(ip: string, reason: string) {
        this.ipBans.add(ip);
        await addDoc(collection(db, 'moderation_bans'), { type: 'ip', value: ip, reason, timestamp: Date.now() });
    },

    async unban(value: string) {
        this.userBans.delete(value);
        this.ipBans.delete(value);

        // Find doc to delete (inefficient query but okay for admin)
        const bansSnapshot = await getDocs(collection(db, 'moderation_bans'));
        bansSnapshot.forEach(async (d) => {
            if (d.data().value === value) {
                await deleteDoc(d.ref);
            }
        });
    },

    async addBannedWord(word: string) {
        const lower = word.toLowerCase();
        this.bannedWords.add(lower);

        // Ensure doc exists
        const ref = doc(db, 'moderation', 'settings');
        // Merge true creates it if missing
        await setDoc(ref, { bannedWords: arrayUnion(lower) }, { merge: true });
    },

    async removeBannedWord(word: string) {
        const lower = word.toLowerCase();
        this.bannedWords.delete(lower);
        await updateDoc(doc(db, 'moderation', 'settings'), {
            bannedWords: arrayRemove(lower)
        });
    }
};
