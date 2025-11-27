import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import { IdentityValidation } from './steps/IdentityValidation';
import { Enrollment } from './steps/Enrollment';
import { DocumentUpload } from './steps/DocumentUpload';
import { CreditValidation } from './steps/CreditValidation';
import { ServiceSelection } from './steps/ServiceSelection';
import { ContractGeneration } from './steps/ContractGeneration';
import { DigitalSignature } from './steps/DigitalSignature';
import { CaseComplete } from './steps/CaseComplete';

const steps = [
  { id: 1, name: 'Validación de Identidad', component: IdentityValidation },
  { id: 2, name: 'Enrolamiento', component: Enrollment },
  { id: 3, name: 'Recepción de Documentos', component: DocumentUpload },
  { id: 4, name: 'Validación Crediticia', component: CreditValidation },
  { id: 5, name: 'Selección de Servicios', component: ServiceSelection },
  { id: 6, name: 'Generación de Contrato', component: ContractGeneration },
  { id: 7, name: 'Firma Digital', component: DigitalSignature },
  { id: 8, name: 'Cierre', component: CaseComplete },
];

export function NewCase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [caseData, setCaseData] = useState<any>({});

  const CurrentStepComponent = steps[currentStep - 1].component;
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleNext = (data: any) => {
    setCaseData({ ...caseData, ...data });
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCaseData({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 mb-1">Proceso de Venta Telco</h2>
        <p className="text-slate-600">Flujo automatizado de validación, enrolamiento y firma de contrato</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Progreso del Proceso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600">Etapa {currentStep} de {steps.length}</span>
              <span className="text-slate-900">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mt-6">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.id < currentStep ? 'bg-green-600' :
                    step.id === currentStep ? 'bg-blue-600' :
                    'bg-slate-200'
                  }`}>
                    {step.id < currentStep ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Circle className={`w-5 h-5 ${step.id === currentStep ? 'text-white' : 'text-slate-400'}`} />
                    )}
                  </div>
                  <span className={`text-center mt-2 text-xs ${
                    step.id === currentStep ? 'text-slate-900' : 'text-slate-600'
                  }`}>
                    {step.name}
                  </span>
                  {step.id === currentStep && (
                    <Badge className="mt-1 bg-blue-600 text-xs">Actual</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <CurrentStepComponent
        data={caseData}
        onNext={handleNext}
        onBack={handleBack}
        onReset={handleReset}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === steps.length}
      />
    </div>
  );
}
