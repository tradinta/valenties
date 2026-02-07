"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/cloudinary';
import { Loader2, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageUploaderProps {
    onUploadComplete: (url: string) => void;
    currentImage?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete, currentImage }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Local Preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            setUploading(true);
            const url = await uploadImage(file);
            if (url) {
                onUploadComplete(url);
            } else {
                alert("Upload failed. Check your cloud settings.");
            }
        } catch (error) {
            console.error(error);
            alert("Upload Error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-pink-300 rounded-xl bg-pink-50/50 hover:bg-pink-50 transition-colors">
            {preview ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg"
                >
                    <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                </motion.div>
            ) : (
                <div className="w-32 h-32 rounded-full bg-pink-100 flex items-center justify-center text-pink-400">
                    <UploadCloud size={48} />
                </div>
            )}

            <div className="relative">
                <Button disabled={uploading} variant="outline" className="relative overflow-hidden group">
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                        </>
                    ) : (
                        "Choose Photo"
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
                Supported: JPG, PNG, WEBP (Max 5MB)
            </p>
        </div>
    );
};
