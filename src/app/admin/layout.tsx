"use client";

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminGuard } from '@/components/admin/AdminGuard';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#F0F2F5] text-[#1a1817] font-sans">
                <AdminSidebar />
                <main className="ml-64 p-8 min-h-screen">
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}
