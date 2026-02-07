import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Client SDK can be used in API routes for simple writes if rules allow, or Admin SDK
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { sendTrapNotification } from '@/lib/mail';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Params is now a Promise
) {
    const { id } = await params;
    const body = await req.json();
    const { attempts, timeToYes } = body;

    try {
        const trapRef = doc(db, "traps", id);

        // 1. Update Stats
        await updateDoc(trapRef, {
            status: 'completed',
            'stats.attempts': attempts,
            'stats.timeToYes': timeToYes,
            'stats.completedAt': Date.now()
        });

        // 2. Fetch for Email Info
        const trapSnap = await getDoc(trapRef);
        if (trapSnap.exists()) {
            const data = trapSnap.data();
            // Assuming creator email is stored or we just assume for now (User didn't ask for Auth)
            // If we don't have creator email, we can't send email. 
            // NOTE: The current form does NOT ask for Email. I should add it to ConfigForm if I want this feature.

            // For now, I will skip email if no email field, or hardcode a test one if requested.
            // The user requested ZeptoMail, implying they want emails. 
            // I will update ConfigForm to ask for "Your Email" in next step or user can do it.

            if (data.creatorEmail) {
                await sendTrapNotification(
                    data.creatorEmail,
                    data.creatorName,
                    data.partnerName,
                    { attempts, timeToYes }
                );
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API Error", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
