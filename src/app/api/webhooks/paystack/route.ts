import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { adminDb } from '@/lib/firebase-admin';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

// Verify Paystack webhook signature
function verifySignature(body: string, signature: string): boolean {
    const hash = createHmac('sha512', PAYSTACK_SECRET)
        .update(body)
        .digest('hex');
    return hash === signature;
}

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-paystack-signature') || '';

        // Verify webhook authenticity
        if (!verifySignature(rawBody, signature)) {
            console.error('Invalid Paystack webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(rawBody);
        console.log(`[Paystack Webhook] Event: ${event.event}`, JSON.stringify(event.data?.metadata, null, 2));

        switch (event.event) {
            case 'charge.success':
                await handleChargeSuccess(event.data);
                break;

            case 'subscription.create':
                await handleSubscriptionCreate(event.data);
                break;

            case 'subscription.disable':
                await handleSubscriptionDisable(event.data);
                break;

            case 'subscription.not_renew':
                await handleSubscriptionNotRenew(event.data);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data);
                break;

            default:
                console.log(`[Paystack Webhook] Unhandled event: ${event.event}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

// ============================================
// EVENT HANDLERS
// ============================================

async function handleChargeSuccess(data: any) {
    const metadata = data.metadata;
    if (!metadata?.uid || !metadata?.plan_id) {
        console.error('[Webhook] Missing metadata in charge.success');
        return;
    }

    const uid = metadata.uid;
    const planId = metadata.plan_id;
    const planType = metadata.plan_type || 'one-time';
    const durationDays = metadata.duration_days;
    const reference = data.reference;
    const customerCode = data.customer?.customer_code;
    const authorizationCode = data.authorization?.authorization_code;
    const currency = data.currency;

    console.log(`[Webhook] Upgrading user ${uid} to ${planId}`);

    const userRef = adminDb.collection('users').doc(uid);

    const updateData: Record<string, any> = {
        tier: planId,
        'subscription.planId': planId,
        'subscription.status': 'active',
        'subscription.startDate': Date.now(),
        'subscription.lastPaymentDate': Date.now(),
        'subscription.lastPaymentRef': reference,
        'subscription.paystackCustomerCode': customerCode,
        'subscription.paystackAuthorizationCode': authorizationCode,
        'subscription.currency': currency,
    };

    // For one-time plans, set expiry
    if (planType === 'one-time' && durationDays) {
        updateData['subscription.expiresAt'] = Date.now() + (durationDays * 24 * 60 * 60 * 1000);
    }

    await userRef.update(updateData);

    // Log the transaction
    await adminDb.collection('transactions').add({
        uid,
        planId,
        planType,
        amount: data.amount,
        currency: data.currency,
        reference,
        channel: data.channel,
        paidAt: data.paid_at,
        customerCode,
        createdAt: Date.now(),
    });

    console.log(`[Webhook] User ${uid} upgraded to ${planId} successfully`);
}

async function handleSubscriptionCreate(data: any) {
    const subscriptionCode = data.subscription_code;
    const customerCode = data.customer?.customer_code;
    const emailToken = data.email_token;

    if (!customerCode) return;

    // Find user by customer code
    const usersSnapshot = await adminDb.collection('users')
        .where('subscription.paystackCustomerCode', '==', customerCode)
        .limit(1)
        .get();

    if (usersSnapshot.empty) {
        console.error(`[Webhook] No user found for customer ${customerCode}`);
        return;
    }

    const userDoc = usersSnapshot.docs[0];
    await userDoc.ref.update({
        'subscription.paystackSubscriptionCode': subscriptionCode,
        'subscription.status': 'active',
    });

    console.log(`[Webhook] Subscription ${subscriptionCode} created for user ${userDoc.id}`);
}

async function handleSubscriptionDisable(data: any) {
    const subscriptionCode = data.subscription_code;
    const status = data.status; // 'cancelled' or 'complete'

    const usersSnapshot = await adminDb.collection('users')
        .where('subscription.paystackSubscriptionCode', '==', subscriptionCode)
        .limit(1)
        .get();

    if (usersSnapshot.empty) return;

    const userDoc = usersSnapshot.docs[0];
    await userDoc.ref.update({
        tier: 'free',
        'subscription.status': status === 'complete' ? 'expired' : 'cancelled',
    });

    console.log(`[Webhook] Subscription ${subscriptionCode} disabled for user ${userDoc.id}`);
}

async function handleSubscriptionNotRenew(data: any) {
    const subscriptionCode = data.subscription_code;

    const usersSnapshot = await adminDb.collection('users')
        .where('subscription.paystackSubscriptionCode', '==', subscriptionCode)
        .limit(1)
        .get();

    if (usersSnapshot.empty) return;

    const userDoc = usersSnapshot.docs[0];
    await userDoc.ref.update({
        'subscription.status': 'non-renewing',
    });

    console.log(`[Webhook] Subscription ${subscriptionCode} set to non-renewing for user ${userDoc.id}`);
}

async function handlePaymentFailed(data: any) {
    const subscriptionCode = data.subscription?.subscription_code;
    if (!subscriptionCode) return;

    const usersSnapshot = await adminDb.collection('users')
        .where('subscription.paystackSubscriptionCode', '==', subscriptionCode)
        .limit(1)
        .get();

    if (usersSnapshot.empty) return;

    const userDoc = usersSnapshot.docs[0];

    // Log the failed payment but don't immediately downgrade
    // (Paystack doesn't retry, so this is final for this cycle)
    console.log(`[Webhook] Payment failed for user ${userDoc.id} subscription ${subscriptionCode}`);

    await adminDb.collection('payment_failures').add({
        uid: userDoc.id,
        subscriptionCode,
        amount: data.amount,
        currency: data.currency,
        failedAt: Date.now(),
    });
}
