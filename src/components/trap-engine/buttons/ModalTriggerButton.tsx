"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface ModalTriggerButtonProps {
    onClick: () => void;
    label?: string;
    description?: string; // Optional hover text
}

export const ModalTriggerButton: React.FC<ModalTriggerButtonProps> = ({ onClick, label = "No" }) => {
    return (
        <Button
            variant="outline"
            size="lg"
            onClick={onClick}
            // Static and clickable! Use a distinct style so they know it's different? 
            // Or keep it looking like a normal 'No' button until clicked.
            className="hover:bg-gray-100 hover:border-black transition-colors"
        >
            {label}
        </Button>
    );
};
