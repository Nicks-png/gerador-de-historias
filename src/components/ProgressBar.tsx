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
    <div className="flex items-center justify-center gap-0 mb-10">
      {phases.map((phase, index) => {
        const done = currentPhase > phase.number;
        const active = currentPhase === phase.number;

        return (
          <div key={phase.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
                  done
                    ? 'bg-amber-500 border-amber-500 text-stone-900 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : active
                    ? 'bg-stone-900 border-amber-400 text-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.3)]'
                    : 'bg-transparent border-stone-700 text-stone-600'
                }`}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  phase.number
                )}
              </div>
              <span
                className={`text-xs font-medium tracking-wide transition-colors duration-300 ${
                  done || active ? 'text-amber-400' : 'text-stone-600'
                }`}
              >
                {phase.label}
              </span>
            </div>

            {index < phases.length - 1 && (
              <div className="w-20 h-px mx-1 mb-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-700" />
                <div
                  className={`absolute inset-y-0 left-0 bg-amber-500 transition-all duration-500 ${
                    done ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
