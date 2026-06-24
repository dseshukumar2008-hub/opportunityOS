import { useState, useEffect } from 'react';
import { X, History, RotateCcw, Clock } from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import toast from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';

export default function ResumeHistoryModal({ isOpen, onClose }) {
  const { activeResumeId, restoreSnapshot, saveResume } = useResume();
  const [snapshots, setSnapshots] = useState([]);

  // Confirmation Modal state
  const [snapshotToRestore, setSnapshotToRestore] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (isOpen && activeResumeId) {
      // Load snapshots from local storage for the active resume
      const key = `resume_snapshots_${activeResumeId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setSnapshots(JSON.parse(saved).reverse());
      } else {
        setSnapshots([]);
      }
    }
  }, [isOpen, activeResumeId]);

  const handleRestoreClick = (snapshot) => {
    setSnapshotToRestore(snapshot);
  };

  const handleConfirmRestore = async () => {
    if (!snapshotToRestore) return;
    setIsRestoring(true);
    
    // Simulating slight delay for UX
    setTimeout(() => {
      restoreSnapshot(snapshotToRestore.data);
      toast.success('Resume restored to previous version!');
      // Give a tiny delay to state update, then save
      setTimeout(() => {
        saveResume();
      }, 100);
      setIsRestoring(false);
      setSnapshotToRestore(null);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Version History</h2>
              <p className="text-xs text-slate-500 font-medium">Restore a previous version of this resume</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto p-4">
          {snapshots.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Clock size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No version history available yet.</p>
              <p className="text-xs mt-1">Changes are saved automatically as you edit.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {snapshots.map((snap, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <Clock size={14} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Version {snapshots.length - idx}</h4>
                      <p className="text-xs font-medium text-slate-500">
                        {new Date(snap.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRestoreClick(snap)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-white border border-indigo-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-50"
                  >
                    <RotateCcw size={14} />
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!snapshotToRestore}
        onClose={() => !isRestoring && setSnapshotToRestore(null)}
        onConfirm={handleConfirmRestore}
        title="Restore Version"
        message={
          <>
            Are you sure you want to restore this version?
            {'\n\n'}Current unsaved changes will be lost.
          </>
        }
        confirmText="Restore"
        isDestructive={false}
        isLoading={isRestoring}
      />
    </div>
  );
}
