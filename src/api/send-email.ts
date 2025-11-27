/**
 * Backend Proxy para Gmail SMTP (Edge Function)
 * 
 * NOTA: Este archivo es para despliegues serverless (Vercel/Netlify).
 * Para desarrollo local, usa el servidor Express en /server/index.js
 * 
 * ⚠️ IMPORTANTE: Nodemailer NO funciona en Edge Functions/Serverless.
 * Para enviar emails en producción con serverless, considera:
 * - Usar el servidor Express en /server/index.js
 * - Usar un servicio de email como Resend, SendGrid, AWS SES
 * - Usar el SMTP API de Gmail (no recomendado para serverless)
 */

// ⚠️ CONFIGURACIÓN: Reemplaza con tus credenciales o usa variables de entorno
const GMAIL_CONFIG = {
  user: process.env.GMAIL_USER || 'telcokonradtobetobe@gmail.com',
  password: process.env.GMAIL_APP_PASSWORD || 'mrbbnamsbeukwnf',
  from: process.env.GMAIL_FROM || 'Telecomunicaciones Konrad Lorenz <telcokonradtobetobe@gmail.com>'
};

interface EmailRequest {
  to: string;
  subject: string;
  htmlContent: string;
  attachments?: Array<{
    name: string;
    contentType: string;
    contentBytes: string;
  }>;
}

/**
 * Handler principal del endpoint
 * 
 * NOTA: Este endpoint NO funcionará en edge functions porque nodemailer
 * requiere un runtime de Node.js completo. Para edge functions, usa
 * servicios como Resend o SendGrid que tienen APIs REST.
 */
export default async function handler(req: Request): Promise<Response> {
  // Solo aceptar POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Parsear body
    const emailData: EmailRequest = await req.json();

    // Validar datos requeridos
    if (!emailData.to || !emailData.subject || !emailData.htmlContent) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, htmlContent' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.to)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('📧 [Edge Function] Procesando envío de email a:', emailData.to);

    // ⚠️ ADVERTENCIA: Nodemailer no funciona aquí
    // Para edge functions, usa un servicio de email como:
    // - Resend (https://resend.com)
    // - SendGrid (https://sendgrid.com)
    // - AWS SES (https://aws.amazon.com/ses)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Este endpoint no está configurado para edge functions. Usa /server/index.js para desarrollo local o configura un servicio de email compatible con serverless.'
      }),
      {
        status: 501,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('❌ [Edge Function] Error procesando request:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Error interno del servidor'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Configuración para Vercel/Netlify Functions
 */
export const config = {
  runtime: 'nodejs' // o 'nodejs' dependiendo de tu plataforma
};
