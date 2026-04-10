'use client';

import { useState } from 'react';
import { Conversation } from '@/lib/types';

interface SidebarProps {
  conversations: Conversation[];
  isOpen: boolean;
  onToggle: () => void;
  onLoad: (conv: Conversation) => void;
  onDelete: (id: string) => void;
  onNewAdventure: () => void;
  currentConversationId: string | null;
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} sem. atrás`;
  return `${Math.floor(days / 30)} meses atrás`;
}

export default function Sidebar({
  conversations,
  isOpen,
  onToggle,
  onLoad,
  onDelete,
  onNewAdventure,
  currentConversationId,
}: SidebarProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 2500);
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-stone-950 border-r border-stone-800 transition-all duration-300 overflow-hidden shrink-0 ${
        isOpen ? 'w-[260px]' : 'w-12'
      }`}
    >
      {/* Header da sidebar */}
      <div className="flex items-center justify-between px-3 h-14 border-b border-stone-800 shrink-0">
        {isOpen && (
          <button
            onClick={onNewAdventure}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 transition-colors font-medium"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Nova aventura
          </button>
        )}
        <button
          onClick={onToggle}
          className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-stone-300 hover:bg-stone-800 rounded-md transition-colors ml-auto"
          title={isOpen ? 'Recolher' : 'Expandir'}
        >
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
          >
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Lista de conversas */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-stone-600 text-xs leading-relaxed">
                Nenhuma aventura salva.<br />Gere uma para começar.
              </p>
            </div>
          ) : (
            <ul className="space-y-0.5 px-2">
              {conversations.map((conv) => {
                const isActive = conv.id === currentConversationId;
                const inProgress = conv.phase < 3;
                return (
                  <li key={conv.id}>
                    <button
                      onClick={() => onLoad(conv)}
                      className={`group w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 relative ${
                        isActive
                          ? 'bg-amber-500/10 border border-amber-500/20 text-stone-200'
                          : 'hover:bg-stone-800/70 text-stone-400 hover:text-stone-200 border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-500 rounded-full" />
                      )}
                      <p className="text-xs font-medium truncate pr-6 leading-relaxed">
                        {conv.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {inProgress && (
                          <span className="text-[9px] font-medium text-amber-500/70">● em progresso</span>
                        )}
                        <p className="text-[10px] text-stone-600">
                          {relativeDate(conv.updatedAt)}
                        </p>
                      </div>

                      {/* Botão deletar */}
                      <button
                        onClick={(e) => handleDelete(e, conv.id)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded transition-all ${
                          confirmDelete === conv.id
                            ? 'text-red-400 opacity-100'
                            : 'text-stone-600 opacity-0 group-hover:opacity-100 hover:text-red-400'
                        }`}
                        title={confirmDelete === conv.id ? 'Confirmar?' : 'Deletar'}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Ícone colapsado */}
      {!isOpen && (
        <div className="flex-1 flex flex-col items-center pt-3 gap-3">
          <button
            onClick={onNewAdventure}
            className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-amber-400 hover:bg-stone-800 rounded-md transition-colors"
            title="Nova aventura"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
