import React from 'react';
import { Button } from '@/components/ui/button';
import { TrapConfig } from '@/types';
import { MultiImageUploader } from '@/components/creation/MultiImageUploader';

interface MediaStepProps {
    config: Partial<TrapConfig>;
    updateConfig: (data: Partial<TrapConfig>) => void;
    onNext: () => void;
    onBack: () => void;
}

export const MediaStep: React.FC<MediaStepProps> = ({ config, updateConfig, onNext, onBack }) => {

    const handleImagesUpdate = (urls: string[]) => {
        updateConfig({
            assets: {
                ...config.assets,
                images: urls,
                image: urls[0] || undefined // Sync first image as main for legacy support
            }
        });
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold text-rose-950">Memories</h2>
                <p className="text-rose-800/60">Add up to 4 photos to float around your question.</p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
                <div className="bg-white/40 p-6 rounded-3xl border border-white/50 shadow-xl backdrop-blur-sm">
                    <MultiImageUploader
                        images={config.assets?.images || (config.assets?.image ? [config.assets.image] : [])}
                        onImagesChange={handleImagesUpdate}
                        maxImages={4}
                    />
                </div>

                {(config.assets?.images?.length || 0) > 0 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 bg-white/30 p-4 rounded-xl border border-white/40">
                        <label className="text-xs font-bold text-rose-900 uppercase tracking-wider block mb-2">Caption (Optional)</label>
                        <input
                            className="w-full bg-white/60 border border-pink-100 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-rose-300/70 text-rose-900"
                            placeholder="Do you remember this day?"
                        />
                    </div>
                )}
            </div>

            {/* Sticky Mobile Footer for Nav */}
            <div className="sticky bottom-0 left-0 right-0 bg-[var(--card)]/90 backdrop-blur-sm p-4 -m-4 mt-4 border-t-2 border-black/10 flex justify-between items-center z-20 rounded-b-3xl">
                <Button variant="ghost" onClick={onBack} className="text-black dark:text-white font-bold hover:bg-black/10 dark:hover:bg-white/10">Back</Button>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={onNext} className="text-gray-500 hover:text-black font-bold">Skip</Button>
                    <Button
                        onClick={onNext}
                        className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-8 py-4 text-lg rounded-full border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 active:shadow-[2px_2px_0_0_#000] active:translate-y-[1px] transition-all font-display"
                    >
                        Next: Security
                    </Button>
                </div>
            </div>
        </div>
    );
};
