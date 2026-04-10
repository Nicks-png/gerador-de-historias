'use client';

import { useState } from 'react';
import ProgressBar from '@/components/ProgressBar';
import PhaseOne from '@/components/PhaseOne';
import PhaseTwo from '@/components/PhaseTwo';
import PhaseThree from '@/components/PhaseThree';
import Sidebar from '@/components/Sidebar';
import ChatBar from '@/components/ChatBar';
import { useAdventureState } from '@/hooks/useAdventureState';
import { useHistory } from '@/hooks/useHistory';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { adventures, save, remove } = useHistory();
  const {
    state,
    submitSummary,
    submitAnswers,
    sendChatMessage,
    loadAdventure,
    resetAdventure,
    retryFromPhase2,
  } = useAdventureState(save);

  const isPhase3 = state.phase === 3;
  const adventureIsDone = !state.isLoading && state.adventure.length > 0;

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      {/* Header */}
      <header className="shrink-0 border-b border-stone-800 bg-stone-950 z-10">
        <div className="h-14 px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-stone-900 font-bold text-xs shadow-[0_0_10px_rgba(245,158,11,0.3)]">
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

      {/* Body */}
      {isPhase3 ? (
        /* Layout fase 3: sidebar + content + chatbar */
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
          <Sidebar
            adventures={adventures}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((o) => !o)}
            onLoad={loadAdventure}
            onDelete={remove}
            onNewAdventure={resetAdventure}
            currentAdventure={state.adventure}
          />

          {/* Main: adventure scroll + chatbar fixo na base */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <ProgressBar currentPhase={state.phase} />
              <PhaseThree
                adventure={state.adventure}
                isLoading={state.isLoading}
                error={state.error}
                onNewAdventure={resetAdventure}
                onAdjust={retryFromPhase2}
              />
            </div>
            <ChatBar
              messages={state.chatMessages}
              isLoading={state.isLoading}
              isAdventureReady={adventureIsDone}
              onSend={sendChatMessage}
            />
          </div>
        </div>
      ) : (
        /* Layout fases 1 e 2: centralizado */
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
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
        </main>
      )}

      {/* Background gradient (fases 1 e 2) */}
      {!isPhase3 && (
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.07),transparent)]" />
        </div>
      )}
    </div>
  );
}
