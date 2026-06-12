import Skeleton from '../ui/Skeleton';

export default function MessagesSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200 overflow-hidden flex shadow-sm">
      {/* Left Sidebar */}
      <div className="w-[320px] border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200">
          <Skeleton.Line w="w-full" h="h-10" rounded="rounded-xl" />
        </div>
        <div className="flex-1 overflow-hidden p-2 space-y-1">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex gap-3 p-3 rounded-xl items-center">
              <Skeleton.Circle size="w-12 h-12" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <Skeleton.Line w="w-24" h="h-4" />
                  <Skeleton.Line w="w-10" h="h-3" />
                </div>
                <Skeleton.Line w="w-40" h="h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-slate-200 px-6 flex items-center gap-4">
          <Skeleton.Circle size="w-10 h-10" />
          <Skeleton.Line w="w-32" h="h-5" />
        </div>
        <div className="flex-1 p-6 flex flex-col justify-end space-y-6">
           {/* Incoming */}
           <div className="flex gap-3 w-3/4">
             <Skeleton.Circle size="w-8 h-8" />
             <div className="space-y-2">
               <Skeleton.Line w="w-48" h="h-12" rounded="rounded-2xl rounded-tl-sm" />
               <Skeleton.Line w="w-64" h="h-10" rounded="rounded-2xl" />
             </div>
           </div>
           
           {/* Outgoing */}
           <div className="flex gap-3 w-3/4 self-end justify-end">
             <div className="space-y-2 flex flex-col items-end">
               <Skeleton.Line w="w-64" h="h-12" rounded="rounded-2xl rounded-tr-sm" />
               <Skeleton.Line w="w-40" h="h-10" rounded="rounded-2xl" />
             </div>
           </div>
           
           {/* Incoming */}
           <div className="flex gap-3 w-3/4">
             <Skeleton.Circle size="w-8 h-8" />
             <Skeleton.Line w="w-56" h="h-16" rounded="rounded-2xl rounded-tl-sm" />
           </div>
        </div>
        <div className="h-20 border-t border-slate-200 p-4 flex items-center gap-4">
          <Skeleton.Base className="w-10 h-10 rounded-xl shrink-0" />
          <Skeleton.Line w="w-full" h="h-12" rounded="rounded-xl" />
          <Skeleton.Base className="w-12 h-12 rounded-xl shrink-0 bg-[#6C4CF1]/20" />
        </div>
      </div>
    </div>
  );
}
