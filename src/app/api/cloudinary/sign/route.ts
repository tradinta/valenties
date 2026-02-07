import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { paramsToSign } = body;

        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);

        return NextResponse.json({ signature });
    } catch (error) {
        console.error("Signature generation failed", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
