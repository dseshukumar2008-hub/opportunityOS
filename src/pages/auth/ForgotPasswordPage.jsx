import { useState, useEffect } from 'react';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setCountdown(30);
    } catch (err) {
      console.error(err);
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-slate-100 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center py-2"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="text-green-600 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Reset Link Sent!</h2>
              
              <div className="text-slate-600 mb-8 text-sm space-y-4 text-left bg-slate-50 p-5 rounded-xl border border-slate-100 w-full">
                <p className="font-medium text-slate-700">
                  We've sent a secure password reset link to your email address.
                </p>
                <p className="font-medium text-slate-700">
                  Please check your Inbox and Spam folder.
                </p>
              </div>
              
              <div className="w-full space-y-3">
                <Link to="/login" className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#6C4CF1] hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all">
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
                
                <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500 mb-3">Didn't receive the email?</p>
                  <button
                    onClick={handleSubmit}
                    disabled={countdown > 0 || isLoading}
                    className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : (countdown > 0 ? `Available in ${countdown}s` : 'Resend Email')}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                  Reset your password
                </h2>
                <p className="text-sm text-slate-500">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${error ? 'border-red-300 ring-red-100' : 'border-slate-200 focus:ring-indigo-100'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="you@university.edu"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#6C4CF1] hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send reset link'}
                  </button>
                </div>
              </form>

              <div className="mt-8 flex justify-center">
                <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  <ArrowLeft size={16} />
                  Back to login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}
