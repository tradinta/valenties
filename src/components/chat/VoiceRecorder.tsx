"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Trash2, Send } from 'lucide-react';

interface VoiceRecorderProps {
    onSend: (blob: Blob) => void;
    disabled?: boolean;
}

export default function VoiceRecorder({ onSend, disabled }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setPreviewUrl(URL.createObjectURL(blob));

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const deleteRecording = () => {
        setAudioBlob(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    const handleSend = () => {
        if (audioBlob) {
            onSend(audioBlob);
            deleteRecording();
        }
    };

    if (audioBlob && previewUrl) {
        return (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-xl">
                <audio src={previewUrl} controls className="h-8 w-40" />
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={deleteRecording}>
                    <Trash2 className="w-4 h-4" />
                </Button>
                <Button size="icon" className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/80" onClick={handleSend}>
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            className={`transition-all duration-300 border-border/20 ${isRecording ? 'bg-destructive text-destructive-foreground animate-pulse border-destructive/50' : 'hover:bg-muted bg-muted'}`}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={disabled}
            title="Hold to Record"
        >
            {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
        </Button>
    );
}
