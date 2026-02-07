import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { AnalyticsSession, AnalyticsEvent } from '@/types';
import { getGeoLocation, getDeviceInfo } from '@/lib/analytics';

export const useAnalytics = (trapId: string, isAuthor: boolean = false) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const startTimeResponse = useRef<number>(Date.now());
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!trapId || isAuthor || hasInitialized.current) return;
        hasInitialized.current = true;

        const initSession = async () => {
            const geo = await getGeoLocation();
            const device = getDeviceInfo();

            const sessionData: Partial<AnalyticsSession> = {
                trapId,
                visitorId: crypto.randomUUID(), // Local anonymous ID
                startTime: Date.now(),
                ...geo,
                // @ts-ignore
                ...device,
                securityAttempts: 0,
                hoverCount: 0,
                clickCount: 0
            };

            try {
                // Create Session Doc
                const docRef = await addDoc(collection(db, `traps/${trapId}/sessions`), {
                    ...sessionData,
                    createdAt: serverTimestamp()
                });
                setSessionId(docRef.id);

                // Increment View Count on Trap
                const trapRef = doc(db, 'traps', trapId);
                await updateDoc(trapRef, {
                    'stats.views': increment(1)
                });

            } catch (error) {
                console.error("Failed to init analytics", error);
            }
        };

        initSession();

        // Cleanup: End Session
        return () => {
            if (sessionId) {
                // Attempt to update duration on unmount (less reliable, use pinging for robust)
            }
        };
    }, [trapId, isAuthor]);

    // Regular "Ping" to update duration every 10s
    useEffect(() => {
        if (!sessionId) return;
        const interval = setInterval(async () => {
            const duration = (Date.now() - startTimeResponse.current) / 1000;
            const sessionRef = doc(db, `traps/${trapId}/sessions`, sessionId);
            await updateDoc(sessionRef, { duration }); // Update duration
        }, 10000); // 10s
        return () => clearInterval(interval);
    }, [sessionId, trapId]);

    const logEvent = async (type: AnalyticsEvent['type'], metadata: any = {}) => {
        if (!sessionId) return;

        try {
            // Add to subcollection 'events'
            await addDoc(collection(db, `traps/${trapId}/sessions/${sessionId}/events`), {
                type,
                metadata,
                timestamp: Date.now()
            });

            // Update aggregates on session
            // Update aggregates on session
            const sessionRef = doc(db, `traps/${trapId}/sessions`, sessionId);
            // Also update parent trap stats for Dashboard visibility
            const trapRef = doc(db, 'traps', trapId);

            if (type === 'attempt_security') {
                await updateDoc(sessionRef, { securityAttempts: increment(1) });
                await updateDoc(trapRef, { 'stats.attempts': increment(1) });
            } else if (type === 'hover_no') {
                await updateDoc(sessionRef, { hoverCount: increment(1) });
                await updateDoc(trapRef, { 'stats.hovers': increment(1) });
            } else if (type === 'click_no') {
                await updateDoc(sessionRef, { clickCount: increment(1) });
                // We count clicks as attempts too? Or separate? Let's count them as attempts for the dashboard "Refusals" stat
                await updateDoc(trapRef, { 'stats.attempts': increment(1) });
            }

        } catch (e) {
            console.warn("Analytics log failed", e);
        }
    };

    return { logEvent, sessionId };
};
