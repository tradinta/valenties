import { FileText } from 'lucide-react';
import { LegalLayout } from '@/components/layout/LegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'The rules of engagement for the chaos toolkit.',
    openGraph: {
        title: 'Terms of Service | Kihumba',
        description: 'By using this site, you agree to let us have a little fun. Read the fine print.',
    },
};

export default function TermsOfService() {
    return (
        <LegalLayout title="Terms of Service" icon={FileText}>
            <h2>1. Acceptance of Terms</h2>
            <p>
                By using <strong>Kihumba</strong> (the "Service"), you agree to these Terms of Service. If you disagree, please close this tab and find a less chaotic way to prank people.
            </p>

            <h2>2. Description of Service</h2>
            <p>
                Kihumba provides a platform for creating interactive, playful "Funny Trap" experiences. The "No" button may or may not cooperate, and we take no responsibility for the frustration that ensues.
            </p>

            <h2>3. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
                <li>Use the Service for any unlawful purpose.</li>
                <li>Harass, abuse, or harm another person using the Service.</li>
                <li>Upload content that is offensive, defamatory, or violates the rights of others.</li>
                <li>Attempt to reverse-engineer, hack, or disrupt the Service.</li>
            </ul>

            <h2>4. Content Ownership</h2>
            <p>
                You retain ownership of any content you upload (images, messages). By uploading, you grant Kihumba a non-exclusive license to store and display this content for the purpose of providing the Service.
            </p>

            <h2>5. Disclaimer of Warranties</h2>
            <p>
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. We are not liable for any failed proposals, broken hearts, or thrown phones resulting from the frustration of our "Impossible Form" mechanic.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
                In no event shall Kihumba be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.
            </p>

            <h2>7. Changes to Terms</h2>
            <p>
                We reserve the right to modify these terms at any time. Continued use of the Service constitutes acceptance of the new terms.
            </p>

            <h2>8. Contact</h2>
            <p>
                For any questions, email us at <a href="mailto:support@kihumba.com" className="underline">support@kihumba.com</a>.
            </p>

            <p className="text-sm text-gray-400 mt-8">Last updated: February 2026</p>
        </LegalLayout>
    );
}
