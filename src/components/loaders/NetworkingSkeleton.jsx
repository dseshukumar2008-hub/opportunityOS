import Skeleton from '../ui/Skeleton';

export default function NetworkingSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton.Line w="w-64" h="h-8" className="mb-2" />
          <Skeleton.Line w="w-48" h="h-4" />
        </div>
      </div>

      <div className="flex gap-4">
        <Skeleton.Line w="w-48" h="h-10" rounded="rounded-lg" />
        <Skeleton.Line w="w-32" h="h-10" rounded="rounded-lg" />
        <Skeleton.Line w="w-32" h="h-10" rounded="rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4,5,6,7,8].map(i => (
          <Skeleton.Card key={i} className="flex flex-col items-center text-center p-8">
             <Skeleton.Circle size="w-24 h-24" className="mb-4" />
             <Skeleton.Line w="w-32" h="h-5" className="mb-2" />
             <Skeleton.Line w="w-24" h="h-4" className="mb-6" />
             
             <div className="flex flex-wrap justify-center gap-2 mb-6">
               <Skeleton.Line w="w-16" h="h-6" rounded="rounded-full" />
               <Skeleton.Line w="w-20" h="h-6" rounded="rounded-full" />
             </div>

             <Skeleton.Line w="w-full" h="h-10" rounded="rounded-xl" />
          </Skeleton.Card>
        ))}
      </div>
    </div>
  );
}
