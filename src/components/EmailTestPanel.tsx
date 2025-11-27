import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Mail, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { sendContractEmail, getEmailPreview, generateDemoPDF } from '../services/gmail-email';
import { API_MODE } from '../services/config';

export function EmailTestPanel() {
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      setResult({
        success: false,
        message: 'Por favor ingresa un correo electrónico',
      });
      return;
    }

    setIsSending(true);
    setResult(null);

    try {
      const emailData = {
        clientName: 'Usuario de Prueba',
        clientEmail: testEmail,
        documentNumber: '1234567890',
        contractNumber: `TEST-${Date.now()}`,
        serviceName: 'Plan Internet Fibra 500 Mbps + TV Premium',
        servicePrice: 129900,
        serviceFeatures: [
          '500 Mbps de velocidad simétrica',
          '200+ canales de TV en HD',
          'Netflix Premium incluido',
          'Router WiFi 6 de última generación',
          'Instalación y configuración gratuita',
          'Soporte técnico 24/7',
        ],
        activationDate: new Date().toLocaleDateString('es-CO'),
        monthlyPaymentDate: '15',
        attachments: {
          contract: generateDemoPDF('contract'),
          termsAndConditions: generateDemoPDF('terms'),
          identityDocument: generateDemoPDF('identity'),
          proofOfAddress: generateDemoPDF('address'),
        },
      };

      const success = await sendContractEmail(emailData);

      if (success) {
        setResult({
          success: true,
          message: API_MODE === 'DEMO' 
            ? 'Email de prueba simulado exitosamente. Revisa la consola del navegador.' 
            : `Email enviado exitosamente a ${testEmail}`,
        });
      } else {
        setResult({
          success: false,
          message: 'Error al enviar el email. Revisa la consola para más detalles.',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Detectar errores comunes y dar sugerencias
      let helpText = '';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        helpText = '\n\n💡 Sugerencia: Este error suele indicar problemas de CORS o credenciales inválidas. ' +
                   'Para desarrollo, cambia API_MODE a "DEMO" en /services/config.ts';
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        helpText = '\n\n💡 Sugerencia: Verifica las credenciales de Microsoft en /services/microsoft-email.ts';
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        helpText = '\n\n💡 Sugerencia: Verifica los permisos de API en Azure AD (Mail.Send debe estar otorgado)';
      } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
        helpText = '\n\n💡 Sugerencia: El usuario remitente no existe. Verifica senderEmail en /services/microsoft-email.ts';
      }
      
      setResult({
        success: false,
        message: `Error: ${errorMessage}${helpText}`,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleShowPreview = () => {
    const emailData = {
      clientName: 'Usuario de Prueba',
      clientEmail: testEmail || 'prueba@example.com',
      documentNumber: '1234567890',
      contractNumber: `PREVIEW-${Date.now()}`,
      serviceName: 'Plan Internet Fibra 500 Mbps + TV Premium',
      servicePrice: 129900,
      serviceFeatures: [
        '500 Mbps de velocidad simétrica',
        '200+ canales de TV en HD',
        'Netflix Premium incluido',
        'Router WiFi 6 de última generación',
        'Instalación y configuración gratuita',
        'Soporte técnico 24/7',
      ],
      activationDate: new Date().toLocaleDateString('es-CO'),
      monthlyPaymentDate: '15',
      attachments: {
        contract: '',
        termsAndConditions: '',
        identityDocument: '',
        proofOfAddress: '',
      },
    };

    const html = getEmailPreview(emailData);
    setPreviewHtml(html);
    setShowPreview(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Panel de Prueba de Correo Electrónico
          </CardTitle>
          <CardDescription>
            Prueba el servicio de envío de correos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Modo Actual */}
          <Alert className={API_MODE === 'DEMO' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}>
            <AlertDescription className={API_MODE === 'DEMO' ? 'text-blue-800' : 'text-green-800'}>
              <strong>Modo Actual:</strong> {API_MODE === 'DEMO' ? 'DEMO (Simulado)' : 'PRODUCCIÓN (Real)'}
              <br />
              {API_MODE === 'DEMO' 
                ? 'Los correos se simularán sin envío real. Cambia a PRODUCTION en /services/config.ts para envío real.'
                : 'Los correos se enviarán realmente usando apikey de gmail.'}
            </AlertDescription>
          </Alert>

          {/* Campo de Email */}
          <div className="space-y-2">
            <Label htmlFor="test-email">Correo Electrónico de Destino</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              disabled={isSending}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button
              onClick={handleSendTestEmail}
              disabled={isSending || !testEmail}
              className="flex-1"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Email de Prueba
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleShowPreview}
              disabled={isSending}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Vista Previa
            </Button>
          </div>

          {/* Resultado */}
          {result && (
            <Alert className={result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Información adicional */}
          <div className="pt-4 border-t">
            <p className="text-slate-600">
              <strong>Configuración de Microsoft Entra:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Client ID: f0287c0d-04... (configurado)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Tenant ID: 299a2881-13... (configurado)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Remitente: migueld.ruizs@konradlorenz.edu.co (configurable)</span>
              </li>
            </ul>
            <p className="mt-3 text-slate-600">
              Para más detalles, consulta <code className="px-1 py-0.5 bg-slate-100 rounded">MICROSOFT_EMAIL_SETUP.md</code>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Vista Previa */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vista Previa del Email</DialogTitle>
            <DialogDescription>
              Vista previa del correo de confirmación que se enviará al cliente
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg p-4 bg-white">
            <iframe
              srcDoc={previewHtml}
              className="w-full h-[600px] border-0"
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
