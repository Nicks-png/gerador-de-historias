import { NextRequest, NextResponse } from 'next/server';
import { createChatCompletion } from '@/lib/groq';
import { EDIT_SYSTEM_PROMPT, buildEditPrompt } from '@/lib/prompts';
import { ChatMessage } from '@/lib/types';

export const maxDuration = 55;

export async function POST(request: NextRequest) {
  try {
    const {
      adventure,
      editRequest,
      chatHistory,
    }: { adventure: string; editRequest: string; chatHistory?: ChatMessage[] } =
      await request.json();

    if (!adventure || !editRequest?.trim()) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const completion = await createChatCompletion({
      max_tokens: 5000,
      temperature: 0.7,
      messages: [
        { role: 'system', content: EDIT_SYSTEM_PROMPT },
        { role: 'user', content: buildEditPrompt(adventure, editRequest.trim(), chatHistory) },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? '';

    // Extrai confirmação e aventura pelo separador
    const sepIdx = raw.indexOf('---ADVENTURE---');
    if (sepIdx === -1) {
      // Sem separador: trata o conteúdo inteiro como aventura atualizada
      return NextResponse.json({ confirmation: '✓ Aventura atualizada.', adventure: raw.trim() });
    }

    const confirmation = raw.slice(0, sepIdx).trim();
    const updatedAdventure = raw.slice(sepIdx + '---ADVENTURE---'.length).trim();

    return NextResponse.json({ confirmation: confirmation || '✓ Aventura atualizada.', adventure: updatedAdventure });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Erro em /api/edit:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
