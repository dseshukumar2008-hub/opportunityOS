/**
 * Reusable prompt generation helpers.
 * Centralize prompt creation.
 */

export function buildSystemPrompt(context, instructions) {
  return `Context:\n${context}\n\nInstructions:\n${instructions}`;
}

export function formatMessages(systemPrompt, userPrompt) {
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];
}
