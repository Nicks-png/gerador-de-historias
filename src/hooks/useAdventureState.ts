'use client';

import { useState, useCallback, useEffect } from 'react';
import { AdventureState, Question, SavedAdventure, ChatMessage } from '@/lib/types';

const SEPARATOR = '---ADVENTURE---';

const initialState: AdventureState = {
  phase: 1,
  summary: '',
  questions: [],
  adventure: '',
  chatMessages: [],
  isLoading: false,
  error: null,
};

export function useAdventureState(
  onSave: (data: { summary: string; adventure: string }) => void
) {
  const [state, setState] = useState<AdventureState>(initialState);

  // Auto-save quando streaming termina
  useEffect(() => {
    if (state.phase === 3 && !state.isLoading && state.adventure) {
      onSave({ summary: state.summary, adventure: state.adventure });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isLoading]);

  const submitSummary = useCallback(async (summary: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, summary }));

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro ao gerar perguntas');
      }

      const data: { questions: Question[] } = await response.json();
      setState((prev) => ({ ...prev, phase: 2, questions: data.questions, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }));
    }
  }, []);

  const submitAnswers = useCallback(
    async (answers: Record<string, string>) => {
      const questionsWithAnswers: Question[] = state.questions.map((q) => ({
        ...q,
        answer: answers[q.id] || '',
      }));

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        questions: questionsWithAnswers,
        adventure: '',
        chatMessages: [],
        phase: 3,
      }));

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ summary: state.summary, questions: questionsWithAnswers }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || 'Erro ao gerar aventura');
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        setState((prev) => ({ ...prev, isLoading: false }));

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setState((prev) => ({
            ...prev,
            adventure: prev.adventure + decoder.decode(value, { stream: true }),
          }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          phase: 2,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }));
      }
    },
    [state.questions, state.summary]
  );

  const sendChatMessage = useCallback(
    async (msg: string) => {
      const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: msg };

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        chatMessages: [...prev.chatMessages, userMsg],
      }));

      try {
        const response = await fetch('/api/edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adventure: state.adventure,
            editRequest: msg,
            chatHistory: state.chatMessages,
          }),
        });

        if (!response.ok) throw new Error(await response.text());

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let adventureStarted = false;
        let confirmationMsg = '';

        setState((prev) => ({ ...prev, isLoading: false, adventure: '' }));

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          if (!adventureStarted) {
            const sepIdx = buffer.indexOf(SEPARATOR);
            if (sepIdx !== -1) {
              confirmationMsg = buffer.slice(0, sepIdx).trim();
              const afterSep = buffer.slice(sepIdx + SEPARATOR.length);
              adventureStarted = true;
              setState((prev) => ({ ...prev, adventure: afterSep }));
              buffer = '';
            }
          } else {
            setState((prev) => ({ ...prev, adventure: prev.adventure + buffer }));
            buffer = '';
          }
        }

        // Flush restante se aventura começou mas ainda havia buffer
        if (adventureStarted && buffer) {
          setState((prev) => ({ ...prev, adventure: prev.adventure + buffer }));
        }

        setState((prev) => ({
          ...prev,
          chatMessages: [
            ...prev.chatMessages,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: confirmationMsg || '✓ Aventura atualizada.',
            },
          ],
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }));
      }
    },
    [state.adventure, state.chatMessages]
  );

  const loadAdventure = useCallback((saved: SavedAdventure) => {
    setState({
      ...initialState,
      phase: 3,
      summary: saved.summary,
      adventure: saved.adventure,
    });
  }, []);

  const resetAdventure = useCallback(() => setState(initialState), []);

  const retryFromPhase2 = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 2, adventure: '', error: null }));
  }, []);

  return { state, submitSummary, submitAnswers, sendChatMessage, loadAdventure, resetAdventure, retryFromPhase2 };
}
