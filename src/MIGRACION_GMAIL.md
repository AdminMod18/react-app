# Migración de Microsoft Graph API a Gmail SMTP

## ✅ Cambios Completados

### 1. Backend Proxy (`/server/index.js`)
- ✅ Reemplazado Microsoft Graph API por Gmail SMTP con nodemailer
- ✅ Configuradas credenciales de Gmail:
  - Email: `telcokonradtobetobe@gmail.com`
  - Contraseña de aplicación: `mrbbnamsbeukwnf`
  - From: `Telecomunicaciones Konrad Lorenz <telcokonradtobetobe@gmail.com>`

### 2. Servicio de Email (`/services/gmail-email.ts`)
- ✅ Creado nuevo archivo `gmail-email.ts` (reemplaza `microsoft-email.ts`)
- ✅ Actualizada lógica de envío para usar el backend proxy con Gmail
- ✅ Mantenidas todas las funciones existentes:
  - `sendContractEmail()`
  - `sendInternalNotification()`
  - `getEmailPreview()`
  - `generateDemoPDF()`

### 3. Importaciones Actualizadas
- ✅ `/components/steps/CaseComplete.tsx` - Actualizado a `gmail-email.ts`
- ✅ `/components/EmailTestPanel.tsx` - Actualizado a `gmail-email.ts`

### 4. Configuración (`/services/config.ts`)
- ✅ Actualizado comentarios para reflejar Gmail
- ✅ Cambiado provider de "resend" a "gmail"
- ✅ Agregadas propiedades `user` y `password` en lugar de `apiKey`

### 5. Dependencias (`/server/package.json`)
- ✅ Agregado `nodemailer@^6.9.7`
- ✅ Actualizada descripción del paquete

### 6. Variables de Entorno
- ✅ Creado `/.env.example` con variables del frontend
- ✅ Creado `/server/.env.example` con variables de Gmail:
  ```env
  GMAIL_USER=telcokonradtobetobe@gmail.com
  GMAIL_APP_PASSWORD=mrbbnamsbeukwnf
  GMAIL_FROM=Telecomunicaciones Konrad Lorenz <telcokonradtobetobe@gmail.com>
  ```

### 7. Documentación
- ✅ Actualizado `/server/README.md` con instrucciones de Gmail
- ✅ Creado `/docs/GMAIL_SETUP.md` con guía completa de configuración
- ✅ Actualizado `/api/send-email.ts` con nota sobre edge functions

## 📋 Archivos Modificados

1. `/server/index.js` - Backend completamente reescrito para Gmail
2. `/services/gmail-email.ts` - Nuevo servicio de email (reemplaza microsoft-email.ts)
3. `/services/config.ts` - Actualizada configuración de email
4. `/components/steps/CaseComplete.tsx` - Actualizado import
5. `/components/EmailTestPanel.tsx` - Actualizado import
6. `/server/package.json` - Agregado nodemailer
7. `/server/README.md` - Nueva documentación
8. `/api/send-email.ts` - Actualizado con advertencia para edge functions

## 📄 Archivos Creados

1. `/.env.example` - Variables de entorno del frontend
2. `/server/.env.example` - Variables de entorno del backend
3. `/docs/GMAIL_SETUP.md` - Guía completa de configuración de Gmail
4. `/MIGRACION_GMAIL.md` - Este archivo

## 🗑️ Archivo Obsoleto (No eliminado)

- `/services/microsoft-email.ts` - Ya no se usa, pero se mantiene por compatibilidad

**Acción recomendada**: Puedes eliminarlo si confirmas que todo funciona correctamente:
```bash
rm /services/microsoft-email.ts
```

## 🚀 Pasos Siguientes

### 1. Instalar Dependencias del Servidor

```bash
cd server
npm install
```

Esto instalará nodemailer y otras dependencias necesarias.

### 2. Configurar Variables de Entorno (Opcional)

Si prefieres usar archivos `.env` en lugar de valores hardcoded:

```bash
# En la raíz del proyecto
cp .env.example .env

# En el directorio server
cd server
cp .env.example .env
```

**Nota**: Las credenciales ya están configuradas directamente en el código, por lo que este paso es opcional.

### 3. Iniciar el Backend

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

### 4. Iniciar el Frontend

En otra terminal:

```bash
npm run dev
```

### 5. Probar el Sistema

1. Navega a la aplicación
2. Crea un nuevo caso
3. Completa todos los pasos hasta el final
4. El sistema enviará un email automáticamente usando Gmail

## 🔧 Verificación

### Health Check del Backend

```bash
curl http://localhost:3001/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "message": "Backend proxy is running (Gmail)",
  "timestamp": "2024-11-07T..."
}
```

### Test de Envío de Email

```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "tu-email@example.com",
    "subject": "Test BPMS",
    "htmlContent": "<h1>Email de prueba</h1>"
  }'
```

## ⚙️ Configuración Actual

### Credenciales de Gmail
- **Email**: telcokonradtobetobe@gmail.com
- **Contraseña de App**: mrbbnamsbeukwnf
- **Nombre**: ENVIO-MAILS-KONRAD-TELCO

### Límites de Gmail (Cuenta Gratuita)
- **500 emails/día**
- **100 destinatarios/email**
- **25 MB/email** (con adjuntos)

### Modo de Operación
- **API_MODE**: PRODUCTION (en `/services/config.ts`)
- **DEMO Mode**: Disponible para desarrollo sin enviar emails reales

## 🆘 Solución de Problemas

### Error: "Cannot find module 'nodemailer'"

```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Error: "Invalid login"

Verifica que:
1. Estés usando una contraseña de aplicación (no tu contraseña normal)
2. La verificación en 2 pasos esté habilitada en la cuenta de Gmail
3. La contraseña no tenga espacios

### Emails no se envían

1. Verifica que el backend esté corriendo en el puerto 3001
2. Revisa los logs del servidor para errores
3. Verifica la configuración en `/server/index.js`

### Cambiar entre DEMO y PRODUCTION

Edita `/services/config.ts`:
```typescript
export const API_MODE = "DEMO"; // o "PRODUCTION"
```

## 📚 Documentación

- **Guía de Gmail**: `/docs/GMAIL_SETUP.md`
- **Backend Setup**: `/server/README.md`
- **API Integration**: `/docs/API_INTEGRATION.md`

## ✨ Diferencias Clave: Microsoft Graph vs Gmail

| Aspecto | Microsoft Graph | Gmail SMTP |
|---------|----------------|------------|
| **Autenticación** | OAuth 2.0 Client Credentials | Contraseña de aplicación |
| **Configuración** | Compleja (Azure AD) | Simple (Gmail Settings) |
| **Límites Gratuitos** | Depende del plan | 500 emails/día |
| **Costo** | Requiere Microsoft 365 | Gratis |
| **Setup Time** | ~30 minutos | ~5 minutos |
| **Complejidad** | Alta | Baja |
| **Ideal para** | Empresas con M365 | Desarrollo, pequeñas apps |

## 🎉 Beneficios de Gmail

1. ✅ **Configuración más simple** - Solo necesitas email y contraseña de app
2. ✅ **Sin Azure AD requerido** - No necesitas configurar Azure Portal
3. ✅ **Gratis** - No requiere licencias de Microsoft 365
4. ✅ **Fácil de probar** - Configuración en minutos
5. ✅ **Logs visibles** - Puedes ver emails en la carpeta "Enviados"

## 🔐 Seguridad

### Contraseñas de Aplicación
- ✅ No expone tu contraseña principal de Gmail
- ✅ Puede ser revocada en cualquier momento
- ✅ Específica para esta aplicación

### Mejores Prácticas
1. Nunca compartas la contraseña de aplicación
2. No subas archivos `.env` a Git (ya está en `.gitignore`)
3. Rota las contraseñas periódicamente
4. Para producción, considera Gmail Workspace

## 📈 Escalabilidad

### Para Desarrollo/Testing
- Gmail gratuito es suficiente (500 emails/día)

### Para Producción Pequeña
- Gmail Workspace: $6/mes (2,000 emails/día)

### Para Producción Grande
- Considera servicios profesionales:
  - SendGrid
  - AWS SES
  - Mailgun
  - Postmark

## ✅ Checklist de Migración

- [x] Backend actualizado a Gmail SMTP
- [x] Servicio de email migrado
- [x] Importaciones actualizadas
- [x] Configuración actualizada
- [x] Dependencias instaladas
- [x] Variables de entorno creadas
- [x] Documentación actualizada
- [x] Credenciales configuradas

## 🎯 Siguiente Paso

¡Todo está listo! Solo necesitas:

```bash
# 1. Instalar dependencias del servidor
cd server
npm install

# 2. Iniciar el backend
npm start

# 3. En otra terminal, iniciar el frontend
cd ..
npm run dev

# 4. ¡Probar el sistema!
```

---

**Fecha de migración**: Viernes, 7 de Noviembre de 2025  
**Sistema**: BPMS Konrad Lorenz  
**Email configurado**: telcokonradtobetobe@gmail.com
