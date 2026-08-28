import { createApiProvider } from './createApiProvider';

export const openRouterProvider = createApiProvider('openrouter', (options) => {
  return {
    systemInstruction: options.systemInstruction || null,
    temperature: options.temperature !== undefined ? options.temperature : 0.3,
    maxTokens: options.maxTokens,
    model: 'deepseek/deepseek-chat-v3-0324'
  };
});
