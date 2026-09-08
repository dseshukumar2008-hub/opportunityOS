import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Route guard that only allows users with user_type === 'admin' to proceed.
 * Redirects all other authenticated users to the dashboard.
 * This works in conjunction with AuthContext reading user_type from Firestore.
 */
export default function AdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (user.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
