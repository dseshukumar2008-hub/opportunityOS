/**
 * Provider Health Monitor
 * Tracks the status and performance of AI providers in memory.
 */

const healthRegistry = {
  gemini: {
    status: 'ONLINE',
    lastSuccess: null,
    lastFailure: null,
    consecutiveFailures: 0,
    averageResponseTime: 0,
    totalRequests: 0
  },
  groq: {
    status: 'ONLINE',
    lastSuccess: null,
    lastFailure: null,
    consecutiveFailures: 0,
    averageResponseTime: 0,
    totalRequests: 0
  }
};

export const providerHealth = {
  getHealth: (providerName) => healthRegistry[providerName],
  
  getAllHealth: () => ({ ...healthRegistry }),

  recordSuccess: (providerName, responseTimeMs) => {
    const health = healthRegistry[providerName];
    if (!health) return;

    health.status = 'ONLINE';
    health.lastSuccess = Date.now();
    health.consecutiveFailures = 0;
    
    // Calculate running average
    const currentTotal = health.averageResponseTime * health.totalRequests;
    health.totalRequests += 1;
    health.averageResponseTime = Math.round((currentTotal + responseTimeMs) / health.totalRequests);
  },

  recordFailure: (providerName, error) => {
    const health = healthRegistry[providerName];
    if (!health) return;

    health.lastFailure = Date.now();
    health.consecutiveFailures += 1;

    // Optional heuristic: mark OFFLINE if too many failures
    if (health.consecutiveFailures >= 3) {
      health.status = 'DEGRADED';
    }
  }
};
