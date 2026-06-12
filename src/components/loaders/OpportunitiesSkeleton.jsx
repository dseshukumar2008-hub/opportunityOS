import Skeleton from '../ui/Skeleton';

export default function OpportunitiesSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton.Line w="w-64" h="h-8" className="mb-2" />
          <Skeleton.Line w="w-48" h="h-4" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-[280px] shrink-0 space-y-6">
           <Skeleton.Line h="h-12" rounded="rounded-xl" />
           <Skeleton.Card className="space-y-6">
              {[1,2,3,4].map(i => (
                <div key={i}>
                  <Skeleton.Line w="w-24" className="mb-4" />
                  <div className="space-y-3">
                    {[1,2,3].map(j => (
                      <div key={j} className="flex gap-3 items-center">
                        <Skeleton.Base className="w-4 h-4 rounded" />
                        <Skeleton.Line w="w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
           </Skeleton.Card>
        </div>

        {/* Feed */}
        <div className="flex-1 space-y-4">
          {[1,2,3,4,5].map(i => (
            <Skeleton.Card key={i} className="flex flex-col sm:flex-row gap-6">
               <Skeleton.Base className="w-16 h-16 rounded-xl shrink-0" />
               <div className="flex-1">
                 <Skeleton.Line w="w-1/2" h="h-6" className="mb-2" />
                 <Skeleton.Line w="w-32" className="mb-4" />
                 <div className="flex gap-2">
                   <Skeleton.Line w="w-20" h="h-6" rounded="rounded-full" />
                   <Skeleton.Line w="w-24" h="h-6" rounded="rounded-full" />
                   <Skeleton.Line w="w-16" h="h-6" rounded="rounded-full" />
                 </div>
               </div>
               <div className="flex sm:flex-col justify-between items-end shrink-0">
                 <Skeleton.Line w="w-20" h="h-8" rounded="rounded-full" />
                 <Skeleton.Line w="w-12" h="h-10" rounded="rounded-xl mt-4" />
               </div>
            </Skeleton.Card>
          ))}
        </div>
      </div>
    </div>
  );
}
