'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal, ArrowLeft, ImagePlus, X } from 'lucide-react';

type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    imageUrl?: string;
};

async function fileToDataUrl(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function MentalHealthAssistantPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content:
                'สวัสดี! ฉันคือ Mental Health Assistant พร้อมให้คำแนะนำเบื้องต้นเรื่องสุขภาพจิต การจัดการความเครียด และอารมณ์ ฉันจะฟังและให้คำแนะนำที่เหมาะสมกับคุณ'
        }
    ]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setSelectedFile(file);
        setImagePreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
        });
    };

    const clearImage = (revokeURL = true) => {
        if (imagePreview && revokeURL) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setSelectedFile(null);
        if (galleryInputRef.current) galleryInputRef.current.value = '';
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed && !selectedFile) return;

        const currentImagePreview = imagePreview;

        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: trimmed || '',
            imageUrl: currentImagePreview || undefined
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        clearImage(false); // Clear image preview but don't revoke URL (image is used in chat)
        setIsSending(true);

        try {
            const imageBase64 = selectedFile ? await fileToDataUrl(selectedFile) : undefined;
            const resp = await fetch('/api/assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages.concat(userMsg).map((m) => ({ role: m.role, content: m.content })),
                    imageBase64,
                    assistantType: 'mental-health'
                })
            });

            if (!resp.ok) {
                const errorData = await resp.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData?.error || `HTTP ${resp.status}`);
            }

            const data = await resp.json();
            const reply = data?.reply || data?.error || 'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
            setMessages((prev) => [
                ...prev,
                { id: crypto.randomUUID(), role: 'assistant', content: reply }
            ]);
        } catch (e: any) {
            setMessages((prev) => [
                ...prev,
                { id: crypto.randomUUID(), role: 'assistant', content: e?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ API' }
            ]);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        // Shift + Enter will create a new line (default behavior)
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    return (
        <section className="max-w-7xl mx-auto w-full p-4 lg:p-8 pb-0 flex flex-col h-[calc(100dvh-68px)]">
            <div className="flex items-center gap-3 mb-4">
                <Button
                    variant="ghost"
                    className="px-2 py-1 h-8 gap-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => router.push('/assistant')}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-lg lg:text-2xl font-medium">Mental Health Assistant</h1>
            </div>
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto space-y-4 p-6 mb-24 relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed space-y-2 ${msg.role === 'user'
                                ? 'bg-purple-500 text-white shadow-sm'
                                : 'bg-white text-gray-900 shadow-sm border border-gray-100'
                                }`}
                        >
                            {msg.imageUrl && (
                                <img
                                    src={msg.imageUrl}
                                    alt="รูปภาพที่ส่ง"
                                    className="rounded-lg max-w-full h-auto max-h-64 object-contain"
                                />
                            )}
                            {msg.content && (
                                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                            )}
                        </div>
                    </div>
                ))}
                {isSending && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white text-gray-900 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-1">
                                <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
                                <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                                <span className="inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 z-20">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 space-y-3">
                    {imagePreview ? (
                        <div className="flex items-center justify-between gap-3 rounded-md border bg-white p-2 shadow-sm">
                            <div className="flex items-center gap-3">
                                <img
                                    src={imagePreview}
                                    alt="แนบรูปภาพ"
                                    className="h-14 w-14 rounded object-cover border"
                                />
                                <div className="text-sm text-gray-600">รูปภาพแนบพร้อมส่ง</div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={clearImage} className="text-gray-700">
                                <X className="h-4 w-4" />
                                <span className="sr-only">ลบรูป</span>
                            </Button>
                        </div>
                    ) : null}
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                        <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleSelectImage}
                            aria-label="แนบรูปจากแกลเลอรี"
                            title="แนบรูปจากแกลเลอรี"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2 shrink-0"
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={isSending}
                            aria-label="แนบรูป"
                            title="แนบรูป"
                        >
                            <ImagePlus className="h-4 w-4" />
                            <span className="hidden sm:inline">แนบรูป</span>
                        </Button>
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask something"
                            disabled={isSending}
                            rows={1}
                            className="flex-1 border-0 focus-visible:ring-0 shadow-none resize-none overflow-hidden min-h-[40px] max-h-[120px] py-3 px-3 text-sm leading-relaxed"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isSending || (!input.trim() && !selectedFile)}
                            className="bg-purple-500 hover:bg-purple-600 text-white shrink-0"
                        >
                            <SendHorizonal className="h-4 w-4" />
                            <span className="sr-only">ส่งข้อความ</span>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

