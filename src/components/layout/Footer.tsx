import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-foreground text-background py-12 px-4 border-t-[4px] border-border relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <Heart className="w-5 h-5 fill-white text-white" />
                            </div>
                            <span className="text-2xl font-black">KIHUMBA</span>
                        </div>
                        <p className="opacity-60 font-medium max-w-sm">
                            Digital tools for modern romance. Made with chaos and questionable decisions.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-black uppercase text-sm tracking-wider mb-4 opacity-40">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link href="/legal/terms" className="font-bold opacity-80 hover:opacity-100 hover:text-primary transition-all">Terms</Link></li>
                            <li><Link href="/legal/privacy" className="font-bold opacity-80 hover:opacity-100 hover:text-primary transition-all">Privacy</Link></li>
                            <li><Link href="/legal/refund" className="font-bold opacity-80 hover:opacity-100 hover:text-primary transition-all">Refunds</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black uppercase text-sm tracking-wider mb-4 opacity-40">Tools</h4>
                        <ul className="space-y-2">
                            <li><Link href="/dashboard" className="font-bold opacity-80 hover:opacity-100 hover:text-primary transition-all">Dashboard</Link></li>
                            <li><Link href="/chat" className="font-bold opacity-80 hover:opacity-100 hover:text-primary transition-all">Random Chat</Link></li>
                            <li><Link href="/tools/whispers" className="font-bold opacity-80 hover:opacity-100 hover:text-primary transition-all">Whispers</Link></li>
                            <li><Link href="/tools/polls" className="font-bold opacity-80 hover:opacity-100 hover:text-primary transition-all">Polls</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-background/10 pt-8 text-center opacity-40 text-sm font-bold">
                    © {new Date().getFullYear()} Kihumba. All rights reserved. Built with 💖 and chaos.
                </div>
            </div>
        </footer>
    );
};
