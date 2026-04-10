'use client';

import { useState, useCallback, useEffect } from 'react';
import { SavedAdventure } from '@/lib/types';

const STORAGE_KEY = 'rpg-adventure-history';
const MAX_SAVED = 50;

export function extractTitle(adventure: string): string {
  const match = adventure.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? 'Aventura sem título';
}

export function useHistory() {
  const [adventures, setAdventures] = useState<SavedAdventure[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAdventures(JSON.parse(raw));
    } catch { /* localStorage corrompido: ignora */ }
  }, []);

  const save = useCallback((data: { summary: string; adventure: string }) => {
    setAdventures((prev) => {
      const prefix = data.adventure.slice(0, 120);
      const existingIdx = prev.findIndex((a) => a.adventure.slice(0, 120) === prefix);

      const entry: SavedAdventure = {
        id: existingIdx >= 0 ? prev[existingIdx].id : crypto.randomUUID(),
        title: extractTitle(data.adventure),
        summary: data.summary,
        adventure: data.adventure,
        savedAt: new Date().toISOString(),
      };

      const next = existingIdx >= 0
        ? prev.map((a, i) => (i === existingIdx ? entry : a))
        : [entry, ...prev];

      const trimmed = next.slice(0, MAX_SAVED);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      return trimmed;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setAdventures((prev) => {
      const next = prev.filter((a) => a.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { adventures, save, remove };
}
