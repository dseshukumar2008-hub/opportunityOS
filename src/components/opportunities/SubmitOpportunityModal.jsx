import { useState } from 'react';
import { X, Send, Link as LinkIcon, Building2, MapPin, Briefcase, Plus, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export default function SubmitOpportunityModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    type: 'Job',
    description: '',
    country: '',
    deadline: '',
    applyUrl: '',
    logoUrl: '',
    skills: []
  });

  const [skillInput, setSkillInput] = useState('');

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.organization || !formData.applyUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'pending_opportunities'), {
        ...formData,
        source: 'Community',
        status: 'pending',
        submittedBy: user?.uid || 'anonymous',
        createdAt: serverTimestamp()
      });
      
      toast.success('Opportunity submitted! It will be reviewed by an admin.');
      onClose();
    } catch (error) {
      console.error('Error submitting opportunity:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Submit Opportunity</h2>
            <p className="text-sm text-slate-500 mt-1">Help the community discover new roles.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="opportunity-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Job Title *</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10"
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Organization / Company *</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10"
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Type *</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10 font-medium"
                >
                  <option value="Job">Job</option>
                  <option value="Internship">Internship</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Competition">Competition</option>
                  <option value="Scholarship">Scholarship</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Country / Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10"
                    placeholder="e.g. United States or Remote"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10 resize-none"
                placeholder="Details about the opportunity..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Skills Required</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10"
                  placeholder="e.g. React, Python"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-[#F4F2FF] text-[#6C4CF1] text-sm font-semibold rounded-lg flex items-center gap-2"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-[#5a4add]">
                        <XCircle size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Application URL *</label>
                <div className="relative">
                  <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    required
                    value={formData.applyUrl}
                    onChange={e => setFormData({ ...formData, applyUrl: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Logo URL (Optional)</label>
              <div className="relative">
                <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6C4CF1] focus:ring-4 focus:ring-[#6C4CF1]/10"
                  placeholder="https://.../logo.png"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-slate-50">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="opportunity-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#6D5DF6] hover:bg-[#5a4add] disabled:bg-slate-300 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-[#6D5DF6]/20"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Opportunity'}
            {!isSubmitting && <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
