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

  const answeredCount = questions.filter((q) => answers[q.id]?.trim()).length;
  const allAnswered = answeredCount === questions.length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allAnswered) onSubmit(answers);
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-100 mb-2 tracking-tight">
          Personalize sua aventura
        </h2>
        <p className="text-stone-400 text-sm">
          Responda as perguntas abaixo para que a IA crie uma aventura sob medida.
        </p>
      </div>

      {/* Summary recap */}
      <div className="flex items-start gap-3 bg-stone-800/40 border border-stone-700/50 rounded-xl px-4 py-3 mb-6">
        <span className="text-amber-500 text-lg mt-0.5 shrink-0">📜</span>
        <div>
          <span className="text-stone-500 text-xs font-medium uppercase tracking-wide block mb-0.5">Resumo</span>
          <p className="text-stone-300 text-sm leading-relaxed line-clamp-2">{summary}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-stone-500 font-medium">
          {answeredCount} de {questions.length} respondidas
        </span>
        <span className="text-xs text-stone-500">{Math.round(progress)}%</span>
      </div>
      <div className="h-1 bg-stone-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {questions.map((q, index) => {
          const answered = !!answers[q.id]?.trim();
          return (
            <div
              key={q.id}
              className={`bg-stone-800/40 border rounded-xl px-5 py-4 transition-all duration-200 ${
                answered
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-stone-700/50 hover:border-stone-600/50'
              }`}
            >
              <label className="flex items-start gap-3 mb-3">
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-colors ${
                    answered
                      ? 'bg-amber-500 text-stone-900'
                      : 'bg-stone-700 text-stone-400'
                  }`}
                >
                  {answered ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="text-stone-200 text-sm font-medium leading-relaxed">{q.text}</span>
              </label>
              <textarea
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder="Sua resposta..."
                rows={2}
                disabled={isLoading}
                className="w-full bg-stone-900/60 border border-stone-700/50 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 rounded-lg px-3 py-2.5 text-stone-100 placeholder-stone-600 text-sm resize-none outline-none transition-all duration-200 disabled:opacity-50"
              />
            </div>
          );
        })}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-950/50 border border-red-800/60 rounded-xl px-4 py-3">
            <span className="text-red-400 mt-0.5 shrink-0">✕</span>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-300 text-sm transition-colors disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Voltar
          </button>

          <button
            type="submit"
            disabled={isLoading || !allAnswered}
            className="group flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-900 font-bold py-3 px-7 rounded-xl transition-all duration-200 text-sm"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                </svg>
                Gerando aventura...
              </>
            ) : (
              <>
                Gerar Aventura
                <span className="text-base">✨</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
