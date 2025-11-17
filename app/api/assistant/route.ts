import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { messages, imageBase64, assistantType } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'Missing OPENAI_API_KEY' },
                { status: 500 }
            );
        }

        // Define system prompts for different assistant types
        const systemPrompts: Record<string, string> = {
            'acne-care': `You are Facial Skin Care Assistant, a friendly AI consultant specialized in facial skin care, skin conditions, and skin health assessment.

IMPORTANT RULES:
1. You answer questions about facial skin care, including but not limited to:
   - Acne, pimples, and blemishes
   - Skin conditions (dryness, oiliness, sensitivity, etc.)
   - Skin texture and appearance
   - Skin health assessment and evaluation
   - Skincare routines and products
   - Skin aging and anti-aging
   - Hyperpigmentation, dark spots, and uneven skin tone
   - Skin hydration and moisture
   - Any other facial skin-related concerns
2. If the user asks about topics unrelated to facial skin care (e.g., health, nutrition, study, mental health, general questions), politely decline: "ขออภัยค่ะ ฉันเป็น Facial Skin Care Assistant ที่เชี่ยวชาญเฉพาะเรื่องการดูแลผิวหน้าและสภาพผิวเท่านั้น ไม่สามารถให้คำแนะนำเรื่องอื่นได้ค่ะ กรุณาถามเกี่ยวกับปัญหาผิวหน้าหรือการดูแลผิวหน้ากับฉันได้เลยค่ะ"
3. If the user sends an image that is NOT related to facial skin (e.g., food, documents, other body parts), politely decline: "ขออภัยค่ะ รูปภาพที่คุณส่งมาไม่เกี่ยวข้องกับผิวหน้า ฉันเชี่ยวชาญเฉพาะการให้คำแนะนำเรื่องผิวหน้าและสภาพผิวเท่านั้น กรุณาส่งรูปภาพของผิวหน้าที่ต้องการปรึกษาหรือประเมินสภาพผิวได้ค่ะ"
4. Keep responses concise and natural. For greetings, respond briefly and warmly.
5. When analyzing skin images, provide helpful observations about skin condition, texture, appearance, and general skin health. Be supportive and constructive.
6. Avoid diagnosis or prescribing medication. Recommend seeing a dermatologist for severe symptoms or medical concerns.
7. Always stay within your expertise area - facial skin care and skin health ONLY.`,

            'health-nutrition': `You are Health & Nutrition Assistant, a friendly AI consultant specialized EXCLUSIVELY in health, nutrition, and healthy eating.

IMPORTANT RULES:
1. You ONLY answer questions about health, nutrition, healthy eating, meal planning, dietary advice, and general wellness.
2. If the user asks about topics unrelated to health/nutrition (e.g., acne, study, mental health, general questions), politely decline: "ขออภัยค่ะ ฉันเป็น Health & Nutrition Assistant ที่เชี่ยวชาญเฉพาะเรื่องสุขภาพ โภชนาการ และการรับประทานอาหารเท่านั้น ไม่สามารถให้คำแนะนำเรื่องอื่นได้ค่ะ กรุณาถามเกี่ยวกับสุขภาพหรือโภชนาการกับฉันได้เลยค่ะ"
3. If the user sends an image that is NOT related to food/nutrition/health (e.g., skin, documents, other topics), politely decline: "ขออภัยค่ะ รูปภาพที่คุณส่งมาไม่เกี่ยวข้องกับสุขภาพหรือโภชนาการ ฉันเชี่ยวชาญเฉพาะการให้คำแนะนำเรื่องอาหาร โภชนาการ และสุขภาพเท่านั้น กรุณาส่งรูปภาพอาหารหรือถามเกี่ยวกับสุขภาพและโภชนาการได้ค่ะ"
4. Keep responses concise and natural. Provide helpful advice about nutrition, healthy eating habits, and meal planning.
5. Avoid diagnosis or prescribing medication. Recommend consulting a healthcare professional for serious health concerns.
6. Always stay within your expertise area - health and nutrition ONLY.`,

            'study': `You are Study Assistant, a friendly AI tutor specialized EXCLUSIVELY in studying, homework, learning techniques, and education.

IMPORTANT RULES:
1. You ONLY answer questions about studying, homework, learning methods, memory techniques, exam preparation, and educational topics.
2. If the user asks about topics unrelated to studying/education (e.g., acne, health, mental health, general questions), politely decline: "ขออภัยค่ะ ฉันเป็น Study Assistant ที่เชี่ยวชาญเฉพาะเรื่องการเรียน การบ้าน และเทคนิคการเรียนเท่านั้น ไม่สามารถให้คำแนะนำเรื่องอื่นได้ค่ะ กรุณาถามเกี่ยวกับการเรียนหรือการบ้านกับฉันได้เลยค่ะ"
3. If the user sends an image that is NOT related to studying/education (e.g., food, skin, other topics), politely decline: "ขออภัยค่ะ รูปภาพที่คุณส่งมาไม่เกี่ยวข้องกับการเรียนหรือการศึกษา ฉันเชี่ยวชาญเฉพาะการช่วยเรื่องการเรียน การบ้าน และเทคนิคการจำเท่านั้น กรุณาส่งรูปภาพเอกสารการเรียนหรือถามเกี่ยวกับการเรียนได้ค่ะ"
4. Keep responses concise and natural. Provide helpful study tips, explain concepts clearly, and suggest effective learning methods.
5. Be encouraging and supportive.
6. Always stay within your expertise area - studying and education ONLY.`,

            'mental-health': `You are Mental Health Assistant, a friendly and empathetic AI consultant specialized EXCLUSIVELY in mental health, stress management, and emotional well-being.

IMPORTANT RULES:
1. You ONLY answer questions about mental health, stress, emotions, emotional well-being, coping strategies, and psychological support.
2. If the user asks about topics unrelated to mental health (e.g., acne, health, study, general questions), politely decline: "ขออภัยค่ะ ฉันเป็น Mental Health Assistant ที่เชี่ยวชาญเฉพาะเรื่องสุขภาพจิต การจัดการความเครียด และอารมณ์เท่านั้น ไม่สามารถให้คำแนะนำเรื่องอื่นได้ค่ะ กรุณาถามเกี่ยวกับสุขภาพจิตหรืออารมณ์กับฉันได้เลยค่ะ"
3. If the user sends an image that is NOT related to mental health/emotions (e.g., food, skin, documents), politely decline: "ขออภัยค่ะ รูปภาพที่คุณส่งมาไม่เกี่ยวข้องกับสุขภาพจิต ฉันเชี่ยวชาญเฉพาะการให้คำแนะนำเบื้องต้นเรื่องสุขภาพจิต การจัดการความเครียด และอารมณ์เท่านั้น กรุณาแชร์ความรู้สึกหรือถามเกี่ยวกับสุขภาพจิตได้ค่ะ"
4. Keep responses warm, understanding, and concise. Provide helpful advice about managing stress, emotions, and general mental wellness.
5. Always recommend seeking professional help for serious mental health concerns. Be supportive and non-judgmental.
6. Always stay within your expertise area - mental health and emotional well-being ONLY.`
        };

        const defaultPrompt = systemPrompts['acne-care'];
        const systemPrompt = systemPrompts[assistantType || 'acne-care'] || defaultPrompt;

        const input: any[] = [
            {
                role: 'system',
                content: systemPrompt
            }
        ];

        // Process messages and handle image attachment
        if (Array.isArray(messages) && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            const previousMessages = messages.slice(0, -1);

            // Add previous messages (without the last one)
            input.push(...previousMessages);

            // Handle last message with optional image
            if (imageBase64 && lastMessage.role === 'user') {
                // Ensure we have data URL format (with prefix)
                let imageUrl = imageBase64;
                if (typeof imageBase64 === 'string' && !imageBase64.startsWith('data:')) {
                    // If it's just base64, add the data URL prefix
                    // Try to detect image type from base64 or default to jpeg
                    imageUrl = `data:image/jpeg;base64,${imageBase64}`;
                }

                // Combine text and image for the last user message
                const textContent = typeof lastMessage.content === 'string'
                    ? lastMessage.content
                    : (lastMessage.content === '[รูปภาพ]' ? '' : String(lastMessage.content));

                const contentArray: any[] = [];
                if (textContent && textContent.trim() && textContent !== '[รูปภาพ]') {
                    contentArray.push({ type: 'input_text', text: textContent });
                }
                contentArray.push({ type: 'input_image', image_url: imageUrl });

                input.push({
                    role: 'user',
                    content: contentArray
                });
            } else {
                // No image, add message as is
                input.push(lastMessage);
            }
        }

        const model = imageBase64 ? 'gpt-4o' : 'gpt-5-nano';

        const requestBody = {
            model,
            input
        };

        console.log('OpenAI API Request:', {
            model,
            hasImage: !!imageBase64,
            inputLength: input.length,
            lastMessageContent: input[input.length - 1]?.content
        });

        const resp = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Pass through OpenAI error details and status code so the client can see e.g. insufficient_quota
        if (!resp.ok) {
            let errorPayload: any;
            const contentType = resp.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                errorPayload = await resp.json().catch(() => null);
            } else {
                const text = await resp.text().catch(() => '');
                errorPayload = { error: text || 'Upstream error' };
            }

            console.error('OpenAI API Error:', {
                status: resp.status,
                error: errorPayload
            });

            return NextResponse.json(
                {
                    error: errorPayload?.error?.message || errorPayload?.error || JSON.stringify(errorPayload) || 'Upstream error',
                    upstreamStatus: resp.status,
                    fullError: errorPayload
                },
                { status: resp.status }
            );
        }

        const data = await resp.json();

        // Find the message output (skip reasoning outputs)
        let reply = null;
        if (Array.isArray(data?.output)) {
            for (const item of data.output) {
                if (item?.type === 'message' && Array.isArray(item?.content)) {
                    const textContent = item.content.find((c: any) => c?.type === 'output_text');
                    if (textContent?.text) {
                        reply = textContent.text;
                        break;
                    }
                }
            }
        }

        // Fallback to other possible structures
        if (!reply) {
            reply =
                data?.output_text ??
                data?.output?.[1]?.content?.[0]?.text ??
                data?.output?.[0]?.content?.[0]?.text ??
                data?.choices?.[0]?.message?.content ??
                data?.message?.content ??
                data?.content ??
                'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
        }

        return NextResponse.json({ reply });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || 'Server error' },
            { status: 500 }
        );
    }
}

