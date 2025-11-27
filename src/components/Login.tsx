import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { UserCircle, Briefcase, AlertCircle, Lock, Mail, Home } from 'lucide-react';

interface LoginProps {
  onLogin: (userType: 'advisor' | 'client', userData: any) => void;
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [advisorData, setAdvisorData] = useState({
    email: '',
    password: '',
  });
  const [clientData, setClientData] = useState({
    documentNumber: '',
    contractNumber: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Obtener la ruta de retorno si existe
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleAdvisorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Credenciales de demo
    if (advisorData.email === 'asesor@konrad.com' && advisorData.password === 'demo123') {
      onLogin('advisor', {
        name: 'Juan Pérez',
        email: advisorData.email,
        role: 'Asesor de Ventas',
        id: 'ASE-001',
      });
    } else if (advisorData.email === 'supervisor@konrad.com' && advisorData.password === 'demo123') {
      onLogin('advisor', {
        name: 'Ana López',
        email: advisorData.email,
        role: 'Supervisor',
        id: 'SUP-001',
      });
    } else {
      setError('Credenciales incorrectas. Usa: asesor@konrad.com / demo123');
    }

    setIsLoading(false);
  };

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validación de demo
    if (clientData.documentNumber.length >= 6) {
      onLogin('client', {
        name: 'María García López',
        documentNumber: clientData.documentNumber,
        contractNumber: clientData.contractNumber || 'CASO-001',
        email: 'maria.garcia@email.com',
        phone: '3001234567',
      });
    } else {
      setError('Por favor ingresa un número de documento válido (mínimo 6 dígitos)');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Botón Volver al Inicio */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Volver al Inicio
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Branding Section */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            <h1 className="text-slate-900">
              BPMS Telecomunicaciones<br />Konrad Lorenz
            </h1>
            <p className="text-slate-600">
              Sistema de Gestión de Procesos de Venta Digital
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-slate-900">Proceso 100% Digital</p>
                <p className="text-slate-600">Sin uso de papel, con trazabilidad completa</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-900">Seguridad Garantizada</p>
                <p className="text-slate-600">Cifrado end-to-end y cumplimiento legal</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-900">Tiempo Promedio: 12 min</p>
                <p className="text-slate-600">Proceso optimizado de principio a fin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-900">Iniciar Sesión</CardTitle>
            <CardDescription>Accede al sistema como asesor o cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="advisor" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="advisor" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Asesor
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Cliente
                </TabsTrigger>
              </TabsList>

              {/* Advisor Login */}
              <TabsContent value="advisor">
                <form onSubmit={handleAdvisorLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="advisor-email">Correo Electrónico</Label>
                    <Input
                      id="advisor-email"
                      type="email"
                      placeholder="tu-email@konrad.com"
                      value={advisorData.email}
                      onChange={(e) => setAdvisorData({ ...advisorData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="advisor-password">Contraseña</Label>
                    <Input
                      id="advisor-password"
                      type="password"
                      placeholder="••••••••"
                      value={advisorData.password}
                      onChange={(e) => setAdvisorData({ ...advisorData, password: e.target.value })}
                      required
                    />
                  </div>

                  {error && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-900">
                      <strong>Demo:</strong> asesor@konrad.com / demo123<br />
                      <strong>Supervisor:</strong> supervisor@konrad.com / demo123
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Autenticando...' : 'Ingresar como Asesor'}
                  </Button>
                </form>
              </TabsContent>

              {/* Client Login */}
              <TabsContent value="client">
                <form onSubmit={handleClientLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="document-number">Número de Documento</Label>
                    <Input
                      id="document-number"
                      type="text"
                      placeholder="Ej: 1234567890"
                      value={clientData.documentNumber}
                      onChange={(e) => setClientData({ ...clientData, documentNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contract-number">
                      Número de Caso/Contrato (Opcional)
                    </Label>
                    <Input
                      id="contract-number"
                      type="text"
                      placeholder="Ej: CASO-001"
                      value={clientData.contractNumber}
                      onChange={(e) => setClientData({ ...clientData, contractNumber: e.target.value })}
                    />
                  </div>

                  {error && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-900">
                      <strong>Demo:</strong> Ingresa cualquier número de documento de 6+ dígitos
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Verificando...' : 'Consultar Mi Caso'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
