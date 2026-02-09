"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/cloudinary';
import { Loader2, UploadCloud, X, Image as ImageIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MultiImageUploaderProps {
    images: string[];
    onImagesChange: (urls: string[]) => void;
    maxImages?: number;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ images = [], onImagesChange, maxImages = 4 }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Check limits
        if (images.length + files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images.`);
            return;
        }

        setUploading(true);
        const newUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate size (6MB)
                if (file.size > 6 * 1024 * 1024) {
                    alert(`File ${file.name} exceeds the 6MB limit.`);
                    continue;
                }

                const url = await uploadImage(file);
                if (url) {
                    newUrls.push(url);
                }
            }
            onImagesChange([...images, ...newUrls]);
        } catch {
            alert("Failed to upload some images.");
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <AnimatePresence>
                    {images.map((url, index) => (
                        <motion.div
                            key={url}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white group"
                        >
                            <img src={url} alt={`Memory ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-red-500/80 hover:bg-red-600"
                                    onClick={() => removeImage(index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {images.length < maxImages && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="aspect-square relative"
                    >
                        <label className="flex flex-col items-center justify-center w-full h-full rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/50 hover:bg-rose-50 cursor-pointer transition-colors group">
                            {uploading ? (
                                <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                                        <Plus className="w-6 h-6 text-rose-400" />
                                    </div>
                                    <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Add Photo</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    </motion.div>
                )}
            </div>

            <p className="text-center text-xs text-rose-800/40 font-medium">
                {images.length} / {maxImages} Uploaded • Max 6MB per file
            </p>
        </div>
    );
};
