import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';
import { QUESTIONS_SYSTEM_PROMPT } from '@/lib/prompts';
import { Question } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { summary } = await request.json();

    if (!summary || typeof summary !== 'string' || summary.trim().length === 0) {
      return NextResponse.json({ error: 'Resumo inválido' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: QUESTIONS_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Gere as perguntas para esta aventura de RPG:\n\n"${summary.trim()}"`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Resposta inesperada da IA' }, { status: 500 });
    }

    let parsed: { questions: Question[] };
    try {
      const jsonText = content.text.trim();
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('JSON não encontrado');
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: 'Falha ao interpretar resposta da IA' }, { status: 500 });
    }

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return NextResponse.json({ error: 'Nenhuma pergunta gerada' }, { status: 500 });
    }

    const questions: Question[] = parsed.questions.map((q: { id: string; text: string }) => ({
      id: q.id,
      text: q.text,
      answer: '',
    }));

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Erro em /api/questions:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
