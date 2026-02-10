import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Vote or Die | Create Polls',
    description: 'Create interactive polls, quizzes, and popularity contests. Watch results roll in live.',
    openGraph: {
        title: 'Create a Poll | Vote or Die',
        description: 'Settle the debate once and for all. Is water wet? Create your poll in seconds.',
        url: 'https://kihumba.com/tools/polls',
    },
};

export default function PollsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
