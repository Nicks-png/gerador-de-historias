'use client';

import { useState } from 'react';

interface PhaseOneProps {
  onSubmit: (summary: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function PhaseOne({ onSubmit, isLoading, error }: PhaseOneProps) {
  const [summary, setSummary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.trim().length >= 10) {
      onSubmit(summary.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-400 mb-2">
          Conte a sua história
        </h2>
        <p className="text-stone-400 text-sm">
          Descreva o tema ou resumo da aventura que deseja criar. Quanto mais detalhes,
          melhor será a aventura gerada.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ex: Uma missão para recuperar um artefato sagrado perdido em uma floresta amaldiçoada, onde os personagens descobrirão que o mal não é o que parece..."
            rows={6}
            disabled={isLoading}
            className="w-full bg-stone-800 border border-stone-600 rounded-lg px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none text-sm leading-relaxed disabled:opacity-50"
          />
          <div className="flex justify-between items-center mt-1">
            <span className={`text-xs ${summary.trim().length < 10 ? 'text-stone-500' : 'text-stone-400'}`}>
              {summary.trim().length < 10
                ? `Mínimo 10 caracteres (${summary.trim().length}/10)`
                : `${summary.trim().length} caracteres`}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || summary.trim().length < 10}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 disabled:text-stone-500 text-stone-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚔</span> Gerando perguntas...
            </span>
          ) : (
            'Continuar →'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-stone-800/50 rounded-lg border border-stone-700">
        <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-2">Exemplos de resumos</p>
        <ul className="space-y-1.5">
          {[
            'Heróis contratados para investigar o desaparecimento de crianças em uma cidade portuária',
            'Uma guerra entre dois reinos que esconde um plano demoníaco de ambos os lados',
            'Exploração de uma masmorra antiga que ressurgiu misteriosamente no centro de uma metrópole',
          ].map((ex) => (
            <li key={ex}>
              <button
                type="button"
                onClick={() => setSummary(ex)}
                disabled={isLoading}
                className="text-xs text-amber-600 hover:text-amber-400 transition-colors text-left disabled:opacity-50"
              >
                • {ex}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
