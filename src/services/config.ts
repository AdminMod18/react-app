/**
 * Configuración de APIs y Servicios Externos
 *
 * IMPORTANTE:
 * - En PRODUCCIÓN, estas credenciales deben estar en un backend proxy
 * - NUNCA expongas API keys reales en el código del cliente
 * - El modo DEMO está activo por defecto y usa datos simulados
 * 
 * CONFIGURACIÓN DE GMAIL:
 * - Para usar el servicio de correo real, necesitas configurar las credenciales
 *   en /server/index.js (backend proxy)
 * - Usa una contraseña de aplicación de Gmail (no tu contraseña normal)
 * - Mientras tanto, el modo DEMO simula el envío de correos sin usar servicios reales
 */

// Modo de operación del sistema
// - DEMO: Simula APIs externas (perfecto para desarrollo/demos)
// - PRODUCTION: Usa APIs reales a través del backend proxy (requiere servidor backend)
export const API_MODE = "PRODUCTION"; // 'DEMO' | 'PRODUCTION'

/**
 * Configuración para modo PRODUCCIÓN
 * Reemplaza estos valores con tus credenciales reales cuando estés listo
 */
export const PRODUCTION_CONFIG = {
  registraduria: {
    baseUrl: "https://api.id-true.com/v2",
    apiKey: "YOUR_REAL_API_KEY_HERE",
    clientId: "TELCO-KONRAD",
  },

  dataCredito: {
    baseUrl: "https://api.datacredito.com.co",
    apiKey: "YOUR_REAL_API_KEY_HERE",
    username: "YOUR_USERNAME_HERE",
    password: "YOUR_PASSWORD_HERE",
  },

  transUnion: {
    baseUrl: "https://api.transunion.com.co",
    apiKey: "YOUR_REAL_API_KEY_HERE",
  },

  crm: {
    baseUrl: "https://api.yourcompany.com/crm",
    apiKey: "YOUR_REAL_API_KEY_HERE",
  },

  email: {
    provider: "gmail", // 'gmail' | 'resend' | 'sendgrid' | 'ses'
    user: "telcokonradtobetobe@gmail.com",
    password: "mrbbnamsbeukwnf",
    from: "Telecomunicaciones Konrad Lorenz <telcokonradtobetobe@gmail.com>",
  },
};

/**
 * Configuración para modo DEMO
 * Estos valores simulan endpoints (no son reales)
 */
export const DEMO_CONFIG = {
  registraduria: {
    baseUrl: "https://demo.registraduria.gov.co",
    apiKey: "DEMO_KEY",
    clientId: "DEMO_CLIENT",
  },

  dataCredito: {
    baseUrl: "https://demo.datacredito.com",
    apiKey: "DEMO_KEY",
    username: "demo_user",
    password: "demo_pass",
  },

  transUnion: {
    baseUrl: "https://demo.transunion.com.co",
    apiKey: "DEMO_KEY",
  },

  crm: {
    baseUrl: "https://demo.crm.com",
    apiKey: "DEMO_KEY",
  },

  email: {
    provider: "demo",
    user: "demo@example.com",
    password: "DEMO_KEY",
    from: "Demo <demo@example.com>",
  },
};

/**
 * Obtiene la configuración actual según el modo
 */
export function getConfig() {
  return API_MODE === "PRODUCTION"
    ? PRODUCTION_CONFIG
    : DEMO_CONFIG;
}

/**
 * Verifica si estamos en modo demo
 */
export function isDemoMode(): boolean {
  return API_MODE === "DEMO";
}