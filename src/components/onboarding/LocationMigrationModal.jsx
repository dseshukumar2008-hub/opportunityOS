import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { MapPin, X, Plus, CheckCircle2, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LOCATIONS_LIST = ['India', 'Remote', 'United States', 'Europe', 'Singapore', 'Australia'];

export default function LocationMigrationModal() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [preferredLocations, setPreferredLocations] = useState([]);
  const [customLocation, setCustomLocation] = useState('');

  // Only run once per session
  useEffect(() => {
    if (!user) return;
    
    // If we've already shown it this session, don't show it again immediately on remount
    if (sessionStorage.getItem(`location_migrated_${user.id}`)) {
      setIsLoading(false);
      return;
    }

    const checkLocationStatus = async () => {
      try {
        const userDocRef = doc(db, 'users', user.id);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          // Show only if onboarding is complete but preferredLocations is missing or empty
          if (data.onboardingCompleted === true && (!data.preferredLocations || data.preferredLocations.length === 0)) {
            setIsVisible(true);
          } else {
            sessionStorage.setItem(`location_migrated_${user.id}`, 'true');
          }
        }
      } catch (error) {
        console.error("Error checking location status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLocationStatus();
  }, [user]);

  const toggleLocation = (loc) => {
    if (preferredLocations.includes(loc)) {
      setPreferredLocations(preferredLocations.filter(l => l !== loc));
    } else {
      setPreferredLocations([...preferredLocations, loc]);
    }
  };

  const handleSave = async () => {
    if (preferredLocations.length === 0) {
      toast.error('Please select at least one preferred location.');
      return;
    }

    setIsSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        preferredLocations: preferredLocations
      });
      sessionStorage.setItem(`location_migrated_${user.id}`, 'true');
      toast.success('Preferences updated!');
      setIsVisible(false);
    } catch (err) {
      console.error("Error saving locations:", err);
      toast.error('Failed to save preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <MapPin size={28} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Where do you want to work?</h2>
          <p className="text-[13px] text-slate-500 text-center mb-6 leading-relaxed">
            We've upgraded our recommendation engine! Tell us your preferred locations so we can find the best opportunities for you.
          </p>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {preferredLocations.filter(loc => !LOCATIONS_LIST.includes(loc)).map(customLoc => (
                <button
                  key={customLoc}
                  onClick={() => toggleLocation(customLoc)}
                  className="px-4 py-2 rounded-full text-[13px] font-medium transition-all bg-[#6D5DF6] text-white shadow-md flex items-center gap-1"
                >
                  {customLoc} <X size={14} />
                </button>
              ))}
              {LOCATIONS_LIST.map(loc => (
                <button
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                    preferredLocations.includes(loc)
                      ? 'bg-[#6D5DF6] text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mt-4 border-t border-slate-100 pt-4">
              <input 
                type="text" 
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customLocation.trim()) {
                    if (!preferredLocations.includes(customLocation.trim())) {
                      setPreferredLocations([...preferredLocations, customLocation.trim()]);
                    }
                    setCustomLocation('');
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#6D5DF6]"
                placeholder="Other location (e.g. London)"
              />
              <button 
                onClick={() => {
                  if (customLocation.trim() && !preferredLocations.includes(customLocation.trim())) {
                    setPreferredLocations([...preferredLocations, customLocation.trim()]);
                    setCustomLocation('');
                  }
                }}
                className="p-2.5 bg-[#6D5DF6] text-white rounded-xl hover:bg-[#5a4add] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || preferredLocations.length === 0}
            className="w-full mt-8 bg-[#6D5DF6] hover:bg-[#5a4add] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
