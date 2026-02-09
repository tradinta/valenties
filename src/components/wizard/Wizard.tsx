"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrapConfig } from '@/types';
import { NeoBrutalBackground } from '@/components/ui/NeoBrutalBackground';
import { IntroStep } from './steps/IntroStep';
import { BasicsStep } from './steps/BasicsStep';
// ChallengeStep removed - to be re-added later
import { MechanicsStep } from './steps/MechanicsStep';
import { MediaStep } from './steps/MediaStep';
import { SecurityStep } from './steps/SecurityStep';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export const Wizard = () => {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState<Partial<TrapConfig>>({
        theme: 'cupid',
        difficulty: 'medium',
        noMechanic: 'run-away',
        yesMechanic: 'simple',
        chaosMode: 'none',
        message: 'Will you be my Valentine?',
        security: undefined // Explicitly undefined initially
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const updateConfig = (data: Partial<TrapConfig>) => {
        setConfig(prev => ({ ...prev, ...data }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const user = auth.currentUser;

            // Sanitize config to remove undefined values (Firestore rejects undefined)
            const cleanConfig = JSON.parse(JSON.stringify(config));

            const docRef = await addDoc(collection(db, "traps"), {
                ...cleanConfig,
                creatorId: user ? user.uid : null,
                createdAt: Date.now(),
                status: 'active',
                stats: { attempts: 0, hovers: 0, timeToYes: 0 }
            });
            router.push(`/created/${docRef.id}`);
        } catch (error) {
            console.error("Error creating trap:", error);
            alert("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 0: return <IntroStep onNext={nextStep} />;
            case 1: return <BasicsStep config={config} updateConfig={updateConfig} onNext={nextStep} onBack={prevStep} />;
            // ChallengeStep removed (theme/labels) - will be re-added later
            case 2: return <MechanicsStep config={config} updateConfig={updateConfig} onNext={nextStep} onBack={prevStep} />;
            case 3: return <SecurityStep config={config} updateConfig={updateConfig} onSubmit={handleSubmit} onBack={prevStep} isSubmitting={isLoading} />;
            default: return <div>Step {step} Coming Soon</div>;
        }
    };

    return (
        <NeoBrutalBackground>
            <div className="flex-1 flex items-center justify-center p-4 pt-24 md:pt-32">
                <div className="w-full max-w-4xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="bg-[var(--card)] border-[3px] border-black rounded-3xl p-8 md:p-12 shadow-[8px_8px_0_0_#000] relative overflow-hidden"
                        >
                            {/* Corner Decoration */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)] rounded-bl-[50px] border-l-[3px] border-b-[3px] border-black -z-0" />

                            {/* Progress Indicator */}
                            <div className="absolute top-6 right-8 z-10 font-display text-xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                                Step {step} / 3
                            </div>

                            <div className="relative z-10">
                                {renderStep()}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </NeoBrutalBackground>
    );
};
