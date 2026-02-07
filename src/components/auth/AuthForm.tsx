"use client";

import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { formatVirtualEmail, isValidUsername } from '@/lib/auth-utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isValidUsername(username)) {
            setError("Username must be at least 3 letters/numbers.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        const email = formatVirtualEmail(username);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(cred.user, { displayName: username });
            }
            // Redirect to dashboard on success
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("That username is taken. Try another.");
            } else if (err.code === 'auth/invalid-credential') {
                setError("Wrong username or password.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
            <div className="text-center mb-8">
                <h2 className="text-5xl font-display text-rose-950 mb-2">
                    {isLogin ? "Welcome Back" : "Join the Trap"}
                </h2>
                <p className="text-rose-800/60 text-sm mt-2">
                    {isLogin ? "Manage your traps and view stats." : "Create an account to save your traps."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-rose-900 uppercase tracking-wider">Username</label>
                    <input
                        type="text"
                        className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400 transition-all"
                        placeholder="cupid123"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-rose-900 uppercase tracking-wider">Password</label>
                    <input
                        type="password"
                        className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400 transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-6 rounded-xl text-lg font-bold shadow-lg shadow-rose-200 overflow-hidden relative"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Login" : "Sign Up")}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setError(""); }}
                    className="text-sm text-rose-500 hover:text-rose-700 font-medium hover:underline transition-colors"
                >
                    {isLogin ? "Need an account? Create one" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
};
