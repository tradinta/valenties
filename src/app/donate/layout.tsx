import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Donate | Fuel the Chaos',
    description: 'Built by one tired developer fueled by caffeine and spite. Help keep the servers running.',
    openGraph: {
        title: 'Support Kihumba | Buy us a Coffee',
        description: 'Keep the chaos engine running. Your support helps us build more tools and pay for server costs.',
        url: 'https://kihumba.com/donate',
    },
};

export default function DonateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
