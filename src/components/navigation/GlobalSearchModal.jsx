import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, Users, User, Target, Award, MessageSquare, X } from 'lucide-react';
import { useGoals } from '../../contexts/GoalContext';
import { useResume } from '../../contexts/ResumeContext';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  const { goals } = useGoals();
  const { resumeData } = useResume();
  const certs = resumeData?.certifications || [];

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
      
      if (!isOpen || results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Debounced Search Engine
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      let matches = [];

      const calculateScore = (item, type, titleField, descField, skillsField) => {
        const title = (item[titleField] || '').toLowerCase();
        const desc = (item[descField] || '').toLowerCase();
        
        let skills = [];
        if (skillsField && item[skillsField]) {
           if (Array.isArray(item[skillsField])) {
             skills = item[skillsField].map(s => typeof s === 'string' ? s.toLowerCase() : s?.label?.toLowerCase() || '');
           }
        }
        
        let score = 0;
        if (title === q) score = 100; // Exact
        else if (title.includes(q)) score = 80; // Title match
        else if (skills.some(s => s.includes(q))) score = 60; // Skill match
        else if (desc.includes(q)) score = 40; // Desc match

        return score > 0 ? { item, type, score, title: item[titleField], desc: item[descField] } : null;
      };

      // 4. Goals
      goals.forEach(goal => {
        const match = calculateScore(goal, 'goal', 'title', 'category', null);
        if (match) matches.push({ ...match, icon: Target, color: 'text-amber-500', bg: 'bg-amber-50', path: `/goals` });
      });

      // 5. Certifications
      certs.forEach(cert => {
        const match = calculateScore(cert, 'certification', 'name', 'issuer', null);
        if (match) matches.push({ ...match, icon: Award, color: 'text-purple-500', bg: 'bg-purple-50', path: `/resume-builder` });
      });

      // Sort by score
      matches.sort((a, b) => b.score - a.score);
      
      setResults(matches.slice(0, 8)); // limit results
      setSelectedIndex(0);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, goals, certs]);

  const handleSelect = (result) => {
    onClose();
    navigate(result.path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-slate-200"
        role="dialog"
        aria-modal="true"
        aria-label="Global Search"
      >
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search size={20} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search goals, certifications..."
            aria-label="Global Search Query"
            className="w-full px-4 py-4 text-[15px] focus:outline-none bg-transparent placeholder-slate-400 font-medium text-slate-800"
          />
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {query.trim() && results.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <Search size={32} className="text-slate-300 mb-3" />
              <p className="text-[14px] font-semibold text-slate-800">No results found.</p>
              <p className="text-[13px] text-slate-500">Try another keyword.</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, idx) => {
                const Icon = result.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={`${result.type}-${result.item.id}`}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${isSelected ? 'bg-slate-50' : 'bg-white'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${result.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={18} className={result.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-[14px] font-bold text-slate-900 truncate">
                          {result.title}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                          {result.type}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-500 truncate mt-0.5">
                        {result.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="text-[11px] font-bold text-slate-400 hidden sm:block">
                        Enter to select
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          
          {!query.trim() && (
            <div className="px-4 py-8 text-center border-t border-slate-50 bg-slate-50/50">
              <p className="text-[13px] font-medium text-slate-500">
                Type <kbd className="border border-slate-200 bg-white rounded-[4px] px-1.5 py-0.5 mx-1 font-sans shadow-sm text-slate-700">React</kbd> or <kbd className="border border-slate-200 bg-white rounded-[4px] px-1.5 py-0.5 mx-1 font-sans shadow-sm text-slate-700">Google</kbd> to see examples.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
