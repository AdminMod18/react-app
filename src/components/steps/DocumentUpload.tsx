import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle2, Camera, Eye, X, File, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCameraSupport } from './useCameraSupport';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
}

interface Document {
  id: string;
  name: string;
  required: boolean;
  uploaded: boolean;
  file?: string;
  fileName?: string;
  fileSize?: string;
}

export function DocumentUpload({ data, onNext, onBack }: Props) {
  const { isSupported: isCameraSupported, error: cameraSupportError } = useCameraSupport();
  
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'cedula', name: 'Cédula de Ciudadanía (Frente y Reverso)', required: true, uploaded: data.docs?.cedula || false },
    { id: 'comprobante', name: 'Comprobante de Domicilio', required: true, uploaded: data.docs?.comprobante || false },
    { id: 'rut', name: 'RUT (Registro Único Tributario)', required: false, uploaded: data.docs?.rut || false },
    { id: 'referencias', name: 'Referencias Personales', required: false, uploaded: data.docs?.referencias || false },
  ]);
  const [consentGiven, setConsentGiven] = useState(data.consentGiven || false);
  
  // Camera and preview states
  const [showCamera, setShowCamera] = useState(false);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const startCamera = async (docId: string) => {
    setCameraError(null);
    setCurrentDocId(docId);
    
    // Verificar soporte de cámara antes de intentar acceder
    if (!isCameraSupported) {
      const errorMsg = cameraSupportError || 'Tu navegador no soporta acceso a la cámara. Por favor, usa la opción de subir archivo.';
      setCameraError(errorMsg);
      toast.error(errorMsg, {
        description: 'Usa el botón "Archivo" para subir documentos',
      });
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = 'No se pudo acceder a la cámara.';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Permiso denegado. Por favor, permite el acceso a la cámara en la configuración de tu navegador.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No se encontró ninguna cámara en tu dispositivo.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'La cámara está siendo usada por otra aplicación.';
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        errorMessage = 'No se pudo iniciar la cámara con la configuración requerida.';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Acceso a la cámara bloqueado por razones de seguridad. Verifica que estés usando HTTPS.';
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage, {
        description: 'Puedes usar la opción de subir archivo en su lugar.',
        duration: 5000,
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCurrentDocId(null);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && currentDocId) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          toast.error('Error al capturar la imagen');
          return;
        }
        
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg', 0.9);
        
        setDocuments(documents.map(doc =>
          doc.id === currentDocId 
            ? { 
                ...doc, 
                uploaded: true, 
                file: photoData,
                fileName: `${doc.name}_captura.jpg`,
                fileSize: '~500 KB'
              } 
            : doc
        ));
        
        toast.success('Documento capturado exitosamente');
        stopCamera();
      } catch (error) {
        console.error('Error capturing photo:', error);
        toast.error('Error al capturar la imagen');
      }
    }
  };

  const handleFileUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamaño (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('El archivo es demasiado grande', {
          description: 'Tamaño máximo permitido: 5MB'
        });
        return;
      }

      // Validar tipo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Formato no válido', {
          description: 'Solo se permiten archivos JPG, PNG o PDF'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(documents.map(doc =>
          doc.id === docId 
            ? { 
                ...doc, 
                uploaded: true,
                file: reader.result as string,
                fileName: file.name,
                fileSize: formatFileSize(file.size)
              } 
            : doc
        ));
        toast.success('Archivo cargado exitosamente', {
          description: file.name
        });
      };
      reader.onerror = () => {
        toast.error('Error al cargar el archivo');
      };
      reader.readAsDataURL(file);
    }
    // Limpiar el input para permitir subir el mismo archivo nuevamente
    event.target.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const removeDocument = (docId: string) => {
    setDocuments(documents.map(doc =>
      doc.id === docId 
        ? { ...doc, uploaded: false, file: undefined, fileName: undefined, fileSize: undefined } 
        : doc
    ));
    toast.info('Documento eliminado');
  };

  const handleSubmit = () => {
    const docsData = documents.reduce((acc, doc) => {
      acc[doc.id] = doc.uploaded;
      return acc;
    }, {} as any);
    
    onNext({ docs: docsData, consentGiven });
  };

  const requiredDocsUploaded = documents.filter(d => d.required).every(d => d.uploaded);
  const canContinue = requiredDocsUploaded && consentGiven;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">3. Recepción de Documentos</CardTitle>
          <p className="text-slate-600">Carga digital de soportes y consentimiento informado</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {cameraError && (
            <Alert className="bg-amber-50 border-amber-200 relative">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 pr-8">
                <strong>Problema con la cámara:</strong> {cameraError}
                <br />
                <span className="text-amber-700">
                  💡 Puedes usar el botón "Archivo" para subir documentos desde tu dispositivo.
                </span>
              </AlertDescription>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => setCameraError(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Alert>
          )}

          <div className="space-y-4">
            <Label>Documentos Requeridos</Label>
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {doc.uploaded ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    ) : (
                      <FileText className="w-5 h-5 text-slate-400 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="text-slate-900">{doc.name}</p>
                      <p className="text-slate-600">
                        {doc.required ? 'Obligatorio' : 'Opcional'} • Formatos: PDF, JPG, PNG • Max: 5MB
                      </p>
                      {doc.uploaded && doc.fileName && (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <div className="flex items-center gap-2 text-green-800">
                            <File className="w-4 h-4" />
                            <span className="flex-1">{doc.fileName}</span>
                            <span>{doc.fileSize}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {doc.uploaded ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setPreviewDoc(doc)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {isCameraSupported && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => startCamera(doc.id)}
                            title="Capturar documento con cámara"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Cámara
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => fileInputRefs.current[doc.id]?.click()}
                          title="Subir archivo desde dispositivo"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Archivo
                        </Button>
                        <input
                          ref={(el) => fileInputRefs.current[doc.id] = el}
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileUpload(doc.id, e)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <Label className="mb-4 block">Consentimiento Informado</Label>
            <div className="bg-slate-50 border rounded-lg p-6 space-y-4">
              <p className="text-slate-700">
                <strong>Tratamiento de Datos Personales</strong>
              </p>
              <p className="text-slate-600">
                Autorizo a Telecomunicaciones de la Konrad Lorenz para recolectar, almacenar, usar, circular 
                y suprimir mis datos personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013. 
                Los datos serán utilizados para:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Validación de identidad y verificación crediticia</li>
                <li>Gestión comercial y prestación de servicios</li>
                <li>Envío de información comercial y promocional</li>
                <li>Cumplimiento de obligaciones legales</li>
              </ul>
              <div className="flex items-start gap-3 pt-4">
                <Checkbox
                  id="consent"
                  checked={consentGiven}
                  onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
                />
                <label htmlFor="consent" className="text-slate-700 cursor-pointer">
                  He leído y acepto la política de tratamiento de datos personales y 
                  autorizo el procesamiento de mi información
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900">
                <strong>Seguridad:</strong> Todos los documentos son verificados mediante checksum y almacenados 
                en el sistema ECM con cifrado en reposo. Se genera hash SHA-256 para cada archivo.
              </p>
            </div>

            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <summary className="cursor-pointer text-slate-900 font-medium">
                💡 ¿Problemas con la cámara? Haz clic aquí
              </summary>
              <div className="mt-3 space-y-3 text-slate-700">
                <p><strong>Para habilitar el acceso a la cámara:</strong></p>
                
                <div>
                  <p className="font-medium">Chrome / Edge:</p>
                  <ol className="list-decimal list-inside ml-4 text-slate-600">
                    <li>Haz clic en el icono del candado o cámara en la barra de direcciones</li>
                    <li>Cambia el permiso de Cámara a "Permitir"</li>
                    <li>Recarga la página</li>
                  </ol>
                </div>

                <div>
                  <p className="font-medium">Firefox:</p>
                  <ol className="list-decimal list-inside ml-4 text-slate-600">
                    <li>Haz clic en el icono del candado en la barra de direcciones</li>
                    <li>Ve a "Permisos" y busca "Usar la cámara"</li>
                    <li>Desmarca "Bloquear" y recarga la página</li>
                  </ol>
                </div>

                <div>
                  <p className="font-medium">Safari (macOS):</p>
                  <ol className="list-decimal list-inside ml-4 text-slate-600">
                    <li>Ve a Safari → Preferencias → Sitios web → Cámara</li>
                    <li>Selecciona "Permitir" para este sitio</li>
                    <li>Recarga la página</li>
                  </ol>
                </div>

                <p className="text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  <strong>Alternativa:</strong> Si no puedes usar la cámara, utiliza el botón 
                  "Archivo" para subir fotos tomadas con otra aplicación.
                </p>
              </div>
            </details>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <Button onClick={handleSubmit} disabled={!canContinue}>
              Continuar al Siguiente Paso
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Camera Dialog */}
      <Dialog open={showCamera} onOpenChange={(open) => !open && stopCamera()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Capturar Documento</DialogTitle>
            <DialogDescription>
              Posiciona el documento en el recuadro y asegúrate de que sea legible
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 border-4 border-blue-500 m-8 rounded-lg pointer-events-none" />
              
              {/* Overlay con instrucciones */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-center">
                  📸 Asegúrate de que el documento esté bien iluminado y enfocado
                </p>
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
              <Camera className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Consejos:</strong> Coloca el documento sobre un fondo oscuro para mejor 
                contraste. Evita reflejos y asegúrate de que todo el documento esté visible.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={stopCamera}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={capturePhoto}
              >
                <Camera className="w-4 h-4 mr-2" />
                Capturar Documento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vista Previa: {previewDoc?.name}</DialogTitle>
            <DialogDescription>
              {previewDoc?.fileName} • {previewDoc?.fileSize}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewDoc?.file && (
              <div className="bg-slate-100 rounded-lg p-4">
                {previewDoc.file.startsWith('data:application/pdf') ? (
                  <div className="flex items-center justify-center h-96 text-slate-600">
                    <div className="text-center">
                      <File className="w-16 h-16 mx-auto mb-4" />
                      <p>Archivo PDF cargado correctamente</p>
                      <p className="text-slate-500 mt-2">{previewDoc.fileName}</p>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={previewDoc.file} 
                    alt="Preview" 
                    className="w-full h-auto max-h-[600px] object-contain rounded"
                  />
                )}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPreviewDoc(null)}
              >
                Cerrar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (previewDoc) {
                    removeDocument(previewDoc.id);
                    setPreviewDoc(null);
                  }
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Eliminar Documento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
