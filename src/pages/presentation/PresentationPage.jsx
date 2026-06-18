import { useState } from 'react';
import {
  ArrowLeft, Download, Rocket, ShieldCheck, Zap, TrendingUp,
  Users, Target, Code, BrainCircuit, Shield, UserPlus,
  Lightbulb, BarChart3, Map, MessageSquare, Award, Globe,
  ChevronRight, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroMetrics from './HeroMetrics';
import PresentationCharts from './PresentationCharts';

const FEATURES = [
  { title: 'Analyze Resume', icon: BrainCircuit, color: 'text-indigo-500', bg: 'bg-indigo-50', desc: 'Instant feedback on resume quality and structure' },
  { title: 'ATS Score Engine', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: 'Beat applicant tracking systems with smart optimization' },
  { title: 'Opportunity Matching', icon: Target, color: 'text-amber-500', bg: 'bg-amber-50', desc: 'AI-ranked opportunities personalized to your profile' },
  { title: 'Skill Gap Analysis', icon: Zap, color: 'text-pink-500', bg: 'bg-pink-50', desc: 'Know exactly what to learn next for your target role' },
  { title: 'Team Finder', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Discover and form teams for hackathons and projects' },
  { title: 'Networking Hub', icon: UserPlus, color: 'text-teal-500', bg: 'bg-teal-50', desc: 'Connect with peers across colleges and disciplines' },
  { title: 'Career Roadmap', icon: Map, color: 'text-purple-500', bg: 'bg-purple-50', desc: 'Step-by-step path from learner to job-ready' },
  { title: 'Achievement System', icon: Award, color: 'text-orange-500', bg: 'bg-orange-50', desc: 'Gamified milestones to keep you motivated' },
  { title: 'Analytics Dashboard', icon: BarChart3, color: 'text-cyan-500', bg: 'bg-cyan-50', desc: 'Real-time insights on applications and growth' },
];

const JOURNEY_STEPS = [
  { step: '01', label: 'Create Profile', sub: 'Sign up & add details', icon: UserPlus, color: 'bg-indigo-500' },
  { step: '02', label: 'Build Resume', sub: 'Craft with live preview', icon: BrainCircuit, color: 'bg-purple-500' },
  { step: '03', label: 'Improve ATS Score', sub: 'Hit 80+ to stand out', icon: ShieldCheck, color: 'bg-emerald-500' },
  { step: '04', label: 'Get Recommendations', sub: '90%+ match accuracy', icon: Lightbulb, color: 'bg-amber-500' },
  { step: '05', label: 'Join Teams', sub: 'Hackathons & projects', icon: Users, color: 'bg-blue-500' },
  { step: '06', label: 'Grow Network', sub: 'Build peer connections', icon: Globe, color: 'bg-teal-500' },
  { step: '07', label: 'Track Progress', sub: 'Goals & analytics', icon: Target, color: 'bg-pink-500' },
  { step: '08', label: 'Land Opportunities', sub: 'The career you deserve', icon: Rocket, color: 'bg-rose-500' },
];

const WHY_ITEMS = [
  'End-to-end career ecosystem — not fragmented tools.',
  'AI-driven, personalized opportunity discovery.',
  'Built-in Resume Intelligence to bypass ATS filters.',
  'Organic team collaboration for hackathons and projects.',
  'Measurable, gamified career growth tracking.',
  'Seamless networking platform built for students.',
];

export default function PresentationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24">

      {/* ── Sticky Header ── */}
      <div className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              {/* Logo mark */}
              <div className="w-8 h-8 rounded-lg bg-[#6C4CF1] flex items-center justify-center">
                <Rocket size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-[15px] font-black tracking-tight leading-none">OpportunityOS</h1>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Presentation Overview</p>
              </div>
            </div>
          </div>

          {/* Nav tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800 rounded-xl p-1">
            {['overview', 'charts', 'features'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-bold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-[#6C4CF1] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="hidden sm:flex px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[13px] font-bold items-center gap-2 transition-colors"
              onClick={() => alert('Downloading Executive Summary PDF...')}
            >
              <Download size={14} /> Summary
            </button>
            <button
              className="px-4 py-2 bg-[#6C4CF1] hover:bg-indigo-500 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-colors"
              onClick={() => alert('Downloading Analytics CSV...')}
            >
              <TrendingUp size={14} /> Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pt-10">

        {/* ── HERO BANNER ── */}
        <div className="relative bg-gradient-to-br from-slate-900 via-[#1a0f4f] to-slate-900 rounded-3xl p-10 md:p-16 text-white mb-12 overflow-hidden shadow-2xl">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#6C4CF1] rounded-full opacity-20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#6C4CF1]/30 text-[#a78bfa] border border-[#6C4CF1]/30 rounded-full text-[12px] font-bold uppercase tracking-wider">
                  AI-Powered Platform
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-full text-[12px] font-bold uppercase tracking-wider">
                  Live Demo
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                Career Development<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-[#60a5fa]">
                  Reimagined
                </span>
              </h2>
              <p className="text-slate-400 text-[16px] font-medium max-w-xl leading-relaxed">
                One intelligent workspace for opportunities, resume building, ATS optimization,
                team collaboration, and career growth tracking — built for students.
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              {[
                { label: 'Platform Modules', value: '12+', icon: Code },
                { label: 'User Satisfaction', value: '4.9★', icon: Star },
                { label: 'Recommendation Accuracy', value: '91%', icon: Target },
                { label: 'ATS Pass Rate', value: '88%', icon: ShieldCheck },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                    <Icon size={16} className="text-slate-400 mx-auto mb-1" />
                    <div className="text-[22px] font-black text-white">{stat.value}</div>
                    <div className="text-[11px] font-medium text-slate-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 1: Platform Impact Metrics ── */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-[#6C4CF1] rounded-full" />
            <h2 className="text-[22px] font-black text-slate-900">Platform Impact</h2>
            <span className="text-[13px] font-medium text-slate-400 ml-1">— live metrics</span>
          </div>
          <HeroMetrics />
        </div>

        {/* ── SECTION 2: Charts ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-emerald-500 rounded-full" />
            <h2 className="text-[22px] font-black text-slate-900">Growth Analytics</h2>
          </div>
          <PresentationCharts />
        </div>

        {/* ── SECTION 3: Career Growth Highlight ── */}
        <div className="bg-gradient-to-br from-indigo-900 to-[#6C4CF1] rounded-3xl p-10 md:p-12 text-white mb-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 bg-emerald-400 rounded-full" />
              <h2 className="text-[22px] font-black">Career Growth Outcomes</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '+14 pts', label: 'Avg ATS Improvement', color: 'text-emerald-300' },
                { value: '+18%', label: 'Career Readiness Growth', color: 'text-emerald-300' },
                { value: '91%', label: 'Recommendation Accuracy', color: 'text-amber-300' },
                { value: '76%', label: 'Goal Completion Rate', color: 'text-blue-300' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                  <div className={`text-[36px] font-black leading-none mb-2 ${stat.color}`}>{stat.value}</div>
                  <div className="text-[13px] font-semibold text-indigo-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: User Journey ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-amber-500 rounded-full" />
            <h2 className="text-[22px] font-black text-slate-900">The User Journey</h2>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 overflow-x-auto">
            <div className="flex items-start gap-0 min-w-max">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center text-center w-[120px]">
                    <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center shadow-md mb-3`}>
                      <step.icon size={20} className="text-white" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{step.step}</span>
                    <span className="text-[13px] font-bold text-slate-900 leading-tight">{step.label}</span>
                    <span className="text-[11px] font-medium text-slate-400 mt-0.5">{step.sub}</span>
                  </div>
                  {i < JOURNEY_STEPS.length - 1 && (
                    <ChevronRight size={20} className="text-slate-300 mx-1 mb-6 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 5: Features Grid ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 bg-pink-500 rounded-full" />
            <h2 className="text-[22px] font-black text-slate-900">Core Platform Modules</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 flex items-start gap-4 group">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${feat.bg}`}>
                    <Icon size={20} className={feat.color} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900 mb-0.5">{feat.title}</h3>
                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 6: Live Highlights + Why OpportunityOS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          {/* Live highlights panel */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#6C4CF1] rounded-full opacity-10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <h2 className="text-[18px] font-black text-white">Live Platform Highlights</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Top Opportunity', value: 'Google SWE Internship', color: 'text-indigo-300' },
                  { label: 'Most Active Team', value: 'Cloud Computing Club', color: 'text-emerald-400' },
                  { label: 'Top Skill Demanded', value: 'React.js', color: 'text-blue-400' },
                  { label: 'Highest ATS Score', value: '98 / 100', color: 'text-amber-400' },
                  { label: 'Top Career Level', value: 'Level 9 — Expert', color: 'text-purple-400' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
                    <span className="text-[13px] font-medium text-slate-400">{item.label}</span>
                    <span className={`text-[14px] font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why OpportunityOS */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#6C4CF1] flex items-center justify-center">
                <Rocket size={16} className="text-white" />
              </div>
              <h2 className="text-[18px] font-black text-slate-900">Why OpportunityOS?</h2>
            </div>
            <ul className="space-y-4">
              {WHY_ITEMS.map((text, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                    <ShieldCheck size={13} strokeWidth={3} />
                  </div>
                  <span className="text-[14px] text-slate-700 font-medium leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-400">Built for students. Backed by data.</span>
              <div className="flex gap-1">
                {[0,1,2,3,4].map(i => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER CTA ── */}
        <div className="text-center py-12 border-t border-slate-200">
          <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-2">Opportunity OS</p>
          <h3 className="text-[28px] font-black text-slate-900 mb-4">
            One platform. Every opportunity.
          </h3>
          <p className="text-slate-500 font-medium mb-6 max-w-md mx-auto">
            Your entire career journey — from resume to offer letter — in one intelligent workspace.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              className="px-6 py-3 bg-[#6C4CF1] text-white font-bold rounded-xl text-[14px] hover:bg-indigo-700 transition-colors shadow-md"
              onClick={() => navigate('/demo')}
            >
              Start Demo
            </button>
            <button
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-[14px] hover:bg-slate-50 transition-colors shadow-sm"
              onClick={() => navigate('/')}
            >
              Back to Landing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
