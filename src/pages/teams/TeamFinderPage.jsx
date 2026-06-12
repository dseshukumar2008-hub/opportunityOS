import { useState } from 'react';
import { Users, Compass, UserCircle, Plus } from 'lucide-react';
import TeamCard from '../../components/teams/TeamCard';
import TeamRequestsPanel from '../../components/teams/TeamRequestsPanel';
import { useTeam } from '../../contexts/TeamContext';
import { useTeamMatch } from '../../hooks/useTeamMatch';

export default function TeamFinderPage() {
  const [activeTab, setActiveTab] = useState('discover');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { getMyTeams, getMyPendingRequests, createTeam, isLoading } = useTeam();
  const { getRecommendedTeams } = useTeamMatch();

  const myTeams = getMyTeams() || [];
  const pendingRequests = getMyPendingRequests() || [];
  const discoverTeams = getRecommendedTeams() || [];

  // Create Team Form State
  const [formData, setFormData] = useState({
    name: '',
    projectIdea: '',
    description: '',
    requiredSkills: '',
    maxMembers: '5'
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
    await createTeam({
      ...formData,
      requiredSkills: skillsArray
    });
    setIsCreateModalOpen(false);
    setFormData({ name: '', projectIdea: '', description: '', requiredSkills: '', maxMembers: '5' });
    setActiveTab('my-teams'); // Switch to my teams after creation
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 leading-tight flex items-center gap-3">
            <Users className="text-[#6C4CF1]" size={32} />
            Team Finder
          </h1>
          <p className="text-[14px] font-medium text-slate-500 mt-1">
            Find teammates for hackathons, projects, and startups based on your skills.
          </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-[#6C4CF1] hover:bg-indigo-600 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} strokeWidth={3} /> Create Team
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex items-center gap-2 px-4 py-3 text-[14px] font-bold border-b-2 transition-colors ${
            activeTab === 'discover' 
              ? 'border-[#6C4CF1] text-[#6C4CF1]' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Compass size={16} /> Discover Teams
        </button>
        <button
          onClick={() => setActiveTab('my-teams')}
          className={`flex items-center gap-2 px-4 py-3 text-[14px] font-bold border-b-2 transition-colors ${
            activeTab === 'my-teams' 
              ? 'border-[#6C4CF1] text-[#6C4CF1]' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <UserCircle size={16} /> My Teams
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : activeTab === 'discover' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discoverTeams.length > 0 ? (
            discoverTeams.map(team => <TeamCard key={team.id} team={team} mode="discover" />)
          ) : (
            <div className="col-span-full card-standard p-12 text-center flex flex-col items-center">
               <Compass size={48} className="text-slate-300 mb-4" />
               <h3 className="text-[18px] font-bold text-slate-900 mb-2">No Teams Available</h3>
               <p className="text-slate-500 text-[14px]">Be the first to create a team and start recruiting!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Incoming Requests (if leader) */}
          <section>
            <h2 className="text-[18px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              Incoming Join Requests
            </h2>
            <TeamRequestsPanel />
          </section>

          {/* My Active Teams */}
          <section>
            <h2 className="text-[18px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              My Active Teams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTeams.length > 0 ? (
                myTeams.map(team => <TeamCard key={team.id} team={team} mode="my-team" />)
              ) : (
                <p className="text-slate-500 text-[14px] italic col-span-full">You haven't joined any teams yet.</p>
              )}
            </div>
          </section>

          {/* My Pending Outbound Requests */}
          <section>
            <h2 className="text-[18px] font-bold text-slate-900 mb-4 flex items-center gap-2">
              My Pending Requests
            </h2>
            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.map(req => (
                  <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[12px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mr-2">Pending</span>
                      <span className="text-[14px] font-bold text-slate-700">Request to join team</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-[14px] italic">No pending requests sent.</p>
            )}
          </section>
        </div>
      )}

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-[18px] font-bold text-slate-900">Create a New Team</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Team Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                  placeholder="e.g. Code Ninjas"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Project Idea</label>
                <input 
                  required
                  type="text" 
                  value={formData.projectIdea}
                  onChange={e => setFormData({...formData, projectIdea: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                  placeholder="e.g. AI Career Coach for Students"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Required Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.requiredSkills}
                  onChange={e => setFormData({...formData, requiredSkills: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                  placeholder="e.g. React, Node.js, Python"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Team Size</label>
                  <input 
                    type="number" 
                    min="2" max="20"
                    value={formData.maxMembers}
                    onChange={e => setFormData({...formData, maxMembers: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                  placeholder="Describe what you are building and who you are looking for..."
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
