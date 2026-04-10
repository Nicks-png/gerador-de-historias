'use client';

import { useState, useCallback, useEffect } from 'react';
import { Conversation } from '@/lib/types';

const STORAGE_KEY = 'rpg-conversations';
const MAX_SAVED = 50;

export function extractTitle(adventure: string, summary: string): string {
  const match = adventure.match(/^#\s+(.+)$/m);
  if (match?.[1]?.trim()) return match[1].trim();
  if (summary?.trim()) return summary.slice(0, 60).trim();
  return 'Nova aventura';
}

export function useHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConversations(JSON.parse(raw));
    } catch { /* localStorage corrompido */ }
  }, []);

  const save = useCallback((data: Omit<Conversation, 'createdAt' | 'updatedAt'> & { createdAt?: string }) => {
    setConversations((prev) => {
      const existingIdx = prev.findIndex((c) => c.id === data.id);
      const existing = existingIdx >= 0 ? prev[existingIdx] : null;
      const now = new Date().toISOString();

      const entry: Conversation = {
        ...data,
        createdAt: existing?.createdAt ?? data.createdAt ?? now,
        updatedAt: now,
      };

      const next = existingIdx >= 0
        ? [entry, ...prev.filter((_, i) => i !== existingIdx)]
        : [entry, ...prev];

      const trimmed = next.slice(0, MAX_SAVED);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      return trimmed;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { conversations, save, remove };
}
