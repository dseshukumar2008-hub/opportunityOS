import { javascriptQuestions } from './bugHunter/javascript';
import { pythonQuestions } from './bugHunter/python';
import { javaQuestions } from './bugHunter/java';
import { cppQuestions } from './bugHunter/cpp';


export const bugHunterQuestions = [
  ...javascriptQuestions,
  ...pythonQuestions,
  ...javaQuestions,
  ...cppQuestions
];

export const getBugHunterQuestionById = (id) => {
  return bugHunterQuestions.find(q => q.id === id);
};

const validateBugHunterQuestion = (q) => {
  const errors = [];
  
  if (typeof q.id === 'undefined' || q.id === null) errors.push('Missing ID');
  if (typeof q.language !== 'string') errors.push('Missing/invalid language');
  if (typeof q.difficulty !== 'string') errors.push('Missing/invalid difficulty');
  if (typeof q.question !== 'string') errors.push('Missing/invalid question text');
  if (typeof q.code !== 'string') errors.push('Missing/invalid code snippet');
  if (!Array.isArray(q.options) || q.options.length < 2) errors.push('Missing/invalid options array (must have at least 2)');
  if (typeof q.answer !== 'string' || (Array.isArray(q.options) && !q.options.includes(q.answer))) errors.push('Missing/invalid answer (must be string and exist in options)');
  if (typeof q.explanation !== 'string' && typeof q.explanation !== 'object') errors.push('Missing/invalid explanation (must be string or object)');
  
  if (q.category !== undefined && typeof q.category !== 'string') errors.push('Invalid category format');
  if (q.hint !== undefined && typeof q.hint !== 'string') errors.push('Invalid hint format');
  if (q.correctedCode !== undefined && typeof q.correctedCode !== 'string') errors.push('Invalid correctedCode format');
  if (q.questionType !== undefined && typeof q.questionType !== 'string') errors.push('Invalid questionType format');
  if (q.bugDescription !== undefined && typeof q.bugDescription !== 'string') errors.push('Invalid bugDescription format');
  if (q.whyItHappens !== undefined && typeof q.whyItHappens !== 'string') errors.push('Invalid whyItHappens format');
  if (q.correctApproach !== undefined && typeof q.correctApproach !== 'string') errors.push('Invalid correctApproach format');

  if (errors.length > 0) {
    console.warn(`[Bug Hunter Validation] Question ID ${q.id} is invalid and will be skipped:`, errors.join(', '));
    return false;
  }
  return true;
};

// Mulberry32 PRNG for deterministic session-level random generation
const createPRNG = (seed) => {
  let s = seed;
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

export const getRandomBugHunterQuestions = (count, language = 'Random', difficulty = 'Mixed', isSpeedMode = false, seed = Date.now()) => {
  const randomFunc = createPRNG(seed);
  
  let basePool = bugHunterQuestions.filter(validateBugHunterQuestion);
  
  if (language !== 'Random') {
    basePool = basePool.filter(q => q.language === language);
  }

  if (isSpeedMode) {
    basePool = basePool.filter(q => q.isSpeedMode === true);
  }
  
  if (basePool.length === 0) {
    return []; // Handled by component gracefully
  }

  // Session Tracking logic to prevent immediate duplicates
  const sessionKey = `bh_seen_${language}_${difficulty}`;
  let seenIds = [];
  try {
    const stored = sessionStorage.getItem(sessionKey);
    if (stored) {
      seenIds = JSON.parse(stored);
    }
  } catch { /* ignore */ }

  // Fisher-Yates (Knuth) Shuffle algorithm for robust, unbiased randomization
  const shuffle = (array) => {
    const arr = [...array];
    let currentIndex = arr.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(randomFunc() * currentIndex);
      currentIndex--;
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr;
  };

  let unseenPool = shuffle(basePool.filter(q => !seenIds.includes(q.id)));
  let seenPool = shuffle(basePool.filter(q => seenIds.includes(q.id)));

  // Define distribution strategy based on difficulty
  let targetDist;
  if (difficulty === 'Easy') {
    // Easy: Primarily beginner-friendly concepts (80% Easy, 20% Medium)
    const easyCount = Math.ceil(count * 0.8);
    targetDist = { Easy: easyCount, Medium: count - easyCount, Hard: 0 };
  } else if (difficulty === 'Medium') {
    // Medium: Mixture of common and moderately complex (30% Easy, 60% Medium, 10% Hard)
    const medCount = Math.ceil(count * 0.6);
    const easyCount = Math.floor(count * 0.3);
    targetDist = { Easy: easyCount, Medium: medCount, Hard: count - easyCount - medCount };
  } else if (difficulty === 'Hard') {
    // Hard: Prioritize deeper reasoning (30% Medium, 70% Hard)
    const hardCount = Math.ceil(count * 0.7);
    targetDist = { Easy: 0, Medium: count - hardCount, Hard: hardCount };
  } else {
    // Mixed: Balanced combination
    const third = Math.floor(count / 3);
    targetDist = { Easy: third, Medium: third, Hard: count - (third * 2) };
  }

  const selected = [];
  
    const pullQuestions = (pool, diff, amount) => {
    const matching = pool.filter(q => (diff ? q.difficulty === diff : true) && !selected.some(s => s.id === q.id));
    
    if (language === 'Random' && matching.length > 0) {
      const byLang = {};
      matching.forEach(q => {
        if (!byLang[q.language]) byLang[q.language] = [];
        byLang[q.language].push(q);
      });
      
      let langs = shuffle(Object.keys(byLang));
      let pulledCount = 0;
      
      while (pulledCount < amount && langs.length > 0) {
        for (let i = 0; i < langs.length; i++) {
          if (pulledCount >= amount) break;
          const lang = langs[i];
          selected.push(byLang[lang].shift());
          pulledCount++;
        }
        langs = langs.filter(l => byLang[l].length > 0);
      }
      return pulledCount;
    } else {
      const pulled = matching.slice(0, amount);
      pulled.forEach(q => selected.push(q));
      return pulled.length;
    }
  };

  // 1. Try to fulfill distribution from unseen questions
  let remainingEasy = targetDist.Easy - pullQuestions(unseenPool, 'Easy', targetDist.Easy);
  let remainingMedium = targetDist.Medium - pullQuestions(unseenPool, 'Medium', targetDist.Medium);
  let remainingHard = targetDist.Hard - pullQuestions(unseenPool, 'Hard', targetDist.Hard);

  let totalShortfall = remainingEasy + remainingMedium + remainingHard;

  // 2. Gracefully fill shortfall with any available unseen questions (ignoring target distribution)
  if (totalShortfall > 0) {
    totalShortfall -= pullQuestions(unseenPool, null, totalShortfall);
  }

  // 3. If still short, we've exhausted unseen history. Dip into seen questions to avoid breaking the game.
  if (totalShortfall > 0) {
    pullQuestions(seenPool, null, totalShortfall);
    
    // Clear history since we had to loop around
    seenIds = [];
  }
  
  // Shuffle final selection so difficulty progression is unpredictable
  const finalSelection = shuffle(selected).slice(0, count);

  // Update session storage with newly seen IDs (strictly the immediately previous session)
  const newSeenIds = finalSelection.map(q => q.id);
  try {
    sessionStorage.setItem(sessionKey, JSON.stringify(newSeenIds));
  } catch { /* ignore */ }

  // Return mapped array with safely shuffled options
  let previousCorrectIndex = -1;
  
  return finalSelection.map(q => {
    const newOptions = shuffle(q.options);
    let correctIndex = newOptions.indexOf(q.answer);
    
    // Prevent the correct answer from appearing in the exact same position as the previous question
    if (correctIndex === previousCorrectIndex && newOptions.length > 1) {
      // Pick a deterministic offset (e.g. +1) wrapped around the array length to ensure it shifts
      const swapIndex = (correctIndex + 1) % newOptions.length;
      
      // Immutably swap the elements within our new array copy
      [newOptions[correctIndex], newOptions[swapIndex]] = [newOptions[swapIndex], newOptions[correctIndex]];
      correctIndex = swapIndex;
    }
    
    previousCorrectIndex = correctIndex;

    return {
      ...q,
      options: newOptions
    };
  });
};

export const getDailyBugHunterChallenge = (count = 5) => {
  const basePool = bugHunterQuestions.filter(validateBugHunterQuestion).sort((a, b) => a.id.localeCompare(b.id));
  if (basePool.length === 0) return [];

  const today = new Date().toISOString().split('T')[0];

  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (Math.imul(31, hash) + today.charCodeAt(i)) | 0;
  }

  let seed = Math.abs(hash) || 1;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const dailySelection = shuffle(basePool).slice(0, count);

  return dailySelection.map(q => ({
    ...q,
    options: shuffle(q.options)
  }));
};
