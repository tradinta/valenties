import { RefreshCw } from 'lucide-react';
import { LegalLayout } from '@/components/layout/LegalLayout';

export default function RefundPolicy() {
    return (
        <LegalLayout title="Refund Policy" icon={RefreshCw}>
            <h2>1. Premium Purchases</h2>
            <p>
                All Premium subscriptions and one-time purchases are eligible for a refund within <strong>7 days</strong> of purchase, provided you have not used the Premium features.
            </p>

            <h2>2. How to Request a Refund</h2>
            <p>
                Email <a href="mailto:billing@kihumba.com" className="underline">billing@kihumba.com</a> with your order ID and reason for the refund. We'll process it within 5 business days.
            </p>

            <h2>3. Exceptions</h2>
            <p>Refunds are <strong>not available</strong> for:</p>
            <ul>
                <li>Donations (those are gifts of chaos, not transactions).</li>
                <li>If your target didn't fall for it. We provide the tools, not the magic.</li>
                <li>If you've already used Premium themes, mechanics, or analytics.</li>
            </ul>

            <h2>4. Chargebacks</h2>
            <p>
                If you initiate a chargeback instead of contacting us, your account may be suspended and further Premium access revoked.
            </p>

            <h2>5. Contact</h2>
            <p>
                Questions? <a href="mailto:billing@kihumba.com" className="underline">billing@kihumba.com</a>
            </p>

            <p className="text-sm text-gray-400 mt-8">Last updated: February 2026</p>
        </LegalLayout>
    );
}
