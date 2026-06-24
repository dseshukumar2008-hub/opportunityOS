import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, deleteDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { ShieldAlert, CheckCircle2, XCircle, Search, Building2, Briefcase, MapPin, Clock, BarChart3, Users, FileText, Map, Target, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/common/ConfirmationModal';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingOpps, setPendingOpps] = useState([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    resumeAnalyses: 0,
    roadmapsGenerated: 0,
    matchAnalyses: 0,
    careerCoach: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [actionOpportunity, setActionOpportunity] = useState(null); // { opp, action: 'approve' | 'reject' }
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    // Basic admin check - in a real app this would be a strict middleware
    if (user?.user_type !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/dashboard');
      return;
    }

    fetchPendingOpportunities();
    fetchMetrics();
  }, [user, navigate]);

  const fetchMetrics = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'telemetry_events'));
      const events = snapshot.docs.map(doc => doc.data());
      
      const uniqueUsers = new Set(events.filter(e => e.userId && e.userId !== 'anonymous').map(e => e.userId)).size;
      
      setMetrics({
        totalUsers: uniqueUsers, // Approximated by active users in telemetry
        activeUsers: uniqueUsers,
        resumeAnalyses: events.filter(e => e.eventName === 'Resume Analysis Completed').length,
        roadmapsGenerated: events.filter(e => e.eventName === 'Roadmap Generated').length,
        matchAnalyses: events.filter(e => e.eventName === 'Match Analysis Completed').length,
        careerCoach: events.filter(e => e.eventName === 'Message Sent').length,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchPendingOpportunities = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, 'pending_opportunities'),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      const opps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by newest
      opps.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setPendingOpps(opps);
    } catch (error) {
      console.error('Error fetching pending opportunities:', error);
      toast.error('Failed to load pending opportunities');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerAction = (opp, action) => {
    setActionOpportunity({ opp, action });
  };

  const executeAction = async () => {
    if (!actionOpportunity) return;
    const { opp, action } = actionOpportunity;
    setIsConfirming(true);

    try {
      if (action === 'approve') {
        const newOppId = `community_${Date.now()}_${opp.id.substring(0, 5)}`;
        const newOppData = {
          title: opp.title,
          organization: opp.organization,
          type: opp.type,
          description: opp.description || '',
          country: opp.country || '',
          location: opp.country || '',
          deadline: opp.deadline || '',
          applyUrl: opp.applyUrl,
          logoUrl: opp.logoUrl || null,
          skills: opp.skills || [],
          source: 'Community',
          status: 'active',
          createdAt: serverTimestamp(),
          approvedBy: user.uid
        };

        await setDoc(doc(db, 'opportunities', newOppId), newOppData);
        await updateDoc(doc(db, 'pending_opportunities', opp.id), {
          status: 'approved',
          approvedAt: serverTimestamp(),
          approvedBy: user.uid
        });

        toast.success('Opportunity approved and published!');
        setPendingOpps(prev => prev.filter(o => o.id !== opp.id));
      } else if (action === 'reject') {
        await updateDoc(doc(db, 'pending_opportunities', opp.id), {
          status: 'rejected',
          rejectedAt: serverTimestamp(),
          rejectedBy: user.uid
        });
        
        toast.success('Opportunity rejected');
        setPendingOpps(prev => prev.filter(o => o.id !== opp.id));
      }
    } catch (error) {
      console.error(`Error ${action}ing opportunity:`, error);
      toast.error(`Failed to ${action} opportunity`);
    } finally {
      setIsConfirming(false);
      setActionOpportunity(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Review and moderate community submissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Users size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{metrics.totalUsers}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <BarChart3 size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Active</span>
          </div>
          <span className="text-2xl font-black text-indigo-600">{metrics.activeUsers}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <FileText size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Resumes</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{metrics.resumeAnalyses}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Map size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Roadmaps</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{metrics.roadmapsGenerated}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Target size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Matches</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{metrics.matchAnalyses}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <MessageSquare size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Coach MSGs</span>
          </div>
          <span className="text-2xl font-black text-slate-900">{metrics.careerCoach}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Pending Opportunities
            <span className="px-2.5 py-0.5 bg-[#6D5DF6]/10 text-[#6D5DF6] rounded-full text-xs">
              {pendingOpps.length}
            </span>
          </h2>
        </div>

        {pendingOpps.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle2 size={48} className="text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">All caught up!</h3>
            <p className="text-slate-500">There are no pending opportunities to review right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingOpps.map((opp) => (
              <div key={opp.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column: Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 mb-1">{opp.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
                          <span className="flex items-center gap-1">
                            <Building2 size={14} className="text-slate-400" />
                            {opp.organization}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} className="text-slate-400" />
                            {opp.type}
                          </span>
                          {opp.country && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} className="text-slate-400" />
                              {opp.country}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-slate-400" />
                            Submitted: {opp.createdAt?.toDate().toLocaleDateString() || 'Recently'}
                          </span>
                        </div>
                      </div>
                      {opp.logoUrl && (
                        <img src={opp.logoUrl} alt="Logo" className="w-12 h-12 rounded-lg object-contain border border-slate-100 bg-white" />
                      )}
                    </div>

                    <div className="text-sm text-slate-600 bg-slate-100/50 p-4 rounded-xl">
                      {opp.description || <span className="italic text-slate-400">No description provided</span>}
                    </div>

                    {opp.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {opp.skills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-[#F4F2FF] text-[#6C4CF1] text-xs font-bold rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-sm">
                      <span className="font-bold text-slate-700">Apply URL: </span>
                      <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {opp.applyUrl}
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="lg:w-[200px] shrink-0 flex flex-row lg:flex-col gap-3 justify-start">
                    <button
                      onClick={() => triggerAction(opp, 'approve')}
                      className="flex-1 lg:w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle2 size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => triggerAction(opp, 'reject')}
                      className="flex-1 lg:w-full px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!actionOpportunity}
        onClose={() => !isConfirming && setActionOpportunity(null)}
        onConfirm={executeAction}
        title={actionOpportunity?.action === 'approve' ? 'Approve Opportunity' : 'Reject Opportunity'}
        message={
          <>
            Are you sure you want to {actionOpportunity?.action} {' '}
            <span className="font-bold text-slate-900">{actionOpportunity?.opp?.title}</span>?
            {actionOpportunity?.action === 'reject' && '\n\nThis action cannot be undone.'}
          </>
        }
        confirmText={actionOpportunity?.action === 'approve' ? 'Approve' : 'Reject'}
        isDestructive={actionOpportunity?.action === 'reject'}
        isLoading={isConfirming}
      />
    </div>
  );
}
