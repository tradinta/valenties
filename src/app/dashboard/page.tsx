"use client";

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { TrapConfig, TrapStats } from '@/types';
import { Loader2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

import { CosmosDashboard } from '@/components/dashboard/CosmosDashboard';
import { NeoBrutalDashboard } from '@/components/dashboard/NeoBrutalDashboard';
import { useTheme } from '@/context/ThemeContext';

interface TrapWithId extends TrapConfig {
    id: string;
    stats?: TrapStats;
}



// ... imports

export default function DashboardPage() {
    const { theme, toggleTheme } = useTheme(); // Use Global Theme
    const [user, setUser] = useState<User | null>(null);
    const [traps, setTraps] = useState<TrapWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Auth check logic only
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push('/login');
                return;
            }
            setUser(currentUser);

            try {
                const q = query(
                    collection(db, "traps"),
                    where("creatorId", "==", currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                const fetchedTraps: TrapWithId[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedTraps.push({ id: doc.id, ...doc.data() } as TrapWithId);
                });
                setTraps(fetchedTraps);
            } catch (error) {
                console.error("Error fetching traps:", error);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#FFFBF5]">
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Heart className="w-16 h-16 text-[#FF9EB5] fill-[#FF9EB5]" />
            </motion.div>
        </div>
    );

    return (
        <>
            {theme === 'cosmos' ? (
                <CosmosDashboard
                    user={user}
                    traps={traps}
                    onLogout={handleLogout}
                    onSwitchTheme={toggleTheme}
                />
            ) : (
                <NeoBrutalDashboard
                    user={user}
                    traps={traps}
                    onLogout={handleLogout}
                    onSwitchTheme={toggleTheme}
                />
            )}
        </>
    );
}
