"use client";

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFF9F0] text-[#1a1817] neo-brutal">
            <div className="max-w-md w-full text-center space-y-8 bg-white border-[4px] border-black p-8 rounded-[2rem] shadow-[8px_8px_0_0_#000]">

                <div className="w-20 h-20 bg-yellow-300 border-[3px] border-black rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-10 h-10 text-black" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase">Something Broke!</h2>
                    <p className="font-bold text-gray-500">
                        Our cupid algorithms got tangled. It's not you, it's us.
                    </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl border-2 border-dashed border-gray-300 text-xs font-mono text-left overflow-auto max-h-32">
                    {error.message || "Unknown error occurred"}
                </div>

                <button
                    onClick={reset}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#B8F4D8] text-black px-8 py-4 rounded-xl border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all font-bold text-lg"
                >
                    <RotateCcw className="w-5 h-5" />
                    Try Again
                </button>
            </div>
        </div>
    );
}
