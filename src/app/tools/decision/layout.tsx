import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Decision Dice | Let Chaos Decide',
    description: 'Can\'t decide where to eat? Let the chaos engine choose for you. Spin the wheel of fate.',
    openGraph: {
        title: 'Decision Dice | Kihumba',
        description: 'Stop arguing. Let the algorithm decide. Should you text them? Where to eat? Spin now.',
        url: 'https://kihumba.com/tools/decision',
    },
};

export default function DecisionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
