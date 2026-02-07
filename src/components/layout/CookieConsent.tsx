"use client";

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consented = localStorage.getItem('cookie_consent');
        if (!consented) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 right-4 z-[100] max-w-sm w-full"
                >
                    <div className="bg-white border-[3px] border-black p-4 rounded-xl shadow-[6px_6px_0_0_#000] relative overflow-hidden">

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-black"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 bg-[#BC9F8B]/20 border-2 border-[#BC9F8B] rounded-lg flex items-center justify-center text-[#BC9F8B]">
                                <Cookie size={20} />
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-black text-sm uppercase">We use cookies</h4>
                                    <p className="text-xs font-bold text-gray-500 leading-relaxed mt-1">
                                        Just to count how many people say "Yes" and ensure the traps work. No creepy tracking.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAccept}
                                        className="bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        That's fine
                                    </button>
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Nah
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
