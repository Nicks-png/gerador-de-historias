'use client';

import ProgressBar from '@/components/ProgressBar';
import PhaseOne from '@/components/PhaseOne';
import PhaseTwo from '@/components/PhaseTwo';
import PhaseThree from '@/components/PhaseThree';
import { useAdventureState } from '@/hooks/useAdventureState';

export default function Home() {
  const { state, submitSummary, submitAnswers, resetAdventure, retryFromPhase2 } =
    useAdventureState();

  return (
    <main className="min-h-screen bg-stone-900 text-stone-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-amber-400 tracking-tight mb-2">
            ⚔ Gerador de Histórias RPG
          </h1>
          <p className="text-stone-400 text-sm max-w-md mx-auto">
            Crie aventuras completas para RPG de mesa com o poder da Inteligência Artificial
          </p>
        </header>

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
          />
        )}
      </div>
    </main>
  );
}
