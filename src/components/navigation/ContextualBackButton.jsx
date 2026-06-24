import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ContextualBackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  const sourceName = location.state?.sourceName;

  if (!sourceName) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm"
      >
        <ArrowLeft size={16} />
        Back to {sourceName}
      </button>
    </div>
  );
}
