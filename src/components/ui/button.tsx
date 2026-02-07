"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, "ref"> {
    asChild?: boolean;
    variant?: "default" | "outline" | "ghost" | "link" | "cupid";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Component = asChild ? Slot : motion.button;

        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
            cupid: "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg hover:shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20",
        };

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8 text-lg",
            icon: "h-10 w-10",
        };

        return (
            // @ts-ignore
            <Component
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                whileTap={{ scale: 0.95 }}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
