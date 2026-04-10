import { NextRequest } from 'next/server';
import { anthropic } from '@/lib/anthropic';
import { ADVENTURE_SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts';
import { Question } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { summary, questions }: { summary: string; questions: Question[] } =
      await request.json();

    if (!summary || !Array.isArray(questions)) {
      return new Response('Dados inválidos', { status: 400 });
    }

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      temperature: 0.9,
      system: ADVENTURE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(summary, questions),
        },
      ],
    });

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      },
      cancel() {
        stream.abort();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Erro em /api/generate:', error);
    return new Response('Erro interno do servidor', { status: 500 });
  }
}
