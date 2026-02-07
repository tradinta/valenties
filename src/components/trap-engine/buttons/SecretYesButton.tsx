"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface SecretYesButtonProps {
    onSuccess: () => void;
    label?: string;
}

export const SecretYesButton: React.FC<SecretYesButtonProps> = ({ onSuccess, label = "No" }) => {
    return (
        <Button
            variant="outline"
            size="lg"
            onClick={onSuccess}
            className="hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 transform hover:scale-110"
        >
            {label}
        </Button>
    );
};
