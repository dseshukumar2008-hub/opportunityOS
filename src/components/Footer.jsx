
export default function Footer() {
  return (
    <footer id="about-us" className="w-full bg-[#0B0F19] pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">

          {/* Logo & Info */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex items-center justify-center w-6 h-6">
              <div className="absolute inset-0 border-2 border-indigo-500 rounded-full opacity-50"></div>
              <div className="absolute inset-0.5 border-2 border-indigo-500 rounded-full opacity-80"></div>
              <div className="absolute inset-1 bg-indigo-500 rounded-full"></div>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">OpportunityOS</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
            The operating system for students to discover, track and win opportunities.
          </p>

        </div>
      </div>
    </footer>
  );
}
