import { Metadata, ResolvingMetadata } from 'next';
import { adminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import { ArrowLeft, Flame, HeartCrack } from 'lucide-react';
import { notFound } from 'next/navigation';

type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

// Fetch whisper helper
async function getWhisper(id: string) {
    if (!adminDb) return null;
    const doc = await adminDb.collection('whispers').doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return { id: doc.id, ...data } as any;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const whisper = await getWhisper(params.id);

    if (!whisper) {
        return {
            title: 'Whisper Not Found',
        };
    }

    const text = whisper.text || 'Secret message';
    const truncated = text.length > 50 ? text.substring(0, 50) + '...' : text;

    return {
        title: `Someone confessed: "${truncated}" | Kihumba Whispers`,
        description: `Read this anonymous confession on Kihumba. ${text.substring(0, 150)}...`,
        openGraph: {
            title: `Anonymous Whisper: "${truncated}"`,
            description: text,
            url: `https://kihumba.com/tools/whispers/${params.id}`,
        },
    };
}

export default async function WhisperDetail({ params }: Props) {
    const whisper = await getWhisper(params.id);

    if (!whisper) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#FFF9F0] pt-32 pb-20 px-4 font-sans text-[#1a1817] flex justify-center">
            <div className="max-w-2xl w-full">
                <Link href="/tools/whispers" className="inline-flex items-center gap-2 font-bold hover:underline mb-8 opacity-60 hover:opacity-100">
                    <ArrowLeft className="w-4 h-4" /> Back to The Void
                </Link>

                <div className={`bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0_0_#000] p-8 ${whisper.color ? '' : 'bg-white'}`} style={{ backgroundColor: whisper.color }}>
                    <h1 className="text-3xl md:text-4xl font-black leading-snug mb-8">"{whisper.text}"</h1>

                    <div className="flex justify-between items-center text-sm font-bold opacity-60 border-t-2 border-black/10 pt-4">
                        <span>{new Date(whisper.createdAt).toLocaleDateString()}</span>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> {whisper.upvotes || 0}</span>
                            <span className="flex items-center gap-1"><HeartCrack className="w-4 h-4" /> {whisper.downvotes || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h3 className="font-black text-xl mb-4">Have a secret?</h3>
                    <Link href="/tools/whispers">
                        <button className="bg-[#FF0040] text-white px-8 py-4 rounded-full font-black text-lg border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-none transition-all">
                            Confess Anonymously
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
