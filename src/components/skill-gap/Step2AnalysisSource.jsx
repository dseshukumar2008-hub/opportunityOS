import { useState } from 'react';
import { Database, FileText, GitBranch, Link, ListPlus, ChevronRight, ChevronLeft } from 'lucide-react';

const SOURCES = [
  { id: 'roadmap', title: 'Career Roadmap Progress', desc: 'Use completed roadmap tasks and milestones', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'resume', title: 'Resume Analysis (Recommended)', desc: 'Analyze uploaded resume', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'github', title: 'GitHub Analysis (Optional)', desc: 'Analyze repositories and technologies', icon: GitBranch, color: 'text-slate-700', bg: 'bg-slate-100' },
  { id: 'linkedin', title: 'LinkedIn Profile PDF (Optional)', desc: 'Analyze downloaded LinkedIn PDF profile', icon: Link, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'manual', title: 'Manual Skills (Optional)', desc: 'Select skills manually', icon: ListPlus, color: 'text-purple-500', bg: 'bg-purple-50' }
];

export default function Step2AnalysisSource({ onSubmit, onBack, initialSources }) {
  const [selected, setSelected] = useState(initialSources.length ? initialSources : ['roadmap', 'resume']);

  const toggleSource = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onSubmit(selected);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col items-center text-center mb-6">
        <h1 className="text-xl lg:text-2xl font-black text-slate-900 mb-1">How should we analyze your skills?</h1>
        <p className="text-[13px] text-slate-500 font-medium">Select sources to build your profile. Don't worry if you only have a resume — that's usually enough to get a great analysis!</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {SOURCES.map((source) => {
          const Icon = source.icon;
          const isSelected = selected.includes(source.id);
          
          return (
            <button
              key={source.id}
              onClick={() => toggleSource(source.id)}
              className={`flex flex-col items-start p-3 sm:p-4 rounded-xl border-2 transition-all text-left max-h-[140px] ${
                isSelected 
                  ? 'border-[#6C4CF1] bg-indigo-50/50 shadow-sm' 
                  : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${source.bg}`}>
                  <Icon size={18} className={source.color} />
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-[#6C4CF1] bg-[#6C4CF1]' : 'border-slate-300'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
              <h3 className={`font-bold text-[14px] mb-0.5 ${isSelected ? 'text-[#6C4CF1]' : 'text-slate-800'}`}>
                {source.title}
              </h3>
              <p className="text-[12px] text-slate-500 font-medium leading-tight">
                {source.desc}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-8 mt-4 border-t border-slate-100">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-2"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="bg-[#6C4CF1] hover:bg-indigo-600 text-white font-bold rounded-xl px-8 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          Continue
          <ChevronRight size={20} color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
}
