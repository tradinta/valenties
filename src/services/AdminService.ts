import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, getDocs, collection, query, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { AdminSettings, AdminUser, AdminTrap, PlanConfig, PlanPricing, PaystackCurrency } from '@/types/shared';

const SETTINGS_DOC_ID = 'global_settings';

// Default plan configuration
const DEFAULT_SETTINGS: AdminSettings = {
    plans: {
        starter: {
            price: { USD: 3, KES: 450, NGN: 4500, GHS: 45, ZAR: 55 },
            active: true,
            type: 'one-time',
            durationDays: 10,
        },
        casual: {
            price: { USD: 2, KES: 300, NGN: 3000, GHS: 30, ZAR: 37 },
            active: true,
            type: 'subscription',
            interval: 'monthly',
            paystackPlanCodes: {},
        },
        premium: {
            price: { USD: 4, KES: 600, NGN: 6000, GHS: 60, ZAR: 74 },
            active: true,
            type: 'subscription',
            interval: 'monthly',
            paystackPlanCodes: {},
        },
    },
    maintenanceMode: false,
};

// Currency symbols for display
export const CURRENCY_SYMBOLS: Record<PaystackCurrency, string> = {
    USD: '$',
    KES: 'KSh',
    NGN: '₦',
    GHS: 'GH₵',
    ZAR: 'R',
};

// Map country codes to Paystack currencies
export const COUNTRY_TO_CURRENCY: Record<string, PaystackCurrency> = {
    KE: 'KES',
    NG: 'NGN',
    GH: 'GHS',
    ZA: 'ZAR',
    // Everything else defaults to USD
};

export const getCurrencyForCountry = (countryCode: string): PaystackCurrency => {
    return COUNTRY_TO_CURRENCY[countryCode] || 'USD';
};

export const AdminService = {
    async getSettings(): Promise<AdminSettings> {
        try {
            const docRef = doc(db, 'admin_settings', SETTINGS_DOC_ID);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const data = snapshot.data() as Partial<AdminSettings>;
                // Merge with defaults to ensure all fields exist
                return {
                    ...DEFAULT_SETTINGS,
                    ...data,
                    plans: {
                        starter: { ...DEFAULT_SETTINGS.plans.starter, ...data.plans?.starter },
                        casual: { ...DEFAULT_SETTINGS.plans.casual, ...data.plans?.casual },
                        premium: { ...DEFAULT_SETTINGS.plans.premium, ...data.plans?.premium },
                    },
                };
            }
            return DEFAULT_SETTINGS;
        } catch (error) {
            console.error("Error fetching admin settings:", error);
            return DEFAULT_SETTINGS;
        }
    },

    async updatePlanPrice(plan: 'starter' | 'casual' | 'premium', pricing: PlanPricing): Promise<void> {
        const docRef = doc(db, 'admin_settings', SETTINGS_DOC_ID);
        await setDoc(docRef, {
            plans: {
                [plan]: { price: pricing }
            }
        }, { merge: true });
    },

    async updatePlanConfig(plan: 'starter' | 'casual' | 'premium', config: Partial<PlanConfig>): Promise<void> {
        const docRef = doc(db, 'admin_settings', SETTINGS_DOC_ID);
        await setDoc(docRef, {
            plans: {
                [plan]: config
            }
        }, { merge: true });
    },

    async updatePaystackPlanCode(plan: 'starter' | 'casual' | 'premium', currency: PaystackCurrency, planCode: string): Promise<void> {
        const docRef = doc(db, 'admin_settings', SETTINGS_DOC_ID);
        await setDoc(docRef, {
            plans: {
                [plan]: {
                    paystackPlanCodes: {
                        [currency]: planCode
                    }
                }
            }
        }, { merge: true });
    },

    async toggleMaintenance(active: boolean): Promise<void> {
        const docRef = doc(db, 'admin_settings', SETTINGS_DOC_ID);
        await setDoc(docRef, { maintenanceMode: active }, { merge: true });
    },

    // --- User Management ---
    async getAllUsers(): Promise<AdminUser[]> {
        try {
            const snapshot = await getDocs(collection(db, 'users'));
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data
                } as AdminUser;
            });
        } catch (error) {
            console.error("Error fetching all users:", error);
            return [];
        }
    },

    // --- Content Management ---
    async getAllTraps(): Promise<AdminTrap[]> {
        try {
            const snapshot = await getDocs(query(collection(db, 'traps'), orderBy('createdAt', 'desc'), limit(100)));
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    creatorName: data.creatorName || 'Unknown Creator',
                    creatorId: data.creatorId || 'unknown',
                    createdAt: data.createdAt?.seconds ? data.createdAt.seconds * 1000 : (data.createdAt || Date.now())
                } as AdminTrap;
            });
        } catch (error) {
            console.error("Error fetching traps:", error);
            return [];
        }
    },

    async deleteTrap(trapId: string) {
        try {
            await deleteDoc(doc(db, 'traps', trapId));
        } catch (error) {
            console.error("Error deleting trap:", error);
            throw error;
        }
    }
};
