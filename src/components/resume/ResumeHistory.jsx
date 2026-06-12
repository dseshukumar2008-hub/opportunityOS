import { useState, useMemo } from 'react';
import { History, TrendingUp, Trophy, CheckCircle2 } from 'lucide-react';

export default function ResumeHistory({ history, getBestVersion, compareVersions }) {
  const [compareV1, setCompareV1] = useState(history.length > 1 ? history[0].id : '');
  const [compareV2, setCompareV2] = useState(history.length > 1 ? history[history.length - 1].id : '');

  const bestVersion = getBestVersion();
  const comparison = useMemo(() => {
    if (compareV1 && compareV2 && compareV1 !== compareV2) {
      return compareVersions(compareV1, compareV2);
    }
    return null;
  }, [compareV1, compareV2, compareVersions]);

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
          <History size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No History Available</h3>
        <p className="text-slate-500 max-w-sm">
          Upload a resume or analyze your profile to start tracking your progress and improvements over time.
        </p>
      </div>
    );
  }

  // Trend Chart logic
  const chartHeight = 150;
  const maxScore = 100;
  const minScore = Math.max(0, Math.min(...history.map(h => h.results.overallScore)) - 10);
  const chartRange = maxScore - minScore;
  const pointWidth = history.length > 1 ? 100 / (history.length - 1) : 100;

  const points = history.map((h, i) => {
    const x = history.length > 1 ? i * pointWidth : 50;
    const y = chartHeight - ((h.results.overallScore - minScore) / chartRange) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-8">
      
      {/* Top row: Trend & Best Version */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-900">Improvement Trend</h3>
          </div>
          
          <div className="relative w-full h-[180px] pt-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[10px] font-bold text-slate-400">
              <span>100</span>
              <span>{Math.round(minScore + chartRange / 2)}</span>
              <span>{minScore}</span>
            </div>

            <div className="ml-10 h-full relative border-b border-l border-slate-100">
              {history.length > 1 ? (
                <svg className="absolute inset-0 w-full h-[150px] overflow-visible" preserveAspectRatio="none">
                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                  {/* Points */}
                  {history.map((h, i) => {
                    const x = `${i * pointWidth}%`;
                    const y = chartHeight - ((h.results.overallScore - minScore) / chartRange) * chartHeight;
                    return (
                      <g key={h.id}>
                        <circle cx={x} cy={y} r="5" fill="#fff" stroke="#4F46E5" strokeWidth="2" />
                        <text x={x} y={y - 15} textAnchor="middle" className="text-xs font-bold fill-indigo-600">
                          {h.results.overallScore}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <div className="w-full h-[150px] flex items-center justify-center text-sm font-medium text-slate-400">
                  Analyze another version to see your trend
                </div>
              )}
              
              {/* X-axis labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-bold text-slate-400">
                {history.map(h => (
                  <span key={h.id}>V{h.versionNumber}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Best Version */}
        {bestVersion && (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-md p-6 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Trophy size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={20} className="text-emerald-100" />
                <span className="text-sm font-bold tracking-wider uppercase text-emerald-100">Best Version</span>
              </div>
              <h3 className="text-4xl font-black mb-1">{bestVersion.results.overallScore}<span className="text-xl font-bold text-emerald-200">/100</span></h3>
              <p className="text-sm font-medium text-emerald-100 mb-6">
                Version {bestVersion.versionNumber} • {new Date(bestVersion.timestamp).toLocaleDateString()}
              </p>
              
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-xs font-semibold leading-relaxed">
                  Source: {bestVersion.sourceName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Engine */}
      {history.length > 1 && (
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History size={18} className="text-indigo-500" />
              Compare Versions
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-slate-50 p-4 rounded-xl">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Baseline Version</label>
              <select 
                value={compareV1} 
                onChange={(e) => setCompareV1(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500"
              >
                {history.map(h => (
                  <option key={h.id} value={h.id}>Version {h.versionNumber} ({h.results.overallScore})</option>
                ))}
              </select>
            </div>
            
            <div className="hidden md:flex w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm shrink-0 border border-slate-100 mt-6">
              <span className="text-xs font-bold text-slate-400">VS</span>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Version</label>
              <select 
                value={compareV2} 
                onChange={(e) => setCompareV2(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-indigo-500"
              >
                {history.map(h => (
                  <option key={h.id} value={h.id}>Version {h.versionNumber} ({h.results.overallScore})</option>
                ))}
              </select>
            </div>
          </div>

          {comparison ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Metric Deltas */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Score Differences</h4>
                
                {[
                  { label: 'Overall ATS Score', diff: comparison.scoreDiff },
                  { label: 'Skills Score', diff: comparison.skillsDiff },
                  { label: 'Projects Score', diff: comparison.projectsDiff },
                  { label: 'Keywords Score', diff: comparison.keywordsDiff }
                ].map((metric, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                    <span className="text-sm font-semibold text-slate-700">{metric.label}</span>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                      metric.diff > 0 ? 'bg-emerald-50 text-emerald-600' :
                      metric.diff < 0 ? 'bg-red-50 text-red-600' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {metric.diff > 0 ? '+' : ''}{metric.diff}
                    </div>
                  </div>
                ))}
              </div>

              {/* Improvement Summary */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4">Improvement Summary</h4>
                {comparison.summary.length > 0 ? (
                  <ul className="space-y-3">
                    {comparison.summary.map((sum, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-slate-600 leading-relaxed">{sum}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-6 text-center">
                    <p className="text-sm font-medium text-slate-500">No significant improvements detected between these versions.</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm font-medium text-slate-500">Select two different versions to compare.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
