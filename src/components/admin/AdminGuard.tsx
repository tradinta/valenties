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
                // Not logged in - show 404
                setStatus('unauthorized');
                return;
            }

            try {
                // Check user profile for admin tier
                const profile = await UserService.getProfile(user.uid);

                if (profile?.tier === 'admin') {
                    setStatus('authorized');
                } else {
                    // Non-admin - show 404
                    setStatus('unauthorized');
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setStatus('unauthorized');
            }
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
