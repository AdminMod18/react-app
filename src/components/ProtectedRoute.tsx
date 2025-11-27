import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  isAuthenticated: boolean;
  requiredUserType?: 'advisor' | 'client';
  userType?: 'advisor' | 'client' | null;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  isAuthenticated, 
  requiredUserType,
  userType,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    // Si es cliente intentando acceder a rutas de asesor, redirigir a vista de cliente
    if (userType === 'client') {
      return <Navigate to="/client" replace />;
    }
    // Si es asesor intentando acceder a vista de cliente, redirigir a dashboard
    if (userType === 'advisor') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
