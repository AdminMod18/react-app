import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { HomePage } from './components/HomePage';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { CasesList } from './components/CasesList';
import { NewCase } from './components/NewCase';
import { AuditLog } from './components/AuditLog';
import { ClientView } from './components/ClientView';
import { AppLayout } from './components/Layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { userType, userData, isAuthenticated, login, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Ruta pública - HomePage */}
        <Route 
          path="/" 
          element={<HomePage isAuthenticated={isAuthenticated} />} 
        />

        {/* Ruta pública - Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              userType === 'client' ? (
                <Navigate to="/client" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Login onLogin={login} />
            )
          } 
        />

        {/* Rutas protegidas para Asesores */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              requiredUserType="advisor" 
              userType={userType}
            >
              <AppLayout userData={userData!} onLogout={handleLogout}>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cases"
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              requiredUserType="advisor" 
              userType={userType}
            >
              <AppLayout userData={userData!} onLogout={handleLogout}>
                <CasesList onSelectCase={() => {}} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-case"
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              requiredUserType="advisor" 
              userType={userType}
            >
              <AppLayout userData={userData!} onLogout={handleLogout}>
                <NewCase />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit"
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              requiredUserType="advisor" 
              userType={userType}
            >
              <AppLayout userData={userData!} onLogout={handleLogout}>
                <AuditLog />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para Clientes */}
        <Route
          path="/client"
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              requiredUserType="client" 
              userType={userType}
            >
              <ClientView userData={userData!} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 - Redirigir al home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
