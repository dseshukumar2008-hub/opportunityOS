import { createApiProvider } from './createApiProvider';

export const geminiProvider = createApiProvider('gemini', (options) => {
  return {
    systemInstruction: options.systemInstruction || null,
    temperature: options.temperature !== undefined ? options.temperature : 0.3,
    inlineDataItems: options.inlineDataItems || [],
    maxTokens: options.maxTokens,
    contents: options.contents
  };
});
