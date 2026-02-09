"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// Dialog Context
// ============================================

interface DialogContextValue {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog() {
    const context = React.useContext(DialogContext);
    if (!context) throw new Error("Dialog components must be used within a Dialog");
    return context;
}

// ============================================
// Dialog Root
// ============================================

interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open = false, onOpenChange, children }: DialogProps) {
    const handleOpenChange = React.useCallback((newOpen: boolean) => {
        onOpenChange?.(newOpen);
    }, [onOpenChange]);

    return (
        <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
            {children}
        </DialogContext.Provider>
    );
}

// ============================================
// Dialog Trigger
// ============================================

interface DialogTriggerProps {
    children: React.ReactNode;
    asChild?: boolean;
}

export function DialogTrigger({ children, asChild }: DialogTriggerProps) {
    const { onOpenChange } = useDialog();

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
            onClick: () => onOpenChange(true)
        });
    }

    return (
        <button onClick={() => onOpenChange(true)}>
            {children}
        </button>
    );
}

// ============================================
// Dialog Content
// ============================================

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
    const { open, onOpenChange } = useDialog();

    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onOpenChange(false);
        };
        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [open, onOpenChange]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => onOpenChange(false)}
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className={cn(
                            "relative z-10 w-full max-w-lg mx-4 bg-white rounded-2xl border-[3px] border-black shadow-[8px_8px_0_0_#000] p-6",
                            className
                        )}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ============================================
// Dialog Header
// ============================================

interface DialogHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
    return (
        <div className={cn("space-y-2 mb-4", className)}>
            {children}
        </div>
    );
}

// ============================================
// Dialog Title
// ============================================

interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
    return (
        <h2 className={cn("text-xl font-black", className)}>
            {children}
        </h2>
    );
}

// ============================================
// Dialog Description
// ============================================

interface DialogDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
    return (
        <p className={cn("text-sm text-gray-500", className)}>
            {children}
        </p>
    );
}

// ============================================
// Dialog Footer
// ============================================

interface DialogFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
    return (
        <div className={cn("mt-6 flex justify-end gap-3", className)}>
            {children}
        </div>
    );
}
