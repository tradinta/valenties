"use client";

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { TrapService } from '@/services/TrapService';
import { PollService } from '@/services/PollService';
import { DecisionService } from '@/services/DecisionService';
import { TrapWithId, PollWithId, DecisionWithId } from '@/types/shared';
import { UnifiedDashboard } from '@/components/dashboard/UnifiedDashboard';
import { useTheme } from '@/context/ThemeContext';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState<User | null>(null);
    const [traps, setTraps] = useState<TrapWithId[]>([]);
    const [polls, setPolls] = useState<PollWithId[]>([]);
    const [decisions, setDecisions] = useState<DecisionWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push('/login');
                return;
            }
            setUser(currentUser);

            try {
                // Use services instead of raw Firestore calls
                const [fetchedTraps, fetchedPolls, fetchedDecisions] = await Promise.all([
                    TrapService.getByCreator(currentUser.uid),
                    PollService.getByCreator(currentUser.uid),
                    DecisionService.getByCreator(currentUser.uid)
                ]);
                setTraps(fetchedTraps);
                setPolls(fetchedPolls);
                setDecisions(fetchedDecisions);
            } catch (error) {
                // Production: Use proper error logging service
                if (process.env.NODE_ENV === 'development') {
                    console.error("Error fetching data:", error);
                }
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

    if (loading) return <FullPageLoader text="Loading your dashboard..." />;

    return (
        <UnifiedDashboard
            user={user}
            traps={traps}
            polls={polls}
            decisions={decisions}
            onLogout={handleLogout}
        />
    );
}
