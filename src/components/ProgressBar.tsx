'use client';

import { Phase } from '@/lib/types';

interface ProgressBarProps {
  currentPhase: Phase;
}

const phases = [
  { number: 1, label: 'Resumo' },
  { number: 2, label: 'Perguntas' },
  { number: 3, label: 'Aventura' },
];

export default function ProgressBar({ currentPhase }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {phases.map((phase, index) => (
        <div key={phase.number} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                currentPhase > phase.number
                  ? 'bg-amber-500 border-amber-500 text-stone-900'
                  : currentPhase === phase.number
                  ? 'bg-stone-900 border-amber-500 text-amber-400'
                  : 'bg-transparent border-stone-600 text-stone-500'
              }`}
            >
              {currentPhase > phase.number ? '✓' : phase.number}
            </div>
            <span
              className={`text-xs font-medium ${
                currentPhase >= phase.number ? 'text-amber-400' : 'text-stone-500'
              }`}
            >
              {phase.label}
            </span>
          </div>
          {index < phases.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-2 mb-5 transition-all duration-300 ${
                currentPhase > phase.number ? 'bg-amber-500' : 'bg-stone-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
