/**
 * Registry for AI providers.
 * Manages active providers and handles provider priority.
 */

const providers = new Map();

// Provider priority config. 
// The first available provider in this list will be the default.
let providerPriority = ['gemini', 'groq', 'openrouter', 'template'];

export function registerProvider(name, providerInstance) {
  providers.set(name, providerInstance);
}

export function getProvider(name) {
  return providers.get(name);
}


export function getDefaultProvider() {
  // Find the first registered provider that exists in the priority list
  for (const name of providerPriority) {
    if (providers.has(name)) {
      return providers.get(name);
    }
  }
  return null;
}
