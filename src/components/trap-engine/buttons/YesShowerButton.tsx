"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Laugh } from 'lucide-react';

interface YesShowerButtonProps {
    onClick: () => void;
    label?: string;
}

export const YesShowerButton: React.FC<YesShowerButtonProps> = ({ onClick, label = "No" }) => {
    return (
        <Button
            variant="outline"
            size="lg"
            onClick={onClick}
            className="hover:text-orange-500 hover:border-orange-500 group relative overflow-hidden"
        >
            <span className="relative z-10">{label}</span>
            <div className="absolute inset-0 bg-orange-100 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Button>
    );
};
