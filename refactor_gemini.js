import fs from 'fs';
let code = fs.readFileSync('src/services/geminiService.js', 'utf-8');

const regex = /(const|let) (result|reqsResult|rawProjects|aiResponse) = await callGemini\((.*?),\s*(.*?),\s*(.*?),\s*(.*?),\s*(.*?)(?:,\s*(.*?))?\);/g;

code = code.replace(regex, (match, p1, p2, p3, p4, p5, p6, p7, p8) => {
  let timeout = p8 ? p8 : '30000';
  return `const request = {
        feature: ${p7},
        prompt: ${p3},
        responseType: 'json',
        options: {
          systemInstruction: ${p4},
          inlineDataItems: ${p5},
          temperature: ${p6},
          timeoutMs: ${timeout}
        }
      };
      
      const response = await aiGenerate(request);
      if (!response.success) throw response.error;
      ${p1} ${p2} = response.data;`;
});

// Also replace returns that directly call await callGemini
const regexReturn = /return await callGemini\((.*?),\s*(.*?),\s*(.*?),\s*(.*?),\s*(.*?)(?:,\s*(.*?))?\);/g;
code = code.replace(regexReturn, (match, p1, p2, p3, p4, p5, p6) => {
  let timeout = p6 ? p6 : '30000';
  return `const request = {
        feature: ${p5},
        prompt: ${p1},
        responseType: 'json',
        options: {
          systemInstruction: ${p2},
          inlineDataItems: ${p3},
          temperature: ${p4},
          timeoutMs: ${timeout}
        }
      };
      
      const response = await aiGenerate(request);
      if (!response.success) throw response.error;
      return response.data;`;
});

const callGeminiDefRegex = /const callGemini = async[\s\S]*?return response\.data;\r?\n};/m;
code = code.replace(callGeminiDefRegex, '');

fs.writeFileSync('src/services/geminiService.js', code);
console.log('Done refactoring');
