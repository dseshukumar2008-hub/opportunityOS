import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { X, User, Code, Heart, Target, FileText, CheckCircle2, ChevronRight, Rocket, MapPin, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const STEPS = [
  { id: 'profile', icon: User, title: '1. Create Profile', desc: 'Tell us about yourself' },
  { id: 'skills', icon: Code, title: '2. Choose Skills', desc: 'Add the skills you know' },
  { id: 'interests', icon: Heart, title: '3. Select Interests', desc: 'Choose your areas of interest' },
  { id: 'goals', icon: Target, title: '4. Career Goals', desc: 'What do you want to achieve?' },
  { id: 'locations', icon: MapPin, title: '5. Preferred Locations', desc: 'Where do you want to work?' },
  { id: 'resume', icon: FileText, title: '6. Upload Resume (Optional)', desc: 'Get AI analysis and better matches' }
];

const SKILLS_LIST = ['Python', 'Java', 'C++', 'React', 'Node.js', 'AI/ML', 'Data Science', 'Cybersecurity', 'UI/UX', 'Cloud Computing'];
const INTERESTS_LIST = ['AI', 'Web Development', 'Data Science', 'Product Management', 'Cybersecurity', 'Cloud', 'Startups'];
const GOALS_LIST = ['Internships', 'Jobs', 'Hackathons', 'Scholarships', 'Competitions', 'Research', 'Freelancing', 'Startup Opportunities'];
const LOCATIONS_LIST = ['India', 'Remote', 'United States', 'Europe', 'Singapore', 'Australia'];

export default function OnboardingModal() {
  const { user, updateUser } = useAuth();
  
  // Synchronous check to avoid loading flash for returning users
  const isLocallyCompleted = user ? localStorage.getItem(`onboarding_${user.uid}`) === 'completed' : false;

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(!isLocallyCompleted);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(null); // null means showing checklist
  const [isCompleted, setIsCompleted] = useState(false);

  const [formData, setFormData] = useState({
    profile: { fullName: '', college: '', degree: '', graduationYear: '', country: '', state: '', city: '' },
    skills: [],
    interests: [],
    goals: [],
    preferredLocations: [],
    resumeUrl: '',
    onboardingProgress: []
  });

  const [customLocation, setCustomLocation] = useState('');

  useEffect(() => {
    if (!user) return;
    if (isLocallyCompleted) {
       // Short circuit if already verified locally
       setIsLoading(false);
       setIsVisible(false);
       return;
    }

    const checkOnboardingStatus = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          
          if (data.onboardingCompleted === false) {
            setFormData(prev => ({ ...prev, ...data }));
            setIsVisible(true);
          } else {
            localStorage.setItem(`onboarding_${user.uid}`, 'completed');
            if (data.onboardingCompleted !== true) {
              await updateDoc(userDocRef, { onboardingCompleted: true });
            }
            setIsVisible(false);
          }
        } else {
          // New user -> Document does not exist
          setIsVisible(true);
        }
      } catch (error) {
        console.error("[ONBOARDING] Error fetching onboarding status:", error);
        // Edge case network error - show modal to capture data
        setIsVisible(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, isLocallyCompleted]);

  const calculateProgress = () => {
    const totalSteps = 5; // Mandatory steps: profile, skills, interests, goals, locations
    let completedSteps = 0;
    if (formData.profile.fullName && formData.profile.college) completedSteps++;
    if (formData.skills.length > 0) completedSteps++;
    if (formData.interests.length > 0) completedSteps++;
    if (formData.goals.length > 0) completedSteps++;
    if (formData.preferredLocations?.length > 0) completedSteps++;
    return Math.min(100, Math.round((completedSteps / totalSteps) * 100));
  };

  const isStepCompleted = (stepId) => {
    switch (stepId) {
      case 'profile': return formData.profile.fullName && formData.profile.college;
      case 'skills': return formData.skills.length > 0;
      case 'interests': return formData.interests.length > 0;
      case 'goals': return formData.goals.length > 0;
      case 'locations': return formData.preferredLocations?.length > 0;
      case 'resume': return !!formData.resumeUrl;
      default: return false;
    }
  };

  const saveProgress = async (newFormData, completedStepId = null) => {
    if (!user) return;
    
    const userDocRef = doc(db, 'users', user.uid);
    let newProgress = [...(newFormData.onboardingProgress || [])];
    if (completedStepId && !newProgress.includes(completedStepId)) {
      newProgress.push(completedStepId);
    }

    try {
      await setDoc(userDocRef, {
        ...newFormData,
        onboardingProgress: newProgress
      }, { merge: true });
      setFormData(prev => ({ ...prev, ...newFormData, onboardingProgress: newProgress }));
      toast.success('Progress saved');
    } catch (err) {
      console.error("Error saving to Firebase:", err);
      // Still update local state even if offline
      setFormData(prev => ({ ...prev, ...newFormData, onboardingProgress: newProgress }));
    }
  };

  const handleCompleteSetup = async () => {
    if (calculateProgress() < 100) {
      toast.error('Please complete all mandatory steps');
      return;
    }
    
    setIsSaving(true);
    const userDocRef = doc(db, 'users', user.uid);
    
    try {
      // 1. Save to local storage for instant robust persistence across reloads/logouts
      localStorage.setItem(`onboarding_${user.uid}`, 'completed');

      // 2. Save to Firestore
      await setDoc(userDocRef, { 
        onboardingCompleted: true,
        ...formData 
      }, { merge: true });

      setIsCompleted(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsSaving(false);
      }, 2000);
      toast.success('Setup Complete!');
    } catch (err) {
      console.error("Error completing setup:", err);
      toast.error("Failed to save progress. Please try again.");
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Uploading resume...');
    try {
      const resumeRef = ref(storage, `resumes/${user.uid}/resume.pdf`);
      await uploadBytes(resumeRef, file);
      const url = await getDownloadURL(resumeRef);
      
      const newData = { ...formData, resumeUrl: url };
      await saveProgress(newData, 'resume');
      toast.success('Resume uploaded successfully', { id: toastId });
      setCurrentStep(null); // go back to checklist
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error('Upload failed', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleArrayItem = (arrayName, item) => {
    const array = formData[arrayName];
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
    
    setFormData({ ...formData, [arrayName]: newArray });
  };

  // While checking Firestore for new users, we display a full screen loading 
  // overlay so the dashboard doesn't flash beneath. Existing users bypass this.
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D5DF6]"></div>
      </div>
    );
  }

  if (!isVisible) return null;

  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">🎉 Setup Complete!</h2>
          <p className="text-slate-500 mt-2">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderChecklist = () => (
    <>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#F3F0FF] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#6D5DF6]/10 shadow-sm relative">
          <Rocket size={28} className="text-[#6D5DF6]" />
          <div className="absolute -top-2 -right-2 text-xl">🎉</div>
          <div className="absolute top-2 -left-3 text-lg">✨</div>
          <div className="absolute -bottom-1 -right-3 text-lg">✨</div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to OpportunityOS 🚀</h2>
        <p className="text-[13px] text-slate-500 max-w-sm mx-auto leading-relaxed">
          Complete your setup to unlock personalized opportunities and AI recommendations.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {STEPS.map((step) => {
          const completed = isStepCompleted(step.id);
          const Icon = step.icon;
          return (
            <div 
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-[#6D5DF6] hover:shadow-[0_4px_20px_rgb(109,93,246,0.08)] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${completed ? 'bg-green-50 text-green-600' : step.id === 'profile' ? 'bg-[#F3F0FF] text-[#6D5DF6]' : step.id === 'skills' ? 'bg-blue-50 text-blue-500' : step.id === 'interests' ? 'bg-pink-50 text-pink-500' : step.id === 'goals' ? 'bg-orange-50 text-orange-500' : step.id === 'locations' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-[#6D5DF6] transition-colors">{step.title}</h4>
                  <p className="text-[12px] text-slate-500">{step.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {completed ? (
                  <CheckCircle2 size={20} className="text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                )}
                <ChevronRight size={18} className="text-slate-300 group-hover:text-[#6D5DF6] transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-bold text-slate-900">Your Progress</span>
        <span className="text-[13px] font-bold text-[#6D5DF6]">{calculateProgress()}% Complete</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-[#6D5DF6] transition-all duration-500 rounded-full"
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>

      <button
        onClick={handleCompleteSetup}
        disabled={calculateProgress() < 100 || isSaving}
        className="w-full bg-[#6D5DF6] hover:bg-[#5a4add] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSaving ? 'Saving...' : 'Continue Setup'} <ChevronRight size={18} />
      </button>
    </>
  );

  const renderFormStep = () => {
    const step = STEPS.find(s => s.id === currentStep);
    
    const handleBack = () => {
      if (currentStep === 'profile') {
        const { fullName, college, graduationYear } = formData.profile;
        if (!fullName?.trim()) {
           toast.error('Full Name is required');
           return;
        }
        if (!college?.trim()) {
           toast.error('College/University is required');
           return;
        }
        if (graduationYear && !/^\d{4}$/.test(graduationYear.trim())) {
           toast.error('Graduation Year must be a 4-digit number');
           return;
        }
      }

      // Save on back
      saveProgress(formData, isStepCompleted(currentStep) ? currentStep : null);
      setCurrentStep(null);
    };

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handleBack} className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
             <ChevronRight size={18} className="rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{step.title}</h2>
            <p className="text-[13px] text-slate-500">{step.desc}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-6">
          {currentStep === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.profile.fullName}
                  onChange={(e) => setFormData({...formData, profile: {...formData.profile, fullName: e.target.value}})}
                  maxLength={100}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/20 transition-all"
                  placeholder="e.g. Rohan Verma"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">College/University</label>
                <input 
                  type="text" 
                  value={formData.profile.college}
                  onChange={(e) => setFormData({...formData, profile: {...formData.profile, college: e.target.value}})}
                  maxLength={150}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/20 transition-all"
                  placeholder="e.g. Stanford University"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Degree</label>
                  <input 
                    type="text" 
                    value={formData.profile.degree}
                    onChange={(e) => setFormData({...formData, profile: {...formData.profile, degree: e.target.value}})}
                    maxLength={100}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/20 transition-all"
                    placeholder="e.g. B.Tech Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Graduation Year</label>
                  <input 
                    type="text" 
                    value={formData.profile.graduationYear}
                    onChange={(e) => setFormData({...formData, profile: {...formData.profile, graduationYear: e.target.value}})}
                    maxLength={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/20 transition-all"
                    placeholder="e.g. 2026"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Country</label>
                  <input 
                    type="text" 
                    value={formData.profile.country}
                    onChange={(e) => setFormData({...formData, profile: {...formData.profile, country: e.target.value}})}
                    maxLength={100}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/20 transition-all"
                    placeholder="e.g. India, USA"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">State/Province</label>
                  <input 
                    type="text" 
                    value={formData.profile.state}
                    onChange={(e) => setFormData({...formData, profile: {...formData.profile, state: e.target.value}})}
                    maxLength={100}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/20 transition-all"
                    placeholder="e.g. California"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">City</label>
                  <input 
                    type="text" 
                    value={formData.profile.city}
                    onChange={(e) => setFormData({...formData, profile: {...formData.profile, city: e.target.value}})}
                    maxLength={100}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#6D5DF6] focus:ring-2 focus:ring-[#6D5DF6]/20 transition-all"
                    placeholder="e.g. San Francisco"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'skills' && (
            <div className="flex flex-wrap gap-2">
              {SKILLS_LIST.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleArrayItem('skills', skill)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                    formData.skills.includes(skill)
                      ? 'bg-[#6D5DF6] text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}

          {currentStep === 'interests' && (
            <div className="flex flex-wrap gap-2">
              {INTERESTS_LIST.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleArrayItem('interests', interest)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-[#6D5DF6] text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          )}

          {currentStep === 'goals' && (
            <div className="flex flex-wrap gap-2">
              {GOALS_LIST.map(goal => (
                <button
                  key={goal}
                  onClick={() => toggleArrayItem('goals', goal)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                    formData.goals.includes(goal)
                      ? 'bg-[#6D5DF6] text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          )}

          {currentStep === 'locations' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(formData.preferredLocations || []).filter(loc => !LOCATIONS_LIST.includes(loc)).map(customLoc => (
                  <button
                    key={customLoc}
                    onClick={() => toggleArrayItem('preferredLocations', customLoc)}
                    className="px-4 py-2 rounded-full text-[13px] font-medium transition-all bg-[#6D5DF6] text-white shadow-md flex items-center gap-1"
                  >
                    {customLoc} <X size={14} />
                  </button>
                ))}
                {LOCATIONS_LIST.map(loc => (
                  <button
                    key={loc}
                    onClick={() => toggleArrayItem('preferredLocations', loc)}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                      (formData.preferredLocations || []).includes(loc)
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
                      if (!(formData.preferredLocations || []).includes(customLocation.trim())) {
                         setFormData({ ...formData, preferredLocations: [...(formData.preferredLocations || []), customLocation.trim()] });
                      }
                      setCustomLocation('');
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[13px] focus:outline-none focus:border-[#6D5DF6]"
                  placeholder="Other location (e.g. London)"
                />
                <button 
                  onClick={() => {
                    if (customLocation.trim() && !(formData.preferredLocations || []).includes(customLocation.trim())) {
                      setFormData({ ...formData, preferredLocations: [...(formData.preferredLocations || []), customLocation.trim()] });
                      setCustomLocation('');
                    }
                  }}
                  className="p-2 bg-[#6D5DF6] text-white rounded-xl hover:bg-[#5a4add] transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'resume' && (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
              <FileText size={48} className="text-slate-400 mx-auto mb-4" />
              <h3 className="text-slate-900 font-bold mb-2">Upload your resume</h3>
              <p className="text-slate-500 text-[13px] mb-4">PDF format, max 5MB</p>
              
              <input 
                type="file" 
                id="resume-upload" 
                className="hidden" 
                accept="application/pdf"
                onChange={handleResumeUpload}
              />
              <label 
                htmlFor="resume-upload"
                className="inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
              >
                {isSaving ? 'Uploading...' : 'Choose File'}
              </label>
              
              {formData.resumeUrl && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-medium text-[13px]">
                  <CheckCircle2 size={16} /> Resume uploaded successfully!
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleBack}
          className="w-full bg-[#6D5DF6] hover:bg-[#5a4add] text-white font-bold py-3.5 rounded-xl transition-colors"
        >
          Save & Continue
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 flex flex-col h-full overflow-y-auto scrollbar-hide">
          {currentStep ? renderFormStep() : renderChecklist()}
        </div>
      </div>
    </div>
  );
}
