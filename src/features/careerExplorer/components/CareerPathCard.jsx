import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Map, CheckCircle2, FolderDot, Clock, Code, Server, Layers, BarChart3, Bot, PenTool, Megaphone, Terminal, ShieldAlert, AlertCircle, X, Sparkles } from 'lucide-react';

const iconMap = {
  Code,
  Server,
  Layers,
  BarChart3,
  Bot,
  PenTool,
  Target,
  Megaphone,
  Terminal,
  ShieldAlert
};

export default function CareerPathCard({ path, simulatedSkills, toggleSimulatedSkill }) {
  const navigate = useNavigate();
  const Icon = iconMap[path.icon] || Target;

  const handleAnalyzeSkills = () => {
    navigate(`/skill-gap?targetRole=${encodeURIComponent(path.title)}`);
  };

  const handleCreateRoadmap = () => {
    console.log("Selected Career:", path.title);
    navigate(`/career-roadmap`, { state: { targetRole: path.title, source: 'careerExplorer' } });
  };

  const hasSimulation = simulatedSkills.some(s => path.skillsNeeded.includes(s));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
      {hasSimulation && (
        <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500"></div>
      )}
      
      <div className="flex items-start justify-between mb-4 mt-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-[#6D5DF6]">
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{path.title}</h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              {path.category}
            </span>
          </div>
        </div>
        
        {/* Match Score Ring */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
              <circle 
                cx="24" cy="24" r="20" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 20}`} 
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - path.matchScore / 100)}`} 
                className={`transition-all duration-1000 ease-out ${hasSimulation ? 'text-indigo-500' : 'text-[#10B981]'}`}
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-700">{path.matchScore}%</span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Match</span>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-5">{path.description}</p>
      
      {hasSimulation && (
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg p-2.5 mb-4 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} />
            "What-If" Simulation Active
          </div>
          <span className="text-[10px] bg-white text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">
            Score Boosted
          </span>
        </div>
      )}

      <div className="space-y-5 mb-6 flex-1">
        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Matched Skills ({path.matchedSkills.length}/{path.skillsNeeded.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {path.matchedSkills.length === 0 && <span className="text-xs text-slate-400 italic">No exact matches yet.</span>}
            {path.matchedSkills.map((skill, idx) => {
              const isSimulated = simulatedSkills.includes(skill);
              return (
                <button 
                  key={idx} 
                  onClick={() => isSimulated && toggleSimulatedSkill(skill)}
                  className={`text-xs font-semibold px-2 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
                    isSimulated 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 cursor-pointer hover:bg-indigo-100 hover:border-indigo-300' 
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                  }`}
                  title={isSimulated ? "Click to remove simulation" : "Matched from your profile"}
                >
                  {isSimulated ? <Sparkles size={12}/> : <CheckCircle2 size={12}/>}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
            <AlertCircle size={14} /> Missing Skills <span className="text-[9px] lowercase bg-slate-100 px-1 rounded ml-1 text-slate-500">Click to Simulate</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {path.missingSkills.length === 0 && <span className="text-xs text-emerald-600 font-semibold italic">You have all required skills!</span>}
            {path.missingSkills.map((skill, idx) => (
              <button 
                key={idx} 
                onClick={() => toggleSimulatedSkill(skill)}
                className="text-[11px] font-medium px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Click to simulate learning this skill"
              >
                <X size={10} className="text-slate-400" />
                {skill}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
            <FolderDot size={14} /> Example Projects
          </h4>
          <ul className="text-xs text-slate-600 space-y-1 ml-5 list-disc">
            {path.recommendedProjects.map((proj, idx) => (
              <li key={idx}>{proj}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
            <Clock size={14} /> Estimated Timeline
          </h4>
          <p className="text-xs font-medium text-slate-700">{path.timeline} of dedicated learning</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100">
        <button 
          onClick={handleAnalyzeSkills}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border-2 border-[#6D5DF6] text-[#6D5DF6] hover:bg-indigo-50 rounded-xl text-xs font-bold transition-colors"
        >
          <Target size={14} />
          Analyze Skills
        </button>
        <button 
          onClick={handleCreateRoadmap}
          className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#6D5DF6] hover:bg-[#5a4add] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
        >
          <Map size={14} />
          Create Roadmap
        </button>
      </div>
    </div>
  );
}

function SparklesIcon({ size = 16, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
