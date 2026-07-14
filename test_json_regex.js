const rawText = 'Here is the JSON:\n```json\n{ "test": 123 }\n```';
try {
  const cleanText1 = rawText.replace(/^\s*```json/i, '').replace(/```\s*$/i, '').trim();
  console.log('useCareerRoadmap:', cleanText1);
  JSON.parse(cleanText1);
} catch (e) { console.error('useCareerRoadmap failed:', e.message); }

try {
  const cleanText2 = rawText.replace(/^```json\s*/m, '').replace(/```\s*$/m, '').trim();
  console.log('geminiService:', cleanText2);
  JSON.parse(cleanText2);
} catch (e) { console.error('geminiService failed:', e.message); }
