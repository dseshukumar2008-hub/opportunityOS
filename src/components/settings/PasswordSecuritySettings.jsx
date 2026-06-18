import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function PasswordSecuritySettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ new: '', confirm: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSave = async () => {
    if (form.new !== form.confirm) {
      toast.error('New password and confirm password do not match');
      return;
    }
    if (form.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: form.new });
      if (error) throw error;
      toast.success('Password updated successfully');
      setForm({ new: '', confirm: '' });
    } catch (err) {
      console.error('Failed to update password:', err);
      toast.error(err.message || 'Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast.error('Email not found for the current user');
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) throw error;
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (err) {
      console.error('Failed to send password reset:', err);
      toast.error(err.message || 'Failed to send password reset');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="card-standard p-8"
    >
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F3F0FF] text-[#6C4CF1] flex items-center justify-center shrink-0">
            <Lock size={24} />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-sl  ate-900">Password & Security</h2>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">Ensure your account stays secure.</p>
          </div>
        </div>
        
        <button 
          onClick={handleResetPassword}
          disabled={isResetting}
          className="btn-secondary h-[40px] px-6 text-[13px] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResetting ? <Loader2 size={16} className="animate-spin" /> : null}
          {isResetting ? 'Sending...' : 'Reset Password'}
        </button>
      </div>

      <div className="max-w-md space-y-5">
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-2">New Password</label>
          <input 
            type="password" 
            value={form.new}
            onChange={e => setForm({...form, new: e.target.value})}
            className="w-full h-[48px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-2">Confirm New Password</label>
          <input 
            type="password" 
            value={form.confirm}
            onChange={e => setForm({...form, confirm: e.target.value})}
            className="w-full h-[48px] px-4 bg-white border border-slate-200 focus:border-[#6C4CF1] rounded-xl text-[14px] outline-none transition-all text-slate-700"
          />
        </div>
        
        <div className="pt-4">
          <button 
            onClick={handleSave}
            disabled={isUpdating || !form.new || !form.confirm}
            className="px-6 py-2.5 text-[14px] font-bold text-white bg-[#6C4CF1] hover:bg-[#5b3fda] rounded-xl transition-all shadow-[0_2px_10px_rgba(108,76,241,0.25)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? <Loader2 size={16} className="animate-spin" /> : null}
            {isUpdating ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
