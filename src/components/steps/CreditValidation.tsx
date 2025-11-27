import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertTriangle, XCircle, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { validateCredit, formatCurrency, getRatingLabel, getDecisionLabel, type CreditValidationResponse } from '../../services/api';
import { ApiModeIndicator } from '../ApiModeIndicator';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
}

export function CreditValidation({ data, onNext, onBack }: Props) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<CreditValidationResponse | null>(data.creditValidation || null);
  const [progress, setProgress] = useState(0);
  const [apiResponse, setApiResponse] = useState<any>(null);

  useEffect(() => {
    if (isValidating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isValidating]);

  const handleValidate = async () => {
    setIsValidating(true);
    setProgress(0);
    setApiResponse(null);

    try {
      // Llamada REAL a APIs de centrales de riesgo (DataCrédito, TransUnion)
      const response = await validateCredit({
        documentType: data.documentType || 'CC',
        documentNumber: data.documentNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
      });

      setValidationResult(response);
      setApiResponse(response);
      setIsValidating(false);

      if (response.success && response.data.decision === 'approved') {
        setTimeout(() => {
          onNext({ creditValidation: response });
        }, 2000);
      }
    } catch (error) {
      console.error('Error en validación crediticia:', error);
      setIsValidating(false);
      setValidationResult({
        success: false,
        data: {
          score: 0,
          rating: 'very-poor',
          decision: 'rejected',
          bureaus: [],
          summary: {
            totalAccounts: 0,
            activeAccounts: 0,
            totalDebt: 0,
            monthlyPayment: 0,
            delinquentAccounts: 0,
            latePayments: 0,
          },
        },
        timestamp: new Date().toISOString(),
      });
    }
  };

  const getResultAlert = () => {
    if (!validationResult || !validationResult.data) return null;

    const { decision, score, rating } = validationResult.data;
    const bureauNames = validationResult.data.bureaus.map(b => b.name).join(', ');

    if (decision === 'approved') {
      return (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Validación Crediticia Aprobada</strong><br />
            Score: {score}/850 - Calificación: {getRatingLabel(rating)}<br />
            Centrales consultadas: {bureauNames}<br />
            Continuando automáticamente...
          </AlertDescription>
        </Alert>
      );
    }

    if (decision === 'manual-review') {
      return (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Requiere Revisión Manual</strong><br />
            Score: {score}/850 - Por debajo del umbral automático<br />
            El caso será escalado a un supervisor para aprobación
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="bg-red-50 border-red-200">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Validación Crediticia Rechazada</strong><br />
          Score: {score}/850 - No cumple con requisitos mínimos<br />
          El caso será cerrado automáticamente
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <>
      <ApiModeIndicator />
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">4. Validación Crediticia</CardTitle>
          <p className="text-slate-600">Consulta a centrales de riesgo y evaluación automática</p>
        </CardHeader>
        <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="border rounded-lg p-6 bg-slate-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Cliente:</span>
                <span className="text-slate-900">{data.firstName} {data.lastName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Documento:</span>
                <span className="text-slate-900">{data.documentNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Centrales a consultar:</span>
                <span className="text-slate-900">Datacrédito, TransUnion</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Score mínimo requerido:</span>
                <span className="text-slate-900">550 (automático) / 650 (ideal)</span>
              </div>
            </div>
          </div>

          {isValidating && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-slate-900">Consultando centrales de riesgo...</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {validationResult && getResultAlert()}

          {validationResult && validationResult.data && (
            <>
              <div className="border rounded-lg p-6 bg-white">
                <h3 className="text-slate-900 mb-4">Resumen Crediticio</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-600">Score General</p>
                    <p className="text-slate-900">{validationResult.data.score}/850</p>
                    <p className="text-slate-600 mt-1">
                      {getRatingLabel(validationResult.data.rating)}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-600">Decisión</p>
                    <p className={`${
                      validationResult.data.decision === 'approved' ? 'text-green-600' :
                      validationResult.data.decision === 'manual-review' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {getDecisionLabel(validationResult.data.decision)}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <h3 className="text-slate-900 mb-3">Centrales de Riesgo</h3>
                <div className="space-y-3">
                  {validationResult.data.bureaus.map((bureau, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-900">{bureau.name}</span>
                        <span className="text-slate-900">{bureau.score}/850</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-slate-600">
                        <div>
                          <p>Cuentas: {bureau.accounts}</p>
                        </div>
                        <div>
                          <p>Moras: {bureau.delinquencies}</p>
                        </div>
                        <div>
                          <p>{new Date(bureau.reportDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <h3 className="text-slate-900 mb-3">Resumen Financiero</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Cuentas Totales:</span>
                    <span className="text-slate-900">{validationResult.data.summary.totalAccounts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Cuentas Activas:</span>
                    <span className="text-slate-900">{validationResult.data.summary.activeAccounts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Deuda Total:</span>
                    <span className="text-slate-900">{formatCurrency(validationResult.data.summary.totalDebt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Pago Mensual:</span>
                    <span className="text-slate-900">{formatCurrency(validationResult.data.summary.monthlyPayment)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Cuentas Morosas:</span>
                    <span className={validationResult.data.summary.delinquentAccounts > 0 ? 'text-red-600' : 'text-green-600'}>
                      {validationResult.data.summary.delinquentAccounts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Pagos Tardíos:</span>
                    <span className={validationResult.data.summary.latePayments > 0 ? 'text-orange-600' : 'text-green-600'}>
                      {validationResult.data.summary.latePayments}
                    </span>
                  </div>
                </div>
              </div>

              {apiResponse && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Respuesta API:</strong><br />
                    <pre className="text-xs mt-2 overflow-auto max-h-40 bg-white p-2 rounded">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            <strong>Proceso Automatizado:</strong> El sistema consulta las centrales de riesgo mediante API
            y aplica reglas de negocio para determinar automáticamente la aprobación. Los casos límite
            son escalados a revisión manual.
          </p>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          {!validationResult && (
            <Button onClick={handleValidate} disabled={isValidating}>
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando DataCrédito y TransUnion...
                </>
              ) : (
                'Iniciar Validación Crediticia'
              )}
            </Button>
          )}
          {validationResult && validationResult.data && validationResult.data.decision === 'approved' && (
            <Button disabled>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aprobado - Continuando...
            </Button>
          )}
          {validationResult && validationResult.data && validationResult.data.decision === 'manual-review' && (
            <Button variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Escalar a Supervisor
            </Button>
          )}
          {validationResult && validationResult.data && validationResult.data.decision === 'rejected' && (
            <Button variant="destructive" disabled>
              <XCircle className="w-4 h-4 mr-2" />
              Rechazado - Caso Cerrado
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    </>
  );
}
