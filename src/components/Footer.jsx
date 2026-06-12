import { ArrowUpRight } from 'lucide-react';

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer() {
  return (
    <footer id="about-us" className="w-full bg-[#0B0F19] pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-16">

          {/* Logo & Info */}
          <div className="col-span-1 md:col-span-2">
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
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-white transition-colors"><TwitterIcon size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><LinkedinIcon size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><InstagramIcon size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><ArrowUpRight size={18} /></a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-bold text-white text-sm mb-4">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Subscribe to get the latest updates and opportunities.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="bg-[#1A1F2B] border border-[#2D3342] text-white text-sm rounded-lg px-3 py-2 w-full focus:outline-none focus:border-indigo-500" />
              <button className="bg-[#6C4CF1] hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-[#1F2937] pt-8 flex justify-center text-xs text-slate-500">
          <p>&copy; 2025 OpportunityOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
