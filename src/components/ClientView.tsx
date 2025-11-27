import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Download, 
  Mail, 
  Phone,
  MapPin,
  User,
  CreditCard,
  LogOut
} from 'lucide-react';

interface ClientViewProps {
  userData: any;
  onLogout: () => void;
}

export function ClientView({ userData, onLogout }: ClientViewProps) {
  // Datos de ejemplo del caso del cliente
  const caseData = {
    caseId: userData.contractNumber || 'CASO-001',
    status: 'completed', // 'in-progress' | 'completed' | 'rejected'
    currentStep: 7,
    totalSteps: 7,
    startDate: '2025-11-05 10:15',
    completionDate: '2025-11-05 10:26',
    duration: '11 minutos',
    contractNumber: 'CONT-2025-001',
    advisor: 'Juan Pérez',
    creditScore: 720,
  };

  const steps = [
    { id: 1, name: 'Validación de Identidad', completed: true, timestamp: '10:16', status: 'success' },
    { id: 2, name: 'Enrolamiento', completed: true, timestamp: '10:18', status: 'success' },
    { id: 3, name: 'Documentos', completed: true, timestamp: '10:20', status: 'success' },
    { id: 4, name: 'Validación Crediticia', completed: true, timestamp: '10:22', status: 'success' },
    { id: 5, name: 'Generación de Contrato', completed: true, timestamp: '10:24', status: 'success' },
    { id: 6, name: 'Firma Digital', completed: true, timestamp: '10:25', status: 'success' },
    { id: 7, name: 'Finalización', completed: true, timestamp: '10:26', status: 'success' },
  ];

  const documents = [
    { id: 1, name: 'Contrato de Servicios Telco', type: 'Contrato Principal', size: '2.4 MB', date: '2025-11-05' },
    { id: 2, name: 'Términos y Condiciones', type: 'Anexo', size: '1.2 MB', date: '2025-11-05' },
    { id: 3, name: 'Política de Privacidad', type: 'Anexo', size: '850 KB', date: '2025-11-05' },
  ];

  const progress = (caseData.currentStep / caseData.totalSteps) * 100;

  const getStatusBadge = () => {
    if (caseData.status === 'completed') {
      return <Badge className="bg-green-600">Completado</Badge>;
    } else if (caseData.status === 'in-progress') {
      return <Badge className="bg-blue-600">En Proceso</Badge>;
    } else {
      return <Badge className="bg-red-600">Rechazado</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-slate-900">Portal del Cliente</h1>
            <p className="text-slate-600">Telecomunicaciones Konrad Lorenz</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-slate-900">{userData.name}</p>
              <p className="text-slate-600">{userData.documentNumber}</p>
            </div>
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white">
              {userData.name.charAt(0)}
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="mb-2">¡Bienvenido, {userData.name.split(' ')[0]}!</h2>
          <p className="text-blue-100">
            Aquí puedes consultar el estado de tu solicitud y descargar tus documentos
          </p>
        </div>

        {/* Case Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-600">Estado del Caso</CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-600">Número de Caso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-900 font-mono">{caseData.caseId}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-600">Tiempo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-900">{caseData.duration}</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Progreso del Proceso</CardTitle>
            <p className="text-slate-600">Tu solicitud ha completado todas las etapas</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Progreso General</span>
                <span className="text-slate-900">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-600' : 'bg-slate-200'
                    }`}>
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                          {step.name}
                        </p>
                        {step.completed && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>{step.timestamp}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`ml-5 h-8 w-0.5 ${
                      step.completed ? 'bg-green-600' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-600">Nombre Completo</p>
                    <p className="text-slate-900">{userData.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-600">Documento</p>
                    <p className="text-slate-900">{userData.documentNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-600">Correo Electrónico</p>
                    <p className="text-slate-900">{userData.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-600">Teléfono</p>
                    <p className="text-slate-900">{userData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-600">Asesor Asignado</p>
                    <p className="text-slate-900">{caseData.advisor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-600">Score Crediticio</p>
                    <p className="text-slate-900">{caseData.creditScore}/850</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Detalles del Contrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="text-slate-600">Número de Contrato</p>
                <p className="text-slate-900 font-mono">{caseData.contractNumber}</p>
              </div>
              <div>
                <p className="text-slate-600">Fecha de Inicio</p>
                <p className="text-slate-900">{caseData.startDate}</p>
              </div>
              <div>
                <p className="text-slate-600">Fecha de Finalización</p>
                <p className="text-slate-900">{caseData.completionDate}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-slate-900 mb-4">Documentos Disponibles</h3>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-slate-900">{doc.name}</p>
                        <p className="text-slate-600">{doc.type} • {doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white">1</span>
              </div>
              <div>
                <p className="text-slate-900">Recibirás un correo de confirmación</p>
                <p className="text-slate-600">En las próximas 24 horas recibirás toda la información de activación</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white">2</span>
              </div>
              <div>
                <p className="text-slate-900">Instalación y activación</p>
                <p className="text-slate-600">Un técnico se comunicará contigo para coordinar la instalación</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white">3</span>
              </div>
              <div>
                <p className="text-slate-900">¡Disfruta tus servicios!</p>
                <p className="text-slate-600">Comienza a disfrutar de telefonía, TV e internet de alta velocidad</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">¿Necesitas Ayuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Phone className="w-6 h-6 text-blue-600" />
                <span>Línea de Atención</span>
                <span className="text-slate-600">01-8000-123-456</span>
              </Button>

              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Mail className="w-6 h-6 text-blue-600" />
                <span>Correo Electrónico</span>
                <span className="text-slate-600">soporte@konrad.com</span>
              </Button>

              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                <span>Oficinas</span>
                <span className="text-slate-600">Bogotá, Colombia</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
