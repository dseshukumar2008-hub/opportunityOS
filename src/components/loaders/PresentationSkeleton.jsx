import Skeleton from '../ui/Skeleton';

export default function PresentationSkeleton() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
         <div className="space-y-2">
            <Skeleton.Line w="w-64" h="h-8" className="bg-slate-700" />
            <Skeleton.Line w="w-48" h="h-4" className="bg-slate-800" />
         </div>
         <Skeleton.Line w="w-32" h="h-10" className="bg-slate-800" rounded="rounded-xl" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4,5,6,7,8].map(i => (
          <Skeleton.Card key={i} className="bg-[#1E293B] border-slate-700">
             <Skeleton.Line w="w-12" h="h-12" rounded="rounded-xl" className="bg-slate-700 mb-4" />
             <Skeleton.Line w="w-24" h="h-8" className="bg-slate-600 mb-2" />
             <Skeleton.Line w="w-32" h="h-4" className="bg-slate-800" />
          </Skeleton.Card>
        ))}
      </div>

      {/* Big Chart */}
      <Skeleton.Card className="h-[400px] bg-[#1E293B] border-slate-700 flex items-end justify-between p-8">
        {[1,2,3,4,5,6].map(i => (
          <Skeleton.Line key={i} w="w-16" h="h-full" className="bg-slate-700 rounded-t-lg" />
        ))}
      </Skeleton.Card>
    </div>
  );
}
