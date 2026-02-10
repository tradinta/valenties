"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    signInAnonymously,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserService } from '@/services/UserService';
import { UserTier, UserSubscription } from '@/types/shared';

interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean;
    loading: boolean;
    loginAnonymous: (displayName?: string) => Promise<any>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    firebaseUser: FirebaseUser | null;
    userTier: UserTier;
    subscription: UserSubscription | null;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [userTier, setUserTier] = useState<UserTier>('anonymous');
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);

    // Load user profile and compute effective tier
    const loadUserProfile = useCallback(async (uid: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const isAdminUser = userData?.role === 'admin' || userData?.tier === 'admin';
                setIsAdmin(isAdminUser);

                // Compute effective tier: check if subscription is still valid
                let effectiveTier: UserTier = userData?.tier || 'free';
                const sub = userData?.subscription as UserSubscription | undefined;

                if (sub) {
                    setSubscription(sub);

                    // For one-time plans (starter), check expiry
                    if (sub.expiresAt && Date.now() > sub.expiresAt) {
                        // Subscription expired — downgrade to free
                        effectiveTier = 'free';
                        await UserService.updateTier(uid, 'free');
                        await UserService.updateSubscriptionStatus(uid, 'expired');
                    } else if (sub.status === 'active' || sub.status === 'non-renewing') {
                        effectiveTier = sub.planId;
                    } else if (sub.status === 'cancelled' || sub.status === 'expired') {
                        effectiveTier = 'free';
                    }
                } else {
                    setSubscription(null);
                }

                if (isAdminUser) effectiveTier = 'admin';
                setUserTier(effectiveTier);
            } else {
                setIsAdmin(false);
                setUserTier('free');
                setSubscription(null);
            }
        } catch {
            setIsAdmin(false);
            setUserTier('free');
            setSubscription(null);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        if (firebaseUser) {
            await loadUserProfile(firebaseUser.uid);
        }
    }, [firebaseUser, loadUserProfile]);

    useEffect(() => {
        let unsubProfile: (() => void) | null = null;

        const unsubAuth = onAuthStateChanged(auth, async (authUser) => {
            // Clean up previous profile listener
            if (unsubProfile) {
                unsubProfile();
                unsubProfile = null;
            }

            if (authUser) {
                setFirebaseUser(authUser);
                setIsLoggedIn(true);
                await loadUserProfile(authUser.uid);

                // Real-time listener for tier/subscription changes (e.g., after payment webhook)
                unsubProfile = onSnapshot(doc(db, 'users', authUser.uid), (snap) => {
                    if (snap.exists()) {
                        const data = snap.data();
                        const sub = data?.subscription as UserSubscription | undefined;
                        let tier: UserTier = data?.tier || 'free';

                        if (data?.role === 'admin' || tier === 'admin') {
                            setIsAdmin(true);
                            tier = 'admin';
                        }

                        if (sub) {
                            setSubscription(sub);
                            if (sub.expiresAt && Date.now() > sub.expiresAt) {
                                tier = 'free';
                            } else if (sub.status === 'active' || sub.status === 'non-renewing') {
                                tier = sub.planId;
                            }
                        }

                        if (data?.role === 'admin') tier = 'admin';
                        setUserTier(tier);
                    }
                });
            } else {
                setFirebaseUser(null);
                setIsLoggedIn(false);
                setIsAdmin(false);
                setUserTier('anonymous');
                setSubscription(null);
            }
            setLoading(false);
        });

        return () => {
            unsubAuth();
            if (unsubProfile) unsubProfile();
        };
    }, [loadUserProfile]);

    const loginAnonymous = async (displayName?: string) => {
        try {
            const result = await signInAnonymously(auth);
            if (displayName && result.user) {
                await updateProfile(result.user, { displayName });
                await UserService.initializeProfile(
                    result.user.uid,
                    'anonymous',
                    undefined,
                    undefined,
                    displayName
                );
            }
            return result;
        } catch (error) {
            throw new Error('Anonymous login failed');
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            if (result.user) {
                const profile = await UserService.getProfile(result.user.uid);
                if (!profile) {
                    await UserService.initializeProfile(
                        result.user.uid,
                        'free',
                        undefined,
                        email,
                        result.user.displayName || undefined
                    );
                }
            }
        } catch (error) {
            throw new Error('Email login failed. Check your credentials.');
        }
    };

    const signupWithEmail = async (email: string, password: string, displayName: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            if (result.user) {
                await updateProfile(result.user, { displayName });
                await UserService.initializeProfile(
                    result.user.uid,
                    'free',
                    undefined,
                    email,
                    displayName
                );
            }
        } catch (error) {
            throw new Error('Signup failed. Email may already be in use.');
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw new Error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            isAdmin,
            loading,
            loginAnonymous,
            loginWithEmail,
            signupWithEmail,
            logout,
            firebaseUser,
            userTier,
            subscription,
            refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
