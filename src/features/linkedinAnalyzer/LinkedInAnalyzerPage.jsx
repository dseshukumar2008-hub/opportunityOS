import React, { useState } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { geminiService } from '../../services/geminiService';
import { useCareer } from '../../contexts/CareerContext';
import LinkedInUpload from './LinkedInUpload';
import LinkedInResults from './LinkedInResults';
import ContextualBackButton from '../../components/navigation/ContextualBackButton';

export default function LinkedInAnalyzerPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { careerContext, updateCareerContext } = useCareer();

  const handleAnalyze = async (payload) => {
    setLoading(true);
    setResults(null);
    try {
      const fullPayload = {
        ...payload,
        targetRole: careerContext?.targetRole,
        specialization: careerContext?.specialization
      };
      let response;
      try {
        response = await geminiService.analyzeLinkedInProfile(fullPayload);
        toast.success("LinkedIn profile analyzed successfully!");
      } catch (geminiError) {
        console.error("Gemini Error during LinkedIn Analysis:", geminiError);

        // Fallback state
        response = {
          overallScore: 50,
          completenessScore: 50,
          searchVisibilityScore: 50,
          analysis: {
            headline: "Profile received, AI analysis unavailable.",
            about: "Profile received, AI analysis unavailable.",
            skills: "Profile received, AI analysis unavailable.",
            projects: "Profile received, AI analysis unavailable.",
            experience: "Profile received, AI analysis unavailable.",
            certifications: "Profile received, AI analysis unavailable."
          },
          topSuggestions: [
            { priority: "Medium", suggestion: "Make sure your headline reflects your target role." },
            { priority: "High", suggestion: "Keep your skills updated and organized." }
          ]
        };
      }
      
      setResults(response);
      updateCareerContext({ linkedinScore: response.overallScore });
    } catch (error) {
      console.error("LinkedIn Analysis Error:", error);
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
        <LinkedInUpload onAnalyze={handleAnalyze} loading={loading} />
      ) : (
        <LinkedInResults results={results} onReset={handleReset} />
      )}
    </div>
  );
}
