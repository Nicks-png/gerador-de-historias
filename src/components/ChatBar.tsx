'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';

interface ChatBarProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isAdventureReady: boolean;
  onSend: (msg: string) => void;
}

const SUGGESTIONS = [
  'Adicione mais um NPC com segredos próprios',
  'Torne o tom mais sombrio',
  'Adicione uma reviravolta no final',
  'Inclua mais detalhes dos locais',
  'Adicione uma cena de combate extra',
];

export default function ChatBar({ messages, isLoading, isAdventureReady, onSend }: ChatBarProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || isLoading) return;
    onSend(msg);
    setInput('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (s: string) => {
    setInput(s);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  if (!isAdventureReady) return null;

  return (
    <div className="border-t border-stone-800 bg-stone-950 shrink-0">
      {/* Mensagens */}
      {messages.length > 0 && (
        <div className="max-h-[200px] overflow-y-auto px-4 py-3 space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500/15 text-amber-200 rounded-br-sm'
                    : 'bg-stone-800 text-stone-300 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-stone-800 px-3 py-2 rounded-xl rounded-bl-sm">
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Sugestões */}
      {showSuggestions && !isLoading && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="text-[11px] text-stone-500 hover:text-amber-400 border border-stone-800 hover:border-amber-600/30 px-2.5 py-1 rounded-full transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2 px-4 py-3">
        <button
          onClick={() => setShowSuggestions((s) => !s)}
          className={`shrink-0 w-8 h-8 mb-0.5 flex items-center justify-center rounded-lg transition-colors ${
            showSuggestions
              ? 'text-amber-400 bg-amber-500/10'
              : 'text-stone-600 hover:text-stone-400 hover:bg-stone-800'
          }`}
          title="Sugestões"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Peça uma alteração na aventura... (Enter para enviar)"
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-stone-800/60 border border-stone-700/50 focus:border-amber-500/30 focus:ring-1 focus:ring-amber-500/10 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-600 text-sm resize-none outline-none transition-all disabled:opacity-50 max-h-28"
          style={{ height: 'auto' }}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = Math.min(t.scrollHeight, 112) + 'px';
          }}
        />

        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="shrink-0 w-8 h-8 mb-0.5 flex items-center justify-center bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-900 rounded-lg transition-colors"
        >
          {isLoading ? (
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5h11M7 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
