'use client';

import { Conversation } from '@/lib/types';

interface PhaseZeroProps {
  conversations: Conversation[];
  onNew: () => void;
  onLoad: (conv: Conversation) => void;
  onDelete: (id: string) => void;
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} sem. atrás`;
  return `${Math.floor(days / 30)} mes. atrás`;
}

function phaseLabel(phase: number): { label: string; color: string } {
  if (phase === 2) return { label: 'Respondendo', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  if (phase === 3) return { label: 'Concluída', color: 'text-stone-400 bg-stone-800 border-stone-700' };
  return { label: 'Em progresso', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
}

export default function PhaseZero({ conversations, onNew, onLoad, onDelete }: PhaseZeroProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-stone-900 font-bold text-xl shadow-[0_0_24px_rgba(245,158,11,0.3)] mx-auto mb-5">
          ⚔
        </div>
        <h1 className="text-4xl font-bold text-stone-100 tracking-tight mb-3">
          RPG Stories
        </h1>
        <p className="text-stone-400 text-sm max-w-sm mx-auto leading-relaxed">
          Gere aventuras completas para RPG de mesa com IA. Descreva sua ideia e receba uma aventura pronta para jogar.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onNew}
        className="flex items-center gap-2.5 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold text-sm rounded-xl transition-colors shadow-[0_0_20px_rgba(245,158,11,0.25)] mb-12"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1v13M1 7.5h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Nova história
      </button>

      {/* History */}
      {conversations.length > 0 && (
        <div className="w-full">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-3">
            Histórias recentes
          </p>
          <ul className="space-y-2">
            {conversations.map((conv) => {
              const { label, color } = phaseLabel(conv.phase);
              return (
                <li key={conv.id}>
                  <button
                    onClick={() => onLoad(conv)}
                    className="group w-full text-left px-4 py-3.5 bg-stone-800/50 hover:bg-stone-800 border border-stone-700/50 hover:border-stone-600 rounded-xl transition-all duration-150 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-200 truncate leading-snug">
                        {conv.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5 truncate">
                        {conv.summary.slice(0, 80)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${color}`}>
                        {label}
                      </span>
                      <span className="text-[10px] text-stone-600 hidden group-hover:hidden sm:block">
                        {relativeDate(conv.updatedAt)}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                        className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded"
                        title="Deletar"
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
