// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { X, Users, Tag, AlignLeft, LayoutGrid, CheckCircle, Image as ImageIcon, Shield, Globe, Lock } from 'lucide-react';
import { useTeam } from '../../contexts/TeamContext';
import toast from 'react-hot-toast';

export default function CreateTeamModal({ onClose }) {
  const { createTeam } = useTeam();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Hackathon',
    maxMembers: 4,
    visibility: 'Public', // 'Public' or 'Private'
    logo: null
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  
  const fileInputRef = useRef(null);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  // Skill Chip Logic
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    
    if (trimmed.length > 30) {
      toast.error('Skill name is too long (max 30 chars)');
      return;
    }
    
    if (skills.length >= 10) {
      toast.error('You can only add up to 10 required skills');
      return;
    }
    
    if (!skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // Image Upload Logic
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for localStorage safety
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Team Name is required');
      return;
    }
    if (formData.name.trim().length > 80) {
      toast.error('Team Name must be 80 characters or less');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Team Description is required');
      return;
    }
    if (formData.description.trim().length > 500) {
      toast.error('Team Description must be 500 characters or less');
      return;
    }
    if (parseInt(formData.maxMembers) < 2 || parseInt(formData.maxMembers) > 20) {
      toast.error('Team size must be between 2 and 20 members');
      return;
    }
    if (skills.length === 0) {
      toast.error('Please add at least one required skill');
      return;
    }
    if (skills.length > 10) {
      toast.error('Maximum 10 required skills allowed');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const teamData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        requiredSkills: skills,
        maxMembers: parseInt(formData.maxMembers),
        visibility: formData.visibility,
        logo: formData.logo
      };

      await createTeam(teamData);
      // Removed duplicate toast.success since TeamContext already triggers it
      onClose();
    } catch (err) {
      // Removed duplicate toast.error since TeamContext already triggers it
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white rounded-t-[24px] sticky top-0 z-10">
          <div>
            <h2 className="text-[18px] font-extrabold text-slate-900">Create New Team</h2>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">Fill in the details to start recruiting members.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-6">
            
            {/* Logo Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-700">Team Logo (Optional)</label>
              <div className="flex items-center gap-4">
                <div 
                  className={`w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0 ${
                    formData.logo ? 'border-[#6C4CF1]' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  {formData.logo ? (
                    <img src={formData.logo} alt="Team Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={20} className="text-slate-400" />
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-bold rounded-lg transition-colors"
                    >
                      {formData.logo ? 'Change Logo' : 'Upload Logo'}
                    </button>
                    {formData.logo && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-[12px] font-bold rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Recommended size: 256x256px. Max 2MB.</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>
            </div>

            {/* Team Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                <Users size={14} className="text-[#6C4CF1]" /> Team Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={80}
                placeholder="e.g. AI Innovators"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium focus:bg-white focus:border-[#6C4CF1] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              />
            </div>

            {/* Category & Max Members Row */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                  <LayoutGrid size={14} className="text-[#6C4CF1]" /> Category
                </label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 focus:bg-white focus:border-[#6C4CF1] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none appearance-none"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Startup">Startup</option>
                  <option value="Project">Project</option>
                  <option value="Competition">Competition</option>
                  <option value="Open Source">Open Source</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
                <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Users size={14} className="text-[#6C4CF1]" /> Capacity
                </label>
                <input 
                  type="number" 
                  name="maxMembers"
                  min="2"
                  max="20"
                  value={formData.maxMembers}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 focus:bg-white focus:border-[#6C4CF1] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                />
              </div>
            </div>

            {/* Required Skills (Multi-select) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                <Tag size={14} className="text-[#6C4CF1]" /> Required Skills <span className="text-red-500">*</span>
              </label>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    maxLength={30}
                    placeholder="e.g. React, Python (Press Enter to add)"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium focus:bg-white focus:border-[#6C4CF1] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  />
                  <button 
                    type="button"
                    onClick={addSkill}
                    disabled={!skillInput.trim()}
                    className="btn-secondary px-4 py-2.5 text-[13px] disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                
                {/* Skill Chips */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {skills.map(skill => (
                      <div key={skill} className="flex items-center gap-1 bg-indigo-50 text-[#6C4CF1] border border-indigo-100 px-3 py-1.5 rounded-lg text-[12px] font-bold">
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => removeSkill(skill)}
                          className="text-[#6C4CF1] hover:text-indigo-800 ml-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                <AlignLeft size={14} className="text-[#6C4CF1]" /> Team Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                placeholder="What is your team building? Who are you looking for? (Max 500 characters)"
                rows={4}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium focus:bg-white focus:border-[#6C4CF1] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
              />
            </div>

            {/* Visibility Toggle */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <label className="text-[13px] font-bold text-slate-700 flex items-center gap-1.5">
                <Shield size={14} className="text-[#6C4CF1]" /> Team Visibility
              </label>
              
              <div className="flex items-center gap-4 mt-1">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, visibility: 'Public' }))}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${
                    formData.visibility === 'Public' 
                      ? 'border-[#6C4CF1] bg-indigo-50/50' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <Globe size={20} className={formData.visibility === 'Public' ? 'text-[#6C4CF1]' : 'text-slate-400'} />
                  <div className="text-center">
                    <span className={`block text-[13px] font-bold ${formData.visibility === 'Public' ? 'text-[#6C4CF1]' : 'text-slate-700'}`}>Public</span>
                    <span className="block text-[11px] font-medium text-slate-500 mt-0.5">Discoverable by anyone</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, visibility: 'Private' }))}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${
                    formData.visibility === 'Private' 
                      ? 'border-[#6C4CF1] bg-indigo-50/50' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <Lock size={20} className={formData.visibility === 'Private' ? 'text-[#6C4CF1]' : 'text-slate-400'} />
                  <div className="text-center">
                    <span className={`block text-[13px] font-bold ${formData.visibility === 'Private' ? 'text-[#6C4CF1]' : 'text-slate-700'}`}>Private</span>
                    <span className="block text-[11px] font-medium text-slate-500 mt-0.5">Invite only</span>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-secondary px-5 py-2.5 text-[13px] disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-2.5 text-[13px] flex items-center gap-2 shadow-[0_4px_12px_-4px_rgba(108,76,241,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Create Team
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
