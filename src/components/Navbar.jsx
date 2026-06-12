import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav role="navigation" aria-label="Main Navigation" className={`fixed top-0 w-full z-50 transition-all duration-300 font-sans ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full opacity-50"></div>
            <div className="absolute inset-1 border-4 border-indigo-600 rounded-full opacity-80"></div>
            <div className="absolute inset-2 bg-[#6C4CF1] rounded-full"></div>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">OpportunityOS</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('features')} className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">Features</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">How It Works</button>
          <button onClick={() => scrollToSection('resources')} className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">Resources</button>
          <button onClick={() => scrollToSection('pricing')} className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">Pricing</button>
          <button onClick={() => scrollToSection('about-us')} className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors">About Us</button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-[14px] font-bold text-slate-700 hover:text-indigo-600 transition-colors">Log In</Link>
          <Link to="/signup" className="bg-[#6C4CF1] hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-[14px] font-bold transition-colors shadow-[0_2px_10px_rgba(79,70,229,0.2)] hover:shadow-[0_4px_15px_rgba(79,70,229,0.3)]">
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
