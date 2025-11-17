'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart, BookOpen, Brain, ArrowLeft } from 'lucide-react';

const assistants = [
    {
        id: 'acne-care',
        name: 'Acne Care Assistant',
        description: 'ที่ปรึกษา AI สำหรับปัญหาสิวและดูแลผิวหน้า ส่งรูปภาพเพื่อรับคำแนะนำได้',
        icon: MessageSquare,
        href: '/assistant/acne-care',
        color: 'bg-orange-500'
    },
    {
        id: 'health-nutrition',
        name: 'Health & Nutrition Assistant',
        description: 'ให้คำแนะนำเรื่องสุขภาพ โภชนาการ และการรับประทานอาหารเพื่อสุขภาพที่ดี',
        icon: Heart,
        href: '/assistant/health-nutrition',
        color: 'bg-red-500'
    },
    {
        id: 'study',
        name: 'Study Assistant',
        description: 'ช่วยเรื่องการเรียน การบ้าน การอ่านหนังสือ และเทคนิคการจำ',
        icon: BookOpen,
        href: '/assistant/study',
        color: 'bg-blue-500'
    },
    {
        id: 'mental-health',
        name: 'Mental Health Assistant',
        description: 'ให้คำแนะนำเบื้องต้นเรื่องสุขภาพจิต การจัดการความเครียด และอารมณ์',
        icon: Brain,
        href: '/assistant/mental-health',
        color: 'bg-purple-500'
    }
];

export default function AssistantSelectionPage() {
    const router = useRouter();

    return (
        <section className="max-w-7xl mx-auto w-full p-4 lg:p-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Button
                        variant="ghost"
                        className="px-2 py-1 h-8 gap-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => router.push('/')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">เลือก Assistant</h1>
                <p className="text-gray-600">เลือก Assistant ที่ต้องการใช้งาน</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assistants.map((assistant) => {
                    const Icon = assistant.icon;
                    return (
                        <Card key={assistant.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className={`${assistant.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle>{assistant.name}</CardTitle>
                                <CardDescription>{assistant.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href={assistant.href}>
                                        เริ่มใช้งาน
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
