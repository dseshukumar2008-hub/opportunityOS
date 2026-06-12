import { useState, useMemo } from 'react';
import { useRecommendationHistory } from '../../hooks/useRecommendationHistory';
import { 
  History, TrendingUp, Calendar, ArrowUpRight, CheckCircle2, ChevronRight, 
  Award, Search, SlidersHorizontal, Grid, List, Clock, Sparkles, Trophy, 
  Briefcase, CheckSquare, ShieldAlert, ArrowUpDown, ChevronDown, RefreshCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecommendationHistoryPage() {
  const { history, clearHistory } = useRecommendationHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'highest_score' | 'lowest_score'
  const [scoreFilter, setScoreFilter] = useState('all'); // 'all' | 'high' (>=80) | 'medium' (70-79) | 'low' (<70)
  const [layoutMode, setLayoutMode] = useState('timeline'); // 'timeline' | 'grid' | 'summary'
  
  // Track selected snapshot for the detailed view
  const [selectedSnapshotId, setSelectedSnapshotId] = useState(null);

  // Fallback / Initial redirect if no history exists
  if (!history || history.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto p-6 md:p-8 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <History size={24} className="text-slate-400" />
        </div>
        <h2 className="text-[20px] font-extrabold text-slate-900 mb-2">No recommendation history available.</h2>
        <p className="text-[14px] text-slate-500 mb-6 max-w-sm text-center">
          Improve your profile, add skills, and get a better resume score to start tracking recommendation growth over time.
        </p>
        <Link to="/resume-builder" className="px-6 py-2.5 bg-[#6D5DF6] hover:bg-[#5a4add] text-white rounded-xl text-[14px] font-bold transition-all shadow-[0_4px_14px_rgba(109,93,246,0.3)]">
          Improve Profile
        </Link>
      </div>
    );
  }

  // Pre-sort baseline
  const sortedByDateDesc = useMemo(() => {
    return [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [history]);

  const oldestSnapshot = sortedByDateDesc[sortedByDateDesc.length - 1];
  const newestSnapshot = sortedByDateDesc[0];

  // Calculate improvement metrics
  const scoreImprovement = newestSnapshot.averageMatchScore - oldestSnapshot.averageMatchScore;
  const averageRecommendationCount = Math.round(
    history.reduce((sum, h) => sum + (h.recommendationCount || 0), 0) / history.length
  );

  // Filters & Sorting calculations
  const processedSnapshots = useMemo(() => {
    let result = [...history];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(snap => 
        snap.topRecommendation.toLowerCase().includes(q) ||
        (snap.improvements && snap.improvements.some(imp => imp.toLowerCase().includes(q))) ||
        (snap.skillsAdded && snap.skillsAdded.some(s => s.toLowerCase().includes(q)))
      );
    }

    // 2. Score Band Filter
    if (scoreFilter !== 'all') {
      result = result.filter(snap => {
        const score = snap.averageMatchScore;
        if (scoreFilter === 'high') return score >= 80;
        if (scoreFilter === 'medium') return score >= 70 && score < 80;
        if (scoreFilter === 'low') return score < 70;
        return true;
      });
    }

    // 3. Sorting logic
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'highest_score') return b.averageMatchScore - a.averageMatchScore;
      if (sortBy === 'lowest_score') return a.averageMatchScore - b.averageMatchScore;
      return 0;
    });

    return result;
  }, [history, searchQuery, sortBy, scoreFilter]);

  // Set initial selected snapshot if not set or if current one is not in results
  const activeSnapshot = useMemo(() => {
    if (processedSnapshots.length === 0) return null;
    const found = processedSnapshots.find(s => s.id === selectedSnapshotId);
    return found || processedSnapshots[0];
  }, [processedSnapshots, selectedSnapshotId]);

  // SVG Chart Setup (100x40 SVG grid scaled representation)
  const chartHeight = 80;
  const chartWidth = 500;
  const padding = 20;
  
  // Sort history chronologically for the line graph
  const chronologicalHistory = useMemo(() => {
    return [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [history]);

  const minScore = Math.max(0, Math.min(...history.map(h => h.averageMatchScore)) - 10);
  const maxScore = Math.min(100, Math.max(...history.map(h => h.averageMatchScore)) + 10);
  const range = maxScore - minScore || 1;

  const points = useMemo(() => {
    return chronologicalHistory.map((h, i) => {
      const x = (i / Math.max(1, chronologicalHistory.length - 1)) * (chartWidth - padding * 2) + padding;
      const y = chartHeight - padding - ((h.averageMatchScore - minScore) / range) * (chartHeight - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  }, [chronologicalHistory, minScore, range]);

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-8 space-y-8">
      {/* Header and Control Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <div className="w-11 h-11 rounded-[14px] bg-[#6D5DF6]/10 flex items-center justify-center">
              <History size={22} className="text-[#6D5DF6]" />
            </div>
            Recommendation History
          </h1>
          <p className="text-[15px] text-slate-500 mt-2 font-medium">
            Monitor and review the evolution of your match scores, skills gap completions, and role recommendations.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={clearHistory}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-[13px] font-bold transition-all flex items-center gap-1.5"
          >
            <RefreshCcw size={14} />
            Reset Baseline
          </button>
          <Link to="/opportunities" className="px-5 py-2.5 bg-[#6D5DF6] hover:bg-[#5a4add] text-white rounded-xl text-[13px] font-bold transition-all shadow-[0_4px_14px_rgba(109,93,246,0.3)]">
            Explore Matches
          </Link>
        </div>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Avg Match Score Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Avg Match Score</p>
              <h3 className="text-[28px] font-black text-slate-900 mt-1">{newestSnapshot.averageMatchScore}%</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-500 bg-emerald-50/50 px-2.5 py-1 rounded-lg w-fit">
            <span>+{scoreImprovement}% improvement since baseline</span>
          </div>
        </div>

        {/* Metric 2: ATS Resume Score */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">ATS Resume Index</p>
              <h3 className="text-[28px] font-black text-slate-900 mt-1">{newestSnapshot.atsScore || 85}/100</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#6D5DF6]/10 flex items-center justify-center text-[#6D5DF6]">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-1000" 
                style={{ width: `${newestSnapshot.atsScore || 85}%` }}
              />
            </div>
            <span className="text-[12px] font-bold text-slate-600">{newestSnapshot.atsScore >= 80 ? 'Optimal' : 'Needs Work'}</span>
          </div>
        </div>

        {/* Metric 3: Goals Completed */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Goals Completed</p>
              <h3 className="text-[28px] font-black text-slate-900 mt-1">{newestSnapshot.goalsCompleted || 8} Achievements</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Trophy size={18} />
            </div>
          </div>
          <p className="text-[12px] text-slate-500 font-medium flex items-center gap-1">
            <CheckSquare size={14} className="text-emerald-500" />
            Active skill gaps bridged on target roadmaps
          </p>
        </div>

        {/* Metric 4: Applications Submitted */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Total Applications</p>
              <h3 className="text-[28px] font-black text-slate-900 mt-1">{newestSnapshot.applicationsSubmitted || 8} Submitted</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Briefcase size={18} />
            </div>
          </div>
          <p className="text-[12px] text-slate-500 font-medium">
            <span className="font-extrabold text-blue-500">{(newestSnapshot.applicationsSubmitted || 8) * 3} matches</span> generated from latest run
          </p>
        </div>

      </div>

      {/* Chart and Detail Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Line Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">Historical Match Trend</h3>
              <p className="text-[13px] text-slate-400 font-medium">Visualization of average match percentile over time</p>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-bold text-slate-400 uppercase">Current Performance</span>
              <p className="text-[20px] font-black text-[#6D5DF6]">{newestSnapshot.averageMatchScore}% Match</p>
            </div>
          </div>

          {/* Line Chart Area */}
          <div className="h-[200px] w-full border border-slate-50 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-center relative overflow-visible">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              {/* Grids */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e2e8f0" strokeWidth="1.5" />
              
              {/* Line */}
              <polyline
                fill="none"
                stroke="#6D5DF6"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              
              {/* Area Under Curve */}
              <path
                d={`M ${chronologicalHistory.map((h, i) => {
                  const x = (i / Math.max(1, chronologicalHistory.length - 1)) * (chartWidth - padding * 2) + padding;
                  const y = chartHeight - padding - ((h.averageMatchScore - minScore) / range) * (chartHeight - padding * 2);
                  return `${x} ${y}`;
                }).join(' L ')} L ${
                  (chronologicalHistory.length - 1) / Math.max(1, chronologicalHistory.length - 1) * (chartWidth - padding * 2) + padding
                } ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
                fill="url(#grad)"
                opacity="0.08"
              />

              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6D5DF6" />
                  <stop offset="100%" stopColor="#6D5DF6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Interactive Dots */}
              {chronologicalHistory.map((h, i) => {
                const x = (i / Math.max(1, chronologicalHistory.length - 1)) * (chartWidth - padding * 2) + padding;
                const y = chartHeight - padding - ((h.averageMatchScore - minScore) / range) * (chartHeight - padding * 2);
                const isSelected = h.id === activeSnapshot?.id;
                
                return (
                  <g key={h.id} className="cursor-pointer group" onClick={() => setSelectedSnapshotId(h.id)}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "8" : "5"}
                      fill={isSelected ? "#6D5DF6" : "white"}
                      stroke="#6D5DF6"
                      strokeWidth={isSelected ? "3" : "2.5"}
                      className="transition-all hover:scale-125"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="transparent"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Column: Dynamic Jump Insight */}
        <div className="bg-gradient-to-br from-[#6D5DF6] to-[#5a4add] rounded-2xl p-6 shadow-md text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.07] translate-x-4 -translate-y-4">
            <Award size={180} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider mb-6">
              <Sparkles size={12} className="text-amber-300" />
              Progress Milestone Achieved
            </div>
            <h3 className="text-[14px] font-bold text-indigo-100 uppercase tracking-wide mb-1">Peak Target Matching Role</h3>
            <p className="text-[22px] font-black leading-tight mb-4">{newestSnapshot.topRecommendation}</p>
            
            <p className="text-[13px] text-indigo-100 leading-relaxed font-medium">
              You increased your average match rate by a massive <span className="font-extrabold text-white text-[15px]">{scoreImprovement}%</span> over the last 90 days. This unlock was catalyzed by optimizing missing skill keywords in the ATS resume model.
            </p>
          </div>
          <div className="flex items-center justify-between mt-6 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/15">
            <span className="text-[13px] font-bold text-indigo-100">Baseline Score: {oldestSnapshot.averageMatchScore}%</span>
            <ArrowUpRight size={16} className="text-emerald-300" />
            <span className="text-[16px] font-black text-white">Current: {newestSnapshot.averageMatchScore}%</span>
          </div>
        </div>

      </div>

      {/* Filter and Sorting Layout Block */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search snapshots or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-[13px] font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#6D5DF6] focus:ring-4 focus:ring-[#6D5DF6]/10 transition-all"
            />
          </div>

          {/* Filtering Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Sorting select */}
            <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-600 bg-white shadow-sm hover:border-slate-300 cursor-pointer">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-700 cursor-pointer pr-1"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest_score">Highest Match</option>
                <option value="lowest_score">Lowest Match</option>
              </select>
            </div>

            {/* Score Band Filter */}
            <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-600 bg-white shadow-sm hover:border-slate-300 cursor-pointer">
              <SlidersHorizontal size={14} className="text-slate-400" />
              <select 
                value={scoreFilter} 
                onChange={(e) => setScoreFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-700 cursor-pointer pr-1"
              >
                <option value="all">All Match Scores</option>
                <option value="high">Optimal (&gt;=80%)</option>
                <option value="medium">Intermediate (70%-79%)</option>
                <option value="low">Sub-optimal (&lt;70%)</option>
              </select>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-[1px] bg-slate-200 mx-1" />

            {/* Layout Toggle Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setLayoutMode('timeline')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-extrabold flex items-center gap-1 transition-all ${
                  layoutMode === 'timeline' ? 'bg-white text-[#6D5DF6] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock size={13} />
                Timeline
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-extrabold flex items-center gap-1 transition-all ${
                  layoutMode === 'grid' ? 'bg-white text-[#6D5DF6] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Grid size={13} />
                Grid
              </button>
              <button
                onClick={() => setLayoutMode('summary')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-extrabold flex items-center gap-1 transition-all ${
                  layoutMode === 'summary' ? 'bg-white text-[#6D5DF6] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List size={13} />
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Snapshots Content & Detail Panel Viewport */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Left Span: Snapshots Listing */}
        <div className="xl:col-span-2 space-y-6">
          
          {processedSnapshots.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center flex flex-col items-center">
              <Search size={40} className="text-slate-300 mb-4" />
              <h4 className="text-[16px] font-bold text-slate-800">No snapshots matched your query</h4>
              <p className="text-[13px] text-slate-400 mt-1 max-w-sm">Try tweaking your search phrase or resetting the match score filters.</p>
              <button 
                onClick={() => { setSearchQuery(''); setScoreFilter('all'); }}
                className="mt-4 text-[#6D5DF6] text-[13px] font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : layoutMode === 'timeline' ? (
            /* TIMELINE VIEW */
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="space-y-8 relative">
                <div className="absolute top-2 bottom-2 left-[23px] w-0.5 bg-slate-100 z-0 hidden sm:block"></div>
                
                {processedSnapshots.map((snapshot) => {
                  const isActive = snapshot.id === activeSnapshot?.id;
                  const dateObj = new Date(snapshot.date);
                  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  
                  return (
                    <div 
                      key={snapshot.id} 
                      onClick={() => setSelectedSnapshotId(snapshot.id)}
                      className={`flex flex-col sm:flex-row gap-6 relative z-10 group cursor-pointer`}
                    >
                      {/* Date & Dot indicator */}
                      <div className="flex sm:flex-col items-center sm:items-start sm:w-28 shrink-0 gap-4 sm:gap-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-all duration-300 ${
                          isActive 
                            ? 'bg-[#6D5DF6] text-white scale-110 shadow-indigo-100 shadow-lg' 
                            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                        }`}>
                          <Calendar size={18} />
                        </div>
                        <div className="sm:mt-3">
                          <p className={`text-[13px] font-bold transition-colors ${isActive ? 'text-[#6D5DF6]' : 'text-slate-500'}`}>{formattedDate}</p>
                          {snapshot.id === newestSnapshot.id && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">Latest</span>
                          )}
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={`flex-1 border transition-all duration-300 rounded-[20px] p-5 ${
                        isActive 
                          ? 'bg-slate-50/50 border-[#6D5DF6]/40 shadow-sm shadow-indigo-50/50' 
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]'
                      }`}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Top Recommendation</p>
                            <h4 className="text-[17px] font-extrabold text-slate-900 group-hover:text-[#6D5DF6] transition-colors flex items-center gap-1.5">
                              {snapshot.topRecommendation}
                              <ChevronRight size={15} className="opacity-40" />
                            </h4>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {snapshot.improvements && snapshot.improvements.slice(0, 2).map((imp, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-md">
                                  {imp}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-right bg-white rounded-xl px-4 py-2 border border-slate-100 shadow-sm shrink-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Average Match</p>
                            <p className="text-[20px] font-black text-slate-900">{snapshot.averageMatchScore}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : layoutMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {processedSnapshots.map((snapshot) => {
                const isActive = snapshot.id === activeSnapshot?.id;
                const dateObj = new Date(snapshot.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                return (
                  <div 
                    key={snapshot.id}
                    onClick={() => setSelectedSnapshotId(snapshot.id)}
                    className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[210px] group ${
                      isActive 
                        ? 'border-[#6D5DF6] bg-slate-50/50 shadow-md' 
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5">
                          <Calendar size={13} />
                          {formattedDate}
                        </span>
                        <div className={`px-2.5 py-1 rounded-lg text-[13px] font-black ${
                          snapshot.averageMatchScore >= 80 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-indigo-50 text-[#6D5DF6]'
                        }`}>
                          {snapshot.averageMatchScore}% Match
                        </div>
                      </div>
                      
                      <h4 className="text-[16px] font-extrabold text-slate-900 mt-4 group-hover:text-[#6D5DF6] transition-colors leading-snug line-clamp-1">
                        {snapshot.topRecommendation}
                      </h4>
                      <p className="text-[12px] text-slate-400 font-semibold mt-1">
                        {snapshot.recommendationCount || 2} matching opportunities generated
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-[12px] text-slate-500 font-medium">
                      <span>ATS Score: <strong className="text-slate-800">{snapshot.atsScore || 70}%</strong></span>
                      <span className="text-[#6D5DF6] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        Inspect
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* COMPACT SUMMARY LIST VIEW */
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      <th className="py-4 px-6">Snapshot Date</th>
                      <th className="py-4 px-6">Top Role Match</th>
                      <th className="py-4 px-6 text-center">Avg Match</th>
                      <th className="py-4 px-6 text-center">ATS Score</th>
                      <th className="py-4 px-6 text-center">Active Apps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[13px]">
                    {processedSnapshots.map((snapshot) => {
                      const isActive = snapshot.id === activeSnapshot?.id;
                      const dateObj = new Date(snapshot.date);
                      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                      return (
                        <tr 
                          key={snapshot.id}
                          onClick={() => setSelectedSnapshotId(snapshot.id)}
                          className={`cursor-pointer hover:bg-slate-50/40 transition-colors ${
                            isActive ? 'bg-slate-50/70 text-[#6D5DF6] font-semibold' : 'text-slate-600'
                          }`}
                        >
                          <td className="py-4 px-6 font-bold flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#6D5DF6]' : 'bg-slate-300'}`} />
                            {formattedDate}
                          </td>
                          <td className="py-4 px-6 font-extrabold text-slate-800">{snapshot.topRecommendation}</td>
                          <td className="py-4 px-6 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[12px] font-black ${
                              snapshot.averageMatchScore >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-[#6D5DF6]'
                            }`}>
                              {snapshot.averageMatchScore}%
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-slate-700">{snapshot.atsScore || 70}%</td>
                          <td className="py-4 px-6 text-center font-bold text-slate-500">{snapshot.applicationsSubmitted || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Immersive Snapshot Detailed View Panel */}
        <div className="xl:col-span-1">
          {activeSnapshot ? (
            <div className="bg-white rounded-2xl border border-[#6D5DF6]/30 shadow-lg shadow-indigo-100/30 overflow-hidden sticky top-8 animate-fade-in">
              {/* Card Header Panel */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white relative">
                <div className="absolute top-4 right-4 bg-white/10 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider text-indigo-200">
                  Checkpoint Detail
                </div>
                <span className="text-[12px] text-slate-300 font-bold flex items-center gap-1">
                  <Calendar size={13} />
                  {new Date(activeSnapshot.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                
                <h3 className="text-[18px] font-extrabold text-white mt-3 leading-snug line-clamp-2">
                  {activeSnapshot.topRecommendation}
                </h3>
                
                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-700/60">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Checkpoint Score</span>
                    <p className="text-[22px] font-black text-emerald-400">{activeSnapshot.averageMatchScore}%</p>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-700" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ATS Score</span>
                    <p className="text-[22px] font-black text-blue-300">{activeSnapshot.atsScore || 70}%</p>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-700" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Recommendations</span>
                    <p className="text-[22px] font-black text-indigo-300">{activeSnapshot.recommendationCount || 2}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-6">
                
                {/* Section 1: ATS Scoring Breakdown */}
                <div>
                  <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3.5">Algorithm Match Breakdown</h4>
                  <div className="space-y-3">
                    {/* Skills match */}
                    <div>
                      <div className="flex justify-between text-[12px] font-bold text-slate-700 mb-1">
                        <span>Skills Match Score</span>
                        <span>{activeSnapshot.matchBreakdown?.skills || 78}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: `${activeSnapshot.matchBreakdown?.skills || 78}%` }}
                        />
                      </div>
                    </div>
                    {/* Experience match */}
                    <div>
                      <div className="flex justify-between text-[12px] font-bold text-slate-700 mb-1">
                        <span>Experience Compatibility</span>
                        <span>{activeSnapshot.matchBreakdown?.experience || 70}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                          style={{ width: `${activeSnapshot.matchBreakdown?.experience || 70}%` }}
                        />
                      </div>
                    </div>
                    {/* Resume formatting */}
                    <div>
                      <div className="flex justify-between text-[12px] font-bold text-slate-700 mb-1">
                        <span>ATS Layout & Formatting</span>
                        <span>{activeSnapshot.matchBreakdown?.formatting || 85}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                          style={{ width: `${activeSnapshot.matchBreakdown?.formatting || 85}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Why it improved (Checklist) */}
                <div>
                  <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Key System Actions</h4>
                  <ul className="space-y-2">
                    {activeSnapshot.improvements && activeSnapshot.improvements.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600 font-semibold leading-relaxed">
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section 3: Skills Added vs Missing */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Unlocked
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {activeSnapshot.skillsAdded && activeSnapshot.skillsAdded.map((skill, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                          {skill}
                        </span>
                      ))}
                      {(!activeSnapshot.skillsAdded || activeSnapshot.skillsAdded.length === 0) && (
                        <span className="text-[11px] text-slate-400 italic font-medium">None added</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 text-amber-600 flex items-center gap-1">
                      <ShieldAlert size={11} /> Missing
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {activeSnapshot.skillsMissing && activeSnapshot.skillsMissing.map((skill, i) => (
                        <span key={i} className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-100">
                          {skill}
                        </span>
                      ))}
                      {(!activeSnapshot.skillsMissing || activeSnapshot.skillsMissing.length === 0) && (
                        <span className="text-[11px] text-slate-400 italic font-medium">None missing</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 4: Recommended Roles at Snapshot */}
                {activeSnapshot.recommendedRoles && activeSnapshot.recommendedRoles.length > 0 && (
                  <div className="border-t border-slate-100 pt-4 space-y-2.5">
                    <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Top Recommended Roles</h4>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {activeSnapshot.recommendedRoles.map((roleObj, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 border border-slate-100 hover:bg-slate-50 transition-colors rounded-xl bg-slate-50/30">
                          <div>
                            <p className="text-[13px] font-black text-slate-800 line-clamp-1">{roleObj.role}</p>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{roleObj.type}</span>
                          </div>
                          <span className="text-[12px] font-black text-[#6D5DF6] bg-indigo-50 px-2 py-0.5 rounded-lg shrink-0">
                            {roleObj.score}% Match
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 border-dashed p-8 text-center text-slate-400">
              Select a history snapshot to inspect breakdown analytics.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
