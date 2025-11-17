"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Image, Sparkles, Shield, HeartPulse, CheckCircle2, Clock, Users, Brain, BookOpen, Heart } from 'lucide-react';
import useSWR from 'swr';
import type { User } from '@/lib/db/schema';
import Link from 'next/link';

type TeamData = {
  subscriptionStatus?: string | null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const { data: teamData } = useSWR<TeamData>('/api/team', fetcher);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const hasActiveSubscription =
    teamData?.subscriptionStatus === 'active' ||
    teamData?.subscriptionStatus === 'trialing';
  const isLoggedIn = !!user;
  const showAssistantCta = isLoggedIn && hasActiveSubscription;

  return (
    <main>
      {/* HERO */}
      <section className="py-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Consultant Platform
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
            ที่ปรึกษาอัจฉริยะ
            <br />
            <span className="text-orange-600">พร้อมให้คำแนะนำในทุกเรื่อง</span>
          </h1>
          <p className="mt-5 text-base text-gray-600 sm:mt-6 sm:text-xl max-w-2xl mx-auto">
            เลือกจาก AI Assistant ที่เชี่ยวชาญเฉพาะด้านต่างๆ รับคำแนะนำที่แม่นยำและเฉพาะเจาะจง พร้อมส่งรูปภาพเพื่อการวิเคราะห์ที่ละเอียดยิ่งขึ้น
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            {showAssistantCta ? (
              <Link href="/assistant">
                <Button size="lg" className="text-lg rounded-full bg-orange-600 hover:bg-orange-700">
                  เริ่มใช้งาน Assistant
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button size="lg" className="text-lg rounded-full bg-orange-600 hover:bg-orange-700">
                  สมัครสมาชิก
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">4</div>
              <div className="text-orange-100">AI Assistants</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-orange-100">พร้อมให้คำแนะนำตลอดเวลา</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">AI</div>
              <div className="text-orange-100">เทคโนโลยี AI ล้ำสมัย</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">รวดเร็ว</div>
              <div className="text-orange-100">ตอบคำถามทันที</div>
            </div>
          </div>
        </div>
      </section>

      {/* ASSISTANTS PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">เลือก Assistant ที่เหมาะกับคุณ</h2>
            <p className="mt-4 text-lg text-gray-600">AI Assistant ที่เชี่ยวชาญเฉพาะด้านต่างๆ พร้อมให้คำแนะนำที่แม่นยำ</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-br from-orange-50 to-white p-6 border border-orange-100 hover:shadow-lg transition-all hover:scale-105">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-orange-500 text-white mb-4">
                <MessageSquare className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Facial Skin Care Assistant</h3>
              <p className="text-sm text-gray-600 mb-4">
                ที่ปรึกษา AI สำหรับการดูแลผิวหน้า ประเมินสภาพผิว และปัญหาผิวหน้าทุกประเภท ส่งรูปภาพเพื่อรับคำแนะนำได้
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-red-50 to-white p-6 border border-red-100 hover:shadow-lg transition-all hover:scale-105">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-red-500 text-white mb-4">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Health & Nutrition</h3>
              <p className="text-sm text-gray-600 mb-4">
                ให้คำแนะนำเรื่องสุขภาพ โภชนาการ และการรับประทานอาหารเพื่อสุขภาพที่ดี
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white p-6 border border-blue-100 hover:shadow-lg transition-all hover:scale-105">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-blue-500 text-white mb-4">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Assistant</h3>
              <p className="text-sm text-gray-600 mb-4">
                ช่วยเรื่องการเรียน การบ้าน การอ่านหนังสือ และเทคนิคการจำ
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white p-6 border border-purple-100 hover:shadow-lg transition-all hover:scale-105">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-purple-500 text-white mb-4">
                <Brain className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mental Health</h3>
              <p className="text-sm text-gray-600 mb-4">
                ให้คำแนะนำเบื้องต้นเรื่องสุขภาพจิต การจัดการความเครียด และอารมณ์
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">ทำไมต้องเลือก Quizly Pilot?</h2>
            <p className="mt-4 text-lg text-gray-600">แพลตฟอร์มที่ปรึกษา AI ที่ครอบคลุมทุกความต้องการของคุณ</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-orange-500 text-white mb-4">
                <Image className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ส่งรูปภาพได้</h3>
              <p className="text-sm text-gray-600">
                ส่งรูปภาพเพื่อให้ AI วิเคราะห์และให้คำแนะนำที่แม่นยำและเฉพาะเจาะจง
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-orange-500 text-white mb-4">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI อัจฉริยะ</h3>
              <p className="text-sm text-gray-600">
                ใช้เทคโนโลยี AI ล้ำสมัยเพื่อวิเคราะห์และให้คำแนะนำที่เหมาะสมกับปัญหาของคุณ
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-orange-500 text-white mb-4">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ปลอดภัย</h3>
              <p className="text-sm text-gray-600">
                ข้อมูลส่วนตัวของคุณจะถูกเก็บรักษาอย่างปลอดภัยและเป็นความลับ
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-orange-500 text-white mb-4">
                <Clock className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ตอบทันที</h3>
              <p className="text-sm text-gray-600">
                ไม่ต้องรอคิว รับคำแนะนำทันทีที่ส่งคำถามหรือรูปภาพ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">ใช้งานง่ายเพียง 3 ขั้นตอน</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">สมัครสมาชิก</h3>
              <p className="text-gray-600">เลือกแพ็กเกจที่เหมาะสมและสมัครสมาชิกเพื่อเริ่มใช้งาน</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">เลือกและถาม Assistant</h3>
              <p className="text-gray-600">เลือก Assistant ที่เหมาะสมและถามคำถามหรือส่งรูปภาพเพื่อรับคำแนะนำ</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">รับคำแนะนำ</h3>
              <p className="text-gray-600">รับคำแนะนำที่เหมาะสมและเฉพาะเจาะจงจาก AI Consultant ทันที</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECONDARY CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">พร้อมเริ่มใช้งานแล้วหรือยัง?</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-orange-100">
            เข้าร่วมกับผู้ใช้หลายพันคนที่ไว้วางใจ Quizly Pilot ในการรับคำแนะนำจาก AI Assistant ที่เชี่ยวชาญเฉพาะด้าน
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            {!showAssistantCta ? (
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg rounded-full bg-white text-orange-600 hover:bg-gray-50 border-0">
                  ดูแพ็กเกจและราคา
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/assistant">
                <Button size="lg" variant="outline" className="text-lg rounded-full bg-white text-orange-600 hover:bg-gray-50 border-0">
                  เริ่มใช้งานตอนนี้
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">© {new Date().getFullYear()} Quizly Pilot</div>
            <div className="flex items-center gap-4 text-sm">
              <a href="/pricing" className="text-gray-700 hover:text-gray-900">Pricing</a>
              <a href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Created by <span className="font-semibold text-gray-700">TKOBRO</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
