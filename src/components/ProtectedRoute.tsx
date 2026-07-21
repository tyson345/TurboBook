import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/portal'} replace />;
  }
  return <>{children}</>;
}
