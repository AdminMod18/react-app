import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Info } from 'lucide-react';
import { isDemoMode } from '../services/config';

export function ApiModeIndicator() {
  const isDemo = isDemoMode();

  if (isDemo) {
    return (
      <Alert className="bg-amber-50 border-amber-200 mb-4">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
              MODO DEMO
            </Badge>
            <span>
              El sistema está usando datos simulados. Para conectar APIs reales, configura <code className="bg-amber-100 px-1 rounded">/services/config.ts</code>
          </span>
        </div>
      </AlertDescription>
    </Alert>
    );
  }

  // Modo Producción
  return (
    <Alert className="bg-blue-50 border-blue-300 mb-4">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-900">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-400">
            🚀 MODO PRODUCTION
          </Badge>
          <span>
            Emails reales activados con Microsoft Graph. Ver estado en <code className="bg-blue-100 px-1 rounded">Dashboard</code>
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
}
