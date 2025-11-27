/**
 * Servicio de Correo Electrónico con Gmail SMTP
 * Integración con Gmail a través de Backend Proxy con nodemailer
 *
 * IMPORTANTE: El sistema usa un backend proxy (/server/index.js) para:
 * - Evitar problemas de CORS
 * - Mantener credenciales seguras
 * - Centralizar logging y manejo de errores
 */

import { isDemoMode } from "./config";

// ============================================
// CONFIGURACIÓN DE GMAIL
// ============================================

const GMAIL_CONFIG = {
  // Información del remitente
  senderEmail: "telcokonradtobetobe@gmail.com",
  senderName: "Telecomunicaciones Konrad Lorenz",
};

// ============================================
// INTERFACES
// ============================================

export interface EmailAttachment {
  name: string;
  contentType: string;
  contentBytes: string; // Base64
}

export interface EmailMessage {
  to: string;
  subject: string;
  htmlContent: string;
  attachments?: EmailAttachment[];
}

export interface ContractEmailData {
  clientName: string;
  clientEmail: string;
  documentNumber: string;
  contractNumber: string;
  serviceName: string;
  servicePrice: number;
  serviceFeatures: string[];
  activationDate: string;
  monthlyPaymentDate: string;
  attachments: {
    contract?: string; // Base64
    termsAndConditions?: string; // Base64
    identityDocument?: string; // Base64
    proofOfAddress?: string; // Base64
  };
}

// ============================================
// ENVÍO DE CORREOS
// ============================================

/**
 * Envía un correo electrónico usando Gmail SMTP a través del backend proxy
 * Esto resuelve el problema de CORS y mantiene las credenciales seguras
 */
async function sendEmailWithGmail(
  emailData: EmailMessage,
): Promise<boolean> {
  try {
    console.log(
      `📧 Enviando correo a través del backend proxy (Gmail)`,
    );
    console.log(
      `   Destinatario: ${emailData.to}`,
    );

    // Llamar al backend proxy
    const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:3001';
    
    const response = await fetch(`${BACKEND_URL}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        htmlContent: emailData.htmlContent,
        attachments: emailData.attachments
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
      
      console.error("❌ Error del backend proxy:", {
        status: response.status,
        error: errorData.error || errorData
      });

      throw new Error(
        `Error enviando email (${response.status}): ${errorData.error || 'Error desconocido'}`
      );
    }

    const result = await response.json();
    console.log(
      "✅ Email enviado exitosamente a través del backend proxy (Gmail)",
    );
    console.log("   Message ID:", result.messageId);
    return true;
  } catch (error) {
    console.error(
      "❌ Error enviando email con Gmail:",
      error,
    );
    throw error;
  }
}

// ============================================
// PLANTILLA HTML DE EMAIL
// ============================================

function generateContractEmail(
  data: ContractEmailData,
): string {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Contrato - Telecomunicaciones Konrad Lorenz</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 10px;
    }
    .header-subtitle {
      color: #e0e7ff;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 30px;
    }
    .info-box {
      background-color: #f9fafb;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      margin-bottom: 30px;
      border-radius: 4px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #6b7280;
    }
    .info-value {
      color: #1f2937;
      font-weight: 500;
    }
    .service-box {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 30px;
    }
    .service-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 10px;
    }
    .service-price {
      font-size: 28px;
      font-weight: 800;
      color: #3b82f6;
      margin-bottom: 20px;
    }
    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .features-list li {
      padding: 8px 0;
      padding-left: 28px;
      position: relative;
      color: #1f2937;
    }
    .features-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
      font-size: 18px;
    }
    .documents-section {
      background-color: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .documents-title {
      font-size: 18px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 15px;
    }
    .documents-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .documents-list li {
      padding: 8px 0;
      color: #78350f;
      font-weight: 500;
    }
    .cta-button {
      display: inline-block;
      background-color: #3b82f6;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 20px 0;
    }
    .important-notice {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 16px;
      margin-bottom: 30px;
      border-radius: 4px;
    }
    .important-notice-title {
      font-weight: 700;
      color: #991b1b;
      margin-bottom: 8px;
    }
    .important-notice-text {
      color: #7f1d1d;
      font-size: 14px;
      line-height: 1.5;
    }
    .footer {
      background-color: #1f2937;
      padding: 30px;
      text-align: center;
    }
    .footer-text {
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 15px;
    }
    .footer-links {
      margin-top: 20px;
    }
    .footer-link {
      color: #60a5fa;
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 30px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .info-row {
        flex-direction: column;
      }
      .service-price {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">📡 Telecomunicaciones Konrad Lorenz</div>
      <div class="header-subtitle">Tu Conexión al Futuro</div>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">¡Bienvenido, ${data.clientName}! 🎉</div>
      
      <div class="message">
        Nos complace confirmar que tu contrato ha sido <strong>procesado exitosamente</strong>. 
        A continuación encontrarás todos los detalles de tu nueva contratación con 
        Telecomunicaciones Konrad Lorenz.
      </div>

      <!-- Contract Information -->
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Número de Contrato:</span>
          <span class="info-value">${data.contractNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Cliente:</span>
          <span class="info-value">${data.clientName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Documento:</span>
          <span class="info-value">${data.documentNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Fecha de Activación:</span>
          <span class="info-value">${data.activationDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Fecha de Pago:</span>
          <span class="info-value">${data.monthlyPaymentDate} de cada mes</span>
        </div>
      </div>

      <!-- Service Details -->
      <div class="service-box">
        <div class="service-title">${data.serviceName}</div>
        <div class="service-price">${formatPrice(data.servicePrice)}/mes</div>
        <ul class="features-list">
          ${data.serviceFeatures.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </div>

      <!-- Documents Attached -->
      <div class="documents-section">
        <div class="documents-title">
          📄 Documentos Adjuntos
        </div>
        <div class="message" style="color: #78350f; margin-bottom: 10px; font-size: 14px;">
          Este correo incluye los siguientes documentos importantes:
        </div>
        <ul class="documents-list">
          <li>✓ Contrato de Servicios Firmado Digitalmente</li>
          <li>✓ Términos y Condiciones</li>
          <li>✓ Copia de Documento de Identidad</li>
          <li>✓ Comprobante de Domicilio</li>
        </ul>
      </div>

      <div class="divider"></div>

      <!-- Important Notice -->
      <div class="important-notice">
        <div class="important-notice-title">⚠️ Información Importante</div>
        <div class="important-notice-text">
          <strong>Activación del Servicio:</strong> Tu servicio será activado dentro de las próximas 48-72 horas hábiles. 
          Recibirás un mensaje SMS y correo electrónico cuando tu servicio esté activo.<br><br>
          <strong>Instalación:</strong> Nuestro equipo técnico se comunicará contigo en las próximas 24 horas 
          para coordinar la fecha y hora de instalación de tu servicio.<br><br>
          <strong>Facturación:</strong> Tu primer pago será proporcional a los días de servicio del mes actual. 
          Los siguientes pagos serán mensuales a partir del día ${data.monthlyPaymentDate} de cada mes.
        </div>
      </div>

      <!-- Call to Action -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://portal.konrad.edu.co/cliente" class="cta-button">
          Acceder a Mi Portal
        </a>
      </div>

      <div class="message" style="text-align: center;">
        ¿Tienes preguntas? Nuestro equipo de soporte está disponible para ayudarte.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        <strong>Telecomunicaciones Konrad Lorenz</strong><br>
        Carrera 9 Bis No. 62-43, Bogotá D.C., Colombia<br>
        Línea de atención: (601) 347 2311 | WhatsApp: +57 300 123 4567<br>
        Email: soporte@konrad.edu.co
      </div>
      <div class="footer-links">
        <a href="https://www.konrad.edu.co/terminos" class="footer-link">Términos y Condiciones</a>
        <a href="https://www.konrad.edu.co/privacidad" class="footer-link">Política de Privacidad</a>
        <a href="https://www.konrad.edu.co/soporte" class="footer-link">Soporte</a>
      </div>
      <div class="footer-text" style="margin-top: 20px; font-size: 12px;">
        Este es un correo automático, por favor no responder. Si necesitas asistencia, 
        contacta a nuestro equipo de soporte.
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================
// FUNCIÓN PRINCIPAL DE ENVÍO
// ============================================

/**
 * Envía el correo de confirmación de contrato al cliente usando Gmail SMTP
 */
export async function sendContractEmail(
  data: ContractEmailData,
): Promise<boolean> {
  try {
    if (isDemoMode()) {
      // MODO DEMO: Simular envío
      console.log(
        "📧 [DEMO] Enviando correo vía Gmail a:",
        data.clientEmail,
      );
      console.log(
        "📧 [DEMO] Asunto: Confirmación de Contrato -",
        data.contractNumber,
      );
      console.log(
        "📧 [DEMO] Adjuntos:",
        Object.keys(data.attachments).length,
        "documentos",
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log(
        "✅ [DEMO] Correo enviado exitosamente (simulado)",
      );
      return true;
    }

    // MODO PRODUCCIÓN - Envío real con Gmail a través del proxy
    const attachments = prepareAttachments(data.attachments);

    const emailMessage: EmailMessage = {
      to: data.clientEmail,
      subject: `Confirmación de Contrato ${data.contractNumber} - Telecomunicaciones Konrad Lorenz`,
      htmlContent: generateContractEmail(data),
      attachments: attachments,
    };

    const result = await sendEmailWithGmail(emailMessage);
    console.log(
      "✅ Email enviado exitosamente a:",
      data.clientEmail,
    );
    return result;
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    throw error;
  }
}

/**
 * Prepara los adjuntos en el formato correcto
 */
function prepareAttachments(
  attachments: ContractEmailData["attachments"],
): EmailAttachment[] {
  const prepared: EmailAttachment[] = [];

  if (attachments.contract) {
    prepared.push({
      name: "Contrato_Firmado.pdf",
      contentType: "application/pdf",
      contentBytes: attachments.contract,
    });
  }

  if (attachments.termsAndConditions) {
    prepared.push({
      name: "Terminos_y_Condiciones.pdf",
      contentType: "application/pdf",
      contentBytes: attachments.termsAndConditions,
    });
  }

  if (attachments.identityDocument) {
    prepared.push({
      name: "Documento_Identidad.pdf",
      contentType: "application/pdf",
      contentBytes: attachments.identityDocument,
    });
  }

  if (attachments.proofOfAddress) {
    prepared.push({
      name: "Comprobante_Domicilio.pdf",
      contentType: "application/pdf",
      contentBytes: attachments.proofOfAddress,
    });
  }

  return prepared;
}

/**
 * Envía correo de notificación al equipo interno
 */
export async function sendInternalNotification(
  caseData: any,
): Promise<boolean> {
  try {
    if (isDemoMode()) {
      console.log("📧 [DEMO] Notificación interna enviada");
      return true;
    }

    // Crear email para notificación interna
    const emailMessage: EmailMessage = {
      to: "equipo@konrad.edu.co", // Email del equipo interno
      subject: `Nuevo Caso Creado: ${caseData.caseId}`,
      htmlContent: `
        <h2>Nuevo Caso en el Sistema BPMS</h2>
        <p><strong>ID del Caso:</strong> ${caseData.caseId}</p>
        <p><strong>Cliente:</strong> ${caseData.clientName}</p>
        <p><strong>Documento:</strong> ${caseData.documentNumber}</p>
        <p><strong>Estado:</strong> ${caseData.status}</p>
        <p><strong>Fecha de Creación:</strong> ${new Date().toLocaleString("es-CO")}</p>
      `,
    };

    return await sendEmailWithGmail(emailMessage);
  } catch (error) {
    console.error(
      "Error enviando notificación interna:",
      error,
    );
    return false;
  }
}

/**
 * Genera vista previa del email (para testing)
 */
export function getEmailPreview(
  data: ContractEmailData,
): string {
  return generateContractEmail(data);
}

/**
 * Genera un PDF simulado en base64 para demo
 */
export function generateDemoPDF(
  type: "contract" | "terms" | "identity" | "address",
): string {
  const headers: Record<string, string> = {
    contract: "CONTRATO DE SERVICIOS TELCO",
    terms: "TÉRMINOS Y CONDICIONES",
    identity: "DOCUMENTO DE IDENTIDAD",
    address: "COMPROBANTE DE DOMICILIO",
  };

  return btoa(`
    ========================================
    ${headers[type]}
    ========================================
    
    Telecomunicaciones Konrad Lorenz
    
    Este es un documento de demostración.
    En producción, aquí iría el PDF real.
    
    Fecha: ${new Date().toLocaleDateString("es-CO")}
    
    ========================================
  `);
}
