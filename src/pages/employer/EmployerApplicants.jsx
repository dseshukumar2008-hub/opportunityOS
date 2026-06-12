import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, FileText, Users, Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useEmployer } from '../../contexts/EmployerContext';
import { geminiService } from '../../services/geminiService';
import PaginationControls from '../../components/ui/PaginationControls';
import toast from 'react-hot-toast';

export default function EmployerApplicants() {
  const { 
    applicants, 
    employerReviews, 
    updateReviewStatus, 
    saveAIEvaluation, 
    employerOpportunities, 
    companyProfile,
    fetchEmployerApplicants,
    applicantsTotal,
    loading
  } = useEmployer();
  
  const [filterOpp, setFilterOpp] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;
  const totalPages = Math.ceil(applicantsTotal / limit) || 1;

  useEffect(() => {
    if (companyProfile) {
      fetchEmployerApplicants({
        page: currentPage,
        limit,
        opportunityId: filterOpp,
        status: filterStatus
      });
    }
  }, [companyProfile, currentPage, filterOpp, filterStatus, fetchEmployerApplicants]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterOpp = (e) => {
    setFilterOpp(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const sortedApplicants = useMemo(() => {
    // We sort the current page's applicants by AI Score DESC locally
    return [...applicants].sort((a, b) => {
      const reviewA = employerReviews.find(r => r.application_id === a.id);
      const reviewB = employerReviews.find(r => r.application_id === b.id);
      const scoreA = reviewA?.gemini_score || 0;
      const scoreB = reviewB?.gemini_score || 0;
      return scoreB - scoreA;
    });
  }, [applicants, employerReviews]);

  if (!companyProfile) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800">Complete Company Profile</h2>
        <p className="text-slate-500 mt-2">You must complete your company profile before viewing applicants.</p>
      </div>
    );
  }

  const handleEvaluate = async (app, opp) => {
    setEvaluatingId(app.id);
    try {
      const candidateData = {
        name: app.profiles.full_name,
        headline: app.profiles.headline,
        bio: app.profiles.bio,
        resume: app.resumes?.[0] || 'No resume attached'
      };
      
      const opportunityData = {
        title: opp.title,
        description: opp.description,
        skills_required: opp.skills_required,
        type: opp.type
      };

      const result = await geminiService.evaluateCandidateFit(candidateData, opportunityData);
      await saveAIEvaluation(app.id, result);
      toast.success('AI Evaluation Complete');
      setExpandedId(app.id);
    } catch (err) {
      console.error(err);
      toast.error('AI Evaluation Failed');
    } finally {
      setEvaluatingId(null);
    }
  };



  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col min-h-[80vh]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Recruiter Hub</h1>
          <p className="text-slate-500 mt-1">Review, rank, and shortlist candidates with AI assistance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={filterOpp}
              onChange={handleFilterOpp}
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              {employerOpportunities.map(opp => (
                <option key={opp.id} value={opp.id}>{opp.title}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select 
              value={filterStatus}
              onChange={handleFilterStatus}
              className="pl-4 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-[#6C4CF1] rounded-full animate-spin"></div>
          </div>
        ) : sortedApplicants.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <Users size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No applicants found</h3>
            <p className="text-slate-500 mt-1">Adjust your filters or wait for new applications.</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1 p-6 space-y-4">
            {sortedApplicants.map(app => {
              const review = employerReviews.find(r => r.application_id === app.id);
              const opp = employerOpportunities.find(o => o.id === app.opportunity_id);
              const status = review?.status || 'Pending';
              const isEvaluated = !!review?.gemini_score;
              const isExpanded = expandedId === app.id;

              return (
                <div key={app.id} className="border border-slate-200 rounded-xl overflow-hidden hover:border-[#6C4CF1]/30 hover:shadow-md transition-all group">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 overflow-hidden shrink-0">
                          {app.profiles?.avatar_url ? (
                            <img src={app.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            app.profiles?.full_name?.charAt(0) || 'U'
                          )}
                        </div>
                        {isEvaluated && (
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${
                            review.gemini_score >= 80 ? 'bg-emerald-500 text-white' : 
                            review.gemini_score >= 60 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {review.gemini_score}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{app.profiles?.full_name || 'Anonymous User'}</h3>
                        <p className="text-sm font-semibold text-[#6C4CF1]">{opp?.title || 'Unknown Role'}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-md">{app.profiles?.headline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                        status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700' :
                        status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {status}
                      </span>
                      
                      {!isEvaluated ? (
                        <button
                          onClick={() => handleEvaluate(app, opp)}
                          disabled={evaluatingId === app.id}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-bold rounded-lg transition-all shadow-sm disabled:opacity-50"
                        >
                          <Sparkles size={16} className={evaluatingId === app.id ? "animate-spin" : ""} />
                          {evaluatingId === app.id ? 'Evaluating...' : 'Evaluate Fit'}
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateReviewStatus(app.id, 'Shortlisted')}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Shortlist"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button
                            onClick={() => updateReviewStatus(app.id, 'Rejected')}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle size={20} />
                          </button>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : app.id)}
                            className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                          >
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isExpanded && isEvaluated && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white border border-emerald-100 rounded-xl p-4">
                          <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                            <CheckCircle size={16} className="text-emerald-500" /> Strengths
                          </h4>
                          <ul className="space-y-2">
                            {review.gemini_strengths?.map((s, i) => (
                              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">•</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white border border-amber-100 rounded-xl p-4">
                          <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                            <AlertCircle size={16} className="text-amber-500" /> Concerns & Missing Skills
                          </h4>
                          <ul className="space-y-2 mb-3">
                            {review.gemini_concerns?.map((c, i) => (
                              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">•</span> {c}
                              </li>
                            ))}
                          </ul>
                          {review.gemini_missing_skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-amber-50">
                              {review.gemini_missing_skills.map((m, i) => (
                                <span key={i} className="px-2 py-1 bg-red-50 text-red-600 text-[11px] font-bold rounded-md">{m}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 relative overflow-hidden">
                        <Sparkles size={100} className="absolute -top-4 -right-4 text-indigo-500/5 rotate-12" />
                        <h4 className="text-sm font-extrabold text-indigo-900 uppercase tracking-wider mb-2">AI Recommendation</h4>
                        <p className="text-sm text-indigo-900 font-medium mb-3">{review.gemini_recommendation}</p>
                        
                        <div className="bg-white/60 rounded-lg p-3 text-sm text-slate-700 font-medium border border-white">
                          <span className="font-bold text-slate-900 mr-1">Summary:</span> {review.gemini_summary}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
