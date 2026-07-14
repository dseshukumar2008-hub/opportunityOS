import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SettingsSidebar from '../../components/settings/SettingsSidebar';
import AccountTab from '../../components/settings/AccountTab';
import NotificationsSettings from '../../components/settings/NotificationsSettings';
import PrivacySettings from '../../components/settings/PrivacySettings';
import PasswordSecuritySettings from '../../components/settings/passwordSecuritySettings';
import AppearanceSettings from '../../components/settings/AppearnceSettings'
import EmailPrefernceSettings from '../../components/settings/EmailPreferncesSettings'
import DataStorageSettings from '../../components/settings/DataStorageSettings';
import IntegrationsSettings from '../../components/settings/IntegrationsSettings'

import { 
  User, FileText, Code, Settings, Camera,
  Globe, Save, ChevronDown, X, Check, Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { auth, storage, db } from '../../config/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { verifyBeforeUpdateEmail } from 'firebase/auth';


import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('account');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  
  // Custom hook logic for Firestore user settings persistence
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (!user?.uid) {
      setSettings({});
      setIsLoadingSettings(false);
      return;
    }

    setIsLoadingSettings(true);
    const docRef = doc(db, 'user_settings', user.uid);

    const unsubscribe = onSnapshot(docRef, async (snap) => {
      if (snap.exists()) {
        setSettings(snap.data());
      } else {
        // Migration check: check if localStorage has settings
        const localSettingsStr = localStorage.getItem('opportunityos_settings');
        if (localSettingsStr) {
          try {
            const localSettings = JSON.parse(localSettingsStr);
            if (localSettings && typeof localSettings === 'object') {
              await setDoc(docRef, localSettings);
              localStorage.removeItem('opportunityos_settings');
              setSettings(localSettings);
            }
          } catch (e) {
            console.error('Failed to migrate local settings:', e);
          }
        } else {
          setSettings({});
        }
      }
      setIsLoadingSettings(false);
    }, (err) => {
      console.error('Error loading settings from Firestore:', err);
      setIsLoadingSettings(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const updateSetting = async (key, value) => {
    if (!user?.uid) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'user_settings', user.uid), { [key]: value }, { merge: true });
    } catch (err) {
      console.error('Failed to update user setting in Firestore:', err);
    }
  };

  // Mock edit form state for the modal
  const [editForm, setEditForm] = useState({
    name: profile?.name || profile?.full_name || user?.name || '',
    email: user?.email || '',
    college: profile?.education?.[0]?.institution || '',
    branch: profile?.education?.[0]?.field || '',
    year: '', // we can leave this blank or map it if needed
    expectedGraduation: profile?.education?.[0]?.endYear || '',
    skills: profile?.skills?.join(', ') || '',
    bio: profile?.bio || ''
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG and WEBP formats are supported');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const storagePath = `users/${user.uid}/avatar/${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, storagePath);

      const uploadTask = await uploadBytes(storageRef, file);
      const publicUrl = await getDownloadURL(uploadTask.ref);

      await updateProfile({ avatar_url: publicUrl });
      toast.success('Profile photo updated successfully');
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      toast.error(err.message || 'Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountTab key="account" settings={settings} updateSetting={updateSetting} setIsEditModalOpen={setIsEditModalOpen} />;
      case 'notifications':
        return <NotificationsSettings key="notifications" settings={settings} updateSetting={updateSetting} />;
      case 'privacy':
        return <PrivacySettings key="privacy" settings={settings} updateSetting={updateSetting} />;
      case 'password':
        return <PasswordSecuritySettings key="password" />;
      case 'appearance':
        return <AppearanceSettings key="appearance" settings={settings} updateSetting={updateSetting} />;
      case 'email':
        return <EmailPreferencesSettings key="email" settings={settings} updateSetting={updateSetting} />;
      case 'data':
        return <DataStorageSettings key="data" />;
      case 'integrations':
        return <IntegrationsSettings key="integrations" />;
      default:
        return <AccountTab key="account" settings={settings} updateSetting={updateSetting} setIsEditModalOpen={setIsEditModalOpen} />;
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6 pt-4 lg:pt-6 pb-24">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-header">Settings</h1>
        <p className="page-subheader mt-1">Manage your account preferences and application settings</p>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Settings Navigation Panel (Left Column) */}
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Settings Content Panel (Right Column) */}
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-[1200px] max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="shrink-0 bg-white p-8 pb-6 relative z-10">
              <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Edit Profile</h2>
              <p className="text-[14px] text-slate-500 mt-1">Update your personal information and preferences</p>
              
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-8 right-8 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="w-full border-b border-slate-100"></div>
            
            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              
              {/* Left Sidebar */}
              <div className="w-full lg:w-[240px] shrink-0 border-r border-slate-100 p-6 flex flex-col gap-2 overflow-y-auto">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#F3F0FF] text-[#6C4CF1] rounded-xl font-semibold text-[14px] transition-colors">
                  <User size={18} />
                  Personal Info
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-[14px] transition-colors">
                  <FileText size={18} />
                  About Me
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-[14px] transition-colors">
                  <Code size={18} />
                  Skills
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-[14px] transition-colors">
                  <Globe size={18} />
                  Links
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold text-[14px] transition-colors">
                  <Settings size={18} />
                  Preferences
                </button>
              </div>

              {/* Center Column */}
              <div className="flex-1 p-8 overflow-y-auto border-r border-slate-100 min-w-0">
                <h3 className="text-[16px] font-bold text-slate-900 mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={editForm.email} 
                      onChange={e => setEditForm({...editForm, email: e.target.value})}
                      className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">College/University</label>
                    <input 
                      type="text" 
                      value={editForm.college} 
                      onChange={e => setEditForm({...editForm, college: e.target.value})}
                      className="w-full h-[52px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Branch/Major</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={editForm.branch} 
                        onChange={e => setEditForm({...editForm, branch: e.target.value})}
                        className="w-full h-[52px] px-4 pr-10 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
                      />
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Graduation Year</label>
                    <div className="relative">
                      <select 
                        value={editForm.expectedGraduation || "2029"}
                        onChange={e => setEditForm({...editForm, expectedGraduation: e.target.value})}
                        className="w-full h-[52px] px-4 pr-10 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700 appearance-none"
                      >
                        <option>2026</option>
                        <option>2027</option>
                        <option>2028</option>
                        <option>2029</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-2">Current Year</label>
                    <div className="relative">
                      <select 
                        value={editForm.year}
                        onChange={e => setEditForm({...editForm, year: e.target.value})}
                        className="w-full h-[52px] px-4 pr-10 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700 appearance-none"
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                
                <div className="w-full border-b border-slate-100 mb-8"></div>

                <div className="mb-8">
                  <label className="block text-[13px] font-semibold text-slate-700 mb-4">Skills (comma separated)</label>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-wrap gap-2 items-center min-h-[52px]">
                    {editForm.skills.split(',').map((skill, index) => skill.trim() && (
                      <span key={index} className="px-3 py-1.5 bg-[#F3F0FF] text-[#6C4CF1] rounded-[8px] text-[13px] font-semibold flex items-center gap-1.5">
                        {skill.trim()}
                        <button className="hover:bg-[#E5DFFF] rounded-full p-0.5 transition-colors">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      className="flex-1 min-w-[120px] bg-transparent outline-none text-[14px] text-slate-700" 
                      placeholder="Add a skill..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-4">About Me (Bio)</label>
                  <textarea 
                    value={editForm.bio} 
                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    rows={6}
                    className="w-full p-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all resize-none text-slate-600 leading-[1.7]"
                  ></textarea>
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full lg:w-[340px] shrink-0 bg-[#FAFAFA] p-8 overflow-y-auto">
                <div className="mb-8 flex flex-col items-center">
                  <h3 className="text-[14px] font-semibold text-slate-900 w-full text-left mb-6">Profile Photo</h3>
                  
                  <div className="relative mb-4 group">
                    {isUploadingAvatar ? (
                      <div className="w-[140px] h-[140px] rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-[#6C4CF1]" />
                      </div>
                    ) : (
                      <>
                        <img 
                          src={profile?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'User'}&backgroundColor=e2e8f0`} 
                          alt="Profile Avatar" 
                          className="w-[140px] h-[140px] rounded-full border border-slate-200 object-cover bg-slate-100"
                        />
                        <label className="absolute bottom-2 right-2 w-10 h-10 bg-[#6C4CF1] text-white rounded-full flex items-center justify-center hover:bg-[#5b3fda] transition-colors shadow-sm border-[3px] border-white cursor-pointer">
                          <Camera size={16} />
                          <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                        </label>
                      </>
                    )}
                  </div>
                  
                  <p className="text-[12px] text-slate-500 mb-6">JPG, PNG or WEBP. Max size 5MB.</p>
                  
                  <label className="btn-secondary w-full h-[44px] text-[#6C4CF1] text-[14px] flex items-center justify-center cursor-pointer">
                    Upload New Photo
                    <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                  </label>
                </div>
                
                <div className="w-full border-b border-slate-200 mb-8"></div>
                
                <div>
                  <h3 className="text-[14px] font-semibold text-slate-900 mb-6">Social Links</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-2">LinkedIn</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </div>
                        <input 
                          type="text" 
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="w-full h-[48px] pl-11 pr-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[13px] outline-none transition-all text-slate-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-2">GitHub</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                        </div>
                        <input 
                          type="text" 
                          placeholder="https://github.com/yourusername"
                          className="w-full h-[48px] pl-11 pr-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[13px] outline-none transition-all text-slate-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-2">Portfolio</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Globe size={18} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="https://yourportfolio.com"
                          className="w-full h-[48px] pl-11 pr-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[13px] outline-none transition-all text-slate-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-2">Twitter (X)</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                        </div>
                        <input 
                          type="text" 
                          placeholder="https://twitter.com/yourusername"
                          className="w-full h-[48px] pl-11 pr-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[13px] outline-none transition-all text-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer Action Bar */}
            <div className="shrink-0 bg-white border-t border-slate-100 p-6 flex items-center justify-end gap-4 z-10">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="btn-secondary h-[48px] px-8 text-[14px]"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    if (editForm.email !== user?.email) {
                      try {
                        await verifyBeforeUpdateEmail(auth.currentUser, editForm.email);
                        toast.success('Verification email sent to the new address. Please check your inbox.');
                      } catch (authErr) {
                        if (authErr.code === 'auth/requires-recent-login') {
                          toast.error('For security reasons, please log out and log back in to change your email.');
                          throw authErr;
                        }
                        throw authErr;
                      }
                    }

                    // 2. Update Profile
                    const updates = {
                      full_name: editForm.name,
                      bio: editForm.bio,
                      skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean),
                      education: [{
                        institution: editForm.college,
                        field: editForm.branch,
                        endYear: editForm.expectedGraduation
                      }]
                    };
                    await updateProfile(updates);
                    setIsEditModalOpen(false);
                    toast.success('Profile updated successfully');
                  } catch (err) {
                    console.error('Failed to update profile:', err);
                    toast.error(err.message || 'Failed to update profile');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="btn-primary h-[48px] px-8 text-[14px] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
