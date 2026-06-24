import { geminiService } from './src/services/geminiService.js';

async function test() {
  try {
    console.log('before Gemini request');
    const res = await geminiService.analyzeResume('This is a test resume with some skills like Python and React.');
    console.log('after Gemini response');
    console.log(res);
  } catch(e) {
    console.log('inside catch block');
    console.error('EXACT ERROR:', e.message, e);
  }
}

test();
