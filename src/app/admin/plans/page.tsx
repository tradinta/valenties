"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminService, CURRENCY_SYMBOLS } from '@/services/AdminService';
import { AdminSettings, PaystackCurrency, PlanConfig, PlanPricing } from '@/types/shared';
import { Loader2, Save, AlertTriangle, Globe, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CURRENCIES: PaystackCurrency[] = ['USD', 'KES', 'NGN', 'GHS', 'ZAR'];

export default function AdminPlansPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const [settings, setSettings] = useState<AdminSettings | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state - using a nested object to track edits before saving
    const [editedPlans, setEditedPlans] = useState<{
        starter: PlanConfig;
        casual: PlanConfig;
        premium: PlanConfig;
    } | null>(null);

    useEffect(() => {
        if (!isAdmin && !authLoading) return;
        loadSettings();
    }, [isAdmin, authLoading]);

    const loadSettings = async () => {
        const data = await AdminService.getSettings();
        if (data) {
            setSettings(data);
            setEditedPlans(JSON.parse(JSON.stringify(data.plans))); // Deep copy
        }
        setLoading(false);
    };

    const handlePriceChange = (plan: 'starter' | 'casual' | 'premium', currency: PaystackCurrency, value: string) => {
        if (!editedPlans) return;
        setEditedPlans({
            ...editedPlans,
            [plan]: {
                ...editedPlans[plan],
                price: {
                    ...editedPlans[plan].price,
                    [currency]: parseFloat(value) || 0
                }
            }
        });
    };

    const handlePlanCodeChange = (plan: 'casual' | 'premium', currency: PaystackCurrency, value: string) => {
        if (!editedPlans) return;
        setEditedPlans({
            ...editedPlans,
            [plan]: {
                ...editedPlans[plan],
                paystackPlanCodes: {
                    ...editedPlans[plan].paystackPlanCodes,
                    [currency]: value
                }
            }
        });
    };

    const handleSave = async () => {
        if (!editedPlans) return;
        setSaving(true);
        try {
            await Promise.all([
                AdminService.updatePlanConfig('starter', editedPlans.starter),
                AdminService.updatePlanConfig('casual', editedPlans.casual),
                AdminService.updatePlanConfig('premium', editedPlans.premium)
            ]);
            alert("Pricing updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save settings");
        }
        setSaving(false);
    };

    if (authLoading || loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-10 h-10" /></div>;

    if (!isAdmin) {
        return (
            <div className="flex flex-col h-screen items-center justify-center space-y-4">
                <AlertTriangle className="w-16 h-16 text-destructive" />
                <h1 className="text-2xl font-black">ACCESS DENIED</h1>
                <Link href="/"><Button>Go Home</Button></Link>
            </div>
        );
    }

    if (!editedPlans) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-32">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight">Plan Management</h1>
                        <p className="text-muted-foreground font-medium">Configure pricing and Paystack plan codes per currency</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/dashboard">
                            <Button variant="outline">Exit Admin</Button>
                        </Link>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-primary text-primary-foreground font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                        >
                            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            SAVE CHANGES
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Starter Plan */}
                    <PlanCard
                        title="Starter"
                        type="one-time"
                        color="bg-white"
                        config={editedPlans.starter}
                        onChange={(currency, val) => handlePriceChange('starter', currency, val)}
                        banner="10 Days Access"
                    />

                    {/* Casual Plan */}
                    <PlanCard
                        title="Casual"
                        type="subscription"
                        color="bg-blue-50"
                        config={editedPlans.casual}
                        onChange={(currency, val) => handlePriceChange('casual', currency, val)}
                        onCodeChange={(currency, val) => handlePlanCodeChange('casual', currency, val)}
                        banner="Monthly Sub"
                    />

                    {/* Premium Plan */}
                    <PlanCard
                        title="Premium"
                        type="subscription"
                        color="bg-amber-50"
                        config={editedPlans.premium}
                        onChange={(currency, val) => handlePriceChange('premium', currency, val)}
                        onCodeChange={(currency, val) => handlePlanCodeChange('premium', currency, val)}
                        banner="Monthly Sub"
                    />
                </div>
            </div>
        </div>
    );
}

interface PlanCardProps {
    title: string;
    type: 'one-time' | 'subscription';
    color: string;
    config: PlanConfig;
    onChange: (currency: PaystackCurrency, value: string) => void;
    onCodeChange?: (currency: PaystackCurrency, value: string) => void;
    banner: string;
}

function PlanCard({ title, type, color, config, onChange, onCodeChange, banner }: PlanCardProps) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`${color} p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0_0_#000] h-full flex flex-col`}
        >
            <div className="flex justify-between items-start mb-6 border-b-2 border-black/10 pb-4">
                <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                    {title}
                </h2>
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {banner}
                </span>
            </div>

            <div className="space-y-6 flex-1">
                <div className="space-y-4">
                    {(['USD'] as PaystackCurrency[]).map((curr) => (
                        <div key={curr} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">
                                    Price ({curr})
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                                        {CURRENCY_SYMBOLS[curr]}
                                    </span>
                                    <input
                                        type="number"
                                        value={config.price[curr] || ''}
                                        onChange={(e) => onChange(curr, e.target.value)}
                                        className="w-full pl-8 pr-4 py-2 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-bold"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            {type === 'subscription' && (
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">
                                        Plan Code ({curr})
                                    </label>
                                    <input
                                        type="text"
                                        value={config.paystackPlanCodes?.[curr] || ''}
                                        onChange={(e) => onCodeChange && onCodeChange(curr, e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl bg-background border-2 border-border focus:border-primary focus:outline-none font-medium text-sm"
                                        placeholder="PLN_..."
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
