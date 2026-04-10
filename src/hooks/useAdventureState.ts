'use client';

import { useState, useCallback, useEffect } from 'react';
import { AdventureState, Conversation, Question, ChatMessage } from '@/lib/types';
import { extractTitle } from '@/hooks/useHistory';

const STORAGE_KEY = 'rpg-conversations';
const ACTIVE_ID_KEY = 'rpg-active-conversation';

const initialState: AdventureState = {
  conversationId: null,
  phase: 0,
  summary: '',
  questions: [],
  adventure: '',
  chatMessages: [],
  isLoading: false,
  error: null,
};

export function useAdventureState(
  onSave: (data: Omit<Conversation, 'createdAt' | 'updatedAt'> & { createdAt?: string }) => void
) {
  const [state, setState] = useState<AdventureState>(initialState);

  // Restore active conversation on mount
  useEffect(() => {
    try {
      const activeId = localStorage.getItem(ACTIVE_ID_KEY);
      if (!activeId) return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const convs: Conversation[] = JSON.parse(raw);
      const active = convs.find((c) => c.id === activeId);
      if (active) {
        setState({
          conversationId: active.id,
          phase: active.phase,
          summary: active.summary,
          questions: active.questions,
          adventure: active.adventure,
          chatMessages: active.chatMessages,
          isLoading: false,
          error: null,
        });
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save when loading finishes
  useEffect(() => {
    if (!state.isLoading && state.conversationId && state.phase >= 2) {
      persistState(state);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isLoading]);

  function persistState(s: AdventureState) {
    if (!s.conversationId) return;
    localStorage.setItem(ACTIVE_ID_KEY, s.conversationId);
    onSave({
      id: s.conversationId,
      title: extractTitle(s.adventure, s.summary),
      summary: s.summary,
      phase: s.phase,
      questions: s.questions,
      adventure: s.adventure,
      chatMessages: s.chatMessages,
    });
  }

  const startNewConversation = useCallback(() => {
    const id = crypto.randomUUID();
    setState({ ...initialState, conversationId: id, phase: 1 });
    localStorage.setItem(ACTIVE_ID_KEY, id);
  }, []);

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
      const previousAdventure = state.adventure;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        chatMessages: [...prev.chatMessages, userMsg],
      }));

      const abortController = new AbortController();
      const abortTimer = setTimeout(() => abortController.abort(), 55000);

      try {
        const response = await fetch('/api/edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adventure: state.adventure,
            editRequest: msg,
            chatHistory: state.chatMessages,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Erro ao processar alteração');
        }

        const { confirmation, adventure: newAdventure } = await response.json();

        setState((prev) => ({
          ...prev,
          isLoading: false,
          adventure: newAdventure || previousAdventure,
          chatMessages: [
            ...prev.chatMessages,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: confirmation || '✓ Aventura atualizada.',
            },
          ],
        }));
      } catch (error) {
        const isAbort = error instanceof Error && error.name === 'AbortError';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          adventure: previousAdventure,
          chatMessages: [
            ...prev.chatMessages,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: isAbort
                ? '⚠ A alteração demorou demais. Tente um pedido mais curto.'
                : `⚠ ${error instanceof Error ? error.message : 'Erro ao processar alteração.'}`,
            },
          ],
        }));
      } finally {
        clearTimeout(abortTimer);
      }
    },
    [state.adventure, state.chatMessages]
  );

  const loadConversation = useCallback((conv: Conversation) => {
    localStorage.setItem(ACTIVE_ID_KEY, conv.id);
    setState({
      conversationId: conv.id,
      phase: conv.phase,
      summary: conv.summary,
      questions: conv.questions,
      adventure: conv.adventure,
      chatMessages: conv.chatMessages,
      isLoading: false,
      error: null,
    });
  }, []);

  const resetAdventure = useCallback(() => {
    localStorage.removeItem(ACTIVE_ID_KEY);
    setState(initialState);
  }, []);

  const retryFromPhase2 = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 2, adventure: '', error: null }));
  }, []);

  return {
    state,
    startNewConversation,
    submitSummary,
    submitAnswers,
    sendChatMessage,
    loadConversation,
    resetAdventure,
    retryFromPhase2,
  };
}
