import Skeleton from '../ui/Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton.Line w="w-48" h="h-8" className="mb-2" />
          <Skeleton.Line w="w-64" h="h-4" />
        </div>
        <Skeleton.Line w="w-32" h="h-10" rounded="rounded-xl" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="xl:col-span-3 space-y-6 flex flex-col">
          <Skeleton.Card className="h-[250px] flex flex-col items-center justify-center space-y-4">
            <Skeleton.Circle size="w-20 h-20" />
            <Skeleton.Line w="w-32" />
            <Skeleton.Line w="w-48" />
          </Skeleton.Card>
          
          <Skeleton.Card className="flex-1 min-h-[300px]">
            <Skeleton.Line w="w-32" className="mb -6" />
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton.Circle size="w-10 h-10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton.Line w="w-full" />
                    <Skeleton.Line w="w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </Skeleton.Card>
        </div>

        {/* Middle Column */}
        <div className="xl:col-span-6 space-y-6 flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton.Card className="h-32" />
            <Skeleton.Card className="h-32" />
          </div>

          <Skeleton.Card className="h-[300px]" />
          
          <Skeleton.Card className="flex-1 min-h-[400px]">
             <div className="flex justify-between mb-6">
               <Skeleton.Line w="w-40" />
               <Skeleton.Line w="w-20" />
             </div>
             <div className="space-y-4">
                {[1, 2].map(i => (
                  <Skeleton.Line key={i} h="h-24" rounded="rounded-xl" />
                ))}
             </div>
          </Skeleton.Card>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-3 space-y-6 flex flex-col">
           <Skeleton.Card className="h-[250px] flex items-center justify-center">
             <Skeleton.Circle size="w-32 h-32" />
           </Skeleton.Card>

           <Skeleton.Card className="flex-1 min-h-[400px]">
             <Skeleton.Line w="w-32" className="mb-6" />
             <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton.Line key={i} h="h-16" rounded="rounded-xl" />
                ))}
             </div>
           </Skeleton.Card>
        </div>

      </div>
    </div>
  );
}
