export type Phase = 1 | 2 | 3;

export interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface SavedAdventure {
  id: string;
  title: string;
  summary: string;
  adventure: string;
  savedAt: string; // ISO 8601
}

export interface AdventureState {
  phase: Phase;
  summary: string;
  questions: Question[];
  adventure: string;
  chatMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
