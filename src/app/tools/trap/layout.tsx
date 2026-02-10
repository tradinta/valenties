import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create a Valentine Trap',
    description: 'The viral "No Button" prank. Create a customizable Valentine trap that runs away when they try to decline.',
    openGraph: {
        title: 'Create a Valentine Trap | Kihumba',
        description: 'Send a digital card they literally cannot say no to. The button runs away, shrinks, or teleports.',
        url: 'https://kihumba.com/tools/trap',
        images: ['/og-trap.png'],
    },
};

export default function TrapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
