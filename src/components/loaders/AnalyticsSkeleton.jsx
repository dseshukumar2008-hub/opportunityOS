import Skeleton from '../ui/Skeleton';

export default function AnalyticsSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton.Line w="w-64" h="h-8" className="mb-2" />
          <Skeleton.Line w="w-48" h="h-4" />
        </div>
        <Skeleton.Line w="w-40" h="h-10" rounded="rounded-xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1,2,3,4].map(i => (
           <Skeleton.Card key={i} className="p-6">
             <Skeleton.Base className="w-10 h-10 rounded-xl mb-4" />
             <Skeleton.Line w="w-24" h="h-8" className="mb-2" />
             <Skeleton.Line w="w-32" h="h-4" />
           </Skeleton.Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Skeleton.Card className="xl:col-span-2 h-[400px] flex flex-col">
          <Skeleton.Line w="w-48" h="h-6" className="mb-8" />
          <div className="flex-1 flex items-end gap-2 px-8">
             {[...Array(12)].map((_, i) => (
                <Skeleton.Base key={i} className="flex-1 rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
             ))}
          </div>
        </Skeleton.Card>

        <Skeleton.Card className="xl:col-span-1 h-[400px] flex flex-col items-center justify-center">
          <Skeleton.Line w="w-48" h="h-6" className="mb-12 self-start" />
          <Skeleton.Circle size="w-48 h-48" className="mb-8" />
          <div className="w-full flex justify-center gap-4">
            <Skeleton.Line w="w-16" h="h-4" />
            <Skeleton.Line w="w-16" h="h-4" />
            <Skeleton.Line w="w-16" h="h-4" />
          </div>
        </Skeleton.Card>
      </div>
    </div>
  );
}
