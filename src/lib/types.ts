export type Phase = 0 | 1 | 2 | 3;

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

export interface Conversation {
  id: string;
  title: string;
  summary: string;
  phase: Phase;
  questions: Question[];
  adventure: string;
  chatMessages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AdventureState {
  conversationId: string | null;
  phase: Phase;
  summary: string;
  questions: Question[];
  adventure: string;
  chatMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
