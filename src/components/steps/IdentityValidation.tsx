import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Camera, CheckCircle2, Loader2, AlertTriangle, Upload, X, Info } from 'lucide-react';
import { validateIdentity, type IdentityValidationResponse } from '../../services/api';
import { ApiModeIndicator } from '../ApiModeIndicator';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
}

export function IdentityValidation({ data, onNext, isFirstStep }: Props) {
  const [formData, setFormData] = useState({
    documentType: data.documentType || 'CC',
    documentNumber: data.documentNumber || '',
    documentPhoto: data.documentPhoto || null,
    facePhoto: data.facePhoto || null,
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<IdentityValidationResponse | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  
  // Camera states
  const [showDocumentCamera, setShowDocumentCamera] = useState(false);
  const [showFaceCamera, setShowFaceCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const faceFileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async (type: 'document' | 'face') => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: type === 'face' ? 'user' : 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      if (type === 'document') {
        setShowDocumentCamera(true);
      } else {
        setShowFaceCamera(true);
      }
    } catch (error) {
      alert('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowDocumentCamera(false);
    setShowFaceCamera(false);
  };

  const capturePhoto = (type: 'document' | 'face') => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        
        if (type === 'document') {
          setFormData({ ...formData, documentPhoto: photoData });
        } else {
          setFormData({ ...formData, facePhoto: photoData });
        }
        
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'face') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'document') {
          setFormData({ ...formData, documentPhoto: reader.result as string });
        } else {
          setFormData({ ...formData, facePhoto: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (type: 'document' | 'face') => {
    if (type === 'document') {
      setFormData({ ...formData, documentPhoto: null });
    } else {
      setFormData({ ...formData, facePhoto: null });
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    setValidationResult(null);
    setApiResponse(null);

    try {
      // Llamada REAL a API de Registraduría Nacional / ID-TRUE
      const response = await validateIdentity({
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        documentPhoto: formData.documentPhoto || undefined,
        facePhoto: formData.facePhoto || undefined,
      });

      setValidationResult(response);
      setApiResponse(response);
      setIsValidating(false);

      if (response.success && response.valid) {
        // Si la validación es exitosa, auto-llenar datos y continuar
        setTimeout(() => {
          const enrichedData = {
            ...formData,
            ...(response.data && {
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              birthDate: response.data.birthDate,
              gender: response.data.gender,
            }),
            identityValidation: response,
          };
          onNext(enrichedData);
        }, 1500);
      }
    } catch (error) {
      console.error('Error en validación:', error);
      setIsValidating(false);
      setValidationResult({
        success: false,
        valid: false,
        message: 'Error de conexión con el servicio de validación',
        provider: 'Sistema',
        responseTime: 0,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const canValidate = formData.documentNumber.length >= 6 && formData.documentPhoto && formData.facePhoto;

  return (
    <>
      <ApiModeIndicator />
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">1. Validación de Identidad</CardTitle>
          <p className="text-slate-600">Verificación biométrica y documental con Registraduría Nacional</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentNumber">Número de Documento</Label>
                <Input
                  id="documentNumber"
                  placeholder="Ej: 1234567890"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                />
              </div>

              <div>
                <Label>Foto del Documento (Cédula)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                  {formData.documentPhoto ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <img 
                          src={formData.documentPhoto} 
                          alt="Documento" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removePhoto('document')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Documento capturado</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-center">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => startCamera('document')}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Tomar Foto con Cámara
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Archivo
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'document')}
                        />
                      </div>
                      <p className="text-slate-500">JPG, PNG • Max 5MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Foto del Rostro (Biometría)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                  {formData.facePhoto ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <img 
                          src={formData.facePhoto} 
                          alt="Rostro" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removePhoto('face')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Rostro capturado</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-center">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => startCamera('face')}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Tomar Foto con Cámara
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => faceFileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Archivo
                        </Button>
                        <input
                          ref={faceFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'face')}
                        />
                      </div>
                      <p className="text-slate-500">JPG, PNG • Max 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {validationResult && validationResult.success && validationResult.valid && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Validación Exitosa</strong><br />
                    {validationResult.message}<br />
                    Tiempo de respuesta: {validationResult.responseTime}ms<br />
                    Proveedor: {validationResult.provider}
                    {validationResult.data && (
                      <>
                        <br /><br />
                        <strong>Datos Verificados:</strong><br />
                        Nombre: {validationResult.data.firstName} {validationResult.data.lastName}<br />
                        Score Biométrico: {validationResult.data.biometricScore}/100
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {validationResult && (!validationResult.success || !validationResult.valid) && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Validación Fallida</strong><br />
                    {validationResult.message}
                  </AlertDescription>
                </Alert>
              )}

              {apiResponse && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Respuesta API:</strong><br />
                    <pre className="text-xs mt-2 overflow-auto max-h-32">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <div></div>
            <Button
              onClick={handleValidate}
              disabled={!canValidate || isValidating || (validationResult?.success && validationResult?.valid)}
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validando con Registraduría...
                </>
              ) : validationResult?.success && validationResult?.valid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Validado - Continuando...
                </>
              ) : (
                'Validar Identidad con Registraduría Nacional'
              )}
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900">
              <strong>Información:</strong> Esta validación se conecta mediante API con el proveedor ID-TRUE
              y la Registraduría Nacional para verificar la autenticidad del documento y la biometría facial.
              Tiempo estimado: 1-3 segundos.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Camera Dialog */}
      <Dialog open={showDocumentCamera || showFaceCamera} onOpenChange={(open) => !open && stopCamera()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {showDocumentCamera ? 'Capturar Documento' : 'Capturar Rostro'}
            </DialogTitle>
            <DialogDescription>
              {showDocumentCamera 
                ? 'Posiciona tu documento de identidad en el recuadro y asegúrate de que sea legible'
                : 'Coloca tu rostro en el centro del recuadro para la captura biométrica'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 border-4 border-blue-500 m-8 rounded-lg pointer-events-none" />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={stopCamera}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={() => capturePhoto(showDocumentCamera ? 'document' : 'face')}
              >
                <Camera className="w-4 h-4 mr-2" />
                Capturar Foto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
