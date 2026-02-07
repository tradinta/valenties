"use client";

import React, { useState } from 'react';
import { Check, Crown, Zap, BarChart3, Infinity } from 'lucide-react';
import { CheckoutModal } from '@/components/premium/CheckoutModal';

const features = [
    { text: "Unlimited Traps", free: true, premium: true },
    { text: "Basic Analytics (Views/No's)", free: true, premium: true },
    { text: "Custom Themes", free: true, premium: true },
    { text: "Priority Support", free: false, premium: true },
    { text: "Advanced Analytics (Device/Loc)", free: false, premium: true },
    { text: "Remove Branding", free: false, premium: true },
    { text: "Early Access to New Mechanics", free: false, premium: true },
];

export default function PremiumPage() {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto space-y-12">

                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD700] border-[3px] border-black rounded-full font-black uppercase text-sm shadow-[4px_4px_0_0_#000]">
                        <Crown className="w-4 h-4" />
                        Beta Pricing
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-[#1a1817]">
                        Go <span className="text-[#FF0040] underline decoration-wavy">Legendary</span>
                    </h1>
                    <p className="text-xl font-bold text-gray-500">Support the chaos. Get the stats. Remove the logo.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">

                    {/* Free Tier */}
                    <div className="bg-white p-8 rounded-[2rem] border-[4px] border-gray-200 text-gray-400 hover:border-gray-300 transition-colors">
                        <h3 className="text-2xl font-black mb-2 text-gray-600">The Casual</h3>
                        <div className="text-5xl font-black text-[#1a1817] mb-6">$0<span className="text-lg font-bold text-gray-400">/forever</span></div>
                        <ul className="space-y-4 mb-8">
                            {features.map((f, i) => (
                                <li key={i} className={`flex items-center gap-3 font-bold ${f.free ? 'text-[#1a1817]' : 'text-gray-200 line-through'}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${f.free ? 'bg-gray-200 text-black' : 'bg-gray-100 text-gray-300'}`}>
                                        {f.free ? <Check size={12} strokeWidth={4} /> : <X size={12} />}
                                    </div>
                                    {f.text}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 font-bold text-gray-400 cursor-default">
                            Current Plan
                        </button>
                    </div>

                    {/* Premium Tier */}
                    <div className="relative bg-[#1a1817] text-white p-8 rounded-[2rem] border-[4px] border-black shadow-[12px_12px_0_0_#FF0040] scale-105 transform">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FF0040] text-white px-6 py-2 rounded-xl border-[3px] border-black font-black uppercase tracking-wider shadow-[4px_4px_0_0_#000] rotate-2">
                            Best Value
                        </div>

                        <h3 className="text-2xl font-black mb-2 text-[#FF0040]">The Heartbreaker</h3>
                        <div className="text-5xl font-black mb-2">$5<span className="text-lg font-bold text-gray-400">/mo</span></div>
                        <p className="text-gray-400 font-medium mb-8 text-sm">Less than a latte. Way more effective than flowers.</p>

                        <ul className="space-y-4 mb-8">
                            {features.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 font-bold">
                                    <div className="w-5 h-5 rounded-full bg-[#FF0040] text-white flex items-center justify-center">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    {f.text}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            className="w-full py-5 rounded-xl bg-[#FF0040] text-white text-xl font-black border-[3px] border-white shadow-[0_0_20px_rgba(255,0,64,0.4)] hover:scale-105 active:scale-95 transition-all"
                        >
                            Upgrade Now
                        </button>
                    </div>

                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                planName="The Heartbreaker"
                price="$5.00"
                onSuccess={() => alert("Welcome to the club!")}
            />
        </div>
    );
}

// Helper X icon since it was missing in imports for the Free list logic
const X = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);
