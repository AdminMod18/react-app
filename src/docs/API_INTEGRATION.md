# Guía de Integración de APIs - BPMS Konrad Lorenz

## 📋 Tabla de Contenidos

- [Microsoft Graph API](#microsoft-graph-api)
- [ID-TRUE (Validación de Identidad)](#id-true)
- [DataCrédito](#datacredito)
- [TransUnion](#transunion)
- [Backend Proxy](#backend-proxy)

## 📧 Microsoft Graph API

### Descripción

Microsoft Graph API permite enviar correos electrónicos desde una cuenta de Microsoft 365/Azure AD.

### Configuración Paso a Paso

#### 1. Registrar Aplicación en Azure AD

1. Ve a [Azure Portal](https://portal.azure.com)
2. Navega a **Azure Active Directory** → **App registrations**
3. Click en **New registration**
4. Completa:
   - **Name**: BPMS Konrad Lorenz Email Service
   - **Supported account types**: Single tenant
   - **Redirect URI**: No necesario para backend
5. Click en **Register**

#### 2. Obtener Credenciales

Después de crear la app, anota:

```
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Directory (tenant) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### 3. Crear Client Secret

1. En tu app, ve a **Certificates & secrets**
2. Click en **New client secret**
3. Descripción: "BPMS Email Service Secret"
4. Expiration: 24 meses (o el máximo)
5. Click en **Add**
6. **IMPORTANTE**: Copia el **Value** inmediatamente (no podrás verlo después)

```
Client Secret: tu_secret_aqui_muy_largo
```

#### 4. Configurar Permisos API

1. En tu app, ve a **API permissions**
2. Click en **Add a permission**
3. Selecciona **Microsoft Graph**
4. Selecciona **Application permissions** (no Delegated)
5. Busca y agrega:
   - ✅ `Mail.Send` - Enviar correos como cualquier usuario
6. Click en **Add permissions**
7. **IMPORTANTE**: Click en **Grant admin consent for [tu organización]**
8. Confirma

#### 5. Configurar Credenciales en el Backend

Edita `/api/send-email.ts`:

```typescript
const MICROSOFT_CONFIG = {
  clientId: 'tu_application_client_id',
  clientSecret: 'tu_client_secret',
  tenantId: 'tu_directory_tenant_id',
  userEmail: 'migueld.ruizs@konradlorenz.edu.co'
};
```

**Mejor práctica** - Usa variables de entorno:

```typescript
const MICROSOFT_CONFIG = {
  clientId: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  tenantId: process.env.MICROSOFT_TENANT_ID,
  userEmail: process.env.MICROSOFT_USER_EMAIL
};
```

#### 6. Activar Modo PRODUCTION

Edita `/services/config.ts`:

```typescript
export const API_MODE = 'PRODUCTION';
```

#### 7. Probar

1. Ve al Dashboard
2. Tab "Prueba de Email"
3. Ingresa un email de destino
4. Click en "Enviar Email de Prueba"
5. Verifica que llegue el email

### Arquitectura del Backend Proxy

```
Frontend (React)
    │
    ├─ POST /api/send-email
    │     {
    │       to: "cliente@example.com",
    │       subject: "Confirmación...",
    │       htmlContent: "...",
    │       attachments: [...]
    │     }
    │
    ↓
Backend Proxy (/api/send-email.ts)
    │
    ├─ Obtiene token de Microsoft
    │  POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
    │
    ├─ Envía email via Microsoft Graph
    │  POST https://graph.microsoft.com/v1.0/users/{user}/sendMail
    │
    ↓
Email enviado ✅
```

### Solución de Problemas

#### Error: "Unauthorized" o "Invalid client"

**Causa**: Credenciales incorrectas

**Solución**:
1. Verifica Client ID, Client Secret y Tenant ID
2. Asegúrate de que no haya espacios extra
3. Verifica que el secreto no haya expirado

#### Error: "Insufficient privileges"

**Causa**: Permisos no configurados o no aceptados

**Solución**:
1. Ve a Azure AD → Tu App → API permissions
2. Verifica que `Mail.Send` esté en la lista
3. Verifica que tenga "✅ Granted for [org]"
4. Si no, click en "Grant admin consent"

#### Error: "Mailbox not found"

**Causa**: El email del remitente no existe o está mal escrito

**Solución**:
1. Verifica que el email en `userEmail` sea correcto
2. Asegúrate de que sea una cuenta activa de Microsoft 365

#### Error: CORS

**Causa**: Intentando llamar a Microsoft Graph directamente desde el frontend

**Solución**: Usa el backend proxy en `/api/send-email.ts` (ya implementado)

Ver más en [DEVELOPMENT.md](./DEVELOPMENT.md#cors)

## 🆔 ID-TRUE

### Descripción

ID-TRUE permite validar identidades consultando la Registraduría Nacional de Colombia.

### Configuración

```typescript
// /services/config.ts
registraduria: {
  baseUrl: "https://api.id-true.com/v2",
  apiKey: "TU_API_KEY_AQUI",
  clientId: "TELCO-KONRAD",
}
```

### Uso

```typescript
import { validateIdentity } from './services/api';

const result = await validateIdentity({
  documentType: 'CC',
  documentNumber: '12345678',
  firstName: 'Juan',
  lastName: 'Pérez'
});

if (result.valid) {
  console.log('Identidad verificada ✅');
} else {
  console.log('Identidad no verificada ❌');
}
```

### Obtener Credenciales

1. Contacta a ID-TRUE: https://id-true.com
2. Solicita cuenta empresarial
3. Obtén API Key y Client ID

### Modo DEMO

En modo DEMO, la validación siempre retorna éxito con datos simulados:

```typescript
// Respuesta simulada en modo DEMO
{
  valid: true,
  score: 95,
  details: {
    documentMatch: true,
    nameMatch: true,
    photoMatch: true
  }
}
```

## 💳 DataCrédito

### Descripción

DataCrédito permite consultar el historial crediticio de personas en Colombia.

### Configuración

```typescript
// /services/config.ts
dataCredito: {
  baseUrl: "https://api.datacredito.com.co",
  apiKey: "TU_API_KEY_AQUI",
  username: "TU_USERNAME_AQUI",
  password: "TU_PASSWORD_AQUI",
}
```

### Uso

```typescript
import { validateCredit } from './services/api';

const result = await validateCredit({
  documentType: 'CC',
  documentNumber: '12345678',
  firstName: 'Juan',
  lastName: 'Pérez'
});

console.log('Score crediticio:', result.score); // 0-999
console.log('Estado:', result.status); // 'approved' | 'rejected' | 'review'
```

### Obtener Credenciales

1. Contacta a DataCrédito: https://www.datacredito.com.co
2. Solicita cuenta empresarial
3. Solicita acceso a API
4. Obtén credenciales (API Key, Username, Password)

### Modo DEMO

En modo DEMO, retorna un score aleatorio entre 650-800:

```typescript
{
  score: 720,
  status: 'approved',
  details: {
    openAccounts: 3,
    closedAccounts: 2,
    delinquencies: 0
  }
}
```

## 🔍 TransUnion

### Descripción

TransUnion es una alternativa a DataCrédito para consultas crediticias.

### Configuración

```typescript
// /services/config.ts
transUnion: {
  baseUrl: "https://api.transunion.com.co",
  apiKey: "TU_API_KEY_AQUI",
}
```

### Uso

Similar a DataCrédito. Ver `/services/api.ts` para implementación.

## 🌉 Backend Proxy

### ¿Por Qué un Backend Proxy?

Las llamadas directas desde el frontend a APIs externas causan:

1. **Problemas de CORS**: El navegador bloquea las llamadas
2. **Seguridad**: Expones API keys en el código del cliente
3. **Control**: No puedes agregar validaciones o logging

### Arquitectura

```
Frontend → Backend Proxy → API Externa
         (tu servidor)
```

### Implementación

El backend proxy ya está implementado para Microsoft Graph en `/api/send-email.ts`.

#### Estructura del Endpoint

```typescript
// /api/send-email.ts
export default async function handler(req, res) {
  // 1. Validar request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Extraer datos
  const { to, subject, htmlContent, attachments } = req.body;

  // 3. Obtener token de Microsoft
  const token = await getAccessToken();

  // 4. Enviar email via Microsoft Graph
  const result = await sendEmail(token, to, subject, htmlContent);

  // 5. Retornar resultado
  res.status(200).json({ success: true, messageId: result.id });
}
```

#### Ventajas

- ✅ Sin problemas de CORS
- ✅ Credenciales seguras en el servidor
- ✅ Logging centralizado
- ✅ Validaciones adicionales
- ✅ Rate limiting posible
- ✅ Caché de tokens

### Desplegar Backend Proxy

#### Opción 1: Vercel

```bash
# En la raíz del proyecto
vercel deploy
```

#### Opción 2: Azure Functions

```bash
# Crear Azure Function
func init --worker-runtime node
func new --name send-email --template "HTTP trigger"

# Copiar código de /api/send-email.ts
# Desplegar
func azure functionapp publish nombre-de-tu-function-app
```

#### Opción 3: AWS Lambda

Usar API Gateway + Lambda con el mismo código.

#### Opción 4: VPS/Docker

```bash
# Crear servidor Express
npm install express cors
# Agregar endpoint /api/send-email
# Desplegar en VPS (DigitalOcean, Linode, etc)
```

## 🔐 Seguridad Best Practices

### 1. Variables de Entorno

**❌ Nunca hagas esto:**

```typescript
const API_KEY = 'pk_live_12345...'; // Hardcoded
```

**✅ Haz esto:**

```typescript
const API_KEY = process.env.API_KEY;
```

### 2. Servicios de Secretos

Para producción, usa:

- **Azure Key Vault** (si usas Azure)
- **AWS Secrets Manager** (si usas AWS)
- **HashiCorp Vault** (multi-cloud)

### 3. Rotación de Secretos

- Rota las API keys cada 3-6 meses
- Usa secretos con expiración automática
- Implementa sistema de alertas

### 4. Least Privilege

- Da solo los permisos necesarios
- No uses cuentas de administrador
- Revisa permisos regularmente

## 📊 Monitoreo

### Logs

Implementa logging en el backend proxy:

```typescript
console.log('[EMAIL] Enviando a:', to);
console.log('[EMAIL] Resultado:', success ? 'OK' : 'FAIL');
```

### Métricas

Monitorea:
- Cantidad de emails enviados
- Tasa de éxito/fallo
- Tiempo de respuesta
- Errores por tipo

### Alertas

Configura alertas para:
- Tasa de fallos > 5%
- APIs caídas
- Credenciales expiradas
- Rate limits alcanzados

## 🧪 Testing

### Modo DEMO para Testing

El modo DEMO es perfecto para:
- ✅ Testing automatizado
- ✅ CI/CD
- ✅ Desarrollo local
- ✅ Demos con clientes

### Testing de APIs Reales

Usa cuentas de sandbox/test cuando estén disponibles:

```typescript
// Ejemplo
const config = process.env.NODE_ENV === 'production'
  ? PRODUCTION_CONFIG
  : SANDBOX_CONFIG;
```

## 📚 Referencias

- [Microsoft Graph API Docs](https://docs.microsoft.com/graph)
- [Azure AD App Registration](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)
- [ID-TRUE Docs](https://id-true.com/docs)
- [DataCrédito API](https://www.datacredito.com.co/api)

## 🆘 Soporte

¿Problemas con las integraciones?
- Ver [DEVELOPMENT.md](./DEVELOPMENT.md) para troubleshooting
- Contactar soporte: soporte@konrad.edu.co
