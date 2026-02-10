"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Assuming cn exists, if not I'll just use template literals or implement it

// Context
const DropdownContext = createContext<{
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
} | null>(null);

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
            <div className="relative inline-block text-left relative-dropdown-container">
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

export const DropdownMenuTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
    const context = useContext(DropdownContext);
    if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

    // If asChild is true, we clone the child and add onClick
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                // Call original onClick if exists
                (children as React.ReactElement<any>).props.onClick?.(e);
                context.setIsOpen(!context.isOpen);
            }
        });
    }

    return (
        <div onClick={(e) => { e.stopPropagation(); context.setIsOpen(!context.isOpen); }}>
            {children}
        </div>
    );
};

export const DropdownMenuContent = ({ children, align = 'end', className }: { children: React.ReactNode, align?: 'start' | 'end' | 'center', className?: string }) => {
    const context = useContext(DropdownContext);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node) &&
                !(event.target as Element).closest('.relative-dropdown-container')) {
                context?.setIsOpen(false);
            }
        };

        if (context?.isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [context?.isOpen]);

    if (!context?.isOpen) return null;

    const alignmentClasses = {
        start: 'left-0',
        end: 'right-0',
        center: 'left-1/2 -translate-x-1/2'
    };

    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 mt-2 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-md animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
                alignmentClasses[align],
                className
            )}
        >
            {children}
        </div>
    );
};

export const DropdownMenuItem = ({ children, className, onClick, ...props }: React.ComponentProps<'div'>) => {
    const context = useContext(DropdownContext);
    return (
        <div
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
                className
            )}
            onClick={(e) => {
                onClick?.(e);
                context?.setIsOpen(false);
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export const DropdownMenuLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("px-2 py-1.5 text-sm font-semibold text-gray-900", className)}>
        {children}
    </div>
);

export const DropdownMenuSeparator = ({ className }: { className?: string }) => (
    <div className={cn("-mx-1 my-1 h-px bg-gray-100", className)} />
);
