import Skeleton from '../ui/Skeleton';

export default function ApplicationsSkeleton() {
  return (
    <div className="p-4 lg:p-6 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton.Line w="w-48" h="h-8" />
          <Skeleton.Line w="w-64" h="h-4" />
        </div>
        <Skeleton.Line w="w-32" h="h-10" rounded="rounded-xl" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-px">
        <Skeleton.Line w="w-24" h="h-10" rounded="rounded-t-xl" />
        <Skeleton.Line w="w-24" h="h-10" rounded="rounded-t-xl" />
        <Skeleton.Line w="w-24" h="h-10" rounded="rounded-t-xl" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton.Card key={i} className="space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton.Line w="w-16" h="h-6" rounded="rounded-full" />
              <Skeleton.Line w="w-8" h="h-8" rounded="rounded-full" />
            </div>
            <div>
              <Skeleton.Line w="w-3/4" h="h-5" className="mb-2" />
              <Skeleton.Line w="w-1/2" h="h-4" />
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <Skeleton.Line w="w-24" h="h-4" />
              <Skeleton.Line w="w-24" h="h-4" />
            </div>
          </Skeleton.Card>
        ))}
      </div>
    </div>
  );
}
