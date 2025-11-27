import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, ArrowRight, FileText, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
}

export function ContractGeneration({ data, onNext, onBack }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contract, setContract] = useState<any>(data.contract || null);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simular generación de contrato
    await new Promise(resolve => setTimeout(resolve, 1500));

    const contractData = {
      contractNumber: `CONT-2025-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      generatedAt: new Date().toISOString(),
      template: 'Contrato Servicios Telco v3.2',
      pdfUrl: '/contracts/sample.pdf',
      hash: 'sha256:' + Math.random().toString(36).substring(2, 15),
    };

    setContract(contractData);
    setIsGenerating(false);
  };

  const handleContinue = () => {
    onNext({ contract });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-900">6. Generación de Contrato</CardTitle>
        <p className="text-slate-600">Creación automática del e-contrato con datos del cliente</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="border rounded-lg p-6 bg-slate-50">
            <h3 className="text-slate-900 mb-4">Datos para el Contrato</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-600">Cliente</p>
                <p className="text-slate-900">{data.firstName} {data.lastName}</p>
              </div>
              <div>
                <p className="text-slate-600">Documento</p>
                <p className="text-slate-900">{data.documentNumber}</p>
              </div>
              <div>
                <p className="text-slate-600">Email</p>
                <p className="text-slate-900">{data.email}</p>
              </div>
              <div>
                <p className="text-slate-600">Teléfono</p>
                <p className="text-slate-900">{data.phone}</p>
              </div>
              <div>
                <p className="text-slate-600">Dirección</p>
                <p className="text-slate-900">{data.address}</p>
              </div>
              <div>
                <p className="text-slate-600">Score Crediticio</p>
                <p className="text-slate-900">{data.creditValidation?.data?.score || data.creditValidation?.score}</p>
              </div>
            </div>
          </div>

          {data.serviceName && (
            <div className="border rounded-lg p-6 bg-gradient-to-r from-purple-50 to-blue-50">
              <h3 className="text-slate-900 mb-4">Servicios Contratados</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-600">Plan Seleccionado</p>
                  <p className="text-slate-900">{data.serviceName}</p>
                </div>
                <div>
                  <p className="text-slate-600">Valor Mensual</p>
                  <p className="text-slate-900">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                    }).format(data.servicePrice)}
                  </p>
                </div>
              </div>
              {data.serviceDetails && (
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <p className="text-slate-600 mb-2">Características incluidas:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {data.serviceDetails.features?.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!contract && !isGenerating && (
            <Alert className="bg-blue-50 border-blue-200">
              <FileText className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                El contrato se generará automáticamente usando la plantilla "Contrato Servicios Telco v3.2"
                con todos los datos capturados en el proceso. Se asignará un número único de contrato.
              </AlertDescription>
            </Alert>
          )}

          {isGenerating && (
            <div className="border rounded-lg p-8 text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
              <p className="text-slate-900">Generando contrato digital...</p>
              <p className="text-slate-600">Aplicando plantilla y variables del cliente</p>
            </div>
          )}

          {contract && (
            <>
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Contrato Generado Exitosamente</strong><br />
                  El documento PDF ha sido creado y está listo para firma digital
                </AlertDescription>
              </Alert>

              <div className="border rounded-lg p-6">
                <h3 className="text-slate-900 mb-4">Información del Contrato</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Número de Contrato:</span>
                    <span className="text-slate-900 font-mono">{contract.contractNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Plantilla:</span>
                    <span className="text-slate-900">{contract.template}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Fecha de Generación:</span>
                    <span className="text-slate-900">
                      {new Date(contract.generatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Hash SHA-256:</span>
                    <span className="text-slate-900 font-mono">{contract.hash}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Previsualizar Contrato PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            <strong>Seguridad:</strong> El contrato genera un hash SHA-256 único para garantizar integridad.
            Se almacenará en el ECM con versionamiento y metadatos completos.
          </p>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          {!contract ? (
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Contrato
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleContinue}>
              Continuar a Firma Digital
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
