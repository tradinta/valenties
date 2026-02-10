import { Cookie } from 'lucide-react';
import { LegalLayout } from '@/components/layout/LegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy',
    description: 'How we use cookies to track chaos at Kihumba.',
};

export default function CookiePolicy() {
    return (
        <LegalLayout title="Cookie Policy" icon={Cookie}>
            <h2>1. What are Cookies?</h2>
            <p>
                Cookies are small text files stored on your device. We use them to keep the chaos engine running and remember who you are during a session.
            </p>

            <h2>2. How We Use Cookies</h2>
            <ul>
                <li><strong>Authentication:</strong> Keeping you logged in.</li>
                <li><strong>Session Tracking:</strong> Ensuring "Chaos Tools" and "Traps" work across page transitions.</li>
                <li><strong>Analytics:</strong> Understanding how many people are using our tools.</li>
                <li><strong>Theme:</strong> Remembering whether you prefer Classic, Noir, or Cyber mode.</li>
            </ul>

            <h2>3. Your Choices</h2>
            <p>
                You can block cookies in your browser settings, but some tools (like the Dashboard or Private Shares) might stop working.
            </p>

            <p className="text-sm text-gray-400 mt-8">Last updated: February 2026</p>
        </LegalLayout>
    );
}
stone
