import { Map, CheckCircle2, Circle, Briefcase, FileText, Code, User, MessageSquare, Award } from 'lucide-react';
import { useDashboardInsights } from '../../hooks/useDashboardInsights';

export default function CareerJourneyWidget() {
  const { careerReadiness, applicationInsights, isLoading } = useDashboardInsights();

  if (isLoading) {
    return (
      <div className="card-standard p-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="h-10 bg-slate-100 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  const { breakdown } = careerReadiness;
  const { submitted, interviews, offers } = applicationInsights;

  const steps = [
    { id: 'profile', label: 'Profile Complete', icon: User, done: breakdown?.profile?.done },
    { id: 'resume', label: 'Resume Uploaded', icon: FileText, done: breakdown?.resume?.done },
    { id: 'skills', label: 'Core Skills Added', icon: Code, done: breakdown?.skills?.done },
    { id: 'apps', label: `${submitted} Applications Submitted`, icon: Briefcase, done: submitted > 0 },
    { id: 'interviews', label: `${interviews} Interviews`, icon: MessageSquare, done: interviews > 0 },
    { id: 'offers', label: `${offers} Offers`, icon: Award, done: offers > 0 },
  ];

  return (
    <div className="card-standard p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
          <Map size={16} className="text-indigo-600" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-900">Career Journey</h3>
      </div>

      <div className="relative flex-grow">
        {/* Connecting Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100"></div>

        <div className="space-y-5 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isDone = step.done;
            const isNext = !isDone && (index === 0 || steps[index - 1].done);

            let markerClass = "w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white ";
            let textClass = "text-sm font-medium ";
            
            if (isDone) {
              markerClass += "border-emerald-500 text-emerald-500";
              textClass += "text-slate-800";
            } else if (isNext) {
              markerClass += "border-indigo-500 text-indigo-500 ring-4 ring-indigo-50";
              textClass += "text-indigo-700 font-bold";
            } else {
              markerClass += "border-slate-200 text-slate-300";
              textClass += "text-slate-400";
            }

            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className={markerClass}>
                  {isDone ? <CheckCircle2 size={16} /> : <Icon size={14} />}
                </div>
                <div className="flex-1 bg-white border border-slate-100 rounded-lg p-2 shadow-sm flex items-center">
                   <span className={textClass}>{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
