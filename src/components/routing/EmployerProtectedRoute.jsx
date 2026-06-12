import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function EmployerProtectedRoute({ children }) {
  const { isAuthenticated, isEmployer, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-[#6C4CF1] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmployer) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
