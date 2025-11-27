import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, ArrowRight, PenTool, CheckCircle2, Mail, Loader2 } from 'lucide-react';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
}

export function DigitalSignature({ data, onNext, onBack }: Props) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendOTP = async () => {
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    setIsSending(false);
  };

  const handleSign = async () => {
    if (otp !== '123456') {
      alert('Código OTP incorrecto. Por favor intente nuevamente.');
      return;
    }

    setIsSigning(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSigned(true);
    setIsSigning(false);

    // Auto-continuar después de firma
    setTimeout(() => {
      onNext({ signature: { signedAt: new Date().toISOString(), otp } });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-900">7. Firma Digital</CardTitle>
        <p className="text-slate-600">Aprobación y firma electrónica del contrato</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="border rounded-lg p-6 bg-slate-50">
            <div className="flex items-center gap-4 mb-4">
              <PenTool className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-slate-900">Contrato Listo para Firma</h3>
                <p className="text-slate-600">Número: {data.contract?.contractNumber}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Cliente:</span>
                <span className="text-slate-900">{data.firstName} {data.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Correo para notificación:</span>
                <span className="text-slate-900">{data.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Celular para OTP:</span>
                <span className="text-slate-900">{data.phone}</span>
              </div>
            </div>
          </div>

          {!otpSent && !signed && (
            <Alert className="bg-blue-50 border-blue-200">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Para firmar el contrato digitalmente, enviaremos un código de verificación (OTP) 
                al número de celular registrado. Este código garantiza la autenticidad de la firma.
              </AlertDescription>
            </Alert>
          )}

          {!otpSent && !signed && (
            <div className="text-center py-6">
              <Button onClick={handleSendOTP} disabled={isSending} size="lg">
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando OTP...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Código de Verificación
                  </>
                )}
              </Button>
            </div>
          )}

          {otpSent && !signed && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Código OTP enviado al número {data.phone}. Por favor ingrese el código para continuar.
                  <br />
                  <span className="text-slate-600">(Para esta demo, use el código: 123456)</span>
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="otp">Código de Verificación (OTP)</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Ingrese el código de 6 dígitos"
                  maxLength={6}
                  className="text-center tracking-widest"
                />
              </div>

              <Button
                onClick={handleSign}
                disabled={otp.length !== 6 || isSigning}
                className="w-full"
                size="lg"
              >
                {isSigning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando Firma Digital...
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4 mr-2" />
                    Firmar Contrato Digitalmente
                  </>
                )}
              </Button>
            </div>
          )}

          {signed && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Contrato Firmado Exitosamente</strong><br />
                La firma digital ha sido registrada con sello de tiempo.<br />
                El contrato será enviado por correo certificado y archivado en el ECM.<br />
                Continuando al cierre del caso...
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            <strong>Firma Electrónica:</strong> La firma digital cumple con los estándares legales 
            y genera evidencia de consentimiento con timestamp, IP del dispositivo y validación OTP.
          </p>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onBack} disabled={isSigning || signed}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          {signed && (
            <Button disabled>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Firmado - Continuando...
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
