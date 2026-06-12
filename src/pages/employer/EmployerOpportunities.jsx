import { useState, useEffect } from 'react';
import { Briefcase, Plus, MapPin, DollarSign, Clock, MoreVertical, X, Check } from 'lucide-react';
import { useEmployer } from '../../contexts/EmployerContext';
import PaginationControls from '../../components/ui/PaginationControls';

export default function EmployerOpportunities() {
  const { 
    employerOpportunities, 
    createOpportunity, 
    updateOpportunity, 
    companyProfile,
    fetchEmployerOpportunities,
    opportunitiesTotal,
    loading 
  } = useEmployer();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const totalPages = Math.ceil(opportunitiesTotal / limit) || 1;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills_required: '',
    location: '',
    type: 'Full-time',
    salary: '',
    status: 'Active'
  });

  useEffect(() => {
    if (companyProfile) {
      fetchEmployerOpportunities({ page: currentPage, limit });
    }
  }, [currentPage, fetchEmployerOpportunities, companyProfile]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skills_required: formData.skills_required.split(',').map(s => s.trim()).filter(Boolean)
    };
    
    await createOpportunity(payload);
    setIsModalOpen(false);
    setFormData({
      title: '', description: '', skills_required: '', location: '', type: 'Full-time', salary: '', status: 'Active'
    });
    // Refresh to show newly created item on page 1
    setCurrentPage(1);
    fetchEmployerOpportunities({ page: 1, limit });
  };

  const toggleStatus = async (opp) => {
    const newStatus = opp.status === 'Active' ? 'Closed' : 'Active';
    await updateOpportunity(opp.id, { status: newStatus });
    fetchEmployerOpportunities({ page: currentPage, limit });
  };

  if (!companyProfile) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800">Complete Company Profile</h2>
        <p className="text-slate-500 mt-2">You must complete your company profile before posting opportunities.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col h-full min-h-[80vh]">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Opportunities</h1>
          <p className="text-slate-500 mt-1">Manage your open roles and job postings.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 py-2.5 px-4 bg-[#6C4CF1] hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
        >
          <Plus size={18} />
          Post Opportunity
        </button>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-[#6C4CF1] rounded-full animate-spin"></div>
          </div>
        ) : employerOpportunities.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12 text-center">
            <div>
              <Briefcase size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-900">No opportunities posted</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">Get started by creating a new posting.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-sm font-semibold text-[#6C4CF1] bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Create Posting
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {employerOpportunities.map((opp) => (
              <div key={opp.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-indigo-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[16px] font-bold text-slate-900">{opp.title}</h3>
                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${opp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                      {opp.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[13px] font-medium text-slate-500 mb-3">
                    <div className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{opp.location || 'Remote'}</div>
                    <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" />{opp.type}</div>
                    {opp.salary && <div className="flex items-center gap-1.5"><DollarSign size={14} className="text-slate-400" />{opp.salary}</div>}
                  </div>
                  {opp.skills_required && opp.skills_required.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {opp.skills_required.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => toggleStatus(opp)}
                    className="px-4 py-2 text-[13px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    {opp.status === 'Active' ? 'Close Posting' : 'Reopen'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Post New Opportunity</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="opportunity-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">Job Title</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Frontend Developer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Remote, NY" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-1">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">Salary Range (Optional)</label>
                  <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. $80k - $100k" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">Skills Required (Comma separated)</label>
                  <input type="text" name="skills_required" value={formData.skills_required} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. React, Node.js, TypeScript" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">Description</label>
                  <textarea name="description" rows={5} required value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Job details..." />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button type="submit" form="opportunity-form" className="px-4 py-2 text-sm font-bold text-white bg-[#6C4CF1] rounded-lg hover:bg-indigo-700">Post Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
