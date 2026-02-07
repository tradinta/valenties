"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TrapData, AnalyticsEvent } from '@/types';
import { TrapGame } from '@/components/trap-engine/TrapGame';
import { Loader2, HeartCrack } from 'lucide-react';
import { SecurityGate } from '@/components/trap-engine/SecurityGate';
import { useAnalytics } from '@/hooks/use-analytics';

export default function TrapPage() {
    const params = useParams();
    const id = params?.id as string;
    const [data, setData] = useState<TrapData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false);

    // Initialize Analytics
    const { logEvent } = useAnalytics(id);

    useEffect(() => {
        if (!id) return;

        // Log view is handled by hook initialization now (via session creation)
        logEvent('view');

        const fetchData = async () => {
            try {
                const docRef = doc(db, "traps", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const trapData = docSnap.data() as TrapData;
                    setData(trapData);
                    // Check if locked
                    // @ts-ignore
                    if (trapData.security && trapData.security.question) {
                        setIsLocked(true);
                    }
                } else {
                    logEvent('error', { detail: 'Trap not found' });
                }
            } catch (e) {
                console.error(e);
                logEvent('error', { detail: 'Fetch failed' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-pink-50">
                <Loader2 className="animate-spin text-pink-500 w-12 h-12" />
            </div>
        );
    }

    if (!data) {
        return <div className="text-center p-10">Trap not found 💔</div>;
    }

    if (data.status === 'disabled') {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-4 text-center">
                <HeartCrack className="w-16 h-16 text-gray-400 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Link No Longer Active</h1>
                <p className="text-gray-500 mt-2">This Valentine's trap has been deactivated by the creator.</p>
            </div>
        );
    }

    return (
        <main className={`min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 transition-colors duration-500 ${data.theme}`}>
            {isLocked ? (
                // @ts-ignore
                <SecurityGate
                    question={data.security.question}
                    answer={data.security.answer}
                    hint={data.security.hint}
                    scold={data.security.scold}
                    onUnlock={() => setIsLocked(false)}
                    // @ts-ignore
                    logEvent={logEvent}
                />
            ) : (
                <TrapGame
                    data={data}
                    id={id}
                    // @ts-ignore
                    logEvent={logEvent}
                />
            )}
        </main>
    );
}
