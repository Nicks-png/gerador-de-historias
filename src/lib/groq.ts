import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY não definida no ambiente');
}

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Modelo principal (100K TPD) → fallback (500K TPD) quando limite atingido
export const MODEL_PRIMARY = 'llama-3.3-70b-versatile';
export const MODEL_FALLBACK = 'llama-3.1-8b-instant';

function isRateLimit(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('429') || error.message.includes('rate_limit');
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
      return await groq.chat.completions.create({ ...params, model: MODEL_FALLBACK });
    }
    throw err;
  }
}
