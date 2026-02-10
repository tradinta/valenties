import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Random Love Chat',
    description: 'Connect anonymously with strangers. Vent, flirt, or just be weird together.',
    openGraph: {
        title: 'Random Love Chat | Kihumba',
        description: 'Bored? Lonely? Connect with a random stranger right now. No sign-up required.',
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
