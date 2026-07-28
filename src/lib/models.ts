export const AI_MODELS = [
  {
    id: 'gemini-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    cost: 'Free (15 RPM)',
    maxTokens: 8192,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    cost: 'Free (2 RPM)',
    maxTokens: 8192,
  },
] as const;

export type AIModelId = (typeof AI_MODELS)[number]['id'];
