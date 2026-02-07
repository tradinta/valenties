"use client";

import { AuthForm } from '@/components/auth/AuthForm';
import { Background3D } from '@/components/canvas/Background3D';

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full relative flex items-center justify-center p-4 font-sans origin-center">
            <Background3D />
            <div className="relative z-10 w-full max-w-md">
                <AuthForm />
            </div>
        </div>
    );
}
