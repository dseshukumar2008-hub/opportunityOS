import { Sparkles, FileText, CheckCircle2, Circle, AlertCircle, ArrowRight, UploadCloud, LayoutTemplate } from 'lucide-react';

export default function Step2BuildResume() {
  return (
    <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Sparkles size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Let's create your resume</h2>
            <p className="text-sm font-medium text-slate-500">We'll use your profile data to generate an ATS-friendly resume.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-sm text-right">
            <div className="font-bold text-slate-900">Resume Strength</div>
            <div className="text-xs text-slate-500">Ready to build</div>
          </div>
          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-[60%] h-full bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 bg-[#FAFAFA]">
        
        {/* Left Col: Sections & Missing */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><LayoutTemplate size={16} className="text-blue-500"/> Resume Sections Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0"/>
                <div>
                  <div className="text-sm font-bold text-slate-900">Contact Info</div>
                  <div className="text-xs text-slate-500">Complete</div>
                </div>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0"/>
                <div>
                  <div className="text-sm font-bold text-slate-900">Education</div>
                  <div className="text-xs text-slate-500">Stanford Univ.</div>
                </div>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0"/>
                <div>
                  <div className="text-sm font-bold text-slate-900">Skills</div>
                  <div className="text-xs text-slate-500">7 skills added</div>
                </div>
              </div>
              <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-amber-500 shrink-0"/>
                <div>
                  <div className="text-sm font-bold text-amber-900">Experience</div>
                  <div className="text-xs text-amber-700 font-medium">Missing</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Choose Template</h3>
            <div className="flex gap-4">
              <div className="w-1/3 aspect-[1/1.2] rounded-xl border-2 border-blue-500 relative overflow-hidden bg-slate-50 shadow-sm cursor-pointer group">
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white"/>
                </div>
                <div className="p-4 flex flex-col gap-2 h-full opacity-50">
                  <div className="h-4 w-1/2 bg-slate-300 rounded mx-auto mb-2"></div>
                  <div className="h-2 w-full bg-slate-200 rounded"></div>
                  <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                  <div className="h-2 w-full bg-slate-200 rounded mt-2"></div>
                  <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-blue-500 text-white text-xs font-bold text-center py-1.5">
                  Tech Standard
                </div>
              </div>
              <div className="w-1/3 aspect-[1/1.2] rounded-xl border-2 border-slate-100 hover:border-slate-300 relative overflow-hidden bg-white cursor-pointer transition-colors">
                 <div className="p-4 flex flex-col gap-2 h-full opacity-30">
                  <div className="flex gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-slate-300"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-2 w-full bg-slate-300 rounded"></div>
                      <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded"></div>
                  <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-slate-100 text-slate-600 text-xs font-bold text-center py-1.5 border-t border-slate-200">
                  Creative
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: AI & Actions */}
        <div className="col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-blue-200" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-blue-100">AI Resume Writer</h4>
            </div>
            <p className="text-sm leading-relaxed font-medium mb-4">
              I notice you are missing an Experience section. Want me to help you draft some bullet points based on your computer science background and class projects?
            </p>
            <button className="w-full bg-white text-blue-700 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
              Generate Projects Section
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm border-dashed text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <UploadCloud size={20} className="text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Already have a resume?</h4>
            <p className="text-xs text-slate-500 mb-4">Upload your PDF and we'll parse it automatically.</p>
            <button className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
              Upload PDF
            </button>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
        <button className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
          Back
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-200 transition-all">
          Generate Resume <ArrowRight size={16}/>
        </button>
      </div>
    </div>
  );
}
