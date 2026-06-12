import { useState, useEffect } from 'react';
import { useApplications } from '../../contexts/ApplicationContext';
import { toast } from 'react-hot-toast';
import {
  Search,
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  Cloud,
  Filter
} from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import PaginationControls from '../../components/ui/PaginationControls';

const typeStyles = {
  'Internship': 'bg-purple-50 text-[#6C4CF1]',
  'Scholarship': 'bg-pink-50 text-pink-600',
  'Hackathon': 'bg-emerald-50 text-emerald-600',
  'Fellowship': 'bg-amber-50 text-amber-600',
};

const statusStyles = {
  'Applied': 'bg-blue-50 text-blue-600',
  'Interview': 'bg-purple-50 text-[#6C4CF1]',
  'Offer': 'bg-emerald-50 text-emerald-600',
  'Rejected': 'bg-red-50 text-red-600',
  'Saved': 'bg-slate-100 text-slate-600',
};

export default function ApplicationsPage() {
  const { 
    applications, 
    updateApplication, 
    deleteApplication, 
    hasLocalMigration, 
    migrateLocalApplications,
    fetchApplications,
    totalCount,
    loading
  } = useApplications();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingApp, setEditingApp] = useState(null);

  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch data when filters or page change
  useEffect(() => {
    fetchApplications({
      page: currentPage,
      limit,
      status: statusFilter,
      search: debouncedSearch
    });
  }, [fetchApplications, currentPage, statusFilter, debouncedSearch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteApplication(id);
      toast.success('Application deleted');
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      company: formData.get('company'),
      role: formData.get('role'),
      status: formData.get('status'),
      type: formData.get('type')
    };
    
    updateApplication(editingApp.id, updates);
    toast.success('Application updated');
    setEditingApp(null);
  };

  const handleMigration = async () => {
    toast.promise(migrateLocalApplications(), {
      loading: 'Migrating to cloud...',
      success: 'Migration successful!',
      error: 'Migration failed. Please try again.'
    });
  };

  const getStatusBadge = (status) => (
    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase tracking-wider ${statusStyles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col h-full p-4 lg:p-6">
      {/* Migration Banner */}
      {hasLocalMigration && (
        <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
              <Cloud size={20} />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-slate-900">Local Applications Found</h3>
              <p className="text-[13px] text-slate-600 font-medium">We found applications saved on your device. Migrate them to the cloud to access them anywhere.</p>
            </div>
          </div>
          <button 
            onClick={handleMigration}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold transition-colors flex items-center gap-2"
          >
            <Cloud size={16} />
            Migrate to Cloud
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header mb-1">Applications</h1>
          <p className="page-subheader mt-0">
            Track and manage all your internship, job and scholarship applications.
          </p>
        </div>
        <button className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 text-[14px] shrink-0">
          <Plus size={18} strokeWidth={2.5} />
          Add Application
        </button>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1 */}
        <div className="card-standard p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-indigo-50 text-[#6C4CF1] flex items-center justify-center shrink-0">
            <Briefcase size={22} strokeWidth={2} />
          </div>
          <div>
            <div className="text-[22px] font-extrabold text-slate-900 leading-none mb-1">
              {totalCount}
            </div>
            <div className="text-[13px] font-bold text-slate-700 leading-tight">Total Applications</div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6C4CF1]"></div>
              <span className="text-[11px] font-medium text-slate-500 leading-none">All time</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card-standard p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-indigo-50 text-[#6C4CF1] flex items-center justify-center shrink-0">
            <Calendar size={22} strokeWidth={2} />
          </div>
          <div>
            <div className="text-[22px] font-extrabold text-slate-900 leading-none mb-1">
              {/* Note: since applications is paginated, this stat won't be globally accurate. It will only show interviews on current page. 
                  Ideally, this should be fetched from server-side aggregated stats. */}
              {(applications || []).filter(a => a.status === 'Interview').length}
            </div>
            <div className="text-[13px] font-bold text-slate-700 leading-tight">Interviews</div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6C4CF1]"></div>
              <span className="text-[11px] font-medium text-slate-500 leading-none">In Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search applications..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-bold text-slate-700 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
            >
              <Filter size={16} className="text-slate-400" />
              {statusFilter}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute top-full mt-2 w-48 right-0 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1.5 z-20">
                {['All Status', 'Applied', 'Interview', 'Offer', 'Rejected', 'Saved'].map(status => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setCurrentPage(1); setIsStatusDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm font-bold rounded-lg transition-colors ${statusFilter === status ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white border border-slate-200 rounded-[20px] shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-slate-500">Loading applications...</p>
          </div>
        ) : (applications || []).length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState
              icon={Briefcase}
              title="No applications found"
              description={searchQuery || statusFilter !== 'All Status' 
                ? "We couldn't find any applications matching your filters."
                : "You haven't added any applications yet. Start tracking your opportunities."}
              actionText={searchQuery || statusFilter !== 'All Status' ? "Clear Filters" : "Find Opportunities"}
              onActionClick={searchQuery || statusFilter !== 'All Status' ? () => { setSearchQuery(''); setStatusFilter('All Status'); setCurrentPage(1); } : undefined}
              actionLink={!(searchQuery || statusFilter !== 'All Status') ? '/opportunities' : undefined}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Company & Role</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Date Applied</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(applications || []).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[14px] bg-white border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                          {app.logo ? (
                            <img src={app.logo} alt={app.company} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-slate-400 text-sm">{app.company.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[15px] text-slate-900 leading-snug">{app.role}</div>
                          <div className="text-[13px] text-slate-500 font-medium">{app.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 align-middle text-[13px] font-semibold text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className={`px-2 py-1 text-[11px] font-bold rounded text-slate-600 bg-slate-100 tracking-wide uppercase`}>
                        {app.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingApp(app)}
                          className="p-2 text-slate-400 hover:text-[#6C4CF1] hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(app.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination component injected at the bottom of the table container */}
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
      </div>

      {editingApp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Edit Application</h3>
              <button 
                onClick={() => setEditingApp(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company</label>
                <input 
                  type="text" 
                  name="company" 
                  defaultValue={editingApp.company}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Role</label>
                <input 
                  type="text" 
                  name="role" 
                  defaultValue={editingApp.role}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Status</label>
                  <select 
                    name="status"
                    defaultValue={editingApp.status}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Saved">Saved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Type</label>
                  <select 
                    name="type"
                    defaultValue={editingApp.type}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingApp(null)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
