export type Phase = 1 | 2 | 3;

export interface Question {
  id: string;
  text: string;
  answer: string;
}

export interface AdventureState {
  phase: Phase;
  summary: string;
  questions: Question[];
  adventure: string;
  isLoading: boolean;
  error: string | null;
}
