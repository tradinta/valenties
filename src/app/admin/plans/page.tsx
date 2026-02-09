"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminService } from '@/services/AdminService';
import { AdminSettings } from '@/types/shared';
import { Loader2, DollarSign, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminPlansPage() {
    const { isAdmin, loading } = useAuth();
    const [settings, setSettings] = useState<AdminSettings | null>(null);
    const [saving, setSaving] = useState(false);
    const [casualPrice, setCasualPrice] = useState('4.99');
    const [premiumPrice, setPremiumPrice] = useState('9.99');

    useEffect(() => {
        if (!isAdmin) return;
        loadSettings();
    }, [isAdmin]);

    const loadSettings = async () => {
        const data = await AdminService.getSettings();
        if (data) {
            setSettings(data);
            setCasualPrice(data.plans.casual.price.toString());
            setPremiumPrice(data.plans.premium.price.toString());
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await Promise.all([
                AdminService.updatePlanPrice('casual', parseFloat(casualPrice)),
                AdminService.updatePlanPrice('premium', parseFloat(premiumPrice))
            ]);
            alert("Pricing updated!");
        } catch (error) {
            alert("Failed to save settings");
        }
        setSaving(false);
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    if (!isAdmin) {
        return (
            <div className="flex flex-col h-screen items-center justify-center space-y-4">
                <AlertTriangle className="w-16 h-16 text-red-500" />
                <h1 className="text-2xl font-black">ACCESS DENIED</h1>
                <Link href="/"><Button>Go Home</Button></Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black uppercase">Plan Management</h1>
                    <Link href="/">
                        <Button variant="outline">Exit Admin</Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Casual Plan */}
                    <div className="bg-white p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0_0_#000]">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-black uppercase">Casual Plan</h2>
                            <span className="bg-[#A7F3D0] px-3 py-1 rounded-full text-xs font-bold border-2 border-black">ACTIVE</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold text-sm mb-2">Price (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={casualPrice}
                                        onChange={(e) => setCasualPrice(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#A7F3D0]"
                                    />
                                </div>
                                {parseFloat(casualPrice) === 0 && (
                                    <p className="text-xs font-bold text-blue-600 mt-2">
                                        * Setting price to 0 enables "Tips Mode" (Free with donation prompt)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-white p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0_0_#000]">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-black uppercase text-[#FF0040]">Premium Plan</h2>
                            <span className="bg-[#FFD166] px-3 py-1 rounded-full text-xs font-bold border-2 border-black">active</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold text-sm mb-2">Price (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={premiumPrice}
                                        onChange={(e) => setPremiumPrice(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-[#FFD166]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black text-white font-black text-xl py-6 px-10 rounded-2xl hover:scale-105 transition-transform"
                    >
                        {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                        SAVE CHANGES
                    </Button>
                </div>
            </div>
        </div>
    );
}
