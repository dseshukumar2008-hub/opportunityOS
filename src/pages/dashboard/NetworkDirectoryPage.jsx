import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnections } from '../../contexts/ConnectionContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { 
  Search, Users, GraduationCap, 
  MessageSquare, UserPlus, Clock, Check, ChevronDown,
  Building, Code, X, Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import RecommendedConnectionsWidget from '../../components/network/RecommendedConnectionsWidget';
import EmptyState from '../../components/ui/EmptyState';
import { useUserDirectory } from '../../hooks/useUserDirectory';

function Avatar({ seed, size = 'md', className = '' }) {
  const sizes = { sm: 'w-10 h-10', md: 'w-16 h-16', lg: 'w-24 h-24' };
  return (
    <img
      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e2e8f0`}
      alt={seed}
      className={`${sizes[size]} rounded-3xl object-cover bg-slate-100 border-2 border-white shadow-sm shrink-0 ${className}`}
    />
  );
}

export default function NetworkDirectoryPage() {
  const navigate = useNavigate();
  const { 
    currentUserId, 
    getRelationship, 
    getIncomingRequestId,
    getConnectionCount, 
    sendConnectionRequest,
    acceptConnectionRequest
  } = useConnections();
  const { users, loading: usersLoading, error: usersError } = useUserDirectory();
  const { addNotification } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
  const [visibleCount, setVisibleCount] = useState(12);

  // Exclude current user from directory
  const directoryUsers = useMemo(() => {
    return users.filter(u => u.id !== currentUserId && u.discoverable !== false);
  }, [users, currentUserId]);

  // Derived filter options based on available users
  const colleges = useMemo(() => [...new Set(directoryUsers.map(u => u.college))].filter(Boolean), [directoryUsers]);
  const branches = useMemo(() => [...new Set(directoryUsers.map(u => u.branch))].filter(Boolean), [directoryUsers]);
  const allSkills = useMemo(() => {
    const skills = new Set();
    directoryUsers.forEach(u => u.skills?.forEach(s => skills.add(s)));
    return Array.from(skills).sort();
  }, [directoryUsers]);
  const gradYears = useMemo(() => [...new Set(directoryUsers.map(u => u.gradYear))].filter(Boolean).sort(), [directoryUsers]);

  // Filtering Logic
  const filteredUsers = useMemo(() => {
    return directoryUsers.filter(user => {
      // Search
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        user.name.toLowerCase().includes(query) ||
        (user.headline || '').toLowerCase().includes(query) ||
        (user.college || '').toLowerCase().includes(query) ||
        (user.branch || '').toLowerCase().includes(query) ||
        (user.skills || []).some(s => s.toLowerCase().includes(query));

      // Dropdowns
      const matchesCollege = !selectedCollege || user.college === selectedCollege;
      const matchesBranch = !selectedBranch || user.branch === selectedBranch;
      const matchesSkill = !selectedSkill || (user.skills || []).includes(selectedSkill);
      const matchesYear = !selectedYear || user.gradYear === selectedYear;

      return matchesSearch && matchesCollege && matchesBranch && matchesSkill && matchesYear;
    });
  }, [directoryUsers, searchQuery, selectedCollege, selectedBranch, selectedSkill, selectedYear]);

  const displayedUsers = filteredUsers.slice(0, visibleCount);

  // Action Handlers
  const handleConnect = (user) => {
    sendConnectionRequest(user.id);
    addNotification({
      category: 'Connections',
      title: 'Request Sent',
      message: `Connection request sent to ${user.name}.`,
    });
    toast.success('Connection request sent');
  };

  const handleAccept = (user) => {
    const reqId = getIncomingRequestId(user.id);
    if (reqId) {
      acceptConnectionRequest(reqId);
      addNotification({
        category: 'Connections',
        title: 'Connection Accepted',
        message: `You are now connected with ${user.name}.`,
      });
      toast.success('Connection accepted');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCollege('');
    setSelectedBranch('');
    setSelectedSkill('');
    setSelectedYear('');
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-6 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Globe size={20} className="text-[#6C4CF1]" />
            </div>
            <h1 className="page-header">Network</h1>
          </div>
          <p className="page-subheader mt-0 max-w-2xl">
            Discover students, teammates, and collaborators across the platform. Expand your professional network.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/network/connections')}
            className="btn-secondary h-10 px-4 flex items-center gap-2 text-[13px]"
          >
            My Connections
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search and Filters Card */}
      <div className="card-standard p-5 mb-8 relative z-10">
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, skills, college, interests..."
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 focus:border-[#6C4CF1] focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-[14px] text-slate-700 placeholder-slate-400 outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* College Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Building size={14} className="text-slate-400" />
            </div>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 outline-none hover:border-slate-300 focus:border-[#6C4CF1] appearance-none transition-colors"
            >
              <option value="">All Colleges</option>
              {colleges.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <GraduationCap size={14} className="text-slate-400" />
            </div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 outline-none hover:border-slate-300 focus:border-[#6C4CF1] appearance-none transition-colors"
            >
              <option value="">All Branches</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Skill Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Code size={14} className="text-slate-400" />
            </div>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 outline-none hover:border-slate-300 focus:border-[#6C4CF1] appearance-none transition-colors"
            >
              <option value="">All Skills</option>
              {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Grad Year Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Clock size={14} className="text-slate-400" />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 outline-none hover:border-slate-300 focus:border-[#6C4CF1] appearance-none transition-colors"
            >
              <option value="">Any Grad Year</option>
              {gradYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {usersError && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
          Unable to load the network directory. Please try again later.
        </div>
      )}

      {/* Results Meta */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[14px] font-bold text-slate-700">
          {usersLoading ? 'Loading users...' : `${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} found`}
        </p>
        {(searchQuery || selectedCollege || selectedBranch || selectedSkill || selectedYear) && (
          <button 
            onClick={clearFilters}
            className="text-[13px] font-bold text-[#6C4CF1] hover:text-indigo-800 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Directory Grid */}
      {usersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card-standard p-5 h-[350px] animate-pulse">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 mx-auto mb-4" />
              <div className="h-4 w-32 bg-slate-100 rounded mx-auto mb-3" />
              <div className="h-3 w-44 bg-slate-100 rounded mx-auto mb-6" />
              <div className="h-16 bg-slate-100 rounded-xl mb-5" />
              <div className="flex gap-2 justify-center">
                <div className="h-7 w-20 bg-slate-100 rounded-lg" />
                <div className="h-7 w-20 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState 
          icon={Users}
          title={usersError ? 'Network unavailable' : 'No matching users found'}
          description={usersError ? 'We could not load real profiles from Firestore.' : 'Try adjusting your search criteria or removing some filters to see more people.'}
          actionText={(searchQuery || selectedCollege || selectedBranch || selectedSkill || selectedYear) ? 'Clear Filters' : undefined}
          onAction={(searchQuery || selectedCollege || selectedBranch || selectedSkill || selectedYear) ? clearFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayedUsers.map(user => {
            const rel = getRelationship(user.id);
            const connectionsCount = getConnectionCount(user.id);

            return (
              <div 
                key={user.id} 
                className="card-standard card-hover flex flex-col group overflow-hidden"
              >
                {/* Card Top */}
                <div className="p-5 flex flex-col items-center text-center relative border-b border-slate-50">
                  <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Avatar seed={user.avatarSeed} size="lg" />
                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-slate-100">
                      <div className="w-5 h-5 bg-indigo-50 text-[#6C4CF1] rounded-full flex items-center justify-center">
                        <Users size={11} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="card-title hover:text-[#6C4CF1] transition-colors mb-1 truncate w-full"
                  >
                    {user.name}
                  </button>
                  <p className="text-[13px] font-medium text-slate-500 line-clamp-2 leading-relaxed h-[40px] px-2 mb-3">
                    {user.headline}
                  </p>
                  
                  <div className="flex flex-col gap-1.5 w-full text-[12px] font-medium text-slate-500 px-2 bg-slate-50 py-2.5 rounded-xl">
                    <div className="flex items-center justify-center gap-1.5 truncate">
                      <Building size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{user.college}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 truncate">
                      <GraduationCap size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{user.branch} • Class of {user.gradYear}</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="px-5 py-4 flex-1">
                  <div className="flex flex-wrap justify-center gap-1.5 mb-2">
                    {user.skills?.slice(0, 5).map(skill => (
                      <span 
                        key={skill} 
                        className="px-2.5 py-1 bg-[#F4F2FF] text-[#6C4CF1] text-[11px] font-bold rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skills?.length > 5 && (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-lg">
                        +{user.skills.length - 5}
                      </span>
                    )}
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-[12px] font-semibold text-slate-400">
                      {connectionsCount} Connection{connectionsCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-slate-50/50 mt-auto grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-slate-50">
                  <button 
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="btn-secondary h-10 text-[13px] flex items-center justify-center"
                  >
                    View Profile
                  </button>

                  {rel === 'none' && (
                    <button 
                      onClick={() => handleConnect(user)}
                      className="btn-primary h-10 text-[13px] flex items-center justify-center gap-2"
                    >
                      <UserPlus size={15} />
                      Connect
                    </button>
                  )}
                  {rel === 'connected' && (
                    <button 
                      onClick={() => navigate('/messages')}
                      className="h-10 flex items-center justify-center gap-2 text-[13px] font-bold text-[#6C4CF1] bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                    >
                      <MessageSquare size={15} />
                      Message
                    </button>
                  )}
                  {rel === 'request_sent' && (
                    <button 
                      disabled
                      className="h-10 flex items-center justify-center gap-2 text-[13px] font-bold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed"
                    >
                      <Clock size={15} />
                      Pending
                    </button>
                  )}
                  {rel === 'request_received' && (
                    <button 
                      onClick={() => handleAccept(user)}
                      className="h-10 flex items-center justify-center gap-2 text-[13px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors shadow-sm"
                    >
                      <Check size={15} />
                      Accept
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination / Load More */}
      {filteredUsers.length > visibleCount && (
        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="btn-secondary h-11 px-8 text-[14px] flex items-center gap-2"
          >
            Load More Users
            <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>
      )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[320px] shrink-0">
          <RecommendedConnectionsWidget />
        </div>
        
      </div>
    </div>
  );
}
