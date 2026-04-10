'use client';

import { useState } from 'react';

interface PhaseOneProps {
  onSubmit: (summary: string) => void;
  isLoading: boolean;
  error: string | null;
}

const EXAMPLES = [
  'Heróis contratados para investigar o desaparecimento de crianças em uma cidade portuária sombria',
  'Uma guerra entre dois reinos que esconde um plano demoníaco orquestrado por ambos os lados',
  'Exploração de uma masmorra antiga que ressurgiu misteriosamente no centro de uma metrópole',
];

export default function PhaseOne({ onSubmit, isLoading, error }: PhaseOneProps) {
  const [summary, setSummary] = useState('');
  const isValid = summary.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit(summary.trim());
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Alimentado por IA
        </div>
        <h2 className="text-3xl font-bold text-stone-100 mb-3 tracking-tight">
          Qual é a sua história?
        </h2>
        <p className="text-stone-400 text-sm leading-relaxed max-w-sm mx-auto">
          Descreva o tema ou premissa da aventura. A IA vai fazer as perguntas certas para moldar cada detalhe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Textarea */}
        <div className="relative">
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ex: Uma missão para recuperar um artefato sagrado perdido em uma floresta amaldiçoada, onde os personagens descobrirão que o mal não é o que parece..."
            rows={5}
            disabled={isLoading}
            className="w-full bg-stone-800/60 border border-stone-700 hover:border-stone-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 rounded-xl px-4 py-4 text-stone-100 placeholder-stone-600 text-sm leading-relaxed resize-none transition-all duration-200 outline-none disabled:opacity-50"
          />
          <div className="absolute bottom-3 right-4 text-xs text-stone-600 select-none">
            {summary.trim().length < 10
              ? `${summary.trim().length} / 10 mín`
              : `${summary.trim().length}`}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-950/50 border border-red-800/60 rounded-xl px-4 py-3">
            <span className="text-red-400 mt-0.5 shrink-0">✕</span>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full group relative bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-900 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-sm overflow-hidden"
        >
          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                </svg>
                Gerando perguntas...
              </>
            ) : (
              <>
                Continuar
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </span>
        </button>
      </form>

      {/* Examples */}
      <div className="mt-8 space-y-2">
        <p className="text-xs text-stone-600 font-medium uppercase tracking-widest mb-3">
          Ou comece com um exemplo
        </p>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setSummary(ex)}
            disabled={isLoading}
            className="w-full text-left text-sm text-stone-500 hover:text-amber-400 hover:bg-stone-800/50 border border-transparent hover:border-stone-700/50 px-4 py-2.5 rounded-lg transition-all duration-150 disabled:opacity-40 group"
          >
            <span className="text-stone-700 group-hover:text-amber-600 mr-2">→</span>
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
