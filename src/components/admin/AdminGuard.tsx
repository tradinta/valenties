"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserService } from '@/services/UserService';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';

interface AdminGuardProps {
    children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            if (!user) {
                setStatus('unauthorized');
                return;
            }

            // Real-time listener for instant access revocation
            const { doc, onSnapshot } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase');

            const profileRef = doc(db, 'users', user.uid);

            // Listen to profile changes
            const unsubscribeProfile = onSnapshot(profileRef, (doc) => {
                const data = doc.data();
                // Check tier - explicitly strictly equal to 'admin'
                if (data?.tier === 'admin') {
                    setStatus('authorized');
                } else {
                    // Instant kick if demoted
                    setStatus('unauthorized');
                }
            }, (error) => {
                console.error("Admin guard error:", error);
                setStatus('unauthorized');
            });

            return () => unsubscribeProfile();
        });

        return () => unsubscribe();
    }, []);

    if (status === 'loading') {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F0F2F5]">
                <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
            </div>
        );
    }

    if (status === 'unauthorized') {
        // Use Next.js notFound to show 404 page
        notFound();
    }

    return <>{children}</>;
};
