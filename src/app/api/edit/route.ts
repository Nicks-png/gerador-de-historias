import { NextRequest } from 'next/server';
import { groq, MODEL_PRIMARY, MODEL_FALLBACK, MAX_TOKENS_FALLBACK, isRateLimit } from '@/lib/groq';
import { EDIT_SYSTEM_PROMPT, buildEditPrompt } from '@/lib/prompts';
import { ChatMessage } from '@/lib/types';

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const {
      adventure,
      editRequest,
      chatHistory,
    }: { adventure: string; editRequest: string; chatHistory?: ChatMessage[] } =
      await request.json();

    if (!adventure || !editRequest?.trim()) {
      return new Response('Dados inválidos', { status: 400 });
    }

    const params = {
      max_tokens: 8192,
      temperature: 0.7,
      stream: true as const,
      messages: [
        { role: 'system' as const, content: EDIT_SYSTEM_PROMPT },
        { role: 'user' as const, content: buildEditPrompt(adventure, editRequest.trim(), chatHistory) },
      ],
    };

    let stream;
    try {
      stream = await groq.chat.completions.create({ ...params, model: MODEL_PRIMARY });
    } catch (err) {
      if (isRateLimit(err)) {
        stream = await groq.chat.completions.create({
          ...params,
          model: MODEL_FALLBACK,
          max_tokens: MAX_TOKENS_FALLBACK,
        });
      } else throw err;
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? '';
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Erro em /api/edit:', msg);
    return new Response(msg, { status: 500 });
  }
}
