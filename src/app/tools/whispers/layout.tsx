import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Anonymous Whispers | The Void',
    description: 'An anonymous confession wall. Leave a secret note for the internet to find. Scream into the void.',
    openGraph: {
        title: 'Kihumba Whispers',
        description: 'Read the deepest darkest secrets of strangers. Or post your own anonymously.',
        url: 'https://kihumba.com/tools/whispers',
    },
};

export default function WhispersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
