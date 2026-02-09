import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { AdminSettings } from '@/types/shared';

const SETTINGS_DOC_ID = 'global_settings';

export const AdminService = {
    async getSettings(): Promise<AdminSettings | null> {
        try {
            const docRef = doc(db, 'admin_settings', SETTINGS_DOC_ID);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                return snapshot.data() as AdminSettings;
            }
            // Return defaults if not set
            return {
                plans: {
                    casual: { price: 4.99, active: true },
                    premium: { price: 9.99, active: true },
                },
                maintenanceMode: false,
            };
        } catch (error) {
            console.error("Error fetching admin settings:", error);
            return null;
        }
    },

    async updatePlanPrice(plan: 'casual' | 'premium', price: number): Promise<void> {
        const docRef = doc(db, 'admin_settings', SETTINGS_DOC_ID);
        // We use set with merge in case the doc doesn't exist yet
        await setDoc(docRef, {
            plans: {
                [plan]: { price }
            }
        }, { merge: true });
    },

    async toggleMaintenance(active: boolean): Promise<void> {
        const docRef = doc(db, 'admin_settings', SETTINGS_DOC_ID);
        await setDoc(docRef, { maintenanceMode: active }, { merge: true });
    }
};
