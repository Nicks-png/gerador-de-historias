'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PhaseThreeProps {
  adventure: string;
  isLoading: boolean;
  error: string | null;
  onNewAdventure: () => void;
  onAdjust: () => void;
  onEdit: (editRequest: string) => void;
}

export default function PhaseThree({
  adventure,
  isLoading,
  error,
  onNewAdventure,
  onAdjust,
  onEdit,
}: PhaseThreeProps) {
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState('');

  const isStreaming = isLoading || (adventure.length > 0 && !adventure.includes('## Ganchos para o Futuro'));
  const isDone = !isStreaming && adventure.length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(adventure);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silencioso */ }
  };

  const handleEdit = () => {
    if (!editText.trim()) return;
    onEdit(editText.trim());
    setEditText('');
    setEditOpen(false);
  };

  const EDIT_SUGGESTIONS = [
    'Adicione mais um NPC importante com segredos próprios',
    'Inclua uma cena de combate extra na sessão 2',
    'Torne o tom mais sombrio e dramático',
    'Adicione uma reviravolta surpreendente no final',
    'Inclua mais detalhes sobre os locais principais',
  ];

  return (
    <div className="max-w-3xl mx-auto fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-stone-100 tracking-tight">Sua Aventura</h2>
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs text-amber-400/70 font-medium bg-amber-500/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {isLoading && adventure.length === 0 ? 'preparando...' : 'gerando...'}
            </span>
          )}
          {isDone && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400/70 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              pronta
            </span>
          )}
        </div>

        {isDone && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditOpen((o) => !o)}
              className={`text-xs border px-3 py-1.5 rounded-lg transition-all duration-150 ${
                editOpen
                  ? 'text-amber-400 border-amber-600/50 bg-amber-500/10'
                  : 'text-stone-500 hover:text-stone-300 border-stone-700/60 hover:border-stone-600'
              }`}
            >
              ✏ Editar
            </button>
            <button
              onClick={handleCopy}
              className={`text-xs border px-3 py-1.5 rounded-lg transition-all duration-150 ${
                copied
                  ? 'text-emerald-400 border-emerald-700/60 bg-emerald-950/30'
                  : 'text-stone-500 hover:text-stone-300 border-stone-700/60 hover:border-stone-600'
              }`}
            >
              {copied ? '✓ Copiado!' : 'Copiar'}
            </button>
            <button
              onClick={onNewAdventure}
              className="text-xs bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-4 py-1.5 rounded-lg transition-colors"
            >
              Nova
            </button>
          </div>
        )}
      </div>

      {/* Edit panel */}
      {editOpen && isDone && (
        <div className="mb-5 bg-stone-800/50 border border-amber-600/20 rounded-2xl p-5 fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-sm font-semibold">Editar aventura</span>
            <span className="text-stone-600 text-xs">— descreva o que quer adicionar ou alterar</span>
          </div>

          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Ex: Adicione um NPC chamado Lyra, uma elfa traidora que trabalha para o vilão..."
            rows={3}
            className="w-full bg-stone-900/60 border border-stone-700/50 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/10 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-600 text-sm resize-none outline-none transition-all duration-200 mb-3"
          />

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {EDIT_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setEditText(s)}
                className="text-xs text-stone-500 hover:text-amber-400 border border-stone-700/50 hover:border-amber-600/30 px-2.5 py-1 rounded-lg transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => { setEditOpen(false); setEditText(''); }}
              className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleEdit}
              disabled={!editText.trim()}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-900 font-bold py-2 px-5 rounded-lg transition-colors text-sm"
            >
              Aplicar alterações ✨
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-950/50 border border-red-800/60 rounded-xl px-4 py-3 mb-4">
          <span className="text-red-400 mt-0.5 shrink-0">✕</span>
          <p className="text-red-300 text-sm">
            {error}{' '}
            <button onClick={onAdjust} className="underline hover:no-underline ml-1">
              Tentar novamente
            </button>
          </p>
        </div>
      )}

      {/* Content */}
      <div className="bg-stone-800/30 border border-stone-700/50 rounded-2xl overflow-hidden">
        {adventure ? (
          <div className="px-8 py-8 prose prose-invert prose-amber max-w-none
            prose-headings:text-amber-400 prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-2xl prose-h1:mb-2 prose-h1:mt-0
            prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-stone-700/50 prose-h2:pb-2
            prose-h3:text-base prose-h3:text-amber-300 prose-h3:mt-5 prose-h3:mb-2
            prose-p:text-stone-300 prose-p:leading-7 prose-p:text-sm
            prose-strong:text-stone-200 prose-strong:font-semibold
            prose-blockquote:text-stone-400 prose-blockquote:border-l-2 prose-blockquote:border-amber-600/50 prose-blockquote:pl-4 prose-blockquote:not-italic prose-blockquote:text-sm
            prose-ul:text-stone-300 prose-ul:text-sm prose-li:leading-6
            prose-ol:text-stone-300 prose-ol:text-sm
            prose-table:text-sm prose-th:text-amber-400 prose-th:font-semibold prose-th:bg-stone-800/60 prose-th:py-2 prose-td:text-stone-300 prose-td:py-2 prose-td:border-stone-700/40
            prose-code:text-amber-300 prose-code:bg-stone-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
            prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline
            prose-hr:border-stone-700/50">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{adventure}</ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-2 h-[1.1em] bg-amber-400 cursor-blink align-middle ml-0.5 rounded-sm" />
            )}
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <svg className="animate-spin w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="60" strokeDashoffset="20" />
            </svg>
            <p className="text-stone-500 text-sm">Preparando sua aventura...</p>
          </div>
        ) : null}
      </div>

      {/* Bottom CTA */}
      {isDone && (
        <div className="flex justify-center mt-8 gap-3">
          <button
            onClick={() => setEditOpen((o) => !o)}
            className={`text-sm border py-2.5 px-6 rounded-xl transition-all ${
              editOpen
                ? 'text-amber-400 border-amber-600/40 bg-amber-500/5'
                : 'text-stone-400 hover:text-stone-200 border-stone-700 hover:border-stone-600'
            }`}
          >
            ✏ Editar aventura
          </button>
          <button
            onClick={onNewAdventure}
            className="text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold py-2.5 px-8 rounded-xl transition-colors"
          >
            Criar Nova Aventura
          </button>
        </div>
      )}
    </div>
  );
}
