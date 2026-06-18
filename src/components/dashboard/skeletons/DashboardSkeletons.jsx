import React from 'react';

export function HeroSkeleton() {
  return (
    <div className="w-full h-[200px] bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 lg:p-8 flex items-center gap-8">
      <div className="shrink-0 w-[140px] h-[140px] rounded-full bg-slate-100 animate-pulse" />
      <div className="flex-1 space-y-4">
        <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
        <div className="h-8 bg-slate-100 rounded w-64 animate-pulse" />
        <div className="h-4 bg-slate-100 rounded w-48 animate-pulse" />
        <div className="w-full h-3 bg-slate-100 rounded-full mt-4 animate-pulse" />
        <div className="flex gap-2 mt-2">
          <div className="h-8 w-32 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-8 w-32 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm animate-pulse flex flex-col gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100" />
          <div className="h-6 w-16 bg-slate-100 rounded" />
          <div className="h-3 w-24 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}

export function OpportunitySkeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 animate-pulse">
      <div className="h-6 w-48 bg-slate-100 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[180px] bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-1/2 bg-slate-200 rounded" />
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 w-16 bg-slate-200 rounded-full" />
              <div className="h-6 w-16 bg-slate-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsWidgetSkeleton() {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm animate-pulse flex flex-col h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-32 bg-slate-100 rounded" />
        <div className="h-4 w-12 bg-slate-100 rounded" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="h-12 w-full bg-slate-50 rounded-xl" />
        <div className="h-12 w-full bg-slate-50 rounded-xl" />
        <div className="h-12 w-full bg-slate-50 rounded-xl" />
      </div>
    </div>
  );
}
