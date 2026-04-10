import { NextRequest } from 'next/server';
import { genAI, MODEL } from '@/lib/gemini';
import { ADVENTURE_SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts';
import { Question } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { summary, questions }: { summary: string; questions: Question[] } =
      await request.json();

    if (!summary || !Array.isArray(questions)) {
      return new Response('Dados inválidos', { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: ADVENTURE_SYSTEM_PROMPT,
    });

    const result = await model.generateContentStream(
      buildUserPrompt(summary, questions)
    );

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Erro em /api/generate:', msg);
    return new Response(msg, { status: 500 });
  }
}
