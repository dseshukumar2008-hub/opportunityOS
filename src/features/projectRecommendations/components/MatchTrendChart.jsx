import React from 'react';

export default function MatchTrendChart({ 
  chronologicalHistory, 
  activeSnapshot, 
  setSelectedSnapshotId, 
  minScore, 
  maxScore, 
  range, 
  chartWidth = 500, 
  chartHeight = 80, 
  padding = 20, 
  points 
}) {
  return (
    <div className="h-[200px] w-full border border-slate-50 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-center relative overflow-visible">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
        <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1.5" />
        <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#f1f5f9" strokeWidth="1.5" />
        <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e2e8f0" strokeWidth="1.5" />
        
        <polyline
          fill="none"
          stroke="#6D5DF6"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        
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
  );
}
