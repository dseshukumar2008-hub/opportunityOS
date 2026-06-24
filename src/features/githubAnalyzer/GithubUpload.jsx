import React, { useState, useEffect } from 'react';
import { Sparkles, GitBranch, Target } from 'lucide-react';
import { useCareer } from '../../contexts/CareerContext';

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Data Analyst",
  "Cloud Engineer",
  "DevOps Engineer",
  "Cyber Security Engineer",
  "Mobile App Developer"
];

export default function GithubUpload({ onAnalyze, loading }) {
  const { careerContext } = useCareer();
  const [username, setUsername] = useState('');
  
  // Use context targetRole if available and it exists in ROLES list, otherwise fallback to first role
  const initialRole = careerContext?.targetRole && ROLES.includes(careerContext.targetRole)
    ? careerContext.targetRole
    : ROLES[0];
    
  const [targetRole, setTargetRole] = useState(initialRole);

  useEffect(() => {
    if (careerContext?.targetRole && ROLES.includes(careerContext.targetRole)) {
      setTargetRole(careerContext.targetRole);
    }
  }, [careerContext?.targetRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(username, targetRole);
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 py-12 space-y-8">
      <section className="text-center space-y-4 pt-4 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-[#6D4AFF] rounded-full text-sm font-bold tracking-wide">
          <Sparkles size={18} /> OpportunityOS GitHub Analyzer
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
          Analyze Your GitHub
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Enter your GitHub username and target role. Our AI will analyze your portfolio, calculate alignment, and identify skill gaps.
        </p>
      </section>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <GitBranch size={18} className="text-slate-700" /> GitHub Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. torvalds"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#6D4AFF] focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Target size={18} className="text-[#6D4AFF]" /> Target Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#6D4AFF] focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium text-slate-700"
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#6D4AFF] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#5B3DE6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing Portfolio...
                </>
              ) : (
                <>
                  <GitBranch size={20} /> Analyze GitHub
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
