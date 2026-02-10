import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { TIER_FEATURES, UserTier } from '@/types/shared';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { paramsToSign } = body;

        // 1. Verify Auth
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split('Bearer ')[1];

        let uid: string;
        try {
            const decodedToken = await adminAuth.verifyIdToken(token);
            uid = decodedToken.uid;
        } catch (e) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // 2. Get User Tier & Limits
        const userDoc = await adminDb.collection('users').doc(uid).get();

        // If user doc doesn't exist (e.g. anonymous), we use default 'anonymous' limits
        const userData = userDoc.exists ? userDoc.data() : null;
        const tier: UserTier = userData?.tier || 'anonymous';

        // 3. Check Limits
        const today = new Date().setHours(0, 0, 0, 0);
        const limits = userData?.limits || { images: 0, lastReset: 0 };

        // Reset if new day
        if (limits.lastReset < today) {
            limits.images = 0;
            limits.lastReset = today;
        }

        const maxImages = TIER_FEATURES[tier]?.maxDailyImages ?? 0;

        if (limits.images >= maxImages) {
            return NextResponse.json({
                error: `Daily image limit reached for ${tier} plan (${limits.images}/${maxImages}). Upgrade to upload more.`
            }, { status: 403 });
        }

        // 4. Increment usage
        // Note: For anonymous users without docs, we create one now to track limits
        await adminDb.collection('users').doc(uid).set({
            limits: {
                ...limits,
                images: limits.images + 1,
                lastReset: limits.lastReset
            }
        }, { merge: true });

        // 5. Sign Request
        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);

        return NextResponse.json({
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            timestamp: paramsToSign.timestamp // Echo back or use server time
        });
    } catch (error) {
        console.error("Signature generation failed", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
