import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { PlanConfig, PlanPricing } from '@/types/shared';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

interface InitializeRequest {
    email: string;
    currency: string;
    metadata: {
        uid: string;
        planId: 'starter' | 'casual' | 'premium';
    };
    callbackUrl?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: InitializeRequest = await req.json();

        if (!body.email || !body.metadata?.uid || !body.metadata?.planId) {
            return NextResponse.json(
                { error: 'Missing required fields: email, uid, planId' },
                { status: 400 }
            );
        }

        const planId = body.metadata.planId;
        const currency = (body.currency || 'USD') as keyof PlanPricing;

        // 1. Securely fetch plan settings from Firestore
        const settingsDoc = await adminDb.collection('admin_settings').doc('global_settings').get();
        if (!settingsDoc.exists) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const settings = settingsDoc.data();
        const planConfig = settings?.plans?.[planId] as PlanConfig | undefined;

        if (!planConfig || !planConfig.active) {
            return NextResponse.json({ error: 'Invalid or inactive plan' }, { status: 400 });
        }

        // 2. Determine Amount
        const pricing = planConfig.price as PlanPricing;
        let paystackPlanCode: string | undefined = undefined;
        let finalCurrency = currency;

        if (planConfig.type === 'subscription') {
            // 1. Try requested currency
            paystackPlanCode = planConfig.paystackPlanCodes?.[currency];

            // 2. If no code for this currency, try KES (common fallback for Paystack/Kenya)
            if (!paystackPlanCode && planConfig.paystackPlanCodes?.['KES']) {
                paystackPlanCode = planConfig.paystackPlanCodes['KES'];
                finalCurrency = 'KES';
            }

            // 3. If still no code, try first available
            if (!paystackPlanCode && planConfig.paystackPlanCodes) {
                const firstKey = Object.keys(planConfig.paystackPlanCodes)[0] as keyof PlanPricing;
                if (firstKey) {
                    paystackPlanCode = planConfig.paystackPlanCodes[firstKey];
                    finalCurrency = firstKey;
                }
            }
        }

        // recalculate amount if currency changed
        const amountValues = pricing || { USD: 0 };
        const amount = (amountValues[finalCurrency] || amountValues['USD']) * 100; // Convert to smallest unit

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid price configuration' }, { status: 500 });
        }

        // Build Paystack request
        const paystackBody: Record<string, any> = {
            email: body.email,
            amount: amount,
            currency: finalCurrency,
            metadata: {
                custom_fields: [
                    { display_name: "User ID", variable_name: "uid", value: body.metadata.uid },
                    { display_name: "Plan", variable_name: "plan_id", value: planId },
                    { display_name: "Plan Type", variable_name: "plan_type", value: planConfig.type },
                ],
                uid: body.metadata.uid,
                plan_id: planId,
                plan_type: planConfig.type,
                duration_days: planConfig.durationDays,
            },
            callback_url: body.callbackUrl || `${req.nextUrl.origin}/premium/callback`,
        };

        // If it's a subscription, add the plan code
        if (paystackPlanCode) {
            paystackBody.plan = paystackPlanCode;
        }

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paystackBody),
        });

        const data = await response.json();

        if (!data.status) {
            console.error('Paystack initialization failed:', data);
            return NextResponse.json(
                { error: data.message || 'Payment initialization failed' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference,
        });

    } catch (error) {
        console.error('Paystack init error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
