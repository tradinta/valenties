"use client";

import React, { useState } from 'react';
import { Coffee, Heart } from 'lucide-react';
import { CheckoutModal } from '@/components/premium/CheckoutModal';

export default function DonatePage() {
    const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
    const [customAmount, setCustomAmount] = useState('');

    const amounts = ["$5", "$10", "$25", "Custom"];

    const handleConfirm = () => {
        if (!selectedAmount && !customAmount) return;
        // Trigger checkout
    };

    return (
        <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4 flex flex-col items-center">
            <div className="max-w-xl w-full text-center space-y-10">

                <div className="space-y-6">
                    <div className="w-24 h-24 bg-[#FFD166] border-[4px] border-black rounded-full flex items-center justify-center mx-auto shadow-[6px_6px_0_0_#000]">
                        <Coffee className="w-10 h-10 text-black" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1a1817]">Fuel the Chaos</h1>
                    <p className="text-xl font-bold text-gray-500">
                        Built by one tired developer fueled by caffeine and spite. Help keep the servers running?
                    </p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border-[4px] border-black shadow-[8px_8px_0_0_#000]">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {amounts.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => {
                                    setSelectedAmount(amount);
                                    if (amount !== "Custom") setCustomAmount('');
                                }}
                                className={`py-4 rounded-xl font-black text-xl border-[3px] transition-all ${selectedAmount === amount
                                        ? 'bg-[#1a1817] text-white border-[#1a1817] scale-105 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]'
                                        : 'bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black'
                                    }`}
                            >
                                {amount}
                            </button>
                        ))}
                    </div>

                    {selectedAmount === 'Custom' && (
                        <div className="mb-8 animate-in fade-in slide-in-from-top-2">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">$</span>
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 border-2 border-black rounded-xl pl-10 pr-4 py-4 text-2xl font-black focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
                                    placeholder="5000"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    <button
                        disabled={!selectedAmount && !customAmount}
                        onClick={() => setSelectedAmount(prev => prev)} // Placeholder for opening modal
                        className="w-full py-5 rounded-xl bg-[#FFD166] text-black text-xl font-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                        <Heart className="w-5 h-5 fill-black" />
                        Send Love ({selectedAmount === 'Custom' ? `$${customAmount || '0'}` : selectedAmount || '$0'})
                    </button>

                    <p className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Securely processed by Stripe
                    </p>
                </div>

            </div>

            {/* Reuse modal logic here if needed, or keeping simple for now */}
        </div>
    );
}
