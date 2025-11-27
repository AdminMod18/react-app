# Configuración de Gmail para BPMS Konrad Lorenz

Esta guía explica cómo configurar Gmail para enviar emails desde el sistema BPMS.

## 📋 Información de la Cuenta

**Email**: telcokonradtobetobe@gmail.com  
**Nombre de aplicación**: ENVIO-MAILS-KONRAD-TELCO  
**Contraseña de aplicación**: `mrbbnamsbeukwnf`

## 🚀 Configuración Rápida

### 1. Configurar Backend Proxy

El backend ya está configurado con las credenciales correctas en `/server/index.js`:

```javascript
const GMAIL_CONFIG = {
  user: 'telcokonradtobetobe@gmail.com',
  password: 'mrbbnamsbeukwnf',
  from: 'Telecomunicaciones Konrad Lorenz <telcokonradtobetobe@gmail.com>'
};
```

### 2. Instalar Dependencias

```bash
cd server
npm install
```

Esto instalará:
- express
- cors
- dotenv
- nodemailer (para Gmail)

### 3. Iniciar el Servidor

```bash
cd server
npm start
```

Deberías ver:
```
🚀 Backend Proxy Server iniciado (Gmail SMTP)
📍 Escuchando en: http://localhost:3001
✅ Health check: http://localhost:3001/api/health
📧 Email endpoint: http://localhost:3001/api/send-email
```

### 4. Probar el Envío

Desde el frontend, el sistema automáticamente enviará emails cuando completes un caso.

## 🔐 Seguridad de Contraseñas de Aplicación

### ¿Qué es una contraseña de aplicación?

Una contraseña de aplicación es una contraseña de 16 caracteres que permite que aplicaciones y dispositivos accedan a tu cuenta de Google sin usar tu contraseña principal.

### ¿Por qué usar contraseñas de aplicación?

1. **Seguridad**: No expones tu contraseña principal
2. **Control**: Puedes revocar el acceso en cualquier momento
3. **Compatibilidad**: Funciona con apps que no soportan verificación en 2 pasos

### Cómo generar una nueva contraseña de aplicación

Si necesitas generar una nueva contraseña:

1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. Asegúrate de tener **Verificación en 2 pasos** habilitada
3. Busca "Contraseñas de aplicaciones" (App Passwords)
4. Click en "Seleccionar app" → Elige "Correo"
5. Click en "Seleccionar dispositivo" → Elige "Otro (nombre personalizado)"
6. Escribe "BPMS Konrad Telco"
7. Click en "Generar"
8. Copia la contraseña de 16 caracteres (sin espacios)
9. Actualiza el archivo `/server/.env` o `/server/index.js`

### Revocar acceso

Si la contraseña se compromete:

1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. Busca "Contraseñas de aplicaciones"
3. Click en el ícono de basura junto a "BPMS Konrad Telco"
4. Genera una nueva contraseña siguiendo los pasos anteriores

## ⚠️ Límites de Gmail

### Cuentas Gratuitas (@gmail.com)

- **500 emails por día**
- **100 destinatarios por email**
- **25 MB por email** (incluyendo adjuntos)

### Gmail Workspace (Google Workspace)

Para necesidades mayores, considera Gmail Workspace:

- **2,000 emails por día** (puede aumentar a 10,000 con solicitud)
- **10,000 destinatarios externos por día**
- **50 MB por email**
- Soporte técnico
- Dominio personalizado (@konrad.edu.co)

Costo: Desde $6 USD/mes por usuario

## 🧪 Testing

### Test desde la Terminal

```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "tu-email@example.com",
    "subject": "Test desde BPMS",
    "htmlContent": "<h1>Este es un email de prueba</h1><p>Si recibes esto, Gmail está funcionando correctamente.</p>"
  }'
```

### Test desde el Frontend

1. Inicia el sistema BPMS
2. Ve a la página de casos
3. Crea un nuevo caso y completa todos los pasos
4. El sistema enviará automáticamente el email de confirmación

## 🔧 Solución de Problemas

### Error: "Invalid login"

**Causas**:
- No estás usando una contraseña de aplicación
- La verificación en 2 pasos no está habilitada
- La contraseña tiene espacios

**Solución**:
1. Verifica que uses una **contraseña de aplicación**, no tu contraseña normal
2. Habilita la verificación en 2 pasos en tu cuenta de Google
3. Genera una nueva contraseña de aplicación
4. Asegúrate de que no tenga espacios al copiarla

### Error: "Daily sending quota exceeded"

**Causa**: Has enviado más de 500 emails en 24 horas

**Solución**:
1. Espera 24 horas para que se restablezca el límite
2. Considera usar Gmail Workspace
3. Implementa un sistema de cola de emails

### Los emails van a spam

**Causas**:
- Gmail gratis no tiene buena reputación de envío
- Falta configuración SPF/DKIM/DMARC
- Contenido parece spam

**Solución**:
1. Pide a los destinatarios que agreguen el email a contactos
2. Usa Gmail Workspace con dominio personalizado
3. Configura SPF, DKIM y DMARC para tu dominio
4. Evita palabras que activen filtros de spam
5. Incluye opción de "darse de baja" en emails masivos

### Error: "Connection timeout"

**Causas**:
- Firewall bloqueando puerto 465/587
- Problemas de red
- Gmail caído (raro)

**Solución**:
1. Verifica tu conexión a internet
2. Desactiva temporalmente el firewall para probar
3. Verifica el estado de Gmail: [Google Workspace Status Dashboard](https://www.google.com/appsstatus/dashboard/)

## 📊 Monitoreo

### Ver emails enviados

1. Inicia sesión en telcokonradtobetobe@gmail.com
2. Ve a "Enviados"
3. Todos los emails enviados aparecerán ahí

### Logs del servidor

El servidor muestra logs detallados en la consola:

```
📧 [Proxy] Procesando envío de email a: cliente@example.com
✅ Email enviado con Gmail: <message-id@gmail.com>
✅ [Proxy] Email enviado exitosamente
```

## 🚀 Mejores Prácticas

### Para Desarrollo

1. Usa el modo DEMO cuando no necesites enviar emails reales
2. Cambia a modo PRODUCTION solo cuando pruebes el flujo completo
3. Usa tu email personal como destinatario de prueba

### Para Producción

1. **Usa Gmail Workspace** con dominio personalizado
2. **Configura SPF/DKIM/DMARC** para tu dominio
3. **Implementa rate limiting** en el backend
4. **Monitorea el uso** para no exceder límites
5. **Ten un plan B** (servicio SMTP alternativo)

## 📚 Referencias

- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [App Passwords](https://support.google.com/accounts/answer/185833)
- [Gmail Sending Limits](https://support.google.com/a/answer/166852)
- [Nodemailer Documentation](https://nodemailer.com/)

## 🆘 Soporte

¿Problemas con Gmail?

1. Revisa los logs del servidor
2. Verifica las credenciales en `/server/.env`
3. Consulta esta documentación
4. Contacta: soporte@konrad.edu.co
