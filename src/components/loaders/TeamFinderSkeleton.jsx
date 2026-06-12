import Skeleton from '../ui/Skeleton';

export default function TeamFinderSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton.Line w="w-64" h="h-8" className="mb-2" />
          <Skeleton.Line w="w-48" h="h-4" />
        </div>
        <Skeleton.Line w="w-32" h="h-10" rounded="rounded-xl" />
      </div>

      <div className="flex gap-4">
        <Skeleton.Line w="w-64" h="h-12" rounded="rounded-xl" />
        <Skeleton.Line w="w-32" h="h-12" rounded="rounded-xl" />
        <Skeleton.Line w="w-32" h="h-12" rounded="rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <Skeleton.Card key={i} className="flex flex-col h-[300px]">
            <div className="flex justify-between items-start mb-4">
              <Skeleton.Base className="w-12 h-12 rounded-xl" />
              <Skeleton.Line w="w-20" h="h-6" rounded="rounded-full" />
            </div>
            <Skeleton.Line w="w-48" h="h-6" className="mb-2" />
            <Skeleton.Line w="w-32" className="mb-6" />
            
            <div className="flex-1 space-y-2">
              <Skeleton.Line w="w-full" />
              <Skeleton.Line w="w-2/3" />
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex -space-x-2">
                {[1,2,3].map(j => (
                  <Skeleton.Circle key={j} size="w-8 h-8" className="border-2 border-white" />
                ))}
              </div>
              <Skeleton.Line w="w-16" h="h-8" rounded="rounded-lg" />
            </div>
          </Skeleton.Card>
        ))}
      </div>
    </div>
  );
}
