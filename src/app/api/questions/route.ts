import { NextRequest, NextResponse } from 'next/server';
import { groq, MODEL } from '@/lib/groq';
import { QUESTIONS_SYSTEM_PROMPT } from '@/lib/prompts';
import { Question } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { summary } = await request.json();

    if (!summary || typeof summary !== 'string' || summary.trim().length === 0) {
      return NextResponse.json({ error: 'Resumo inválido' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: QUESTIONS_SYSTEM_PROMPT },
        { role: 'user', content: `Gere as perguntas para esta aventura de RPG:\n\n"${summary.trim()}"` },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? '';

    let parsed: { questions: Question[] };
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
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
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Erro em /api/questions:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
