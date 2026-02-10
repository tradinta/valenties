"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Loader2, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function PremiumCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { refreshProfile, userTier } = useAuth();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    useEffect(() => {
        const verify = async () => {
            if (!reference) {
                setStatus('failed');
                return;
            }

            try {
                // Verify the transaction with Paystack
                const res = await fetch(`/api/paystack/verify?reference=${reference}`);
                const data = await res.json();

                if (data.status === 'success') {
                    // Refresh the user profile to pick up the new tier
                    await refreshProfile();
                    setStatus('success');
                } else {
                    setStatus('failed');
                }
            } catch {
                setStatus('failed');
            }
        };

        verify();
    }, [reference, refreshProfile]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card border-[3px] border-border rounded-[2rem] shadow-[var(--shadow-brutal-lg)] p-10 max-w-md w-full text-center"
            >
                {status === 'verifying' && (
                    <div className="space-y-4">
                        <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                        <h2 className="text-2xl font-black text-foreground">Verifying Payment...</h2>
                        <p className="text-muted-foreground font-medium">Hang tight, confirming your upgrade.</p>
                    </div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto border-[3px] border-green-500">
                            <Check className="w-10 h-10 text-green-600" strokeWidth={4} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-foreground">Welcome to {userTier}! 🎉</h2>
                            <p className="text-muted-foreground font-medium mt-2">
                                Your account has been upgraded. All premium features are now unlocked.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Link href="/dashboard">
                                <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-[var(--shadow-brutal)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                    Go to Dashboard <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link href="/tools/trap">
                                <button className="w-full py-3 rounded-xl bg-card border-2 border-border text-foreground font-bold hover:border-primary transition-colors">
                                    Create a Trap
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {status === 'failed' && (
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto border-[3px] border-red-500">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-foreground">Payment Failed</h2>
                            <p className="text-muted-foreground font-medium mt-2">
                                Something went wrong. Your card was not charged.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Link href="/premium">
                                <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black shadow-[var(--shadow-brutal)] hover:opacity-90 transition-opacity">
                                    Try Again
                                </button>
                            </Link>
                            <Link href="/">
                                <button className="w-full py-3 rounded-xl bg-card border-2 border-border text-foreground font-bold hover:border-primary transition-colors">
                                    Go Home
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
