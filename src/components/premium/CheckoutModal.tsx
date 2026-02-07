"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    price: string;
    onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, planName, price, onSuccess }) => {
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

    const handlePay = () => {
        setStep('processing');
        // Mock API call
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess();
                onClose();
                setStep('details'); // Reset
            }, 2000);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-md rounded-[2rem] border-[4px] border-black shadow-[8px_8px_0_0_#000] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gray-50 border-b-2 border-black p-6 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-black uppercase text-gray-500 tracking-wider">Secure Checkout</span>
                        </div>
                        <button onClick={onClose}><X className="w-6 h-6 hover:scale-110 transition-transform" /></button>
                    </div>

                    <div className="p-8">
                        {step === 'details' && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black text-[#1a1817]">{planName}</h3>
                                    <div className="text-4xl font-black text-[#EC4899]">{price}</div>
                                </div>

                                {/* Mock Form */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase ml-1 text-gray-500">Card Number</label>
                                        <div className="relative">
                                            <input
                                                className="w-full bg-gray-50 border-2 border-black rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                                                placeholder="4242 4242 4242 4242"
                                                defaultValue=""
                                            />
                                            <CreditCard className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase ml-1 text-gray-500">Expiry</label>
                                            <input
                                                className="w-full bg-gray-50 border-2 border-black rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                                                placeholder="MM/YY"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase ml-1 text-gray-500">CVC</label>
                                            <input
                                                className="w-full bg-gray-50 border-2 border-black rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#EC4899]"
                                                placeholder="123"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePay}
                                    className="w-full py-6 text-lg font-black bg-[#1a1817] text-white rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.3)] transition-all"
                                >
                                    Pay {price}
                                </Button>
                                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-wider">
                                    Powered by MockStripe™
                                </p>
                            </div>
                        )}

                        {step === 'processing' && (
                            <div className="py-12 text-center space-y-6">
                                <Loader2 className="w-16 h-16 animate-spin mx-auto text-[#EC4899]" />
                                <h3 className="text-xl font-bold">Processing...</h3>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="py-12 text-center space-y-6 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto border-[3px] border-black">
                                    <Check className="w-10 h-10 text-green-600" strokeWidth={4} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black">Success!</h3>
                                    <p className="text-gray-500 font-medium">You're officially a legend.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
