import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Building, MapPin, Clock, Calendar, Bookmark, Share2,
  ArrowUpRight, ChevronLeft, CheckCircle, GraduationCap,
  BookOpen, Star, FileText, Target, Award, Users, FileBadge,
  Sparkles, Globe, ExternalLink, Briefcase, TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApplications } from '../../contexts/ApplicationContext';
import { useSavedOpportunities } from '../../contexts/SavedOpportunitiesContext';
import { useLiveOpportunities } from '../../hooks/useLiveOpportunities';
import SkillGapAnalysis from '../../components/opportunities/SkillGapAnalysis';


export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, addApplication } = useApplications();
  const { toggleSavedOpportunity, isSaved } = useSavedOpportunities();

  const [opportunity, setOpportunity] = useState(null);

  const { opportunities: liveOpportunities, isLoading } = useLiveOpportunities();

  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);

    if (isLoading) return; // Wait for data to load

    const opp = liveOpportunities.find(o => String(o.id) === String(id));
    if (opp) {
      setOpportunity(opp);
    } else {
      // Handle not found
      navigate('/opportunities');
      toast.error('Opportunity not found');
    }
  }, [id, navigate, location.pathname, liveOpportunities, isLoading]);

  const similarOpportunities = useMemo(() => {
    if (!opportunity) return [];

    return liveOpportunities
      .filter(o => String(o.id) !== String(opportunity.id))
      .map(o => {
        let score = 0;
        // Same Category Priority
        if (o.type === opportunity.type) score += 3;

        // Similar Skills
        if (o.requiredSkills && opportunity.requiredSkills) {
          const matchingSkills = o.requiredSkills.filter(skill => opportunity.requiredSkills.includes(skill));
          score += matchingSkills.length;
        }

        // Same Organization
        if (o.company === opportunity.company) score += 2;

        return { ...o, similarityScore: score };
      })
      .filter(o => o.similarityScore > 0)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 4);
  }, [opportunity, liveOpportunities]);

  const relatedOpportunities = useMemo(() => {
    if (!opportunity) return [];
    return liveOpportunities
      .filter(o => o.company === opportunity.company && String(o.id) !== String(opportunity.id))
      .slice(0, 3);
  }, [opportunity, liveOpportunities]);

  if (!opportunity) return null;

  const isAlreadyApplied = applications.some(
    (app) => app.title === opportunity.title && app.company === opportunity.company
  );

  const handleApply = () => {
    if (isAlreadyApplied) {
      toast.error('You have already applied to this opportunity.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineObj = new Date(opportunity.deadline);
    deadlineObj.setHours(0, 0, 0, 0);

    if (!isNaN(deadlineObj.getTime()) && deadlineObj < today) {
      toast.error('Cannot apply: The deadline has already passed.');
      return;
    }

    const application = {
      company: opportunity.company,
      title: opportunity.title,
      role: opportunity.title,
      type: opportunity.type,
      status: 'Applied',
      appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      deadline: opportunity.deadline,
      logo: opportunity.logo,
      location: opportunity.location,
      duration: opportunity.duration,
    };

    addApplication(application);
    toast.success('Redirecting to application page...');
    if (opportunity.applyLink) {
      window.open(opportunity.applyLink, '_blank');
    }
    navigate('/applications');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const postedDate = opportunity.postedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="bg-[#F8FAFC] font-sans pb-20 p-4 lg:p-6">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-[14px] mb-6 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to opportunities
        </button>

        {/* Page Header */}
        <div className="card-standard p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7C3AED]/5 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-sm">
                <img
                  src={opportunity.logo}
                  alt={opportunity.company}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = "/placeholder-company-logo.png"; }}
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="page-header leading-tight">
                    {opportunity.title}
                  </h1>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-indigo-50 text-[#6C4CF1] border border-indigo-100">
                    {opportunity.type}
                  </span>
                  {isAlreadyApplied && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                      <CheckCircle size={12} /> Applied
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[14px] font-medium text-slate-600 mb-4">
                  <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <Building size={16} className="text-[#6C4CF1]" /> {opportunity.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-slate-400" /> {opportunity.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} className="text-slate-400" /> {opportunity.duration}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[13px]">
                  <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md">
                    <Calendar size={14} /> Posted: <span className="font-bold">{postedDate}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
                    <Target size={14} /> Deadline: <span className="font-bold">{opportunity.deadline}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 md:shrink-0 w-full md:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleShare}
                  className="btn-secondary flex-1 sm:flex-none h-11 px-4 text-[14px] flex items-center justify-center gap-2"
                >
                  <Share2 size={16} /> Share
                </button>
                <button
                  onClick={() => toggleSavedOpportunity(opportunity)}
                  className={`flex-1 sm:flex-none h-11 px-4 border rounded-xl text-[14px] font-bold transition-all shadow-sm flex items-center justify-center gap-2
                    ${isSaved(opportunity.id)
                      ? 'bg-[#6C4CF1] border-[#6C4CF1] text-white'
                      : 'border-slate-200 text-slate-700 hover:text-[#6C4CF1] hover:bg-indigo-50 hover:border-indigo-100'
                    }`}
                >
                  <Bookmark size={16} fill={isSaved(opportunity.id) ? 'currentColor' : 'none'} />
                  {isSaved(opportunity.id) ? 'Saved' : 'Save'}
                </button>
              </div>
              <button
                onClick={handleApply}
                disabled={isAlreadyApplied}
                className={`w-full sm:w-auto h-11 px-8 text-[15px] flex items-center justify-center gap-2 ${isAlreadyApplied
                    ? 'bg-emerald-500 text-white rounded-xl font-bold cursor-not-allowed opacity-90'
                    : 'btn-primary'
                  }`}
              >
                {isAlreadyApplied ? (
                  <>
                    <CheckCircle size={18} /> Already Applied
                  </>
                ) : (
                  <>
                    Apply Now <ArrowUpRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Main Content (Left) + Sidebar (Right) */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-8">

            {/* Match Details Component */}
            <SkillGapAnalysis opportunity={opportunity} />

            {/* Section 1: Overview */}
            <div className="card-standard p-6 md:p-8">
              <h2 className="section-header mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-[#6C4CF1] flex items-center justify-center">
                  <FileText size={16} />
                </div>
                Overview
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-2">Description</h3>
                  <p className="text-[14.5px] text-slate-600 leading-relaxed">
                    {opportunity.fullDescription}
                  </p>
                </div>

                {opportunity.responsibilities && (
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 mb-3">Responsibilities</h3>
                    <ul className="space-y-2.5">
                      {opportunity.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14.5px] text-slate-600 leading-relaxed">
                          <CheckCircle className="text-[#6C4CF1] shrink-0 mt-0.5" size={16} />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {opportunity.whatYouWillLearn && (
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 mb-3">What You Will Learn</h3>
                    <ul className="space-y-2.5">
                      {opportunity.whatYouWillLearn.map((learn, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14.5px] text-slate-600 leading-relaxed">
                          <Star className="text-amber-500 shrink-0 mt-0.5" size={16} />
                          {learn}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Eligibility */}
            <div className="card-standard p-6 md:p-8">
              <h2 className="section-header mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <GraduationCap size={16} />
                </div>
                Eligibility
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-1">Education</p>
                  <p className="text-[14px] font-bold text-slate-900">{opportunity.educationRequirements || 'Any Degree'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-1">Year of Study</p>
                  <p className="text-[14px] font-bold text-slate-900">{opportunity.yearOfStudy || 'Any Year'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-1">CGPA Requirement</p>
                  <p className="text-[14px] font-bold text-slate-900">{opportunity.cgpaRequirement || 'No Bar'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-1">Branch</p>
                  <p className="text-[14px] font-bold text-slate-900">{opportunity.branchRestrictions || 'All Branches'}</p>
                </div>
              </div>
            </div>

            {/* Section 3: Required Skills */}
            <div className="card-standard p-6 md:p-8">
              <h2 className="section-header mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BookOpen size={16} />
                </div>
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {opportunity.requiredSkills && opportunity.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-[13px] rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Section 4: Benefits */}
            <div className="card-standard p-6 md:p-8">
              <h2 className="section-header mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <Award size={16} />
                </div>
                Benefits & Perks
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {opportunity.stipend && (
                  <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <span className="font-bold text-[15px]">₹</span>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900">Stipend / Salary</h4>
                      <p className="text-[13px] font-medium text-slate-500">{opportunity.stipend}</p>
                    </div>
                  </div>
                )}

                {opportunity.certificate && (
                  <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileBadge size={16} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900">Certificate</h4>
                      <p className="text-[13px] font-medium text-slate-500">Upon successful completion</p>
                    </div>
                  </div>
                )}

                {opportunity.ppoOpportunity && (
                  <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-[#6C4CF1] flex items-center justify-center shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900">PPO Opportunity</h4>
                      <p className="text-[13px] font-medium text-slate-500">Pre-placement offer available</p>
                    </div>
                  </div>
                )}

                {opportunity.mentorship && (
                  <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Users size={16} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-900">Mentorship</h4>
                      <p className="text-[13px] font-medium text-slate-500">1-on-1 industry guidance</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">

            {/* Quick Info Card */}
            <div className="card-standard p-6">
              <h3 className="card-title mb-5 border-b border-slate-100 pb-3">Quick Info</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium text-slate-500">Organization</span>
                  <span className="text-[13px] font-bold text-slate-900">{opportunity.company}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium text-slate-500">Location</span>
                  <span className="text-[13px] font-bold text-slate-900">{opportunity.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium text-slate-500">Duration</span>
                  <span className="text-[13px] font-bold text-slate-900">{opportunity.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium text-slate-500">Deadline</span>
                  <span className="text-[13px] font-bold text-red-600">{opportunity.deadline}</span>
                </div>
                <div className="w-full h-[1px] bg-slate-100 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-medium text-slate-500">Applicants Count</span>
                  <span className="text-[13px] font-bold text-[#6C4CF1] bg-indigo-50 px-2 py-0.5 rounded-md">
                    {opportunity.applicantsCount || 0} applied
                  </span>
                </div>
              </div>
            </div>

            {/* Match Score Card */}
            <div className="bg-gradient-to-br from-[#6C4CF1] to-indigo-800 rounded-xl shadow-md p-4 text-white relative overflow-hidden flex items-center gap-4">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="w-12 h-12 shrink-0 rounded-full border-[2.5px] border-white/20 flex items-center justify-center relative z-10">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#fff" strokeWidth="2.5" strokeDasharray={`${opportunity.matchScore || 0} ${100 - (opportunity.matchScore || 0)}`} strokeDashoffset="0" />
                </svg>
                <span className="text-[13px] font-bold">{opportunity.matchScore || 0}%</span>
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <h3 className="text-[14px] font-bold mb-0.5 truncate">Great Match!</h3>
                <p className="text-[12px] text-white/80 font-medium leading-tight line-clamp-2">Your profile matches this opportunity perfectly.</p>
              </div>
            </div>

            {/* About Organization Card */}
            <div className="card-standard p-6">
              <h3 className="card-title mb-5 border-b border-slate-100 pb-3">About Organization</h3>

              {!opportunity.organization ? (
                <div className="text-center py-6">
                  <p className="text-[14px] text-slate-500 font-medium">Organization information not available.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 p-2.5 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={opportunity.logo}
                        alt={opportunity.company}
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = "/placeholder-company-logo.png"; }}
                      />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-extrabold text-slate-900">{opportunity.company}</h4>
                      <p className="text-[13px] font-medium text-[#6C4CF1]">{opportunity.organization.industry}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    {opportunity.organization.description}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5"><Users size={12} /> Size</p>
                      <p className="text-[13px] font-bold text-slate-900">{opportunity.organization.size}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5"><MapPin size={12} /> HQ</p>
                      <p className="text-[13px] font-bold text-slate-900">{opportunity.organization.headquarters}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5"><Calendar size={12} /> Founded</p>
                      <p className="text-[13px] font-bold text-slate-900">{opportunity.organization.founded}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5"><Briefcase size={12} /> Opportunities</span>
                      <span className="text-[13px] font-bold text-slate-900">{opportunity.organization.stats.posted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5"><Users size={12} /> Active Applicants</span>
                      <span className="text-[13px] font-bold text-slate-900">{opportunity.organization.stats.active}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5"><TrendingUp size={12} /> Hiring Rate</span>
                      <span className="text-[13px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{opportunity.organization.stats.hiringRate}</span>
                    </div>
                  </div>

                  {/* Visit Website */}
                  <a
                    href={opportunity.organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full h-10 text-[13px] flex items-center justify-center gap-2"
                  >
                    <Globe size={16} /> Visit Website <ExternalLink size={14} className="ml-1 opacity-50" />
                  </a>

                  {/* Related Opportunities */}
                  {relatedOpportunities.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-[13px] font-bold text-slate-900 mb-3">Other opportunities</p>
                      <div className="space-y-2">
                        {relatedOpportunities.map(rel => (
                          <button
                            key={rel.id}
                            onClick={() => navigate(`/opportunity/${rel.id}`)}
                            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group flex items-center justify-between"
                          >
                            <div className="min-w-0 pr-3">
                              <p className="text-[13px] font-bold text-slate-900 truncate group-hover:text-[#6C4CF1] transition-colors">{rel.title}</p>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{rel.type} • {rel.location}</p>
                            </div>
                            <ChevronLeft size={16} className="rotate-180 text-slate-400 group-hover:text-[#6C4CF1] shrink-0 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Similar Opportunities Section */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="section-header">Similar Opportunities</h2>
            <p className="page-subheader mt-0">Explore related opportunities that match your interests.</p>
          </div>

          {similarOpportunities.length === 0 ? (
            <div className="card-standard p-8 text-center">
              <p className="text-[15px] font-medium text-slate-500">No similar opportunities found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="card-standard card-hover p-5 flex flex-col cursor-pointer h-full group"
                  onClick={() => navigate(`/opportunity/${opp.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={opp.logo}
                        alt={opp.company}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { e.target.src = "/placeholder-company-logo.png"; }}
                      />
                    </div>
                    <span className="px-2.5 py-1 bg-indigo-50 text-[#6C4CF1] rounded-md text-[11px] font-bold tracking-wide uppercase">
                      {opp.type}
                    </span>
                  </div>

                  <div className="mb-4 flex-1">
                    <h3 className="card-title leading-snug mb-1 line-clamp-2 group-hover:text-[#6C4CF1] transition-colors">{opp.title}</h3>
                    <p className="text-[13px] font-medium text-slate-500 flex items-center gap-1.5 line-clamp-1 mb-3">
                      <Building size={14} className="shrink-0" /> {opp.company}
                    </p>
                    <div className="space-y-1.5">
                      <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
                        <MapPin size={14} className="text-slate-400 shrink-0" /> {opp.location}
                      </p>
                      <p className="text-[12px] text-red-600 font-medium flex items-center gap-1.5">
                        <Clock size={14} className="text-red-400 shrink-0" /> {opp.deadline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-[12px] font-bold">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Star size={10} fill="currentColor" />
                      </span>
                      <span className="text-emerald-600">{opp.matchScore || 0}% Match</span>
                    </div>
                    <button
                      className="text-[13px] font-bold text-[#6C4CF1] flex items-center gap-1 hover:text-[#5b3fda] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/opportunity/${opp.id}`);
                      }}
                    >
                      View Details <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
