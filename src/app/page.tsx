'use client';

import ProgressBar from '@/components/ProgressBar';
import PhaseOne from '@/components/PhaseOne';
import PhaseTwo from '@/components/PhaseTwo';
import PhaseThree from '@/components/PhaseThree';
import { useAdventureState } from '@/hooks/useAdventureState';

export default function Home() {
  const { state, submitSummary, submitAnswers, resetAdventure, retryFromPhase2, submitEdit } =
    useAdventureState();

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.07),transparent)]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-stone-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-stone-900 font-bold text-sm shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              ⚔
            </div>
            <span className="font-bold text-stone-200 tracking-tight text-sm">RPG Stories</span>
          </div>
          {state.phase !== 1 && (
            <button
              onClick={resetAdventure}
              className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
            >
              Recomeçar
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="relative max-w-5xl mx-auto px-6 py-12">
        {/* Hero — only on phase 1 */}
        {state.phase === 1 && (
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-stone-100 tracking-tight mb-4">
              Gere aventuras de{' '}
              <span className="text-amber-400">RPG de mesa</span>
            </h1>
            <p className="text-stone-400 text-base max-w-lg mx-auto leading-relaxed">
              Descreva sua ideia, responda algumas perguntas e receba uma aventura completa — pronta para jogar.
            </p>
          </div>
        )}

        <ProgressBar currentPhase={state.phase} />

        {state.phase === 1 && (
          <PhaseOne
            onSubmit={submitSummary}
            isLoading={state.isLoading}
            error={state.error}
          />
        )}

        {state.phase === 2 && (
          <PhaseTwo
            questions={state.questions}
            summary={state.summary}
            onSubmit={submitAnswers}
            onBack={resetAdventure}
            isLoading={state.isLoading}
            error={state.error}
          />
        )}

        {state.phase === 3 && (
          <PhaseThree
            adventure={state.adventure}
            isLoading={state.isLoading}
            error={state.error}
            onNewAdventure={resetAdventure}
            onAdjust={retryFromPhase2}
            onEdit={submitEdit}
          />
        )}
      </main>
    </div>
  );
}
