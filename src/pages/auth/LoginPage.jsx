import { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Sparkles, Check } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showNoAccountModal, setShowNoAccountModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isLoading) return;
    setError(null);
    setIsGoogleLoading(true);
    
    try {
      await loginWithGoogle();
      toast.success('Successfully logged in with Google!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Google Login error:", err);
      if (err.code === 'auth/popup-blocked') {
        toast.error('Your browser blocked the Google sign-in popup. Please allow popups and try again.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        toast.error('Google sign-in was cancelled.');
      } else if (err.code === 'auth/network-request-failed') {
        toast.error('Network connection lost. Please try again.');
      } else {
        toast.error('Something went wrong while signing in with Google.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || isGoogleLoading) return;
    setError(null);
    
    if (!email || !email.includes('@')) {
      setError({ message: 'Please enter a valid email address.' });
      return;
    }
    if (!password) {
      setError({ message: 'Please enter your password.' });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      const errorCode = err.code || '';
      
      if (
        errorCode === 'auth/invalid-credential' || 
        errorCode === 'auth/user-not-found' || 
        errorCode === 'auth/wrong-password' ||
        err.message === 'Invalid login credentials'
      ) {
        try {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods.length > 0) {
            setError({
              title: "Incorrect Password",
              message: "The password you entered is incorrect. Please try again."
            });
          } else {
            setShowNoAccountModal(true);
          }
        } catch (fetchErr) {
          console.error("Fetch methods error:", fetchErr);
          setError({
            message: getFriendlyErrorMessage(errorCode)
          });
        }
      } else {
        setError({ message: getFriendlyErrorMessage(errorCode) });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-slate-100">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
              <div className="flex flex-col">
                {error.title && <span className="text-sm text-red-800 font-bold">{error.title}</span>}
                <span className="text-sm text-red-600 font-medium">{error.message}</span>
              </div>
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
                disabled={isLoading || isGoogleLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2.5 border ${error && !email ? 'border-red-300 ring-red-100' : 'border-slate-200 focus:ring-indigo-100'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="you@university.edu"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-900">
                Password
              </label>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading || isGoogleLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2.5 border ${error && !password ? 'border-red-300 ring-red-100' : 'border-slate-200 focus:ring-indigo-100'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#6C4CF1] hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign in'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button type="button" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading} className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-slate-200 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                    <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                    <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showNoAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white/90 backdrop-blur-xl rounded-[24px] shadow-[0_32px_64px_rgba(108,76,241,0.15)] border border-white/50 w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
            {/* Ambient glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="p-8 relative z-10 flex flex-col items-center text-center">
              {/* Illustration */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8168f8] to-[#5136db] flex items-center justify-center shadow-[0_8px_16px_rgba(108,76,241,0.3)] mb-6">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">You're almost there! ✨</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Create your OpportunityOS account to personalize your dashboard, organize your career journey, and unlock AI-powered career tools.
              </p>
              
              {/* Benefits */}
              <div className="w-full bg-slate-50/80 rounded-2xl p-4 mb-8 space-y-3 text-left">
                {[
                  "Personalized Dashboard",
                  "AI-Powered Career Tools",
                  "Organized Career Journey"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-200 transition-transform">
                      <Check className="w-3.5 h-3.5 text-[#6C4CF1]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-3 w-full">
                <button
                  type="button"
                  onClick={() => navigate('/signup', { state: { email } })}
                  className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-[#6C4CF1] to-[#8168f8] rounded-xl shadow-[0_8px_16px_rgba(108,76,241,0.25)] hover:shadow-[0_12px_20px_rgba(108,76,241,0.3)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  Create Free Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowNoAccountModal(false)}
                  className="w-full py-3 px-4 text-sm font-medium text-slate-500 hover:text-slate-800 hover:underline transition-colors bg-transparent"
                >
                  Use Another Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
