import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Activity, LayoutDashboard, FolderOpen, ClipboardList, LogOut, Home } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  userData: {
    name: string;
    role?: string;
  };
  onLogout: () => void;
}

export function AppLayout({ children, userData, onLogout }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/cases', name: 'Casos', icon: FolderOpen },
    { path: '/new-case', name: 'Nueva Venta', icon: Activity },
    { path: '/audit', name: 'Auditoría', icon: ClipboardList },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Home className="w-5 h-5 text-blue-600" />
            </button>
            <div className="border-l border-slate-300 h-8" />
            <div>
              <h1 className="text-slate-900">BPMS Telecomunicaciones Konrad Lorenz</h1>
              <p className="text-slate-600">Sistema de Gestión de Procesos de Venta</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-slate-900">{userData.name}</p>
              <p className="text-slate-600">{userData.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              {userData.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
                    ${active 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}
