'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PhaseThreeProps {
  adventure: string;
  isLoading: boolean;
  error: string | null;
  onNewAdventure: () => void;
  onAdjust: () => void;
}

export default function PhaseThree({
  adventure,
  isLoading,
  error,
  onNewAdventure,
  onAdjust,
}: PhaseThreeProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(adventure);
    } catch {
      // fallback silencioso
    }
  };

  const isStreaming = isLoading || (adventure.length > 0 && !adventure.includes('## Ganchos para o Futuro'));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-amber-400">
          Sua Aventura
          {isStreaming && (
            <span className="ml-2 text-sm font-normal text-stone-400 animate-pulse">
              gerando...
            </span>
          )}
        </h2>
        {!isStreaming && adventure && (
          <div className="flex gap-2">
            <button
              onClick={onAdjust}
              className="text-xs text-stone-400 hover:text-stone-200 border border-stone-600 hover:border-stone-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              Ajustar respostas
            </button>
            <button
              onClick={handleCopy}
              className="text-xs text-stone-400 hover:text-stone-200 border border-stone-600 hover:border-stone-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              Copiar Markdown
            </button>
            <button
              onClick={onNewAdventure}
              className="text-xs bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Nova Aventura
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm mb-4">
          {error}
          <button
            onClick={onAdjust}
            className="ml-2 underline hover:no-underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="bg-stone-800/40 border border-stone-700 rounded-xl p-6 min-h-32">
        {adventure ? (
          <div className="prose prose-invert prose-amber max-w-none prose-sm prose-headings:text-amber-400 prose-strong:text-stone-200 prose-blockquote:text-stone-400 prose-blockquote:border-amber-600 prose-table:text-sm prose-th:text-amber-400 prose-a:text-amber-500">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {adventure}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse ml-0.5" />
            )}
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-32 text-stone-500">
            <span className="animate-spin mr-2 text-amber-500">⚔</span>
            Preparando sua aventura...
          </div>
        ) : null}
      </div>

      {!isStreaming && adventure && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onNewAdventure}
            className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold py-2.5 px-8 rounded-lg transition-colors text-sm"
          >
            Criar Nova Aventura
          </button>
        </div>
      )}
    </div>
  );
}
