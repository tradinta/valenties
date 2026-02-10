import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin'; // Ensure you have this exported
import { UserTier } from '@/types/shared';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function GET(req: NextRequest) {
    const reference = req.nextUrl.searchParams.get('reference');

    if (!reference) {
        return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET}`,
            },
        });

        const data = await response.json();

        if (data.status && data.data?.status === 'success') {
            const { metadata, amount, currency, reference: ref, customer, plan } = data.data;
            const uid = metadata?.uid;
            const planId = metadata?.plan_id as UserTier;
            const planType = metadata?.plan_type;
            const durationDays = metadata?.duration_days;

            // Update User Tier Immediately (Fallback/Redundancy for Webhooks)
            if (uid && planId) {
                const userRef = adminDb.collection('users').doc(uid);

                const updateData: any = {
                    tier: planId,
                    subscription: {
                        planId: planId,
                        status: 'active',
                        provider: 'paystack',
                        startDate: Date.now(),
                    }
                };

                // Calculate expiry for one-time or subscription
                if (planType === 'one-time' && durationDays) {
                    updateData.subscription.periodEnd = Date.now() + (parseInt(durationDays) * 24 * 60 * 60 * 1000);
                    updateData.subscription.autoRenew = false;
                } else {
                    // Subscription usually monthly
                    updateData.subscription.periodEnd = Date.now() + (30 * 24 * 60 * 60 * 1000); // Rough estimate, webhook handles exact
                    updateData.subscription.paystackSubscriptionCode = data.data.subscription_code; // If exists
                    updateData.subscription.autoRenew = true;
                }

                // Add transaction record
                await adminDb.collection('transactions').add({
                    uid,
                    amount,
                    currency,
                    reference: ref,
                    status: 'success',
                    planId,
                    provider: 'paystack',
                    email: customer?.email,
                    createdAt: Date.now(),
                    type: 'payment'
                });

                await userRef.set(updateData, { merge: true });
            }

            return NextResponse.json({
                status: 'success',
                amount: data.data.amount,
                currency: data.data.currency,
                reference: data.data.reference,
                plan: data.data.metadata?.plan_id,
            });
        }

        return NextResponse.json({
            status: 'failed',
            message: data.data?.gateway_response || 'Transaction failed',
        });

    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
