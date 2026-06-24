import { useState, useEffect } from 'react';
import { useTeam } from '../../contexts/TeamContext';
import { Search, Plus, Filter, Users, ChevronRight, Clock, Bell, Bot, Trophy, Rocket, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateTeamModal from '../../components/team/CreateTeamModal';
import TeamCard from '../../components/team/TeamCard';
import EmptyState from '../../components/ui/EmptyState';

import Skeleton from '../../components/ui/Skeleton';
import PaginationControls from '../../components/ui/PaginationControls';


export default function TeamFinderPage() {
  const { teams, getDiscoverTeams, getMyTeams, getMyPendingRequests, currentUserId, fetchTeams, teamsTotal, loading, error } = useTeam();
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeFilter, activeTab]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  if (loading) return <Skeleton.Teams />;
  if (error) return (
    <div className="bg-[#F8FAFC] font-sans pb-20 p-4 lg:p-6 flex items-center justify-center min-h-[50vh]">
      <div className="bg-white p-6 rounded-xl border border-red-100 flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 className="text-slate-900 font-bold text-lg">Failed to load teams</h3>
        <p className="text-slate-500 text-sm text-center max-w-[300px]">{error}</p>
      </div>
    </div>
  );

  const filters = ['All', 'Hackathon', 'Startup', 'Project', 'Competition', 'Open Source'];

  // getDiscoverTeams will filter out teams the user is already in from the currently fetched teams
  const discoverTeams = getDiscoverTeams();
  const myTeams = getMyTeams();
  const pendingRequests = getMyPendingRequests();

  // Client-side filtering (Firestore streams all data via onSnapshot)
  const filteredDiscover = discoverTeams.filter((t) => {
    const matchesSearch =
      !debouncedSearch ||
      t.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      t.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (t.requiredSkills || []).some((s) =>
        s.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    const matchesCategory =
      activeFilter === 'All' || t.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredDiscover.length / limit) || 1;
  const paginatedDiscover = filteredDiscover.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const getTeamIcon = (name) => {
    if (name.includes('AI')) return <Bot size={20} className="text-[#6C4CF1]" />;
    if (name.includes('Hackathon')) return <Trophy size={20} className="text-amber-500" />;
    if (name.includes('Startup')) return <Rocket size={20} className="text-emerald-500" />;
    if (name.includes('Open Source')) return <Code2 size={20} className="text-blue-600" />;
    return <Users size={20} className="text-[#6C4CF1]" />;
  };

  const getTeamIconBg = (name) => {
    if (name.includes('AI')) return 'bg-purple-50';
    if (name.includes('Hackathon')) return 'bg-amber-50';
    if (name.includes('Startup')) return 'bg-emerald-50';
    if (name.includes('Open Source')) return 'bg-blue-50';
    return 'bg-purple-50';
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hackathon': return 'bg-purple-100 text-[#6C4CF1] border-purple-200';
      case 'Startup': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Project': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Competition': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Open Source': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-[#F8FAFC] font-sans pb-20 p-4 lg:p-6">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        


        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-header">Team Finder</h1>
            <p className="page-subheader mt-1">
              Find teammates and build winning teams.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              aria-label="Notifications"
              className="btn-secondary w-10 h-10 p-0 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
            >
              <Bell size={18} />
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary h-10 px-5 text-[14px] flex items-center gap-2"
            >
              <Plus size={16} />
              Create Team
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('discover')}
            className={`pb-3 text-[14px] font-bold transition-colors relative ${
              activeTab === 'discover' ? 'text-[#6C4CF1]' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Discover Teams
            {activeTab === 'discover' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C4CF1] rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('my-teams')}
            className={`pb-3 text-[14px] font-bold transition-colors relative ${
              activeTab === 'my-teams' ? 'text-[#6C4CF1]' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            My Teams
            {activeTab === 'my-teams' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C4CF1] rounded-t-full"></div>
            )}
          </button>
        </div>

        {activeTab === 'discover' && (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full lg:w-[350px] shrink-0">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search teams, skills, hackathons..."
                  aria-label="Search teams"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6C4CF1] focus:ring-2 focus:ring-[#6C4CF1]/20 transition-all shadow-sm"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide">
                {filters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-colors shrink-0 ${
                      activeFilter === filter 
                        ? 'bg-[#6C4CF1] text-white shadow-sm' 
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
                <button 
                  aria-label="Filter teams"
                  className="btn-secondary w-10 h-10 p-0 flex items-center justify-center shrink-0 ml-2 focus-visible:ring-2 focus-visible:ring-[#6C4CF1] focus-visible:outline-none"
                >
                  <Filter size={16} />
                </button>
              </div>
            </div>

            {/* Main 3-Column Layout */}
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left + Center: Discovery Grid */}
              <div className="flex-1 lg:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedDiscover.map(team => (
                    <TeamCard key={team.id} team={team} mode="discover" />
                  ))}
                  {paginatedDiscover.length === 0 && (
                    <div className="col-span-2 py-16 flex flex-col items-center justify-center text-center gap-3">
                      <Users size={36} className="text-slate-300" />
                      <p className="text-[14px] font-bold text-slate-500">No teams found</p>
                      <p className="text-[13px] text-slate-400">Try adjusting your search or filters.</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <div className="mt-10">
                  <PaginationControls 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>

              {/* Right: My Teams Panel */}
              <div className="w-full lg:w-1/3 flex flex-col gap-6">
                
                {/* My Teams Card */}
                <div className="card-standard p-6">
                  <h2 className="text-[18px] font-bold text-slate-900 mb-6">My Teams</h2>

                  {/* Section 1: Teams Created */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[13px] font-bold text-slate-900">Teams Created ({myTeams.filter(t => t.leaderId === currentUserId || t.ownerId === currentUserId).length})</h3>
                      <button onClick={() => setActiveTab('my-teams')} className="text-[12px] font-bold text-[#6C4CF1] hover:underline">View all</button>
                    </div>
                    {myTeams.filter(t => t.leaderId === currentUserId || t.ownerId === currentUserId).slice(0, 1).map(team => (
                      <div key={team.id} onClick={() => navigate(`/team/${team.id}`)} className="bg-white border border-slate-100 rounded-[12px] p-3 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getTeamIconBg(team.name)}`}>
                            {getTeamIcon(team.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[14px] font-bold text-slate-900">{team.name}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getCategoryColor(team.category)}`}>{team.category}</span>
                            </div>
                            <span className="text-[11px]"><span className="font-bold text-[#6C4CF1]">{team.members?.length || 0} / {team.maxMembers}</span> <span className="font-medium text-slate-500">members</span></span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </div>
                    ))}
                  </div>

                  {/* Section 2: Teams Joined */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[13px] font-bold text-slate-900">Teams Joined ({myTeams.filter(t => t.leaderId !== currentUserId && t.ownerId !== currentUserId).length})</h3>
                      <button onClick={() => setActiveTab('my-teams')} className="text-[12px] font-bold text-[#6C4CF1] hover:underline">View all</button>
                    </div>
                    {myTeams.filter(t => t.leaderId !== currentUserId && t.ownerId !== currentUserId).slice(0, 1).map(team => (
                      <div key={team.id} onClick={() => navigate(`/team/${team.id}`)} className="bg-white border border-slate-100 rounded-[12px] p-3 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getTeamIconBg(team.name)}`}>
                            {getTeamIcon(team.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[14px] font-bold text-slate-900">{team.name}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getCategoryColor(team.category)}`}>{team.category}</span>
                            </div>
                            <span className="text-[11px]"><span className="font-bold text-[#6C4CF1]">{team.members?.length || 0} / {team.maxMembers}</span> <span className="font-medium text-slate-500">members</span></span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </div>
                    ))}
                  </div>

                  {/* Section 3: Pending Requests */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[13px] font-bold text-slate-900">Pending Requests ({pendingRequests.length})</h3>
                      <button onClick={() => setActiveTab('my-teams')} className="text-[12px] font-bold text-[#6C4CF1] hover:underline">View all</button>
                    </div>
                    {pendingRequests.slice(0, 1).map(req => {
                      const reqTeam = discoverTeams.find(t => t.id === req.teamId);
                      return (
                        <div key={req.id} className="bg-white border border-slate-100 rounded-[12px] p-3 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${reqTeam ? getTeamIconBg(reqTeam.name) : 'bg-slate-50'}`}>
                              {reqTeam ? getTeamIcon(reqTeam.name) : <Users size={20} className="text-slate-400" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[14px] font-bold text-slate-900">{reqTeam?.name || 'Unknown Team'}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${reqTeam ? getCategoryColor(reqTeam.category) : 'bg-slate-100 text-slate-500'}`}>{reqTeam?.category || 'General'}</span>
                              </div>
                              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                                <Clock size={12} /> Requested 2 days ago
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-slate-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom CTA Card */}
                <div className="bg-[#F3F0FF] rounded-[16px] p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#6C4CF1] mb-1.5">Build Something Amazing</h3>
                    <p className="text-[12px] font-medium text-[#6C4CF1]/80 max-w-[200px] leading-relaxed">
                      Team up with talented people and turn your ideas into reality.
                    </p>
                  </div>
                  
                  {/* Decorative Elements replacing illustration */}
                  <div className="absolute bottom-[-10px] right-[-10px] w-24 h-24 bg-gradient-to-tr from-[#6C4CF1] to-[#9F7AEA] rounded-full opacity-20"></div>
                  <div className="absolute bottom-[10px] right-[10px] flex items-center gap-1 opacity-70">
                    <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                      <Users size={14} className="text-[#6C4CF1]" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#6C4CF1]/20 flex items-center justify-center shadow-sm -ml-3 border border-white">
                      <Rocket size={14} className="text-[#6C4CF1]" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* Detailed My Teams Tab */}
        {activeTab === 'my-teams' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-6">
            
            {myTeams.length === 0 && pendingRequests.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No Teams Yet"
                description="You haven't joined or created any teams yet. Start discovering teams or create your own!"
                actionText="Create Team"
                onAction={() => setIsCreateModalOpen(true)}
              />
            ) : (
              <div className="flex flex-col gap-10">
                {/* Teams Created */}
                {myTeams.filter(t => t.leaderId === currentUserId || t.ownerId === currentUserId).length > 0 && (
                  <div>
                    <h2 className="text-[18px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-[#6C4CF1] flex items-center justify-center">
                        <Users size={16} />
                      </div>
                      Teams Created
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {myTeams.filter(t => t.leaderId === currentUserId || t.ownerId === currentUserId).map(team => (
                        <TeamCard key={team.id} team={team} mode="manage" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Teams Joined */}
                {myTeams.filter(t => t.leaderId !== currentUserId && t.ownerId !== currentUserId).length > 0 && (
                  <div>
                    <h2 className="text-[18px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Users size={16} />
                      </div>
                      Teams Joined
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {myTeams.filter(t => t.leaderId !== currentUserId && t.ownerId !== currentUserId).map(team => (
                        <TeamCard key={team.id} team={team} mode="manage" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                  <div>
                    <h2 className="text-[18px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Clock size={16} />
                      </div>
                      Pending Requests
                    </h2>
                    <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
                      <div className="divide-y divide-slate-100">
                        {pendingRequests.map(req => {
                          const reqTeam = discoverTeams.find(t => t.id === req.teamId) || myTeams.find(t => t.id === req.teamId);
                          return (
                            <div key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${reqTeam ? getTeamIconBg(reqTeam.name) : 'bg-slate-50'}`}>
                                  {reqTeam ? getTeamIcon(reqTeam.name) : <Users size={20} className="text-slate-400" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-[15px] font-bold text-slate-900">{reqTeam?.name || 'Unknown Team'}</h3>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${reqTeam ? getCategoryColor(reqTeam.category) : 'bg-slate-100 text-slate-500'}`}>{reqTeam?.category || 'General'}</span>
                                  </div>
                                  <p className="text-[13px] font-medium text-slate-500 line-clamp-1">"{req.message}"</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="flex items-center gap-1.5 text-[12px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                  Pending Review
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateTeamModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
}
