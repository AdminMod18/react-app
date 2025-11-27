import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle2, FileText, Mail, Database, Clock, Download, Loader2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { sendContractEmail, generateDemoPDF, getEmailPreview, type ContractEmailData } from '../../services/gmail-email';
import { toast } from 'sonner';

interface Props {
  data: any;
  onReset: () => void;
}

export function CaseComplete({ data, onReset }: Props) {
  const caseNumber = `CASO-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  const completionTime = Math.floor(Math.random() * 5) + 10; // 10-14 min
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState('');

  // Enviar email automáticamente al montar el componente
  useEffect(() => {
    sendEmail();
  }, []);

  const sendEmail = async () => {
    setIsSendingEmail(true);

    try {
      // Preparar datos del email
      const emailData: ContractEmailData = {
        clientName: `${data.firstName} ${data.lastName}`,
        clientEmail: data.email,
        documentNumber: data.documentNumber,
        contractNumber: data.contract?.contractNumber || 'N/A',
        serviceName: data.serviceName || 'Servicio Telco',
        servicePrice: data.servicePrice || 0,
        serviceFeatures: data.serviceDetails?.features || [
          'Servicio de alta calidad',
          'Soporte técnico 24/7',
          'Instalación incluida',
        ],
        activationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        monthlyPaymentDate: '5',
        attachments: {
          contract: generateDemoPDF('contract'),
          termsAndConditions: generateDemoPDF('terms'),
          identityDocument: data.documentPhoto ? data.documentPhoto.split(',')[1] : generateDemoPDF('identity'),
          proofOfAddress: data.addressProof ? data.addressProof.split(',')[1] : generateDemoPDF('address'),
        },
      };

      // Enviar el email
      const success = await sendContractEmail(emailData);

      if (success) {
        setEmailSent(true);
        toast.success('Correo enviado exitosamente', {
          description: `Contrato enviado a ${data.email}`,
        });
      } else {
        toast.error('Error al enviar correo', {
          description: 'No se pudo enviar el correo de confirmación',
        });
      }
    } catch (error) {
      console.error('Error enviando email:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      let toastDescription = 'No se pudo enviar el correo de confirmación';
      
      // Detectar errores comunes y dar sugerencias
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        toastDescription = 'Error de conexión. Para desarrollo, usa modo DEMO en /services/config.ts';
      } else if (errorMessage.includes('Invalid credentials')) {
        toastDescription = 'Credenciales inválidas. Verifica la configuración del servicio de email.';
      } 
      toast.error('Error al enviar correo', {
        description: toastDescription,
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handlePreviewEmail = () => {
    const emailData: ContractEmailData = {
      clientName: `${data.firstName} ${data.lastName}`,
      clientEmail: data.email,
      documentNumber: data.documentNumber,
      contractNumber: data.contract?.contractNumber || 'N/A',
      serviceName: data.serviceName || 'Servicio Telco',
      servicePrice: data.servicePrice || 0,
      serviceFeatures: data.serviceDetails?.features || ['Servicio de alta calidad'],
      activationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO'),
      monthlyPaymentDate: '5',
      attachments: {},
    };

    const html = getEmailPreview(emailData);
    setEmailPreviewHtml(html);
    setShowEmailPreview(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-slate-900">8. Caso Completado Exitosamente</CardTitle>
            <p className="text-slate-600">El proceso de venta ha finalizado correctamente</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-slate-900">Número de Caso</span>
            </div>
            <p className="font-mono text-green-900">{caseNumber}</p>
          </div>

          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-slate-900">Tiempo Total</span>
            </div>
            <p className="text-blue-900">{completionTime} minutos</p>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-slate-50">
          <h3 className="text-slate-900 mb-4">Resumen del Cliente</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Cliente:</span>
              <span className="text-slate-900">{data.firstName} {data.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Documento:</span>
              <span className="text-slate-900">{data.documentNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Email:</span>
              <span className="text-slate-900">{data.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Teléfono:</span>
              <span className="text-slate-900">{data.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Número de Contrato:</span>
              <span className="text-slate-900 font-mono">{data.contract?.contractNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Score Crediticio:</span>
              <span className="text-slate-900">{data.creditValidation?.data?.score || data.creditValidation?.score}</span>
            </div>
            {data.serviceName && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-600">Plan Contratado:</span>
                  <span className="text-slate-900">{data.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Valor Mensual:</span>
                  <span className="text-slate-900">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                    }).format(data.servicePrice)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-slate-900">Acciones Completadas</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-slate-900">Contrato Firmado</p>
                <p className="text-slate-600">Firma digital registrada con sello de tiempo</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-lg border ${
              emailSent ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
            }`}>
              {isSendingEmail ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : (
                <Mail className={`w-5 h-5 ${emailSent ? 'text-green-600' : 'text-blue-600'}`} />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-slate-900">
                    {isSendingEmail ? 'Enviando Correo...' : emailSent ? 'Correo Certificado Enviado' : 'Preparando Correo'}
                  </p>
                
                </div>
                <p className="text-slate-600">
                  {isSendingEmail ? 'Adjuntando documentos y contrato' : `Contrato enviado a ${data.email}`}
                </p>
              </div>
              {emailSent && <CheckCircle2 className="w-5 h-5 text-green-600" />}
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Database className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-slate-900">Almacenado en ECM</p>
                <p className="text-slate-600">Contrato archivado con hash SHA-256</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-slate-900">Sincronización CRM</p>
                <p className="text-slate-600">Cliente actualizado en sistema RequestManager</p>
              </div>
            </div>
          </div>
        </div>

        {emailSent && (
          <Alert className="bg-green-50 border-green-200">
            <Mail className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>✉️ Email de Confirmación Enviado</strong><br />
              El cliente ha recibido un correo con:<br />
              • Contrato firmado digitalmente (PDF)<br />
              • Términos y condiciones (PDF)<br />
              • Copia de documentos de identidad y domicilio<br />
              • Detalles completos del servicio contratado<br />
              • Instrucciones de activación
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            <strong>✓ Meta Cumplida:</strong> El caso se completó en {completionTime} minutos, 
            dentro del objetivo de ≤15 minutos. Todos los documentos fueron procesados digitalmente 
            con trazabilidad 100%.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t">
          <Button className="w-full" onClick={onReset}>
            <FileText className="w-4 h-4 mr-2" />
            Iniciar Nueva Venta
          </Button>
          <Button variant="outline" className="w-full" onClick={handlePreviewEmail}>
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa del Email
          </Button>
          <Button variant="outline" className="w-full" onClick={sendEmail} disabled={isSendingEmail}>
            {isSendingEmail ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Reenviar Correo
              </>
            )}
          </Button>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Descargar Contrato
          </Button>
        </div>
      </CardContent>

      {/* Dialog de Vista Previa del Email */}
      <Dialog open={showEmailPreview} onOpenChange={setShowEmailPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Vista Previa del Email</DialogTitle>
            <DialogDescription>
              Así es como el cliente verá el correo de confirmación
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden">
            <iframe
              srcDoc={emailPreviewHtml}
              className="w-full h-[600px]"
              title="Email Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
