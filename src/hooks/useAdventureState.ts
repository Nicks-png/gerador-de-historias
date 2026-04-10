'use client';

import { useState, useCallback } from 'react';
import { AdventureState, Question } from '@/lib/types';

const initialState: AdventureState = {
  phase: 1,
  summary: '',
  questions: [],
  adventure: '',
  isLoading: false,
  error: null,
};

export function useAdventureState() {
  const [state, setState] = useState<AdventureState>(initialState);

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

      setState((prev) => ({
        ...prev,
        phase: 2,
        questions: data.questions,
        isLoading: false,
      }));
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
        phase: 3,
      }));

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            summary: state.summary,
            questions: questionsWithAnswers,
          }),
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
          const chunk = decoder.decode(value, { stream: true });
          setState((prev) => ({
            ...prev,
            adventure: prev.adventure + chunk,
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

  const resetAdventure = useCallback(() => {
    setState(initialState);
  }, []);

  const retryFromPhase2 = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 2,
      adventure: '',
      error: null,
    }));
  }, []);

  const submitEdit = useCallback(async (editRequest: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adventure: state.adventure,
          editRequest,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Erro ao editar aventura');
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      setState((prev) => ({ ...prev, isLoading: false, adventure: '' }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setState((prev) => ({ ...prev, adventure: prev.adventure + chunk }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }));
    }
  }, [state.adventure]);

  return {
    state,
    submitSummary,
    submitAnswers,
    resetAdventure,
    retryFromPhase2,
    submitEdit,
  };
}
