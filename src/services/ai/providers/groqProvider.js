import { createApiProvider } from './createApiProvider';

export const groqProvider = createApiProvider('groq', (options) => {
  return {
    systemInstruction: options.systemInstruction || null,
    temperature: options.temperature !== undefined ? options.temperature : 0.3,
    // Use caller-specified maxTokens, or a default of 4096.
    // The old default of 1024 (from the server) was far too low for large JSON
    // responses such as Skill Gap reports, causing truncated JSON and parse failures
    // that cascaded into the offline template fallback.
    maxTokens: options.maxTokens || 4096,
    model: 'llama3-70b-8192'
  };
});
