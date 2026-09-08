import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2} from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { analyticsService } from '../../services/analyticsService';


export default function SignupPage() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: location.state?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/dashboard';

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    
    // Robust email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    
    try {
      const userType = 'student';
      await signup(trimmedEmail, formData.password, trimmedName, userType);
      analyticsService.trackEvent('Sign Up', { userType });
      setSuccess(true);
      setTimeout(() => navigate(from, { replace: true }), 2000);
    } catch (err) {
      console.error("Signup Error:", err);
      const errorCode = err.code || '';
      if (err.message.includes('User already registered') || errorCode === 'auth/email-already-in-use') {
         setError('This email is already registered.');
      } else {
         setError('An error occurred during signup. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="bg-white py-12 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-slate-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="text-green-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
          <p className="text-slate-600 mb-8">
            Your account has been successfully created. Logging you in...
          </p>
          <Link to={from} replace className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#6C4CF1] hover:bg-indigo-700 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sign Up - OpportunityOS</title>
        <meta name="description" content="Create your free OpportunityOS account and unlock AI-powered career tools to build resumes, analyze skill gaps, and achieve your goals." />
        <link rel="canonical" href="https://opportunityos.app/signup" />
      </Helmet>
      <AuthLayout>
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>

            {error && (
              <div id="signup-error" role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={50}
                disabled={isLoading}
                value={formData.name}
                onChange={handleChange}
                aria-invalid={error.includes('name') ? 'true' : 'false'}
                aria-describedby={error ? 'signup-error' : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 border ${error.includes('name') ? 'border-red-300 ring-red-100' : 'border-slate-200 focus:ring-indigo-100'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-1.5">
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
                maxLength={100}
                disabled={isLoading}
                value={formData.email}
                onChange={handleChange}
                aria-invalid={error.includes('email') ? 'true' : 'false'}
                aria-describedby={error ? 'signup-error' : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 border ${error.includes('email') ? 'border-red-300 ring-red-100' : 'border-slate-200 focus:ring-indigo-100'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="you@university.edu"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                maxLength={128}
                disabled={isLoading}
                value={formData.password}
                onChange={handleChange}
                aria-invalid={error.includes('Password') || error.includes('characters') ? 'true' : 'false'}
                aria-describedby={error ? 'signup-error' : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 border ${error.includes('Password') || error.includes('characters') ? 'border-red-300 ring-red-100' : 'border-slate-200 focus:ring-indigo-100'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                maxLength={128}
                disabled={isLoading}
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-invalid={error.includes('match') ? 'true' : 'false'}
                aria-describedby={error ? 'signup-error' : undefined}
                className={`block w-full pl-10 pr-3 py-2.5 border ${error.includes('match') ? 'border-red-300 ring-red-100' : 'border-slate-200 focus:ring-indigo-100'} rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#6C4CF1] hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            By signing up, you agree to our <Link to="#" className="underline hover:text-slate-700">Terms of Service</Link> and <Link to="#" className="underline hover:text-slate-700">Privacy Policy</Link>.
          </p>
        </form>
      </div>
      </AuthLayout>
    </>
  );
}
