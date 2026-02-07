import Link from 'next/link';
import { HeartCrack, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFF9F0] text-[#1a1817] neo-brutal">
            <div className="max-w-md w-full text-center space-y-8">

                <div className="relative inline-block">
                    <HeartCrack className="w-32 h-32 mx-auto text-[#FF0040] animate-pulse" strokeWidth={1.5} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black">
                        404
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-black uppercase tracking-tighter">Trap Not Found</h1>
                    <p className="text-xl font-bold text-gray-500">
                        You've stumbled into the void. This page doesn't exist, or maybe it ghosted you.
                    </p>
                </div>

                <Link href="/">
                    <button className="inline-flex items-center gap-2 bg-[#FF0040] text-white px-8 py-4 rounded-xl border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all font-bold text-lg">
                        <Home className="w-5 h-5" />
                        Take Me Home
                    </button>
                </Link>
            </div>
        </div>
    );
}
