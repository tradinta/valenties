import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Premium Plans',
    description: 'Unleash the full power of chaos with Kihumba Premium. Unlimited traps, custom themes, and advanced analytics.',
    openGraph: {
        title: 'Kihumba Premium | Unlock the Chaos',
        description: 'Get unlimited Valentine traps, custom themes, and detailed analytics. Choose the plan that fits your chaos level.',
        url: 'https://kihumba.com/premium',
    },
};

export default function PremiumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
