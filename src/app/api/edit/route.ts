import { NextRequest } from 'next/server';
import { groq, MODEL } from '@/lib/groq';
import { EDIT_SYSTEM_PROMPT, buildEditPrompt } from '@/lib/prompts';

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const { adventure, editRequest }: { adventure: string; editRequest: string } =
      await request.json();

    if (!adventure || !editRequest?.trim()) {
      return new Response('Dados inválidos', { status: 400 });
    }

    const stream = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 8192,
      temperature: 0.7,
      stream: true,
      messages: [
        { role: 'system', content: EDIT_SYSTEM_PROMPT },
        { role: 'user', content: buildEditPrompt(adventure, editRequest.trim()) },
      ],
    });

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
