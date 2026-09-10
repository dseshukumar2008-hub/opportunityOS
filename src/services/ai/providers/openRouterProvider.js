import { createApiProvider } from './createApiProvider';

export const openRouterProvider = createApiProvider('openrouter', (options) => {
  return {
    systemInstruction: options.systemInstruction || null,
    temperature: options.temperature !== undefined ? options.temperature : 0.3,
    // Use caller-specified maxTokens, or a default of 4096.
    // A low token cap causes large JSON responses to be truncated and fail to parse.
    maxTokens: options.maxTokens || 4096,
    model: 'deepseek/deepseek-chat-v3-0324'
  };
});
