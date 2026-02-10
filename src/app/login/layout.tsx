import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Access your global dashboard. Manage your traps, view analytics, and update your subscription.',
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
