# Guía de Desarrollo - BPMS Konrad Lorenz

## 📋 Tabla de Contenidos

- [Entorno de Desarrollo](#entorno-de-desarrollo)
- [Problema CORS](#problema-cors)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Testing](#testing)

## 💻 Entorno de Desarrollo

### Requisitos

- Node.js 18+
- npm 9+
- Editor de código (VS Code recomendado)

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

### Estructura del Proyecto

```
/
├── App.tsx                   # Router principal
├── api/                      # Backend endpoints
│   └── send-email.ts         # Proxy para Microsoft Graph
├── components/               # Componentes React
│   ├── HomePage.tsx
│   ├── Dashboard.tsx
│   ├── NewCase.tsx
│   ├── CasesList.tsx
│   ├── AuditLog.tsx
│   ├── ClientView.tsx
│   ├── Login.tsx
│   ├── Layout/
│   │   └── AppLayout.tsx
│   ├── steps/                # 8 pasos del proceso
│   │   ├── IdentityValidation.tsx
│   │   ├── Enrollment.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── CreditValidation.tsx
│   │   ├── ServiceSelection.tsx
│   │   ├── ContractGeneration.tsx
│   │   ├── DigitalSignature.tsx
│   │   └── CaseComplete.tsx
│   └── ui/                   # Componentes shadcn
├── hooks/
│   └── useAuth.ts            # Hook de autenticación
├── services/
│   ├── api.ts                # APIs externas
│   ├── config.ts             # Configuración
│   ├── documents.ts          # Gestión de documentos
│   └── microsoft-email.ts    # Servicio de email
└── styles/
    └── globals.css
```

## 🚫 Problema CORS

### ¿Qué es CORS?

**CORS** = Cross-Origin Resource Sharing

Es una política de seguridad de navegadores que **bloquea** llamadas de JavaScript a APIs en dominios diferentes.

### El Problema

```
Tu App (localhost:5173) → Microsoft Graph (graph.microsoft.com)
                        ❌ BLOQUEADO POR EL NAVEGADOR
```

### ¿Por Qué Existe?

**Seguridad**: Previene que sitios maliciosos accedan a APIs sin autorización.

### Síntomas

En la consola del navegador ves:

```
❌ Access to fetch at 'https://graph.microsoft.com' from origin 'http://localhost:5173'
   has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.

❌ Failed to fetch
```

### Arquitecturas

#### ❌ NO Funciona (Frontend Directo)

```
Frontend (localhost:5173)
    │
    └─ fetch('https://graph.microsoft.com')
            ↓
       ❌ CORS Error
```

#### ✅ Funciona (Backend Proxy)

```
Frontend (localhost:5173)
    │
    └─ fetch('/api/send-email')  ← Mismo origen, sin CORS
            ↓
       Backend (/api/send-email.ts)
            │
            └─ fetch('https://graph.microsoft.com')
                    ↓
               ✅ Funciona (backend no tiene CORS)
```

### Solución Implementada

El sistema usa un **backend proxy** en `/api/send-email.ts`:

```typescript
// Frontend llama al proxy
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'cliente@example.com',
    subject: 'Confirmación',
    htmlContent: '<html>...</html>',
    attachments: []
  })
});

// El proxy llama a Microsoft Graph (sin CORS)
```

### Alternativas

#### 1. Backend Proxy (Implementada) ⭐

**Ventajas**:
- ✅ Sin CORS
- ✅ Credenciales seguras
- ✅ Control total

**Desventajas**:
- ⚠️ Necesitas servidor

#### 2. Modo DEMO (Para Desarrollo) ⭐

**Ventajas**:
- ✅ Sin configuración
- ✅ Funciona inmediatamente
- ✅ Perfecto para desarrollo

**Desventajas**:
- ❌ No envía emails reales

#### 3. Servicios de Email Alternativos

Usar SendGrid, Resend, AWS SES en lugar de Microsoft Graph.

**Ventajas**:
- ✅ APIs diseñadas para frontend
- ✅ Sin CORS
- ✅ Fácil integración

**Desventajas**:
- ⚠️ Otro proveedor
- ⚠️ Costos adicionales

## 🔧 Troubleshooting

### Error: "Failed to fetch" en Emails

**Causa**: Problema de CORS o credenciales incorrectas

**Solución**:

1. Verifica que estés usando el backend proxy:
```typescript
// /services/microsoft-email.ts debe llamar a /api/send-email
const response = await fetch('/api/send-email', { /* ... */ });
```

2. Verifica credenciales en `/api/send-email.ts`

3. Revisa logs en consola del backend

4. Si todo falla, usa modo DEMO:
```typescript
// /services/config.ts
export const API_MODE = 'DEMO';
```

### Error: "Unauthorized" o "Invalid client"

**Causa**: Credenciales de Microsoft incorrectas

**Solución**:

1. Verifica Client ID en `/api/send-email.ts`
2. Verifica Client Secret (no debe tener espacios)
3. Verifica Tenant ID
4. Verifica que el secreto no haya expirado en Azure AD

### Error: "Insufficient privileges"

**Causa**: Permisos no configurados en Azure AD

**Solución**:

1. Ve a Azure Portal → Azure AD → Tu App
2. Ve a "API permissions"
3. Verifica que `Mail.Send` esté presente
4. Click en "Grant admin consent"
5. Espera 5-10 minutos para que se propague

### Error: "Mailbox not found"

**Causa**: Email del remitente incorrecto

**Solución**:

Verifica en `/api/send-email.ts`:
```typescript
const MICROSOFT_CONFIG = {
  // ...
  userEmail: 'email-correcto@konradlorenz.edu.co' // ← Verifica este
};
```

### Sistema Lento o No Responde

**Causa**: Datos muy grandes en localStorage o memoria

**Solución**:

1. Limpia localStorage:
```javascript
localStorage.clear();
```

2. Reinicia el navegador

3. Limpia caché del navegador

### Dashboard No Muestra Datos

**Causa**: Datos no cargados o error en cálculos

**Solución**:

1. Revisa consola del navegador (F12)
2. Verifica que haya casos creados
3. Crea un caso de prueba en "Nueva Venta"
4. Refresca la página

## ✅ Best Practices

### 1. Manejo de Estado

Usa localStorage para persistencia:

```typescript
// Guardar
localStorage.setItem('bpms_cases', JSON.stringify(cases));

// Cargar
const savedCases = localStorage.getItem('bpms_cases');
const cases = savedCases ? JSON.parse(savedCases) : [];
```

### 2. Manejo de Errores

Siempre usa try-catch:

```typescript
try {
  const result = await sendEmail(to, subject, body);
  toast.success('Email enviado exitosamente');
} catch (error) {
  console.error('Error:', error);
  toast.error('Error al enviar email');
}
```

### 3. Validaciones

Valida datos antes de procesar:

```typescript
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateDocument(doc: string): boolean {
  return doc.length >= 6 && /^\d+$/.test(doc);
}
```

### 4. Logging

Usa console.log estratégicamente:

```typescript
// ✅ Bueno
console.log('[EMAIL] Enviando a:', to);
console.log('[EMAIL] Resultado:', success);

// ❌ Malo (demasiado)
console.log('x', x);
console.log('y', y);
```

### 5. Tipos TypeScript

Define tipos claros:

```typescript
interface Case {
  id: string;
  clientName: string;
  documentNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  currentStep: number;
  createdAt: string;
  // ...
}
```

### 6. Componentes Reutilizables

Extrae lógica común:

```typescript
// ✅ Bueno
function StatusBadge({ status }: { status: string }) {
  const colors = {
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded ${colors[status]}`}>
      {status}
    </span>
  );
}

// ❌ Malo (repetir código en cada componente)
```

### 7. Performance

Optimiza renders:

```typescript
// Usa React.memo para componentes que no cambian frecuentemente
const ExpensiveComponent = React.memo(({ data }) => {
  // ...
});

// Usa useMemo para cálculos costosos
const stats = useMemo(() => {
  return calculateStats(cases);
}, [cases]);
```

### 8. Seguridad

```typescript
// ❌ Nunca expongas credenciales
const API_KEY = 'pk_live_12345...';

// ✅ Usa variables de entorno
const API_KEY = process.env.API_KEY;

// ✅ Usa backend proxy para APIs
```

## 🧪 Testing

### Testing Manual

1. **Flujo Completo de Venta**:
   - Login como asesor
   - Click en "Nueva Venta"
   - Completa las 8 etapas
   - Verifica email enviado (consola o real)
   - Verifica caso en "Casos"
   - Verifica auditoría en "Auditoría"

2. **Dashboard**:
   - Verifica métricas se actualizan
   - Crea varios casos
   - Verifica gráficas

3. **Portal Cliente**:
   - Login con documento y contrato
   - Verifica información del caso
   - Verifica documentos descargables

### Testing Automatizado

```typescript
// Ejemplo con Vitest
import { describe, it, expect } from 'vitest';
import { validateEmail, validateDocument } from './utils';

describe('Validaciones', () => {
  it('valida emails correctos', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid')).toBe(false);
  });

  it('valida documentos correctos', () => {
    expect(validateDocument('123456')).toBe(true);
    expect(validateDocument('12345')).toBe(false);
    expect(validateDocument('abc123')).toBe(false);
  });
});
```

### Testing de APIs

Usa modo DEMO para testing:

```typescript
// /services/config.ts
export const API_MODE = process.env.NODE_ENV === 'test' 
  ? 'DEMO' 
  : 'PRODUCTION';
```

## 📊 Debugging

### Chrome DevTools

1. **Console** (F12): Ver logs y errores
2. **Network**: Ver requests HTTP
3. **Application → LocalStorage**: Ver datos guardados
4. **React DevTools**: Inspeccionar componentes

### Logs Útiles

Agrega logs estratégicos:

```typescript
// En servicios
console.log('[API] Llamando a:', endpoint);
console.log('[API] Respuesta:', response);

// En componentes
console.log('[Dashboard] Casos cargados:', cases.length);
console.log('[NewCase] Paso actual:', currentStep);
```

### Errores Comunes

```typescript
// ❌ Error: Cannot read property 'x' of undefined
// Solución: Usa optional chaining
const value = obj?.prop?.value;

// ❌ Error: map is not a function
// Solución: Verifica que sea un array
const items = Array.isArray(data) ? data : [];

// ❌ Error: Maximum update depth exceeded
// Solución: No llamar setState directamente en render
useEffect(() => {
  setState(value); // ✅ Correcto
}, []);
```

## 🚀 Deployment

### Build

```bash
npm run build
```

Genera carpeta `/dist` con los archivos estáticos.

### Opciones de Deployment

#### 1. Vercel (Recomendado)

```bash
vercel deploy
```

- ✅ Gratis para proyectos pequeños
- ✅ Serverless functions incluidas
- ✅ HTTPS automático
- ✅ Git integration

#### 2. Netlify

```bash
netlify deploy
```

Similar a Vercel.

#### 3. Azure Static Web Apps

Para integración completa con Azure AD y Microsoft Graph.

#### 4. VPS/Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📚 Recursos

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Vite Docs](https://vitejs.dev)

## 🆘 Soporte

¿Necesitas ayuda con desarrollo?
- Email: soporte@konrad.edu.co
- Ver otras guías en `/docs`
