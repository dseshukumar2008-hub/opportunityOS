import { geminiService } from './src/services/geminiService.js';

async function test() {
  try {
    const contextData = { profile: { name: 'Test' } };
    const history = [];
    const message = 'Hello';
    const result = await geminiService.chatWithCopilot({
      mode: 'career_coach',
      contextData,
      history,
      message
    });
    console.log("Success:", result);
  } catch (err) {
    console.error("Test Error:", err);
  }
}
test();
