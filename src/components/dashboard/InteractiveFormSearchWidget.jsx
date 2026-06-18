import { useState, useMemo, useEffect } from 'react';
import { 
  Search, CheckCircle2, X, Sparkles, Plus, AlertCircle, 
  Briefcase, MapPin, TrendingUp, Filter, CheckSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const INITIAL_CHECKLIST = [
  { id: 'react', name: 'React.js Framework', checked: true, score: 8 },
  { id: 'ts', name: 'TypeScript Typings', checked: true, score: 8 },
  { id: 'redux', name: 'Redux State Management', checked: false, score: 6 },
  { id: 'jest', name: 'Jest Unit Testing', checked: false, score: 6 },
  { id: 'docker', name: 'Docker Containerization', checked: false, score: 7 },
  { id: 'cicd', name: 'CI/CD Pipelines (GitHub Actions)', checked: false, score: 7 },
  { id: 'graphql', name: 'GraphQL Query APIs', checked: false, score: 5 },
  { id: 'tailwind', name: 'Tailwind CSS Layouts', checked: true, score: 5 }
];

const INITIAL_SKILLS = ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Git'];

const MOCK_OPPORTUNITIES = [];

export default function InteractiveFormSearchWidget() {
  // ATS Checklist state
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [atsScore, setAtsScore] = useState(60);
  
  // Skill tags state
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [newSkill, setNewSkill] = useState('');
  
  // Opportunity Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Recalculate ATS Score whenever checklist changes
  useEffect(() => {
    const baseScore = 40;
    const addedScore = checklist.reduce((sum, item) => sum + (item.checked ? item.score : 0), 0);
    setAtsScore(Math.min(98, baseScore + addedScore));
  }, [checklist]);

  const handleToggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    
    const sanitized = newSkill.trim();
    if (skills.some(s => s.toLowerCase() === sanitized.toLowerCase())) {
      toast.error(`${sanitized} is already added!`);
      return;
    }

    setSkills(prev => [...prev, sanitized]);
    setNewSkill('');
    toast.success(`Added ${sanitized} successfully!`);

    // Dynamic ATS boost logic for fun!
    if (sanitized.toLowerCase() === 'docker' || sanitized.toLowerCase() === 'graphql') {
      setChecklist(prev => prev.map(item => 
        item.id === sanitized.toLowerCase() ? { ...item, checked: true } : item
      ));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
    toast.success(`Removed ${skillToRemove}`);
  };

  // Filtered Opportunities logic
  const filteredOpportunities = useMemo(() => {
    return MOCK_OPPORTUNITIES.filter(opp => {
      const matchesSearch = 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCat = selectedCategory === 'All' || opp.category === selectedCategory;
      
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 py-3.5 px-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-300 animate-pulse" />
          <span className="text-[12px] font-black tracking-wider uppercase">Profile & Search Optimizer</span>
        </div>
        <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Interactive Sandbox</span>
      </div>

      {/* Main Grid View */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Hand side: Interactive Forms */}
        <div className="space-y-6">
          
          {/* ATS Checklist & Dial Display */}
          <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[15px] font-bold text-slate-800">ATS Optimization Matrix</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Toggle keywords to adjust match algorithm calculations</p>
              </div>
              
              {/* ATS radial score badge */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="4.5" fill="transparent" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="#6D5DF6" 
                      strokeWidth="4.5" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - atsScore / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute text-[13px] font-black text-slate-900">{atsScore}%</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 mt-1">Ready Index</span>
              </div>
            </div>

            {/* Keyword selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {checklist.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-left rounded-xl border transition-all ${
                    item.checked 
                      ? 'bg-indigo-50/50 border-[#6D5DF6]/25 text-[#6D5DF6] font-bold' 
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-500 font-semibold'
                  } text-[12px]`}
                >
                  <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                    item.checked 
                      ? 'bg-[#6D5DF6] border-[#6D5DF6] text-white' 
                      : 'border-slate-300'
                  }`}>
                    {item.checked && <CheckCircle2 size={11} strokeWidth={3} />}
                  </div>
                  <span className="truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skill Tag Builder Form */}
          <div className="space-y-3">
            <div>
              <h3 className="text-[15px] font-bold text-slate-800">Dynamic Skill Tag Manager</h3>
              <p className="text-[11px] text-slate-400 font-medium">Add credentials to instantly populate matching card queries</p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Docker, GraphQL, Python..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-[12px] font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#6D5DF6] focus:ring-4 focus:ring-[#6D5DF6]/10 transition-all bg-white"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-[#6D5DF6] hover:bg-[#5a4add] text-white rounded-xl text-[12px] font-bold transition-all shadow-[0_2px_8px_rgba(109,93,246,0.2)] flex items-center gap-1 shrink-0"
              >
                <Plus size={14} />
                Add
              </button>
            </form>

            {/* Skills Badges Grid */}
            <div className="flex flex-wrap gap-1.5 p-1 border border-slate-50 rounded-xl max-h-[120px] overflow-y-auto">
              {skills.map((skill) => (
                <span 
                  key={skill} 
                  className="inline-flex items-center gap-1 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/80 rounded-lg py-1 px-2.5 text-[11px] font-extrabold text-slate-700 hover:border-[#6D5DF6]/35 transition-colors group cursor-default"
                >
                  {skill}
                  <button 
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-500 rounded p-0.5 focus:outline-none transition-colors"
                  >
                    <X size={10} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Hand Side: Search Filter & Interactive Results */}
        <div className="space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <h3 className="text-[15px] font-bold text-slate-800">Mock Live Recommendation Queries</h3>
              <p className="text-[11px] text-slate-400 font-medium">Filtered instantaneously based on tag updates & queries</p>
            </div>

            {/* Search Input Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Query by company, role or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2 border border-slate-200 rounded-xl text-[12px] font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#6D5DF6] focus:ring-4 focus:ring-[#6D5DF6]/10 transition-all bg-white"
                />
              </div>

              {/* Category selector */}
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-2 text-[12px] font-bold text-slate-500 bg-white">
                <Filter size={12} className="text-slate-400" />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-700 cursor-pointer pr-1"
                >
                  <option value="All">All Categories</option>
                  <option value="Engineering">Tech</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                </select>
              </div>
            </div>

            {/* Opportunity Results list */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {filteredOpportunities.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                  <AlertCircle size={24} className="text-slate-300 mb-2" />
                  <p className="text-[12px] font-bold text-slate-500">No matching recommendations found</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Try widening search criteria or resetting filters</p>
                </div>
              ) : (
                filteredOpportunities.map(opp => (
                  <div 
                    key={opp.id} 
                    className="p-3 border border-slate-100 bg-slate-50/20 hover:bg-slate-50/65 hover:border-[#6D5DF6]/20 transition-all rounded-xl flex items-center justify-between group"
                  >
                    <div className="space-y-1 truncate mr-4">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-black text-slate-800 group-hover:text-[#6D5DF6] transition-colors truncate">{opp.title}</h4>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold uppercase rounded shrink-0">{opp.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-0.5 truncate"><Briefcase size={10} />{opp.company}</span>
                        <span className="flex items-center gap-0.5 truncate"><MapPin size={10} />{opp.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {opp.tags.map(t => (
                          <span key={t} className="text-[9px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-0.5 text-[12px] font-black text-[#6D5DF6] bg-indigo-50 px-2 py-0.5 rounded-lg">
                        <TrendingUp size={11} />
                        {opp.score}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats Panel Footer */}
          <div className="bg-slate-50/60 p-4 border border-slate-100 rounded-2xl flex items-center justify-between text-[11px] font-bold text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <CheckSquare size={13} strokeWidth={2.5} className="text-emerald-500" />
              Checklist optimal: {checklist.filter(c => c.checked).length} of {checklist.length} keys
            </span>
            <span className="text-[#6D5DF6]">
              {skills.length} target skills mapped
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
