import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, Globe, MapPin, AlignLeft, Save, Camera, Loader2 } from 'lucide-react';
import { useEmployer } from '../../contexts/EmployerContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function CompanyProfile() {
  const { user } = useAuth();
  const { companyProfile, updateCompanyProfile } = useEmployer();
  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    industry: '',
    description: '',
    logo_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (companyProfile) {
      setFormData({
        company_name: companyProfile.company_name || '',
        website: companyProfile.website || '',
        industry: companyProfile.industry || '',
        description: companyProfile.description || '',
        logo_url: companyProfile.logo_url || ''
      });
    }
  }, [companyProfile]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoUpload = async (e) => {
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

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
      await updateCompanyProfile({ ...formData, logo_url: publicUrl });
      toast.success('Logo uploaded successfully');
    } catch (err) {
      console.error('Failed to upload logo:', err);
      toast.error(err.message || 'Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateCompanyProfile(formData);
    setIsSaving(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Company Profile</h1>
        <p className="text-slate-500 mt-1">Manage how your organization appears to candidates.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 group">
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                  <Loader2 size={20} className="animate-spin text-[#6C4CF1]" />
                </div>
              ) : formData.logo_url ? (
                <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building size={24} className="text-slate-400" />
              )}
              <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-colors">
                <Camera size={20} className="text-white" />
                <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleLogoUpload} disabled={isUploading} />
              </label>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{formData.company_name || 'Your Company Name'}</h2>
              <p className="text-sm text-slate-500">{formData.industry || 'Industry not set'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="company_name"
                  required
                  value={formData.company_name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Industry</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="e.g. Technology, Finance"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Website</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder="https://acme.com"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">About the Company</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <AlignLeft className="h-5 w-5 text-slate-400" />
                </div>
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 resize-none"
                  placeholder="Describe your company's mission, culture, and what you do..."
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#6C4CF1] hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
