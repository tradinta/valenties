import React from 'react';
import { Scale } from 'lucide-react';

const LegalLayout = ({ children, title, icon: Icon }: { children: React.ReactNode, title: string, icon: any }) => (
    <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-white border-[4px] border-black p-8 md:p-12 rounded-[2rem] shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-6">
                <div className="w-12 h-12 bg-[#FF8A80] border-[3px] border-black rounded-xl flex items-center justify-center">
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

export default function RefundPage() {
    return (
        <LegalLayout title="Refund Policy" icon={Scale}>
            <p><strong>Simplicity is Key.</strong></p>

            <h3>1. The "It Didn't Work" Guarantee</h3>
            <p>
                If our site crashed, the image upload failed, or the trap link was 404 on arrival due to our error,
                we will refund your Premium purchase 100%. Just email support with your Trap ID.
            </p>

            <h3>2. The "She Said No" Clause</h3>
            <p>
                We cannot refund you if your partner says no. We provide the digital tools; you provide the rizz.
                Our "Impossible Form" is powerful, but it is not mind control.
            </p>

            <h3>3. Donations</h3>
            <p>
                "Buy Me a Coffee" donations are non-refundable gifts. Thank you for supporting independent developers!
            </p>

            <h3>4. Processing</h3>
            <p>
                Refunds are processed via Stripe and typically take 5-10 business days to appear on your statement.
            </p>
        </LegalLayout>
    );
}
