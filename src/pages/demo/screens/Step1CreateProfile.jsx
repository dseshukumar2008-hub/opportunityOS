import { Sparkles, User, Mail, MapPin, GraduationCap, Code, Briefcase, PlusCircle, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Step1CreateProfile() {
  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Sparkles size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Let's build your profile</h2>
            <p className="text-sm font-medium text-slate-500">Provide your details to get personalized opportunity matches.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="75 25" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900">75%</div>
          </div>
          <div className="text-sm">
            <div className="font-bold text-slate-900">Profile Strength</div>
            <div className="text-xs text-slate-500">Good, but needs work</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 bg-[#FAFAFA]">
        
        {/* Left Col: Personal Info */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center shrink-0">
              <User size={40} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900">Alex Johnson</h3>
              <p className="text-slate-500 font-medium">Computer Science Major @ Stanford University</p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-600"><Mail size={16}/> alex.j@example.com</div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600"><MapPin size={16}/> San Francisco, CA</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><GraduationCap size={16} className="text-indigo-500"/> Education</h4>
              <div className="space-y-3">
                <div className="border border-slate-100 rounded-lg p-3">
                  <div className="font-bold text-sm text-slate-900">B.S. Computer Science</div>
                  <div className="text-xs text-slate-500">Stanford University • Expected 2026</div>
                  <div className="text-xs font-medium text-emerald-600 mt-1">GPA: 3.8/4.0</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Briefcase size={16} className="text-indigo-500"/> Career Interests</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">Software Engineering</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">AI / Machine Learning</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Product Management</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Code size={16} className="text-indigo-500"/> Technical Skills</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'Python', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL'].map(skill => (
                <span key={skill} className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm">
                  {skill}
                </span>
              ))}
              <button className="px-3 py-1.5 border border-dashed border-slate-300 text-slate-500 hover:text-slate-900 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors">
                <PlusCircle size={14}/> Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Checklist & AI */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Missing Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-100 bg-amber-50 text-amber-900">
                <AlertCircle size={16} className="text-amber-500 shrink-0"/>
                <span className="text-xs font-medium">Add GitHub/Portfolio link</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-100 bg-amber-50 text-amber-900">
                <AlertCircle size={16} className="text-amber-500 shrink-0"/>
                <span className="text-xs font-medium">Add a short bio</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 text-slate-500">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0"/>
                <span className="text-xs font-medium line-through">Add Education</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6C4CF1] to-purple-600 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-amber-300" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-indigo-100">AI Coach</h4>
            </div>
            <p className="text-sm leading-relaxed font-medium">
              Adding a link to your GitHub repository will increase your profile search visibility by 40%. Want me to help you write a professional bio?
            </p>
            <button className="mt-4 w-full bg-white text-indigo-700 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
              Draft Bio with AI
            </button>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
        <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
          Skip for now
        </button>
        <button className="bg-[#6C4CF1] hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-200 transition-all">
          Complete Profile <ArrowRight size={16}/>
        </button>
      </div>
    </div>
  );
}
