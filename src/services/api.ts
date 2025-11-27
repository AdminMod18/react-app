/**
 * Servicios de API para integración con sistemas externos
 * 
 * MODO ACTUAL: DEMO (datos simulados)
 * 
 * Para cambiar a modo PRODUCCIÓN:
 * 1. Abre /services/config.ts
 * 2. Cambia API_MODE = 'PRODUCTION'
 * 3. Configura tus credenciales reales en PRODUCTION_CONFIG
 */

import { getConfig, isDemoMode } from './config';

// ============================================
// INTERFACES DE TIPOS
// ============================================

export interface IdentityValidationRequest {
  documentType: string;
  documentNumber: string;
  documentPhoto?: string;
  facePhoto?: string;
}

export interface IdentityValidationResponse {
  success: boolean;
  valid: boolean;
  message: string;
  data?: {
    documentNumber: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    expeditionDate: string;
    expeditionPlace: string;
    gender: string;
    bloodType?: string;
    biometricMatch: boolean;
    biometricScore: number; // 0-100
  };
  provider: string;
  responseTime: number;
  timestamp: string;
}

export interface CreditValidationRequest {
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
}

export interface CreditValidationResponse {
  success: boolean;
  data: {
    score: number; // Score crediticio (300-850)
    rating: 'excellent' | 'good' | 'fair' | 'poor' | 'very-poor';
    decision: 'approved' | 'manual-review' | 'rejected';
    bureaus: {
      name: string;
      score: number;
      reportDate: string;
      accounts: number;
      delinquencies: number;
    }[];
    summary: {
      totalAccounts: number;
      activeAccounts: number;
      totalDebt: number;
      monthlyPayment: number;
      delinquentAccounts: number;
      latePayments: number;
    };
  };
  timestamp: string;
}

// ============================================
// SERVICIO: VALIDACIÓN DE IDENTIDAD
// ============================================

export async function validateIdentity(
  request: IdentityValidationRequest
): Promise<IdentityValidationResponse> {
  const startTime = Date.now();
  const config = getConfig();
  
  try {
    // Si estamos en modo DEMO, usar simulación
    if (isDemoMode()) {
      // SIMULACIÓN PARA DEMO
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validación básica del número de documento
    const isValidFormat = /^\d{6,10}$/.test(request.documentNumber);
    
    // Simulación de validación biométrica (90% de éxito en demo)
    const biometricMatch = Math.random() > 0.1;
    const biometricScore = biometricMatch 
      ? Math.floor(Math.random() * 15) + 85  // 85-100
      : Math.floor(Math.random() * 30) + 40; // 40-70

    const responseTime = Date.now() - startTime;

    if (!isValidFormat) {
      return {
        success: false,
        valid: false,
        message: 'Formato de documento inválido',
        provider: 'Registraduría Nacional',
        responseTime,
        timestamp: new Date().toISOString(),
      };
    }

    if (!biometricMatch) {
      return {
        success: true,
        valid: false,
        message: 'Discrepancia en verificación biométrica',
        provider: 'ID-TRUE / Registraduría Nacional',
        responseTime,
        timestamp: new Date().toISOString(),
      };
    }

      // Generar datos de respuesta simulados
      const mockData = generateMockPersonData(request.documentNumber);

      return {
        success: true,
        valid: true,
        message: 'Identidad verificada correctamente (MODO DEMO)',
        data: {
          documentNumber: request.documentNumber,
          firstName: mockData.firstName,
          lastName: mockData.lastName,
          birthDate: mockData.birthDate,
          expeditionDate: mockData.expeditionDate,
          expeditionPlace: mockData.expeditionPlace,
          gender: mockData.gender,
          bloodType: mockData.bloodType,
          biometricMatch: true,
          biometricScore,
        },
        provider: 'ID-TRUE / Registraduría Nacional (DEMO)',
        responseTime,
        timestamp: new Date().toISOString(),
      };
    }

    // MODO PRODUCCIÓN - Integración real con API
    const response = await fetch(
      `${config.registraduria.baseUrl}/v1/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.registraduria.apiKey}`,
          'X-Client-ID': config.registraduria.clientId,
        },
        body: JSON.stringify({
          tipo_documento: request.documentType,
          numero_documento: request.documentNumber,
          imagen_documento: request.documentPhoto,
          imagen_rostro: request.facePhoto,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    return {
      success: data.success,
      valid: data.valid,
      message: data.valid ? 'Identidad verificada correctamente' : data.mensaje,
      data: data.valid ? {
        documentNumber: data.data.numero_documento,
        firstName: `${data.data.primer_nombre} ${data.data.segundo_nombre || ''}`.trim(),
        lastName: `${data.data.primer_apellido} ${data.data.segundo_apellido}`,
        birthDate: data.data.fecha_nacimiento,
        expeditionDate: data.data.fecha_expedicion,
        expeditionPlace: data.data.lugar_expedicion,
        gender: data.data.sexo,
        bloodType: data.data.tipo_sangre,
        biometricMatch: data.data.validacion_biometrica?.coincide || false,
        biometricScore: data.data.validacion_biometrica?.score || 0,
      } : undefined,
      provider: 'ID-TRUE / Registraduría Nacional',
      responseTime,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('Error en validación de identidad:', error);
    
    return {
      success: false,
      valid: false,
      message: `Error al conectar con Registraduría: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      provider: 'Registraduría Nacional',
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================
// SERVICIO: VALIDACIÓN CREDITICIA
// ============================================

export async function validateCredit(
  request: CreditValidationRequest
): Promise<CreditValidationResponse> {
  const config = getConfig();
  
  try {
    // Si estamos en modo DEMO, usar simulación
    if (isDemoMode()) {
      // SIMULACIÓN PARA DEMO
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockCreditData = generateMockCreditData(request.documentNumber);

      return {
        success: true,
        data: mockCreditData,
        timestamp: new Date().toISOString(),
      };
    }

    // MODO PRODUCCIÓN - Integración real con APIs
    const [dataCreditoResponse, transUnionResponse] = await Promise.all([
      fetch(`${config.dataCredito.baseUrl}/api/v2/credit-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${config.dataCredito.username}:${config.dataCredito.password}`)}`,
          'X-API-Key': config.dataCredito.apiKey,
        },
        body: JSON.stringify({
          tipoDocumento: request.documentType,
          numeroDocumento: request.documentNumber,
          primerNombre: request.firstName,
          primerApellido: request.lastName,
          fechaNacimiento: request.birthDate,
        }),
      }),
      
      fetch(`${config.transUnion.baseUrl}/v1/credit-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.transUnion.apiKey}`,
        },
        body: JSON.stringify({
          document_type: request.documentType,
          document_number: request.documentNumber,
          first_name: request.firstName,
          last_name: request.lastName,
        }),
      }),
    ]);

    const dataCreditoData = await dataCreditoResponse.json();
    const transUnionData = await transUnionResponse.json();

    // Consolidar scores
    const averageScore = Math.round((dataCreditoData.score + transUnionData.credit_score) / 2);

    // Determinar calificación y decisión
    let rating: 'excellent' | 'good' | 'fair' | 'poor' | 'very-poor';
    let decision: 'approved' | 'manual-review' | 'rejected';

    if (averageScore >= 750) {
      rating = 'excellent';
      decision = 'approved';
    } else if (averageScore >= 700) {
      rating = 'good';
      decision = 'approved';
    } else if (averageScore >= 650) {
      rating = 'fair';
      decision = 'approved';
    } else if (averageScore >= 580) {
      rating = 'poor';
      decision = 'manual-review';
    } else {
      rating = 'very-poor';
      decision = 'rejected';
    }

    return {
      success: true,
      data: {
        score: averageScore,
        rating,
        decision,
        bureaus: [
          {
            name: 'DataCrédito',
            score: dataCreditoData.score,
            reportDate: dataCreditoData.fecha_reporte,
            accounts: dataCreditoData.cuentas_totales,
            delinquencies: dataCreditoData.cuentas_mora,
          },
          {
            name: 'TransUnion',
            score: transUnionData.credit_score,
            reportDate: transUnionData.report_date,
            accounts: transUnionData.total_accounts,
            delinquencies: transUnionData.delinquent_accounts,
          },
        ],
        summary: {
          totalAccounts: dataCreditoData.cuentas_totales + transUnionData.total_accounts,
          activeAccounts: dataCreditoData.cuentas_activas + transUnionData.active_accounts,
          totalDebt: dataCreditoData.deuda_total,
          monthlyPayment: dataCreditoData.pago_mensual,
          delinquentAccounts: dataCreditoData.cuentas_mora,
          latePayments: dataCreditoData.pagos_tardios,
        },
      },
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('Error en validación crediticia:', error);
    
    // En caso de error, retornar datos simulados con advertencia
    return {
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
    };
  }
}

// ============================================
// SERVICIO: SINCRONIZACIÓN CON CRM
// ============================================

export async function syncWithCRM(caseData: any): Promise<boolean> {
  const config = getConfig();
  
  try {
    // Si estamos en modo DEMO, usar simulación
    if (isDemoMode()) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Datos sincronizados con CRM (DEMO):', caseData);
      return true;
    }

    // INTEGRACIÓN REAL - CRM RequestManager
    const response = await fetch(
      `${config.crm.baseUrl}/cases`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.crm.apiKey}`,
        },
        body: JSON.stringify(caseData),
      }
    );

    return response.ok;

  } catch (error) {
    console.error('Error al sincronizar con CRM:', error);
    return false;
  }
}

// ============================================
// FUNCIONES AUXILIARES DE SIMULACIÓN
// ============================================

function generateMockPersonData(documentNumber: string) {
  const names = ['María', 'Juan', 'Ana', 'Carlos', 'Laura', 'Pedro', 'Sofía', 'Miguel'];
  const lastNames = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez'];
  const cities = ['Bogotá D.C.', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'];
  const bloodTypes = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-'];
  
  const seed = parseInt(documentNumber.substring(0, 6));
  
  return {
    firstName: names[seed % names.length],
    lastName: `${lastNames[seed % lastNames.length]} ${lastNames[(seed + 1) % lastNames.length]}`,
    birthDate: `19${70 + (seed % 30)}-${String((seed % 12) + 1).padStart(2, '0')}-${String((seed % 28) + 1).padStart(2, '0')}`,
    expeditionDate: `20${10 + (seed % 15)}-${String((seed % 12) + 1).padStart(2, '0')}-${String((seed % 28) + 1).padStart(2, '0')}`,
    expeditionPlace: cities[seed % cities.length],
    gender: seed % 2 === 0 ? 'M' : 'F',
    bloodType: bloodTypes[seed % bloodTypes.length],
  };
}

function generateMockCreditData(documentNumber: string) {
  const seed = parseInt(documentNumber.substring(0, 6));
  
  // Generar score basado en el seed (distribución realista)
  let baseScore = 500 + (seed % 300);
  
  // Ajustar para distribución más realista
  if (baseScore > 750) baseScore = 750 - (seed % 100);
  if (baseScore < 450) baseScore = 450 + (seed % 150);
  
  const score = baseScore;
  
  let rating: 'excellent' | 'good' | 'fair' | 'poor' | 'very-poor';
  let decision: 'approved' | 'manual-review' | 'rejected';
  
  if (score >= 750) {
    rating = 'excellent';
    decision = 'approved';
  } else if (score >= 700) {
    rating = 'good';
    decision = 'approved';
  } else if (score >= 650) {
    rating = 'fair';
    decision = 'approved';
  } else if (score >= 580) {
    rating = 'poor';
    decision = 'manual-review';
  } else {
    rating = 'very-poor';
    decision = 'rejected';
  }

  const dataCreditoScore = score + (seed % 20) - 10;
  const transUnionScore = score + ((seed + 5) % 20) - 10;

  return {
    score,
    rating,
    decision,
    bureaus: [
      {
        name: 'DataCrédito',
        score: dataCreditoScore,
        reportDate: new Date().toISOString().split('T')[0],
        accounts: 3 + (seed % 8),
        delinquencies: score < 650 ? (seed % 3) : 0,
      },
      {
        name: 'TransUnion',
        score: transUnionScore,
        reportDate: new Date().toISOString().split('T')[0],
        accounts: 2 + (seed % 6),
        delinquencies: score < 600 ? (seed % 2) : 0,
      },
    ],
    summary: {
      totalAccounts: 5 + (seed % 10),
      activeAccounts: 3 + (seed % 5),
      totalDebt: (seed % 50) * 1000000, // En pesos colombianos
      monthlyPayment: (seed % 10) * 100000,
      delinquentAccounts: score < 650 ? (seed % 2) : 0,
      latePayments: score < 700 ? (seed % 5) : 0,
    },
  };
}

// ============================================
// UTILIDADES
// ============================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getRatingLabel(rating: string): string {
  const labels: Record<string, string> = {
    'excellent': 'Excelente',
    'good': 'Bueno',
    'fair': 'Regular',
    'poor': 'Bajo',
    'very-poor': 'Muy Bajo',
  };
  return labels[rating] || rating;
}

export function getDecisionLabel(decision: string): string {
  const labels: Record<string, string> = {
    'approved': 'Aprobado',
    'manual-review': 'Revisión Manual',
    'rejected': 'Rechazado',
  };
  return labels[decision] || decision;
}
