import { User, List, Mail, Users, ArrowUpRight } from 'lucide-react';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full max-w-[1200px] mx-auto px-6 py-24 flex flex-col items-center">
      <div className="text-center mb-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">How OpportunityOS Works</h2>
        <p className="text-slate-600">A simple 5-step journey to your dream opportunity.</p>
      </div>

      <div className="w-full relative flex justify-between mt-8">
        {/* Horizontal connecting line */}
        <div className="absolute top-6 left-[10%] right-[10%] border-t-2 border-dotted border-slate-300 -z-10"></div>
        
        {/* Step 1 */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6 z-10 shadow-sm relative">
            <User size={20} />
            <div className="absolute -bottom-3 w-6 h-6 bg-slate-200 rounded-full border-2 border-white text-[10px] font-bold text-slate-700 flex items-center justify-center">1</div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-2 mt-2 text-center">Create Profile</h3>
          <p className="text-xs text-slate-500 text-center max-w-[160px]">Build your profile and tell us your goals.</p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-6 z-10 shadow-sm relative">
            <List size={20} />
            <div className="absolute -bottom-3 w-6 h-6 bg-slate-200 rounded-full border-2 border-white text-[10px] font-bold text-slate-700 flex items-center justify-center">2</div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-2 mt-2 text-center">Discover Opportunities</h3>
          <p className="text-xs text-slate-500 text-center max-w-[160px]">Get personalized opportunities that match your skills.</p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-6 z-10 shadow-sm relative">
            <Mail size={20} />
            <div className="absolute -bottom-3 w-6 h-6 bg-slate-200 rounded-full border-2 border-white text-[10px] font-bold text-slate-700 flex items-center justify-center">3</div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-2 mt-2 text-center">Track Applications</h3>
          <p className="text-xs text-slate-500 text-center max-w-[160px]">Apply and track every application in one beautiful dashboard.</p>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-6 z-10 shadow-sm relative">
            <Users size={20} />
            <div className="absolute -bottom-3 w-6 h-6 bg-slate-200 rounded-full border-2 border-white text-[10px] font-bold text-slate-700 flex items-center justify-center">4</div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-2 mt-2 text-center">Improve & Prepare</h3>
          <p className="text-xs text-slate-500 text-center max-w-[160px]">Use AI tools and resources to improve your resume and skills.</p>
        </div>

        {/* Step 5 */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6 z-10 shadow-sm relative">
            <ArrowUpRight size={20} />
            <div className="absolute -bottom-3 w-6 h-6 bg-slate-200 rounded-full border-2 border-white text-[10px] font-bold text-slate-700 flex items-center justify-center">5</div>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-2 mt-2 text-center">Get Selected</h3>
          <p className="text-xs text-slate-500 text-center max-w-[160px]">Ace interviews and land your dream opportunities.</p>
        </div>
      </div>
    </section>
  );
}
