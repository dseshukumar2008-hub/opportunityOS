import { createApiProvider } from './createApiProvider';

export const groqProvider = createApiProvider('groq', (options) => {
  return {
    systemInstruction: options.systemInstruction || null,
    temperature: options.temperature !== undefined ? options.temperature : 0.3,
    maxTokens: options.maxTokens,
    model: 'llama3-70b-8192'
  };
});
