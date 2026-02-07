"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInAnonymously, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (username: string) => Promise<void>;
    logout: () => Promise<void>;
    user: string | null; // The display username
    firebaseUser: FirebaseUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        // Restore custom username from local storage
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) {
            setUser(savedUser);
            setIsAdmin(savedUser === 'admin');
        }

        // Listen to Firebase Auth state
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setFirebaseUser(authUser);
                setIsLoggedIn(true);
            } else {
                setFirebaseUser(null);
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (username: string) => {
        try {
            await signInAnonymously(auth);
            setUser(username);
            setIsAdmin(username === 'admin');
            localStorage.setItem('user_session', username);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
            localStorage.removeItem('user_session');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user, isAdmin, firebaseUser }}>
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
