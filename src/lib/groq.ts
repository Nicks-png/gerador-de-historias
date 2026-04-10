import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY não definida no ambiente');
}

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Modelo principal → fallback quando rate limit atingido
// Fallback usa max_tokens reduzido para caber no limite de 6K TPM da camada gratuita
export const MODEL_PRIMARY = 'llama-3.3-70b-versatile';
export const MODEL_FALLBACK = 'llama-3.1-8b-instant';
export const MAX_TOKENS_FALLBACK = 3500;

export function isRateLimit(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('429') ||
      error.message.includes('rate_limit') ||
      error.message.includes('413')
    );
  }
  return false;
}

import type { ChatCompletionCreateParamsNonStreaming } from 'groq-sdk/resources/chat/completions';

type NonStreamParams = Omit<ChatCompletionCreateParamsNonStreaming, 'model'>;

export async function createChatCompletion(params: NonStreamParams) {
  try {
    return await groq.chat.completions.create({ ...params, model: MODEL_PRIMARY });
  } catch (err) {
    if (isRateLimit(err)) {
      console.warn('Rate limit no modelo principal, usando fallback...');
      return await groq.chat.completions.create({
        ...params,
        model: MODEL_FALLBACK,
        max_tokens: Math.min(params.max_tokens ?? MAX_TOKENS_FALLBACK, MAX_TOKENS_FALLBACK),
      });
    }
    throw err;
  }
}
