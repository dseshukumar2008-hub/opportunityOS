import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <div id="pricing" className="w-full bg-[#6C4CF1] rounded-2xl overflow-hidden relative shadow-lg flex flex-col md:flex-row items-center p-10 md:p-12">
      <div className="flex-1 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to unlock your opportunities?</h2>
        <p className="text-indigo-100 mb-8 max-w-md text-sm">
          Join thousands of students already winning.
        </p>
        <div className="flex gap-4">
          <Link to="/signup" className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-lg text-sm hover:bg-slate-50 transition-colors shadow-sm inline-block">
            Get Started Free
          </Link>
          <button className="bg-indigo-700/50 border border-indigo-400 text-white font-bold px-6 py-3 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
            Explore Features
          </button>
        </div>
      </div>
      
      {/* 3D Illustration Placeholder */}
      <div className="w-64 h-64 mt-8 md:mt-0 md:absolute md:-right-8 md:-bottom-8 flex-shrink-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop" 
          alt="Students" 
          className="w-full h-full object-cover rounded-full opacity-0" // Hidden actual image, using a placeholder styling below or we can just show a graphic
        />
        <div className="absolute inset-0 bg-[url('https://cdn3d.iconscout.com/3d/premium/thumb/students-5453006-4560731.png')] bg-contain bg-no-repeat bg-right-bottom mix-blend-luminosity opacity-80" />
      </div>
    </div>
  );
}
