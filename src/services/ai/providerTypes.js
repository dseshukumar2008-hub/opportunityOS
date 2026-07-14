/**
 * Common request/response interfaces for AI providers.
 * Every provider must adhere to these structures.
 */

export const AIRequestFormat = {
  feature: "",
  prompt: "",
  context: {},
  responseType: "text", // or "json"
  options: {}
};

export const AIResponseFormat = {
  success: true,
  provider: "",
  model: "",
  data: null,
  metadata: {},
  error: null
};
