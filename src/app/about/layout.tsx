import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Kihumba',
    description: 'Digital tools for modern romance. Prank your partner, make decisions together, or scream into the void.',
    openGraph: {
        title: 'About Kihumba | The Chaos Toolkit',
        description: 'Learn about the team behind the viral Valentine Traps and anonymous confession walls.',
        url: 'https://kihumba.com/about',
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
