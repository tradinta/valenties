import { Shield } from 'lucide-react';
import { LegalLayout } from '@/components/layout/LegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'How we respect your privacy and handle data at Kihumba.',
    openGraph: {
        title: 'Privacy Policy | Kihumba',
        description: 'Plain English explanation of what data we collect and how we use it.',
    },
};

export default function PrivacyPolicy() {
    return (
        <LegalLayout title="Privacy Policy" icon={Shield}>
            <h2>1. Introduction</h2>
            <p>
                At <strong>Kihumba</strong>, we respect your privacy (and your partner's). This policy explains what data we collect and how we use it.
            </p>

            <h2>2. Data We Collect</h2>
            <ul>
                <li><strong>Account Data:</strong> Email address (if you sign up), anonymous session IDs.</li>
                <li><strong>Content:</strong> Messages, images, and poll responses you create.</li>
                <li><strong>Usage Data:</strong> Page views, button clicks (for analytics), device type, browser.</li>
                <li><strong>Cookies:</strong> We use cookies for authentication and preferences.</li>
            </ul>

            <h2>3. How We Use Your Data</h2>
            <ul>
                <li>To provide and improve the Service.</li>
                <li>To display your traps and poll results.</li>
                <li>To send transactional emails (e.g., "Someone said Yes!").</li>
                <li>For aggregate analytics (we don't sell individual data).</li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>
                Trap data is retained until you delete it. Images are stored in our secure cloud bucket. You can delete your images at any time via the Dashboard "Delete" button.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>We use:</p>
            <ul>
                <li><strong>Firebase:</strong> Authentication and database.</li>
                <li><strong>Cloudinary:</strong> Image storage.</li>
                <li><strong>Vercel:</strong> Hosting and analytics.</li>
            </ul>
            <p>These services have their own privacy policies.</p>

            <h2>6. Your Rights</h2>
            <p>
                You can request access to, correction of, or deletion of your data by contacting us at <a href="mailto:privacy@kihumba.com" className="underline">privacy@kihumba.com</a>.
            </p>

            <h2>7. Changes to This Policy</h2>
            <p>We may update this policy. Major changes will be announced on the site.</p>

            <p className="text-sm text-gray-400 mt-8">Last updated: February 2026</p>
        </LegalLayout>
    );
}
