# Guía de Configuración - BPMS Konrad Lorenz

## 🚀 Inicio Rápido (5 minutos)

### 1. Acceso al Sistema

El sistema está **listo para usar**. Solo necesitas:

```
URL: http://localhost:5173 (o tu puerto configurado)

Credenciales Asesor:
- Usuario: admin
- Contraseña: admin123

Credenciales Cliente:
- Documento: Cualquier número de 6+ dígitos
- Contrato: Cualquier número
```

### 2. Flujo Básico

1. **Inicio**: Visita `/` (landing page)
2. **Login**: Click en "Acceso Asesores" → Login
3. **Dashboard**: Visualiza KPIs en tiempo real
4. **Nueva Venta**: Click en "Nueva Venta" → Completa las 8 etapas
5. **Seguimiento**: Consulta casos en "Casos" y auditoría en "Auditoría"

### 3. Probar Envío de Emails

1. Ve al Dashboard
2. Click en la pestaña "Prueba de Email"
3. Ingresa un email de destino
4. Click en "Enviar Email de Prueba"
5. Revisa la consola del navegador (F12)

## 🔧 Configuración Avanzada

### Modo Demo vs Producción

El sistema funciona en dos modos configurables en `/services/config.ts`:

#### 🟢 Modo DEMO (Recomendado para Desarrollo)

```typescript
export const API_MODE = 'DEMO';
```

**Características:**
- ✅ Todas las integraciones son simuladas
- ✅ No requiere configuración de APIs
- ✅ Datos de prueba precargados
- ✅ Emails simulados en consola
- ✅ Funciona inmediatamente
- ✅ Sin costos de APIs

#### 🟡 Modo PRODUCTION

```typescript
export const API_MODE = 'PRODUCTION';
```

**Características:**
- ⚡ Integraciones reales con APIs externas
- ⚡ Envío de correos reales vía Microsoft Graph
- ⚡ Validaciones reales de identidad y crédito
- ⚠️ Requiere configuración de credenciales
- ⚠️ Requiere backend proxy para emails

## 📧 Configuración de Email (Microsoft Graph)

### Opción 1: Usar Modo DEMO (Recomendado)

No necesitas configurar nada. Los emails se simulan en consola.

```typescript
// /services/config.ts
export const API_MODE = 'DEMO';
```

### Opción 2: Backend Proxy (Producción)

Para enviar emails reales sin problemas de CORS:

1. **El backend proxy ya está implementado** en `/api/send-email.ts`

2. **Configura las credenciales de Microsoft**:

```typescript
// /api/send-email.ts (líneas 5-8)
const MICROSOFT_CONFIG = {
  clientId: 'TU_CLIENT_ID_AQUI',
  clientSecret: 'TU_CLIENT_SECRET_AQUI',
  tenantId: 'TU_TENANT_ID_AQUI',
  userEmail: 'tu-email@konradlorenz.edu.co'
};
```

3. **Cambia a modo PRODUCTION**:

```typescript
// /services/config.ts
export const API_MODE = 'PRODUCTION';
```

4. **Variables de Entorno** (Recomendado para producción):

En lugar de hardcodear las credenciales, usa variables de entorno:

```typescript
// /api/send-email.ts
const MICROSOFT_CONFIG = {
  clientId: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  tenantId: process.env.MICROSOFT_TENANT_ID,
  userEmail: process.env.MICROSOFT_USER_EMAIL
};
```

Crea un archivo `.env`:

```bash
MICROSOFT_CLIENT_ID=tu_client_id
MICROSOFT_CLIENT_SECRET=tu_client_secret
MICROSOFT_TENANT_ID=tu_tenant_id
MICROSOFT_USER_EMAIL=tu-email@konradlorenz.edu.co
```

### Obtener Credenciales de Microsoft Azure

Ver guía completa en [API_INTEGRATION.md](./API_INTEGRATION.md#microsoft-graph-api)

## 🔌 Configuración de APIs Externas

### ID-TRUE (Validación de Identidad)

```typescript
// /services/config.ts
export const PRODUCTION_CONFIG = {
  registraduria: {
    baseUrl: "https://api.id-true.com/v2",
    apiKey: "TU_API_KEY_AQUI",
    clientId: "TELCO-KONRAD",
  },
  // ...
};
```

### DataCrédito (Validación Crediticia)

```typescript
// /services/config.ts
dataCredito: {
  baseUrl: "https://api.datacredito.com.co",
  apiKey: "TU_API_KEY_AQUI",
  username: "TU_USERNAME_AQUI",
  password: "TU_PASSWORD_AQUI",
},
```

### TransUnion (Validación Crediticia Alternativa)

```typescript
// /services/config.ts
transUnion: {
  baseUrl: "https://api.transunion.com.co",
  apiKey: "TU_API_KEY_AQUI",
},
```

## 🏗️ Estructura de Configuración

### Archivo Principal: `/services/config.ts`

```typescript
// Cambiar entre DEMO y PRODUCTION
export const API_MODE = 'DEMO'; // o 'PRODUCTION'

// Configuración para modo PRODUCTION
export const PRODUCTION_CONFIG = {
  registraduria: { /* ... */ },
  dataCredito: { /* ... */ },
  transUnion: { /* ... */ },
  crm: { /* ... */ },
  email: { /* ... */ }
};

// Configuración para modo DEMO
export const DEMO_CONFIG = {
  // Valores simulados
};
```

### Servicios

- `/services/api.ts` - Integraciones con APIs externas
- `/services/microsoft-email.ts` - Servicio de email
- `/services/documents.ts` - Gestión de documentos
- `/api/send-email.ts` - Backend proxy para emails

## 🔐 Seguridad

### Best Practices

1. **Nunca expongas credenciales en el código**
   - Usa variables de entorno
   - Usa servicios de secretos (Azure Key Vault, AWS Secrets Manager)

2. **Backend Proxy**
   - Todas las llamadas a APIs externas deben pasar por tu backend
   - No expongas API keys en el frontend

3. **Autenticación**
   - Implementa autenticación robusta (JWT, OAuth2)
   - Valida tokens en cada request

4. **HTTPS**
   - Usa siempre HTTPS en producción
   - Configura certificados SSL/TLS

## 🚦 Checklist de Configuración

### Para Desarrollo

- [x] Sistema corriendo
- [x] Modo DEMO activo
- [x] Credenciales de prueba funcionando
- [ ] Probar todos los flujos del BPMS
- [ ] Probar envío de emails simulados

### Para Staging

- [ ] Cambiar a modo PRODUCTION
- [ ] Configurar credenciales de Microsoft (variables de entorno)
- [ ] Configurar backend proxy
- [ ] Probar envío de emails reales
- [ ] Configurar APIs externas (ID-TRUE, DataCrédito)

### Para Producción

- [ ] Variables de entorno configuradas
- [ ] Backend proxy en servidor
- [ ] HTTPS configurado
- [ ] Credenciales en servicio de secretos
- [ ] Logs y monitoreo configurados
- [ ] Backups configurados
- [ ] Plan de disaster recovery

## 🆘 Problemas Comunes

### Error: "Failed to fetch" al enviar emails

**Causa**: Problema de CORS (llamadas directas a Microsoft Graph desde el navegador)

**Solución**: Usa el backend proxy en `/api/send-email.ts`

Ver más en [DEVELOPMENT.md](./DEVELOPMENT.md#cors)

### Error: "Unauthorized" en APIs

**Causa**: Credenciales incorrectas o expiradas

**Solución**: 
1. Verifica las credenciales en `/services/config.ts`
2. Renueva tokens si es necesario
3. Verifica permisos en Azure AD

### Sistema no inicia

**Causa**: Puerto ocupado o dependencias faltantes

**Solución**:
```bash
# Instalar dependencias
npm install

# Cambiar puerto si es necesario
# Editar vite.config.ts
```

## 📚 Siguientes Pasos

1. ✅ [Integración de APIs](./API_INTEGRATION.md) - Configurar Microsoft Graph y otras APIs
2. ✅ [Guía de Desarrollo](./DEVELOPMENT.md) - Troubleshooting y mejores prácticas

## 🤝 Soporte

¿Necesitas ayuda?
- Email: soporte@konrad.edu.co
- Documentación adicional en `/docs`
