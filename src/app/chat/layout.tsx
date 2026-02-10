import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Random Chaos Chat',
    description: 'Connect anonymously with strangers. Vent, scream, or just be weird together.',
    openGraph: {
        title: 'Random Chaos Chat | Kihumba',
        description: 'Connect with a random stranger right now. No sign-up required.',
        url: 'https://kihumba.com/chat',
    },
};

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
