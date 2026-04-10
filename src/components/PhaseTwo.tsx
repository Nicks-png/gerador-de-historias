'use client';

import { useState } from 'react';
import { Question } from '@/lib/types';

interface PhaseTwoProps {
  questions: Question[];
  summary: string;
  onSubmit: (answers: Record<string, string>) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function PhaseTwo({
  questions,
  summary,
  onSubmit,
  onBack,
  isLoading,
  error,
}: PhaseTwoProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const allAnswered = questions.every((q) => answers[q.id]?.trim());
  const answeredCount = questions.filter((q) => answers[q.id]?.trim()).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allAnswered) {
      onSubmit(answers);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-amber-400 mb-2">
          Personalize sua aventura
        </h2>
        <p className="text-stone-400 text-sm">
          Responda as perguntas abaixo para que a IA crie uma aventura sob medida.
        </p>
      </div>

      <div className="bg-stone-800/50 border border-stone-700 rounded-lg px-4 py-3 mb-6 text-sm text-stone-400">
        <span className="text-stone-500 font-medium">Resumo: </span>
        {summary}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {questions.map((q, index) => (
          <div key={q.id} className="space-y-1.5">
            <label className="flex gap-2 text-sm font-medium text-stone-200">
              <span className="text-amber-500 font-bold">{index + 1}.</span>
              {q.text}
            </label>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
              placeholder="Sua resposta..."
              rows={2}
              disabled={isLoading}
              className="w-full bg-stone-800 border border-stone-600 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none text-sm disabled:opacity-50"
            />
          </div>
        ))}

        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="text-stone-400 hover:text-stone-200 text-sm transition-colors disabled:opacity-50"
          >
            ← Voltar
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500">
              {answeredCount}/{questions.length} respondidas
            </span>
            <button
              type="submit"
              disabled={isLoading || !allAnswered}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 text-stone-900 font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚔</span> Gerando aventura...
                </span>
              ) : (
                'Gerar Aventura ✨'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
