import { useState, useEffect, useCallback } from 'react';
import { careerPaths } from '../data/careerPathsDb';
import CareerPathCard from './CareerPathCard';
import { RefreshCcw, HelpCircle, Loader2, AlertTriangle } from 'lucide-react';
import CareerExplorerHowItWorksModal from './CareerExplorerHowItWorksModal';
import { generate } from '../../../services/ai/aiProvider';

function scorePathsLocally(userProfile, resumeData, profileData, simulatedSkills = []) {
  const userTags = [
    ...userProfile.interests,
    ...userProfile.strengths,
    ...userProfile.workPreferences,
  ].map(t => t.toLowerCase());

  if (resumeData?.skills) {
    userTags.push(...resumeData.skills.map(s => s.toLowerCase()));
  }
  if (profileData?.extractedSkills) {
    userTags.push(...profileData.extractedSkills.map(s => s.toLowerCase()));
  }

  const allTags = [...userTags, ...simulatedSkills.map(s => s.toLowerCase())];

  return careerPaths
    .map(path => {
      const matchedSkills = [];
      const missingSkills = [];

      path.skillsNeeded.forEach(skill => {
        const lower = skill.toLowerCase();
        if (allTags.some(ut => ut.includes(lower) || lower.includes(ut))) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      });

      const matchScore =
        path.skillsNeeded.length > 0
          ? Math.round((matchedSkills.length / path.skillsNeeded.length) * 100)
          : 0;

      return { ...path, matchScore, matchedSkills, missingSkills };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
}

function buildCareerExplorerPrompt(userProfile, resumeData, profileData) {
  const interestsList = userProfile.interests.length
    ? userProfile.interests.join(', ')
    : 'not specified';
  const strengthsList = userProfile.strengths.length
    ? userProfile.strengths.join(', ')
    : 'not specified';
  const prefsList = userProfile.workPreferences.length
    ? userProfile.workPreferences.join(', ')
    : 'not specified';

  const resumeSkills = resumeData?.skills?.join(', ') || 'none provided';
  const resumeExperience =
    resumeData?.experience?.map(e => `${e.title} at ${e.company}`).join('; ') || 'none provided';
  const resumeProjects = resumeData?.projects?.map(p => p.title).join(', ') || 'none provided';
  const profileSkills = profileData?.extractedSkills?.join(', ') || 'none provided';

  return `You are an expert career counsellor AI for OpportunityOS.

The user has completed a 3-step career onboarding assessment. Based EXCLUSIVELY on their selections below, recommend exactly 4 career paths most aligned with what they chose.

=== USER SELECTIONS ===
Interests: ${interestsList}
Strengths: ${strengthsList}
Work Preferences: ${prefsList}

=== RESUME / PROFILE DATA ===
Skills from Resume: ${resumeSkills}
Experience: ${resumeExperience}
Projects: ${resumeProjects}
Skills from Profile: ${profileSkills}

=== STRICT RULES ===
1. Recommend exactly 4 career paths tailored to the USER SELECTIONS above. The careers MUST reflect the user's interests — e.g. if they selected "Data & Analytics" or "Artificial Intelligence", do NOT recommend Frontend/Backend/Full-Stack as top results.
2. matchScore (0-100) = overlap of the user's interests, strengths, and resume skills with each career's required skills. Be accurate.
3. matchedSkills = only skills the user demonstrably has based on their resume skills or interests/strengths.
4. missingSkills = the most important skills they still need.
5. Descriptions must be 1-2 concise sentences specific to the career.
6. recommendedProjects must be concrete, actionable ideas (not generic names).
7. timeline must be a realistic string like "3-6 months" or "6-12 months".
8. icon must be EXACTLY one of: Code, Server, Layers, BarChart3, Bot, PenTool, Target, Megaphone, Terminal, ShieldAlert

=== OUTPUT ===
Respond with valid JSON only. No markdown fences. No text outside JSON.

{
  "careers": [
    {
      "id": "unique-kebab-case-id",
      "title": "Career Title",
      "category": "Category Name",
      "description": "Short description.",
      "icon": "IconName",
      "matchScore": 85,
      "skillsNeeded": ["Skill A", "Skill B", "Skill C", "Skill D", "Skill E"],
      "matchedSkills": ["Skill A", "Skill B"],
      "missingSkills": ["Skill C", "Skill D", "Skill E"],
      "recommendedProjects": ["Project 1", "Project 2", "Project 3"],
      "timeline": "X-Y months"
    }
  ]
}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CareerPathResults({ userProfile, onRetake, resumeData, profileData }) {
  const [simulatedSkills, setSimulatedSkills] = useState([]);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [aiError, setAiError] = useState(null);
  const [recommendedPaths, setRecommendedPaths] = useState([]);

  const toggleSimulatedSkill = (skill) => {
    setSimulatedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const fetchAIRecommendations = useCallback(async () => {
    setIsLoading(true);
    setAiError(null);

    try {
      const prompt = buildCareerExplorerPrompt(userProfile, resumeData, profileData);

      const request = {
        providerName: 'gemini',
        feature: 'CareerExplorer',
        prompt,
        responseType: 'json',
        options: {
          systemInstruction:
            'You are an expert career counsellor AI. Output only valid JSON matching the requested schema exactly. No markdown. No explanation.',
          temperature: 0.4,
          timeoutMs: 45000,
          maxTokens: 3000,
          model: 'gemini-3.5-flash'
        },
      };

      const response = await generate(request);

      if (response?.error) {
        throw response.error;
      }

      const data = response?.data;

      if (!data?.careers || !Array.isArray(data.careers) || data.careers.length === 0) {
        throw new Error('AI returned an unexpected response structure.');
      }

      // Normalise – ensure all required fields are present
      const normalised = data.careers.slice(0, 4).map((c, idx) => ({
        id: c.id || `ai-career-${idx}`,
        title: c.title || 'Career Path',
        category: c.category || 'General',
        description: c.description || '',
        icon: c.icon || 'Target',
        matchScore: typeof c.matchScore === 'number' ? Math.min(100, Math.max(0, c.matchScore)) : 0,
        skillsNeeded: Array.isArray(c.skillsNeeded) ? c.skillsNeeded : [],
        matchedSkills: Array.isArray(c.matchedSkills) ? c.matchedSkills : [],
        missingSkills: Array.isArray(c.missingSkills) ? c.missingSkills : [],
        recommendedProjects: Array.isArray(c.recommendedProjects) ? c.recommendedProjects : [],
        timeline: c.timeline || 'Varies',
      }));

      // Detect template/offline sentinel careers (provider returned offline placeholder cards).
      // Template offline cards always have IDs prefixed with 'offline-' and matchScore of 0.
      // If all careers are offline sentinels, treat this exactly like an AI failure so the
      // local fallback + amber warning banner are shown instead of fake "AI" results.
      const isOfflineSentinel = normalised.every(
        (c) => c.id.startsWith('offline-') || (c.matchScore === 0 && c.description?.toLowerCase().includes('offline'))
      );
      if (isOfflineSentinel) {
        throw new Error('AI providers are temporarily unavailable. Showing locally-scored results.');
      }

      setRecommendedPaths(normalised);
    } catch (err) {
      console.error('[CareerExplorer] AI call failed – using local fallback:', err);
      setAiError(err?.message || 'AI service unavailable.');
      setRecommendedPaths(scorePathsLocally(userProfile, resumeData, profileData, simulatedSkills));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, resumeData, profileData]);

  // Fetch whenever userProfile changes (covers initial load + retake)
  useEffect(() => {
    fetchAIRecommendations();
  }, [fetchAIRecommendations]);

  // ---- Loading ----
  if (isLoading) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Real-Time Career Match Engine</h2>
            <p className="text-slate-500 mt-1">
              Calculated instantly from your Resume, GitHub, LinkedIn, and Onboarding profile.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 size={40} className="text-[#6D5DF6] animate-spin" />
          <p className="text-slate-500 font-medium">Generating your personalised career report…</p>
        </div>
      </div>
    );
  }

  // ---- Results ----
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Real-Time Career Match Engine</h2>
          <p className="text-slate-500 mt-1">
            Calculated instantly from your Resume, GitHub, LinkedIn, and Onboarding profile.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] lg:text-xs font-bold text-[#6D5DF6] hover:text-white bg-indigo-50 hover:bg-[#6D5DF6] rounded-lg transition-all"
          >
            <HelpCircle size={14} /> How It Works
          </button>
          <button
            onClick={onRetake}
            className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-[#6D5DF6] transition-colors"
          >
            <RefreshCcw size={16} />
            Retake Assessment
          </button>
        </div>
      </div>

      {/* Soft warning when AI failed and we fell back to local scoring */}
      {aiError && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 mb-6 text-sm">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>
            AI personalisation is temporarily unavailable — showing locally-scored results.{' '}
            <button
              onClick={fetchAIRecommendations}
              className="underline font-semibold hover:text-amber-900"
            >
              Retry
            </button>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedPaths.map(path => (
          <CareerPathCard
            key={path.id}
            path={path}
            simulatedSkills={simulatedSkills}
            toggleSimulatedSkill={toggleSimulatedSkill}
          />
        ))}
      </div>

      <CareerExplorerHowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
