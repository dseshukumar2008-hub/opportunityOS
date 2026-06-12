import Skeleton from '../ui/Skeleton';

export default function ResumeBuilderSkeleton() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Left side editor */}
      <div className="w-full md:w-[45%] flex flex-col border-r border-slate-200 bg-white h-full overflow-hidden">
        <div className="p-6 border-b border-slate-100 space-y-2 shrink-0">
          <Skeleton.Line w="w-48" h="h-8" />
          <Skeleton.Line w="w-64" h="h-4" />
        </div>
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <Skeleton.Card className="space-y-4">
            <Skeleton.Line w="w-32" h="h-6" />
            <Skeleton.Line h="h-12" rounded="rounded-xl" />
            <Skeleton.Line h="h-12" rounded="rounded-xl" />
          </Skeleton.Card>
          <Skeleton.Card className="space-y-4">
            <Skeleton.Line w="w-32" h="h-6" />
            <Skeleton.Line h="h-24" rounded="rounded-xl" />
          </Skeleton.Card>
        </div>
      </div>
      {/* Right side PDF preview */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-slate-100 p-8">
        <div className="w-full max-w-[800px] h-full bg-white shadow-xl flex flex-col p-12 space-y-8">
          <div className="text-center space-y-3">
            <Skeleton.Line w="w-64" h="h-10" className="mx-auto" />
            <Skeleton.Line w="w-96" h="h-4" className="mx-auto" />
          </div>
          <div className="space-y-6 mt-8">
             {[1, 2, 3].map(i => (
               <div key={i} className="space-y-3">
                 <Skeleton.Line w="w-40" h="h-6" />
                 <Skeleton.Line w="w-full" h="h-4" />
                 <Skeleton.Line w="w-full" h="h-4" />
                 <Skeleton.Line w="w-3/4" h="h-4" />
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
