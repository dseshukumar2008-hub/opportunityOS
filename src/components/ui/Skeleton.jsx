// ─────────────────────────────────────────────────────────────────
// Skeleton Primitives
// ─────────────────────────────────────────────────────────────────

export function SkeletonBase({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:400%_100%] ${className}`}
      style={{ backgroundSize: '400% 100%', animation: 'skeleton-shimmer 1.6s ease-in-out infinite' }}
      {...props}
    />
  );
}

export function SkeletonLine({ className = '', w = 'w-full', h = 'h-4', rounded = 'rounded-md', ...props }) {
  return <SkeletonBase className={`${w} ${h} ${rounded} ${className}`} {...props} />;
}

export function SkeletonCircle({ className = '', size = 'w-10 h-10', ...props }) {
  return <SkeletonBase className={`rounded-full ${size} shrink-0 ${className}`} {...props} />;
}

export function SkeletonRect({ className = '', w = 'w-full', h = 'h-[120px]', rounded = 'rounded-2xl', ...props }) {
  return <SkeletonBase className={`${w} ${h} ${rounded} ${className}`} {...props} />;
}

export function SkeletonCard({ className = '', children, ...props }) {
  return (
    <div className={`bg-white border border-slate-100 shadow-sm rounded-2xl p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Page-Specific Skeleton Presets
// ─────────────────────────────────────────────────────────────────

/** Dashboard: stat row + widget grid */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonLine w="w-48" h="h-7" />
          <SkeletonLine w="w-64" h="h-4" />
        </div>
        <SkeletonRect w="w-28" h="h-10" rounded="rounded-xl" />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="space-y-3">
            <div className="flex items-center gap-3">
              <SkeletonCircle size="w-10 h-10" />
              <SkeletonLine w="w-24" h="h-3" />
            </div>
            <SkeletonLine w="w-16" h="h-8" />
            <SkeletonLine w="w-32" h="h-3" />
          </SkeletonCard>
        ))}
      </div>
      {/* Widget grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SkeletonCard className="space-y-4">
            <SkeletonLine w="w-40" h="h-5" />
            <SkeletonRect h="h-40" rounded="rounded-xl" />
          </SkeletonCard>
          <div className="grid grid-cols-2 gap-4">
            {[0,1].map(i => (
              <SkeletonCard key={i} className="space-y-3">
                <SkeletonLine w="w-28" h="h-4" />
                <SkeletonRect h="h-24" rounded="rounded-xl" />
              </SkeletonCard>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <SkeletonCard className="space-y-3">
            <SkeletonLine w="w-36" h="h-4" />
            {[0,1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonCircle size="w-8 h-8" />
                <div className="flex-1 space-y-1">
                  <SkeletonLine h="h-3" />
                  <SkeletonLine w="w-3/4" h="h-3" />
                </div>
              </div>
            ))}
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}

/** Opportunities: filter sidebar + card grid */
export function OpportunitiesSkeleton() {
  return (
    <div className="flex gap-6 p-4 lg:p-6">
      {/* Filter sidebar */}
      <div className="hidden lg:flex w-[260px] shrink-0">
        <SkeletonCard className="w-full space-y-4 h-fit">
          <SkeletonLine w="w-28" h="h-5" />
          {[0,1,2,3].map(i => (
            <div key={i} className="space-y-2">
              <SkeletonLine w="w-20" h="h-3" />
              <SkeletonLine w="w-full" h="h-3" />
              <SkeletonLine w="w-3/4" h="h-3" />
              <SkeletonLine w="w-2/3" h="h-3" />
            </div>
          ))}
        </SkeletonCard>
      </div>
      {/* Cards */}
      <div className="flex-1 space-y-4">
        <div className="flex gap-3">
          <SkeletonRect w="w-full" h="h-11" rounded="rounded-xl" />
          <SkeletonRect w="w-24" h="h-11" rounded="rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="space-y-4">
              <div className="flex items-start gap-3">
                <SkeletonRect w="w-12 h-12" h="h-12" rounded="rounded-xl" />
                <div className="flex-1 space-y-2">
                  <SkeletonLine w="w-3/4" h="h-4" />
                  <SkeletonLine w="w-1/2" h="h-3" />
                </div>
              </div>
              <SkeletonLine h="h-3" />
              <SkeletonLine w="w-5/6" h="h-3" />
              <div className="flex gap-2">
                <SkeletonRect w="w-16" h="h-6" rounded="rounded-full" />
                <SkeletonRect w="w-20" h="h-6" rounded="rounded-full" />
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <SkeletonRect w="w-full" h="h-9" rounded="rounded-xl" />
                <SkeletonRect w="w-9 h-9" h="h-9" rounded="rounded-xl" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Team Finder: filter tabs + team cards */
export function TeamsSkeleton() {
  return (
    <div className="p-4 lg:p-6 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonLine w="w-36" h="h-7" />
          <SkeletonLine w="w-52" h="h-4" />
        </div>
        <SkeletonRect w="w-32" h="h-10" rounded="rounded-xl" />
      </div>
      {/* Tabs */}
      <div className="flex gap-2">
        {[0,1,2].map(i => (
          <SkeletonRect key={i} w="w-24" h="h-10" rounded="rounded-xl" />
        ))}
      </div>
      {/* Search */}
      <SkeletonRect w="w-full" h="h-11" rounded="rounded-xl" />
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="space-y-4">
            <div className="flex items-start gap-3">
              <SkeletonCircle size="w-12 h-12" />
              <div className="flex-1 space-y-2">
                <SkeletonLine w="w-3/4" h="h-4" />
                <SkeletonRect w="w-16" h="h-5" rounded="rounded-full" />
              </div>
            </div>
            <SkeletonLine h="h-3" />
            <SkeletonLine w="w-4/5" h="h-3" />
            <div className="flex gap-1.5">
              {[0,1,2].map(j => (
                <SkeletonRect key={j} w="w-14" h="h-6" rounded="rounded-lg" />
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <SkeletonRect w="w-full" h="h-9" rounded="rounded-xl" />
              <SkeletonRect w="w-full" h="h-9" rounded="rounded-xl" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

/** Messages: sidebar + chat area */
export function MessagesSkeleton() {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-[350px] border-r border-slate-200 bg-white flex flex-col p-4 space-y-4 shrink-0">
        <div className="space-y-1">
          <SkeletonLine w="w-32" h="h-6" />
          <SkeletonLine w="w-48" h="h-3" />
        </div>
        <SkeletonRect w="w-full" h="h-10" rounded="rounded-xl" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <SkeletonCircle size="w-12 h-12" />
            <div className="flex-1 space-y-2">
              <SkeletonLine w="w-28" h="h-3" />
              <SkeletonLine w="w-40" h="h-3" />
            </div>
            <SkeletonLine w="w-10" h="h-3" />
          </div>
        ))}
      </div>
      {/* Chat pane */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC] p-6 space-y-4">
        {/* Chat header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <SkeletonCircle size="w-10 h-10" />
          <div className="space-y-1">
            <SkeletonLine w="w-32" h="h-4" />
            <SkeletonLine w="w-20" h="h-3" />
          </div>
        </div>
        {/* Message bubbles */}
        <div className="flex-1 space-y-4">
          {[0,1,2,3].map(i => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              {i % 2 === 0 && <SkeletonCircle size="w-8 h-8" className="mr-2 mt-1" />}
              <SkeletonRect w={i % 2 === 0 ? 'w-48' : 'w-56'} h="h-12" rounded="rounded-2xl" className={i % 2 === 0 ? '' : 'bg-[#6C4CF1]/10'} />
            </div>
          ))}
        </div>
        {/* Input */}
        <SkeletonRect w="w-full" h="h-14" rounded="rounded-2xl" />
      </div>
    </div>
  );
}

/** Analytics: stat cards + charts */
export function AnalyticsSkeleton() {
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <SkeletonLine w="w-52" h="h-8" />
        <SkeletonLine w="w-80" h="h-4" />
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="space-y-3">
            <div className="flex items-center gap-3">
              <SkeletonRect w="w-10 h-10" h="h-10" rounded="rounded-xl" />
              <SkeletonLine w="w-24" h="h-3" />
            </div>
            <SkeletonLine w="w-16" h="h-9" />
            <SkeletonLine w="w-28" h="h-3" />
          </SkeletonCard>
        ))}
      </div>
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="space-y-4">
            <SkeletonLine w="w-36" h="h-5" />
            <SkeletonRect h="h-48" rounded="rounded-xl" />
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

/** Career Roadmap: header + progress + skill grid */
export function CareerRoadmapSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-2">
          <SkeletonLine w="w-56" h="h-8" />
          <SkeletonLine w="w-72" h="h-4" />
        </div>
        <SkeletonRect w="w-48" h="h-11" rounded="rounded-xl" />
      </div>
      {/* Readiness panel */}
      <SkeletonCard className="space-y-4">
        <div className="flex justify-between items-center">
          <SkeletonLine w="w-40" h="h-5" />
          <SkeletonLine w="w-16" h="h-5" />
        </div>
        <SkeletonRect h="h-4" rounded="rounded-full" />
        <div className="grid grid-cols-4 gap-4">
          {[0,1,2,3].map(i => <SkeletonRect key={i} h="h-16" rounded="rounded-xl" />)}
        </div>
      </SkeletonCard>
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard className="space-y-3">
            <SkeletonLine w="w-40" h="h-5" />
            <SkeletonRect h="h-4" rounded="rounded-full" />
          </SkeletonCard>
          <div className="grid grid-cols-2 gap-6">
            {[0,1].map(i => (
              <SkeletonCard key={i} className="space-y-3">
                <SkeletonLine w="w-36" h="h-4" />
                <div className="flex flex-wrap gap-2">
                  {[0,1,2,3].map(j => <SkeletonRect key={j} w="w-16" h="h-7" rounded="rounded-lg" />)}
                </div>
              </SkeletonCard>
            ))}
          </div>
        </div>
        <div>
          <SkeletonCard className="space-y-4">
            <SkeletonLine w="w-44" h="h-5" />
            {[0,1,2].map(i => (
              <div key={i} className="space-y-2 p-3 rounded-xl border border-slate-100">
                <SkeletonLine w="w-24" h="h-3" />
                <SkeletonLine w="w-40" h="h-4" />
                <SkeletonRect w="w-20" h="h-7" rounded="rounded-lg" />
              </div>
            ))}
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}

/** Goals: stat row + goal cards */
export function GoalsSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-2">
          <SkeletonLine w="w-40" h="h-8" />
          <SkeletonLine w="w-64" h="h-4" />
        </div>
        <SkeletonRect w="w-32" h="h-10" rounded="rounded-xl" />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="flex items-center gap-3">
            <SkeletonRect w="w-12 h-12" h="h-12" rounded="rounded-xl" />
            <div className="space-y-2">
              <SkeletonLine w="w-16" h="h-3" />
              <SkeletonLine w="w-10" h="h-6" />
            </div>
          </SkeletonCard>
        ))}
      </div>
      {/* Goal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="space-y-4">
            <div className="flex justify-between">
              <SkeletonLine w="w-36" h="h-5" />
              <SkeletonRect w="w-16" h="h-6" rounded="rounded-full" />
            </div>
            <SkeletonLine h="h-3" />
            <SkeletonLine w="w-3/4" h="h-3" />
            <SkeletonRect h="h-2" rounded="rounded-full" />
            <div className="flex justify-between">
              <SkeletonLine w="w-12" h="h-3" />
              <SkeletonLine w="w-16" h="h-3" />
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Default export namespace
// ─────────────────────────────────────────────────────────────────
const Skeleton = {
  Base: SkeletonBase,
  Line: SkeletonLine,
  Circle: SkeletonCircle,
  Rect: SkeletonRect,
  Card: SkeletonCard,
  // Page presets
  Dashboard: DashboardSkeleton,
  Opportunities: OpportunitiesSkeleton,
  Teams: TeamsSkeleton,
  Messages: MessagesSkeleton,
  Analytics: AnalyticsSkeleton,
  CareerRoadmap: CareerRoadmapSkeleton,
  Goals: GoalsSkeleton,
};

export default Skeleton;
