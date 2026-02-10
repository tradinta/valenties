import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | Manage Your Chaos',
    description: 'View your trap statistics, manage your active polls, and track your anonymous whispers. Control your chaos from one place.',
    openGraph: {
        title: 'Kihumba Dashboard',
        description: 'Manage your traps, polls, and whispers. View detailed analytics and responses.',
        url: 'https://kihumba.com/dashboard',
    },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
