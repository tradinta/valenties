import React from 'react';
import { Rocket, Heart, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-20">

                {/* Hero */}
                <div className="text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black text-[#1a1817]">
                        Why did we <span className="text-[#EC4899]">build this?</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-bold text-gray-500 max-w-2xl mx-auto">
                        Because asking "Will you be my Valentine?" over text is boring. We wanted to make it an <span className="underline decoration-wavy decoration-[#EC4899]">event</span>.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white border-[4px] border-black p-8 rounded-[2rem] shadow-[8px_8px_0_0_#000] rotate-1 hover:rotate-0 transition-transform">
                        <div className="w-12 h-12 bg-[#B8F4D8] border-[3px] border-black rounded-xl flex items-center justify-center mb-6">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black mb-3">Maximum Chaos</h3>
                        <p className="font-medium text-gray-600">
                            We engineered the "No" button to be physically unclickable. It runs, shrinks, teleports, and guilt-trips. It's aggressive affection.
                        </p>
                    </div>

                    <div className="bg-white border-[4px] border-black p-8 rounded-[2rem] shadow-[8px_8px_0_0_#000] -rotate-1 hover:rotate-0 transition-transform">
                        <div className="w-12 h-12 bg-[#FFF59D] border-[3px] border-black rounded-xl flex items-center justify-center mb-6">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black mb-3">Instant gratification</h3>
                        <p className="font-medium text-gray-600">
                            Get notified the second they crack. Watch the stats in real-time. See how hard they tried to resist (and failed).
                        </p>
                    </div>
                </div>

                {/* Mission */}
                <div className="bg-[#1a1817] text-white p-10 rounded-[3rem] text-center space-y-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <Heart className="w-16 h-16 text-[#FF0040] fill-[#FF0040] mx-auto mb-6 animate-pulse" />
                        <h2 className="text-4xl font-black mb-4">Our Mission</h2>
                        <p className="text-xl font-medium text-gray-300 max-w-2xl mx-auto">
                            To facilitate 1 million "Yes" responses worldwide. We believe love should be fun, slightly annoying, and aesthetically pleasing.
                        </p>
                    </div>
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="/">
                        <button className="px-10 py-5 bg-[#EC4899] text-white text-xl font-black rounded-2xl border-[4px] border-black shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all">
                            Create Your Trap
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
