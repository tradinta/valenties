import React from 'react';
import { Shield, FileText, Scale } from 'lucide-react';

const LegalLayout = ({ children, title, icon: Icon }: { children: React.ReactNode, title: string, icon: any }) => (
    <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-white border-[4px] border-black p-8 md:p-12 rounded-[2rem] shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-6">
                <div className="w-12 h-12 bg-[#FFEB3B] border-[3px] border-black rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black uppercase">{title}</h1>
            </div>
            <div className="prose prose-lg prose-headings:font-black prose-p:font-medium prose-p:text-gray-600 max-w-none">
                {children}
            </div>
        </div>
    </div>
);

export default function TermsPage() {
    return (
        <LegalLayout title="Terms of Use" icon={FileText}>
            <p><strong>Effective Date:</strong> February 14, 2026</p>

            <h3>1. The "Just for Fun" Clause</h3>
            <p>
                By using Kihumba ("The Service"), you acknowledge that this is a digital toy designed for amusement, pranks, and lighthearted romantic gestures.
                We are not responsible if your partner actually gets mad at the "Run Away" button. Use at your own risk.
            </p>

            <h3>2. User Content</h3>
            <p>
                You retain ownership of the photos and text you upload. However, you grant us a license to host and display this content for the purpose of serving your Trap.
                Please do not upload illegal, explicit, or hateful content. We have a "Delete" button for a reason, and we will use it if you're being a jerk.
            </p>

            <h3>3. Premium Services</h3>
            <p>
                Premium features ("Cupid's Arrows") are one-time purchases or subscriptions as specified.
                Refunds are generally not provided for "I changed my mind" scenarios, but we handle technical failures on a case-by-case basis.
            </p>

            <h3>4. Liability</h3>
            <p>
                We are not liable for any failed proposals, broken hearts, or thrown phones resulting from the frustration of our "Impossible Form" mechanic.
            </p>
        </LegalLayout>
    );
}
