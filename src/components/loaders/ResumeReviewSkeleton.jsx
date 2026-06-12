import Skeleton from '../ui/Skeleton';

export default function ResumeReviewSkeleton() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton.Line w="w-64" h="h-8" className="mb-2" />
          <Skeleton.Line w="w-48" h="h-4" />
        </div>
        <Skeleton.Line w="w-40" h="h-10" rounded="rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton.Card className="lg:col-span-1 flex flex-col items-center justify-center p-12">
          <Skeleton.Circle size="w-48 h-48" className="mb-8" />
          <Skeleton.Line w="w-32" h="h-6" className="mb-2" />
          <Skeleton.Line w="w-24" />
        </Skeleton.Card>

        <div className="lg:col-span-2 space-y-6">
          <Skeleton.Card className="flex items-start gap-6">
            <Skeleton.Circle size="w-12 h-12" />
            <div className="flex-1 space-y-3">
              <Skeleton.Line w="w-48" h="h-6" />
              <Skeleton.Line w="w-full" />
              <Skeleton.Line w="w-5/6" />
            </div>
          </Skeleton.Card>
          <Skeleton.Card className="flex items-start gap-6">
            <Skeleton.Circle size="w-12 h-12" />
            <div className="flex-1 space-y-3">
              <Skeleton.Line w="w-48" h="h-6" />
              <Skeleton.Line w="w-full" />
              <Skeleton.Line w="w-4/5" />
            </div>
          </Skeleton.Card>
          <Skeleton.Card className="flex items-start gap-6">
            <Skeleton.Circle size="w-12 h-12" />
            <div className="flex-1 space-y-3">
              <Skeleton.Line w="w-48" h="h-6" />
              <Skeleton.Line w="w-full" />
            </div>
          </Skeleton.Card>
        </div>
      </div>
    </div>
  );
}
