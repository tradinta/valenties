"use client";
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Check } from "lucide-react"

interface SelectContextType {
    value?: string;
    onValueChange?: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    labels: Record<string, React.ReactNode>;
    registerLabel: (value: string, label: React.ReactNode) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

const Select = ({ children, value, onValueChange, disabled }: any) => {
    const [open, setOpen] = React.useState(false);
    const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>({});

    const registerLabel = React.useCallback((val: string, label: React.ReactNode) => {
        setLabels(prev => ({ ...prev, [val]: label }));
    }, []);

    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen, labels, registerLabel }}>
            <div className={cn("relative inline-block w-full", disabled && "opacity-50 pointer-events-none")}>
                {children}
            </div>
        </SelectContext.Provider>
    )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(
    ({ className, children, ...props }, ref) => {
        const ctx = React.useContext(SelectContext);
        return (
            <button
                type="button"
                ref={ref}
                onClick={() => ctx?.setOpen(!ctx.open)}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        )
    }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<HTMLDivElement, any>(
    ({ className, children, position = "popper", ...props }, ref) => {
        const ctx = React.useContext(SelectContext);
        if (!ctx?.open) return null;

        return (
            <>
                <div className="fixed inset-0 z-40" onClick={() => ctx.setOpen(false)} />
                <div
                    ref={ref}
                    className={cn(
                        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 top-full mt-1 w-full bg-white max-h-60 overflow-y-auto",
                        className
                    )}
                    {...props}
                >
                    <div className="p-1">{children}</div>
                </div>
            </>
        )
    }
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, any>(
    ({ className, children, value, ...props }, ref) => {
        const ctx = React.useContext(SelectContext);

        React.useEffect(() => {
            if (value && children) ctx?.registerLabel(value, children);
        }, [value, children, ctx]);

        return (
            <div
                ref={ref}
                onClick={() => {
                    ctx?.onValueChange?.(value);
                    ctx?.setOpen(false);
                }}
                className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100 cursor-pointer",
                    className
                )}
                {...props}
            >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {ctx?.value === value && (
                        <Check className="h-4 w-4" />
                    )}
                </span>
                <span className="truncate">{children}</span>
            </div>
        )
    }
)
SelectItem.displayName = "SelectItem"

const SelectValue = React.forwardRef<HTMLSpanElement, any>(
    ({ className, placeholder, ...props }, ref) => {
        const ctx = React.useContext(SelectContext);
        return (
            <span ref={ref} className={className} {...props}>
                {ctx?.value && ctx.labels[ctx.value] ? ctx.labels[ctx.value] : placeholder}
            </span>
        )
    }
)
SelectValue.displayName = "SelectValue"

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
