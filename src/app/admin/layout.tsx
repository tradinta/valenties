import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F0F2F5] text-[#1a1817] font-sans">
            <AdminSidebar />
            <main className="ml-64 p-8 min-h-screen">
                {children}
            </main>
        </div>
    );
}
