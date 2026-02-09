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
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean;
    loading: boolean;
    loginAnonymous: (displayName?: string) => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    signupWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    firebaseUser: FirebaseUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

    // Check admin status from Firestore (server-side source of truth)
    const checkAdminStatus = useCallback(async (user: FirebaseUser) => {
        try {
            // Check for admin role in Firestore users collection
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setIsAdmin(userData?.role === 'admin');
            } else {
                setIsAdmin(false);
            }
        } catch {
            // Default to non-admin on error
            setIsAdmin(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setFirebaseUser(authUser);
                setIsLoggedIn(true);
                await checkAdminStatus(authUser);
            } else {
                setFirebaseUser(null);
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [checkAdminStatus]);

    const loginAnonymous = async (displayName?: string) => {
        try {
            const result = await signInAnonymously(auth);
            if (displayName && result.user) {
                await updateProfile(result.user, { displayName });
            }
        } catch (error) {
            throw new Error('Anonymous login failed');
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            throw new Error('Email login failed. Check your credentials.');
        }
    };

    const signupWithEmail = async (email: string, password: string, displayName: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            if (result.user) {
                await updateProfile(result.user, { displayName });
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
            firebaseUser
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
