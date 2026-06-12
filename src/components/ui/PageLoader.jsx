import { Loader2 } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Loader2 size={32} className="text-indigo-600 animate-spin relative z-10" />
      </div>
      <p className="text-sm font-bold text-slate-500 animate-pulse tracking-wide uppercase">Loading Page...</p>
    </div>
  );
}
