/**
 * Standardized AI Errors
 * Provides unified error types across all AI providers.
 */

export const AIErrorTypes = {
  AI_TIMEOUT: 'AI_TIMEOUT',
  AI_RATE_LIMIT: 'AI_RATE_LIMIT',
  AI_SERVER_ERROR: 'AI_SERVER_ERROR',
  AI_AUTH_ERROR: 'AI_AUTH_ERROR',
  AI_NETWORK_ERROR: 'AI_NETWORK_ERROR',
  AI_UNKNOWN_ERROR: 'AI_UNKNOWN_ERROR'
};

export class AIError extends Error {
  constructor(type, originalMessage, provider, status = null) {
    super(`[${provider}] ${type}: ${originalMessage}`);
    this.name = 'AIError';
    this.type = type;
    this.provider = provider;
    this.status = status;
    this.originalMessage = originalMessage;
  }
}
