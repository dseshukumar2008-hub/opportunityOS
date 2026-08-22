import  { useState } from 'react';
import { toast } from 'react-hot-toast';
import { geminiService } from '../../services/geminiService';
import { useCareer } from '../../contexts/CareerContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useActivity } from '../../contexts/ActivityContext';
import GithubUpload from './GithubUpload';
import GithubResults from './GithubResults';
import { calculateLocalGithubMetrics, fetchDeepGithubData, fetchContributionHeatmap } from '../../utils/githubAnalyzerEngine';
import ContextualBackButton from '../../components/navigation/ContextualBackButton';
import { sanitizeForFirestore, findNestedArrays } from '../../utils/firestoreSanitizer';

export default function GithubAnalyzerPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { updateCareerContext } = useCareer();
  const { updateProfile } = useProfile();
  const { addActivity } = useActivity();

  const handleAnalyze = async (username, targetRole) => {
    if (!username || !targetRole) {
      toast.error("Please provide both a GitHub username and a target role.");
      return { success: false, error: 'MISSING_DATA' };
    }

    setLoading(true);
    setResults(null);

    const cacheKey = `github_analysis_${username}_${targetRole}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        // Ensure the cached data matches the new schema and is NOT a fallback (githubScore > 0)
        if (parsed.basicStats && parsed.repos && parsed.deepAnalysis && parsed.githubScore > 0) {
          setResults(parsed);
          
          const savePayload = {
            targetRole,
            githubScore: parsed.githubScore || 0,
            alignmentScore: parsed.alignmentScore || 0,
            strengths: parsed.strengths || [],
            weaknesses: parsed.weaknesses || [],
            technologyAnalysis: parsed.technologyAnalysis || { detected: [] }
          };

          const firestoreSafeContext = sanitizeForFirestore({
            ...savePayload,
            missingSkills: parsed.technologyAnalysis?.missing || []
          });

          try {
            await updateCareerContext(firestoreSafeContext);
          } catch (e) {
            console.warn("Non-fatal error updating career context from cache:", e);
          }

          if (updateProfile) {
            // eslint-disable-next-line no-unused-vars
            const { repos, deepAnalysis, heatmap, ...safeToSaveObj } = parsed;
            const firestoreSafeAnalysis = sanitizeForFirestore(safeToSaveObj);
            
            try {
              const saveResult = await updateProfile({ 
                githubAnalysis: { ...firestoreSafeAnalysis, analyzedAt: new Date().toISOString() } 
              });
              if (saveResult && saveResult.error) {
                console.error("Firestore cache save error:", saveResult.error);
                // We won't block the UI here, but we log it.
              }
            } catch (saveError) {
              console.error("Firestore Save Error from cache:", saveError);
            }
          }

          setLoading(false);
          toast.success("Loaded cached GitHub analysis!");
          return { success: true };
        } else {
          console.warn("Stale or fallback cache detected, fetching fresh.");
          localStorage.removeItem(cacheKey);
        }
      } catch (_e) {
        console.warn("Invalid cache data, fetching fresh.");
        localStorage.removeItem(cacheKey);
      }
    }

    try {
      const [userResponse, reposResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
      ]);

      if (!userResponse.ok || !reposResponse.ok) {
        if (userResponse.status === 404 || reposResponse.status === 404) {
          throw new Error("USER_NOT_FOUND");
        }
        throw new Error("Failed to fetch GitHub data. Please check the username.");
      }
      
      const userData = await userResponse.json();
      const repos = await reposResponse.json();
      
      const githubData = repos.map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        topics: repo.topics,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
      }));

      // Calculate deterministic metrics locally
      const localMetrics = calculateLocalGithubMetrics(githubData, userData, targetRole);

      // Deep fetch top 5 repos for AI context and real heatmap
      const [deepAnalysis, heatmapData] = await Promise.all([
        fetchDeepGithubData(username, repos),
        fetchContributionHeatmap(username)
      ]);

      // Add heatmap to local metrics so it renders
      localMetrics.heatmap = heatmapData.heatmap;
      localMetrics.totalContributions = heatmapData.totalContributions;
      localMetrics.deepAnalysis = deepAnalysis;

      console.log("=== GITHUB ANALYZER DEBUG ===");
      console.log("1. Target Role:", targetRole);
      console.log("2. Total Repos analyzed:", githubData.length);
      console.log("3. Deep Analysis Repo Count:", deepAnalysis.length);

      let analysisResult;
      try {
        console.log("4. Calling geminiService.analyzeGithubPortfolio...");
        const geminiOutput = await geminiService.analyzeGithubPortfolio(username, githubData, targetRole, localMetrics);
        console.log("5. Gemini Output received:", geminiOutput);
        
        if (geminiOutput._fallbackMode) {
          console.warn("6. FALLBACK MODE TRIGGERED! Throwing error instead of silent fallback.");
          throw new Error("AI analysis temporarily unavailable due to API limits or failure.");
        } else {
          // Calculate overall alignment from careerMatch
          const m = geminiOutput.careerMatch || { frontend: 0, backend: 0, aiTools: 0, cloudDevOps: 0 };
          const avgMatch = Math.round((m.frontend + m.backend + m.aiTools + m.cloudDevOps) / 4);
          
          // Merge Gemini qualitative and scored data with local deterministic data
          analysisResult = {
            ...localMetrics,
            githubScore: geminiOutput.githubScore || 0,
            alignmentScore: avgMatch,
            careerMatch: m,
            analysisSummary: geminiOutput.analysisSummary || [],
            overallAssessment: geminiOutput.overallAssessment || "",
            strengths: geminiOutput.strengths || [],
            weaknesses: geminiOutput.weaknesses || [],
            recommendations: geminiOutput.recommendations || []
          };
          console.log("7. Final Analysis Result Object:", analysisResult);
        }
      } catch (geminiError) {
        console.error("6. GEMINI ERROR CAUGHT:", geminiError);
        throw geminiError; // DO NOT silently fall back, throw to the UI so we can see it!
      }
      
      // Update Shared Career Context safely
      const savePayload = {
        targetRole,
        githubScore: analysisResult.githubScore || 0,
        alignmentScore: analysisResult.alignmentScore || 0,
        strengths: analysisResult.strengths || [],
        weaknesses: analysisResult.weaknesses || [],
        technologyAnalysis: analysisResult.technologyAnalysis || { detected: [] }
      };

      const firestoreSafeContext = sanitizeForFirestore(savePayload);
      const contextNested = findNestedArrays(firestoreSafeContext);
      if (contextNested.length > 0) {
        console.warn("Found nested arrays in career context:", contextNested);
      }

      try {
        console.log("Saving to updateCareerContext...");
        await updateCareerContext(firestoreSafeContext);
      } catch (e) {
        console.warn("Non-fatal error updating career context:", e);
      }

      const finalResultObj = { ...analysisResult, username, targetRole };
      setResults(finalResultObj);
      localStorage.setItem(cacheKey, JSON.stringify(finalResultObj));

      if (updateProfile) {
        // Strip heavy/raw data to prevent Firestore 1MB limits
        // eslint-disable-next-line no-unused-vars
        const { repos, deepAnalysis, heatmap, ...safeToSaveObj } = finalResultObj;
        
        const firestoreSafeAnalysis = sanitizeForFirestore(safeToSaveObj);
        const analysisNested = findNestedArrays(firestoreSafeAnalysis);
        if (analysisNested.length > 0) {
           console.error("CRITICAL: Found nested arrays in githubAnalysis after sanitization!", analysisNested);
        }
        
        try {
          console.log("Saving to updateProfile...");
          const saveResult = await updateProfile({ 
            githubAnalysis: { ...firestoreSafeAnalysis, analyzedAt: new Date().toISOString() } 
          });
          
          if (saveResult && saveResult.error) {
            throw saveResult.error;
          }
        } catch (saveError) {
          console.error("Firestore Save Error:", saveError);
          toast.error("Analysis complete, but failed to save to profile. " + (saveError.message || ""));
          return { success: false, error: "SAVE_FAILED" };
        }
      }

      if (analysisResult.githubScore > 0) {
        if (addActivity) {
          addActivity({
            title: "GitHub Profile Analyzed",
            description: "Your GitHub profile and repositories have been analyzed.",
            category: "Analysis",
            type: "action",
            iconType: "GitBranch",
            color: "bg-blue-50 text-blue-600"
          });
        }
        toast.success("GitHub portfolio analyzed successfully!");
      }
      return { success: true };
    } catch (error) {
      console.error("GitHub Fetch Error:", error);
      if (error.message === "USER_NOT_FOUND") {
        toast.error(
          <div>
            <p className="font-bold mb-1">❌ GitHub user not found</p>
            <p className="text-sm">Please enter a valid GitHub username and try again.</p>
          </div>,
          { duration: 5000, style: { maxWidth: '500px' } }
        );
        return { success: false, error: "USER_NOT_FOUND" };
      }
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-6 px-4">
      <div className="max-w-6xl mx-auto">
        <ContextualBackButton />
      </div>
      {!results ? (
        <GithubUpload onAnalyze={handleAnalyze} loading={loading} />
      ) : (
        <GithubResults results={results} onReset={handleReset} />
      )}
    </div>
  );
}
