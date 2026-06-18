import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Clock, Signal, Code2, BrainCircuit, Compass } from 'lucide-react';

export default function ProjectRecommendationCard({ project, onSave, isSaved }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving || isSaved) return;
    setSaving(true);
    try {
      await onSave(project);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-200 transition-all flex flex-col h-full">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">{project.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || isSaved}
          className={`shrink-0 p-2 rounded-xl transition-colors ${
            isSaved 
              ? 'bg-indigo-50 text-indigo-600 cursor-default' 
              : 'bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
          title={isSaved ? "Saved to Workspace" : "Save Project"}
        >
          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      <div className="mb-6 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Code2 size={16} className="text-slate-400" />
          <h4 className="text-[13px] font-bold text-slate-900">Technologies</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech, idx) => (
            <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-medium rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Why This Project?</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{project.whyThisProject}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
