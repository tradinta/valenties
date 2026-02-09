import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { AnalyticsEvent } from '@/types';
import { getGeoLocation, getDeviceInfo } from '@/lib/analytics';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface SessionData {
    trapId: string;
    visitorId: string;
    startTime: number;
    country?: string;
    city?: string;
    region?: string;
    ip?: string;
    deviceType?: DeviceType;
    browser?: string;
    os?: string;
    userAgent?: string;
    securityAttempts: number;
    hoverCount: number;
    clickCount: number;
}

type EventMetadata = Record<string, unknown>;

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

            const sessionData: SessionData = {
                trapId,
                visitorId: crypto.randomUUID(),
                startTime: Date.now(),
                country: geo.country,
                city: geo.city,
                region: geo.region,
                ip: geo.ip,
                deviceType: device.deviceType as DeviceType,
                browser: device.browser,
                os: device.os,
                userAgent: device.userAgent,
                securityAttempts: 0,
                hoverCount: 0,
                clickCount: 0
            };

            try {
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

            } catch {
                // Silent fail in production
            }
        };

        initSession();
    }, [trapId, isAuthor]);

    // Ping to update duration every 10s
    useEffect(() => {
        if (!sessionId) return;
        const interval = setInterval(async () => {
            const duration = (Date.now() - startTimeResponse.current) / 1000;
            const sessionRef = doc(db, `traps/${trapId}/sessions`, sessionId);
            try {
                await updateDoc(sessionRef, { duration });
            } catch {
                // Silent fail
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [sessionId, trapId]);

    const logEvent = async (type: AnalyticsEvent['type'], metadata: EventMetadata = {}) => {
        if (!sessionId) return;

        try {
            await addDoc(collection(db, `traps/${trapId}/sessions/${sessionId}/events`), {
                type,
                metadata,
                timestamp: Date.now()
            });

            const sessionRef = doc(db, `traps/${trapId}/sessions`, sessionId);
            const trapRef = doc(db, 'traps', trapId);

            if (type === 'attempt_security') {
                await updateDoc(sessionRef, { securityAttempts: increment(1) });
                await updateDoc(trapRef, { 'stats.attempts': increment(1) });
            } else if (type === 'hover_no') {
                await updateDoc(sessionRef, { hoverCount: increment(1) });
                await updateDoc(trapRef, { 'stats.hovers': increment(1) });
            } else if (type === 'click_no') {
                await updateDoc(sessionRef, { clickCount: increment(1) });
                await updateDoc(trapRef, { 'stats.attempts': increment(1) });
            }

        } catch {
            // Silent fail - analytics should never break the user experience
        }
    };

    return { logEvent, sessionId };
};
