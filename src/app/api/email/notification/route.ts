import { NextRequest, NextResponse } from 'next/server';
import { sendZeptoEmail } from '@/lib/zepto';

export async function POST(req: NextRequest) {
    try {
        const { to, creatorName, partnerName, attempts } = await req.json();

        if (!to) {
            return NextResponse.json({ error: 'Recipient email required' }, { status: 400 });
        }

        // Basic protection - in a real app, verify creator match

        await sendZeptoEmail({
            from: { email: "notifications@kihumba.com", name: "Kihumba Chaos" },
            to: [{ email: to }],
            subject: `🔥 Chaos Alert! ${partnerName} said YES!`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 3px solid #000; border-radius: 20px;">
                    <h1 style="text-transform: uppercase;">Victory is Yours!</h1>
                    <p>Your "Chaos Trap" was successful.</p>
                    <p><strong>${partnerName}</strong> just clicked YES after <strong>${attempts}</strong> attempts to refuse.</p>
                    <hr />
                    <p style="font-size: 12px; color: #666;">View detailed stats on your <a href="https://kihumba.com/dashboard">Kihumba Dashboard</a>.</p>
                </div>
            `
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Email API Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

