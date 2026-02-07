import React from 'react';
import { Shield } from 'lucide-react';

const LegalLayout = ({ children, title, icon: Icon }: { children: React.ReactNode, title: string, icon: any }) => (
    <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-white border-[4px] border-black p-8 md:p-12 rounded-[2rem] shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-6">
                <div className="w-12 h-12 bg-[#B8F4D8] border-[3px] border-black rounded-xl flex items-center justify-center">
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

export default function PrivacyPage() {
    return (
        <LegalLayout title="Privacy Policy" icon={Shield}>
            <p><strong>Last Updated:</strong> February 14, 2026</p>

            <h3>1. Data We Collect</h3>
            <p>
                We collect the bare minimum to make the Traps work:
            </p>
            <ul>
                <li><strong>Creation Data:</strong> Names, messages, and images you upload.</li>
                <li><strong>Usage Data:</strong> We track clicks, "No" attempts, and completion time to generate the fun stats in your dashboard.</li>
                <li><strong>Session Info:</strong> IP addresses (anonymized/hashed) to prevent spam and abuse.</li>
            </ul>

            <h3>2. Cookies</h3>
            <p>
                We use local storage and simple session cookies to keep you logged in and to track if a user has already visited a trap.
                We do not track you across the web. We are not Facebook.
            </p>

            <h3>3. Image Storage</h3>
            <p>
                Images are stored in our secure cloud bucket. You can delete your images at any time via the Dashboard "Delete" button.
                Deleting a trap permanently removes the associated images from our servers.
            </p>

            <h3>4. Third Parties</h3>
            <p>
                We use Firebase (Google) for hosting and database services. They process data securely on our behalf.
                Payments are processed via Stripe; we never see your credit card number.
            </p>
        </LegalLayout>
    );
}
