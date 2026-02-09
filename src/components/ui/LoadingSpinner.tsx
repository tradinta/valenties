import React from 'react';
import { Loader2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    variant?: 'heart' | 'spinner';
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    variant = 'spinner',
    size = 'md',
    text
}) => {
    const sizeClass = sizeMap[size];

    if (variant === 'heart') {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Heart className={`${sizeClass} text-[#FF9EB5] fill-[#FF9EB5]`} />
                </motion.div>
                {text && <p className="text-sm font-bold text-gray-500">{text}</p>}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className={`${sizeClass} animate-spin text-black`} />
            {text && <p className="text-sm font-bold text-gray-500">{text}</p>}
        </div>
    );
};

// Full page loading state
export const FullPageLoader: React.FC<{ text?: string }> = ({ text }) => (
    <div className="flex h-screen items-center justify-center bg-[#FFFBF5]">
        <LoadingSpinner variant="heart" size="lg" text={text} />
    </div>
);
