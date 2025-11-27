/**
 * Backend Proxy Server para Gmail SMTP
 * 
 * Este servidor maneja el envío de correos a través de Gmail usando nodemailer.
 * Mantiene las credenciales seguras y evita problemas de CORS.
 * 
 * Instalación:
 * npm install express cors dotenv nodemailer
 * 
 * Uso:
 * node server/index.js
 * 
 * O agregar a package.json:
 * "scripts": {
 *   "server": "node server/index.js",
 *   "dev:full": "npm run server & npm run dev"
 * }
 */

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite default ports
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Para soportar adjuntos grandes

// ⚠️ CONFIGURACIÓN: Reemplaza con tus credenciales o usa .env
const GMAIL_CONFIG = {
  user: process.env.GMAIL_USER || 'telcokonradtobetobe@gmail.com',
  password: process.env.GMAIL_APP_PASSWORD || 'mrbbnamsbeukwnf',
  from: process.env.GMAIL_FROM || 'Telecomunicaciones Konrad Lorenz <telcokonradtobetobe@gmail.com>'
};

/**
 * Crea el transporter de nodemailer para Gmail
 */
function createGmailTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_CONFIG.user,
      pass: GMAIL_CONFIG.password
    }
  });
}

/**
 * Envía un email usando Gmail SMTP
 */
async function sendEmailWithGmail(emailData) {
  const transporter = createGmailTransporter();

  // Preparar adjuntos
  const attachments = emailData.attachments?.map(att => ({
    filename: att.name,
    content: Buffer.from(att.contentBytes, 'base64'),
    contentType: att.contentType
  })) || [];

  // Configurar el mensaje
  const mailOptions = {
    from: GMAIL_CONFIG.from,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.htmlContent,
    attachments: attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado con Gmail:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Error enviando email con Gmail:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================
// ENDPOINTS
// ============================================

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend proxy is running (Gmail)',
    timestamp: new Date().toISOString()
  });
});

/**
 * Endpoint para enviar emails
 */
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, htmlContent, attachments } = req.body;

    // Validar datos requeridos
    if (!to || !subject || !htmlContent) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: to, subject, htmlContent' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    console.log('📧 [Proxy] Procesando envío de email a:', to);

    // Enviar email con Gmail
    const result = await sendEmailWithGmail({
      to,
      subject,
      htmlContent,
      attachments
    });

    if (result.success) {
      console.log('✅ [Proxy] Email enviado exitosamente');
      res.json({
        success: true,
        messageId: result.messageId,
        message: 'Email enviado exitosamente'
      });
    } else {
      console.error('❌ [Proxy] Error enviando email:', result.error);
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ [Proxy] Error procesando request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Backend Proxy Server iniciado (Gmail SMTP)`);
  console.log(`📍 Escuchando en: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Email endpoint: http://localhost:${PORT}/api/send-email`);
  console.log(`\n⚙️  Configuración Gmail:`);
  console.log(`   Email: ${GMAIL_CONFIG.user}`);
  console.log(`   From: ${GMAIL_CONFIG.from}`);
  console.log(`   Password: ${'*'.repeat(GMAIL_CONFIG.password.length)}`);
  console.log(`\n💡 Para usar el backend proxy, actualiza el frontend para llamar a http://localhost:${PORT}/api/send-email\n`);
});
