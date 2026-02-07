"use client";

import React from 'react';
import { MechanicDispatcher } from '../trap-engine/MechanicDispatcher';
import { YesButton } from '../trap-engine/YesButton';
// import { Card } from '../ui/card';

interface LivePreviewProps {
    config: {
        message: string;
        theme: string;
        imageUrl?: string;
        noMechanic: string;
        yesMechanic: string;
        difficulty: 'easy' | 'medium' | 'hard' | 'impossible';
    };
}

export const LivePreview: React.FC<LivePreviewProps> = ({ config }) => {
    return (
        <div className={`relative w-full aspect-video rounded-xl border-4 border-pink-200 overflow-hidden shadow-inner bg-background transition-colors duration-500 ${config.theme}`}>

            {/* Background (Simplified) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">

                {/* Image Preview */}
                {config.imageUrl ? (
                    <img
                        src={config.imageUrl}
                        alt="Us"
                        className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg mb-4"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-pink-100 border-4 border-white shadow-lg mb-4 flex items-center justify-center text-3xl">
                        📸
                    </div>
                )}

                {/* Message */}
                <h2 className="text-xl md:text-2xl font-bold text-center text-primary mb-8 px-4 font-script">
                    {config.message || "Your Question Here..."}
                </h2>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full z-10">
                    <YesButton onSuccess={() => { }} />

                    <div className="relative w-32 h-16 flex items-center justify-center">
                        <MechanicDispatcher
                            mechanic={config.noMechanic}
                            difficulty={config.difficulty}
                            onAttempt={() => { }}
                        />
                    </div>
                </div>

            </div>

            {/* Label */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
                Live Preview
            </div>
        </div>
    );
};
