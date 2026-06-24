import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { geminiService } from '../../services/geminiService';
import { useCareer } from '../../contexts/CareerContext';
import GithubUpload from './GithubUpload';
import GithubResults from './GithubResults';
import { calculateLocalGithubMetrics } from '../../utils/githubAnalyzerEngine';
import ContextualBackButton from '../../components/navigation/ContextualBackButton';

export default function GithubAnalyzerPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { updateCareerContext } = useCareer();

  const handleAnalyze = async (username, targetRole) => {
    if (!username || !targetRole) {
      toast.error("Please provide both a GitHub username and a target role.");
      return;
    }

    setLoading(true);
    setResults(null);

    const cacheKey = `github_analysis_${username}_${targetRole}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setResults(parsed);
        updateCareerContext({
          targetRole,
          githubScore: parsed.githubScore,
          alignmentScore: parsed.alignmentScore,
          strengths: parsed.strengths,
          weaknesses: parsed.weaknesses,
          missingSkills: parsed.technologyAnalysis?.missing || parsed.missingSkills || [],
          missingProjects: parsed.missingProjects || [],
          technologyAnalysis: parsed.technologyAnalysis,
          portfolioDiversity: parsed.portfolioDiversity
        });
        setLoading(false);
        toast.success("Loaded cached GitHub analysis!");
        return;
      } catch (e) {
        console.warn("Invalid cache data, fetching fresh.");
      }
    }

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub data. Please check the username.");
      }
      const repos = await response.json();
      
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
      const localMetrics = calculateLocalGithubMetrics(githubData, targetRole);

      let analysisResult;
      try {
        const geminiOutput = await geminiService.analyzeGithubPortfolio(username, githubData, targetRole, localMetrics);
        
        if (geminiOutput._fallbackMode) {
          // Fallback silently
          analysisResult = {
            ...localMetrics,
            strengths: ["Active GitHub Profile"],
            weaknesses: ["(AI qualitative analysis temporarily unavailable)"],
            improvementSuggestions: ["Keep committing and building projects!"],
            missingSkills: localMetrics.technologyAnalysis.missing,
            missingProjects: ["(AI project suggestions temporarily unavailable)"]
          };
        } else {
          // Merge Gemini qualitative data with local deterministic data
          analysisResult = {
            ...localMetrics,
            strengths: geminiOutput.strengths || [],
            weaknesses: geminiOutput.weaknesses || [],
            improvementSuggestions: geminiOutput.improvementSuggestions || [],
            missingSkills: geminiOutput.missingSkills || localMetrics.technologyAnalysis.missing,
            missingProjects: geminiOutput.missingProjects || []
          };
        }
      } catch (geminiError) {
        console.error("Gemini Error during GitHub Analysis:", geminiError);
        // Fallback silently
        analysisResult = {
          ...localMetrics,
          strengths: ["Active GitHub Profile"],
          weaknesses: ["(AI qualitative analysis temporarily unavailable)"],
          improvementSuggestions: ["Keep committing and building projects!"],
          missingSkills: localMetrics.technologyAnalysis.missing,
          missingProjects: ["(AI project suggestions temporarily unavailable)"]
        };
      }
      
      // Update Shared Career Context
      updateCareerContext({
        targetRole,
        githubScore: analysisResult.githubScore,
        alignmentScore: analysisResult.alignmentScore,
        strengths: analysisResult.strengths,
        weaknesses: analysisResult.weaknesses,
        missingSkills: analysisResult.technologyAnalysis?.missing || analysisResult.missingSkills || [],
        missingProjects: analysisResult.missingProjects || [],
        technologyAnalysis: analysisResult.technologyAnalysis,
        portfolioDiversity: analysisResult.portfolioDiversity
      });

      const finalResultObj = { ...analysisResult, username, targetRole };
      setResults(finalResultObj);
      localStorage.setItem(cacheKey, JSON.stringify(finalResultObj));

      if (analysisResult.githubScore > 0) {
        toast.success("GitHub portfolio analyzed successfully!");
      }
    } catch (error) {
      console.error("GitHub Fetch Error:", error);
      // Fail silently for STARDANCE
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
