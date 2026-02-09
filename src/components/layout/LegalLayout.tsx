import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface LegalLayoutProps {
    children: React.ReactNode;
    title: string;
    icon: LucideIcon;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({ children, title, icon: Icon }) => (
    <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4 font-sans text-[#1a1817]">
        <div className="max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 font-bold hover:underline opacity-60 hover:opacity-100 transition-opacity mb-8">
                <ArrowLeft className="w-4 h-4" /> Back Home
            </Link>

            <div className="bg-white border-[4px] border-black rounded-[2rem] p-8 md:p-12 shadow-[8px_8px_0_0_#000]">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white">
                        <Icon className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black">{title}</h1>
                </div>

                <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-black">
                    {children}
                </div>
            </div>
        </div>
    </div>
);
