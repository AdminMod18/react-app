# Configuración del Backend Proxy - BPMS Konrad Lorenz

## 🎯 ¿Por Qué Necesitas un Backend?

El navegador bloquea llamadas directas a Microsoft Graph API por CORS (Cross-Origin Resource Sharing). 

El backend proxy:
- ✅ Resuelve problemas de CORS
- ✅ Mantiene credenciales seguras (no expuestas en el frontend)
- ✅ Centraliza logging y manejo de errores

## 🚀 Opción 1: Modo DEMO (Sin Backend - Recomendado para Desarrollo)

**Para empezar rápido sin configurar backend:**

1. Edita `/services/config.ts`:
```typescript
export const API_MODE = "DEMO";
```

2. Reinicia la aplicación

3. Los emails se simularán en consola ✅

## 🔧 Opción 2: Backend Local (Node.js/Express)

### Paso 1: Instalar Dependencias del Backend

```bash
cd server
npm install
```

Esto instalará:
- `express` - Servidor web
- `cors` - Manejo de CORS
- `dotenv` - Variables de entorno

### Paso 2: Configurar Credenciales

1. Copia el archivo de ejemplo:
```bash
cd server
cp .env.example .env
```

2. Edita `server/.env` con tus credenciales de Azure:
```env
PORT=3001
MICROSOFT_CLIENT_ID=tu_client_id_aqui
MICROSOFT_CLIENT_SECRET=tu_client_secret_aqui
MICROSOFT_TENANT_ID=tu_tenant_id_aqui
MICROSOFT_USER_EMAIL=migueld.ruizs@konradlorenz.edu.co
```

**¿Cómo obtener estas credenciales?**
Ver [API_INTEGRATION.md](./API_INTEGRATION.md#microsoft-graph-api)

### Paso 3: Iniciar el Backend

```bash
cd server
npm start
```

Deberías ver:
```
🚀 Backend Proxy Server iniciado
📍 Escuchando en: http://localhost:3001
✅ Health check: http://localhost:3001/api/health
📧 Email endpoint: http://localhost:3001/api/send-email
```

### Paso 4: Configurar el Frontend

1. En la raíz del proyecto, crea un archivo `.env`:
```bash
cp .env.example .env
```

2. Edita `.env`:
```env
VITE_BACKEND_URL=http://localhost:3001
```

3. Edita `/services/config.ts`:
```typescript
export const API_MODE = "PRODUCTION";
```

### Paso 5: Probar

1. Con el backend corriendo, inicia el frontend en otra terminal:
```bash
npm run dev
```

2. Ve al Dashboard → Tab "Prueba de Email"

3. Envía un email de prueba

4. Verifica en la consola del backend que se procese correctamente

## 🌐 Opción 3: Desplegar Backend en Producción

### Vercel/Netlify Functions

Convierte el backend a serverless functions.

**Ejemplo para Vercel:**

1. Crea `/api/send-email.js` en la raíz:
```javascript
// Igual contenido que server/index.js pero como function handler
module.exports = async (req, res) => {
  // ... código del handler
};
```

2. Despliega:
```bash
vercel deploy
```

### Azure Functions

Perfecto si ya usas Azure AD:

```bash
# Crear Azure Function
func init --worker-runtime node
func new --name send-email --template "HTTP trigger"

# Copiar código
# Desplegar
func azure functionapp publish nombre-de-tu-function-app
```

### VPS/Docker

**Dockerfile:**
```dockerfile
FROM node:18
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
EXPOSE 3001
CMD ["node", "index.js"]
```

**Desplegar:**
```bash
docker build -t bpms-backend .
docker run -p 3001:3001 --env-file server/.env bpms-backend
```

## ⚙️ Configuración Avanzada

### Variables de Entorno del Frontend

```env
# .env (raíz del proyecto)

# Backend URL (desarrollo)
VITE_BACKEND_URL=http://localhost:3001

# Backend URL (producción)
# VITE_BACKEND_URL=https://api.tu-dominio.com
```

### Variables de Entorno del Backend

```env
# server/.env

# Puerto del servidor
PORT=3001

# Microsoft Graph credentials
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx
MICROSOFT_TENANT_ID=xxx
MICROSOFT_USER_EMAIL=xxx

# Orígenes permitidos (CORS)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://tu-dominio.com
```

### Scripts de NPM

Agrega a tu `package.json` principal:

```json
{
  "scripts": {
    "dev": "vite",
    "server": "cd server && npm start",
    "dev:full": "concurrently \"npm run dev\" \"npm run server\"",
    "build": "vite build"
  }
}
```

Instala `concurrently` para ejecutar ambos:
```bash
npm install -D concurrently
```

Luego ejecuta todo con:
```bash
npm run dev:full
```

## 🔒 Seguridad

### ✅ Buenas Prácticas

1. **Nunca expongas credenciales en el código**
   ```javascript
   // ❌ Malo
   const clientSecret = 'abc123...';
   
   // ✅ Bueno
   const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
   ```

2. **Usa HTTPS en producción**
   ```javascript
   // Configurar certificados SSL
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('key.pem'),
     cert: fs.readFileSync('cert.pem')
   };
   
   https.createServer(options, app).listen(443);
   ```

3. **Implementa rate limiting**
   ```bash
   npm install express-rate-limit
   ```
   
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 100 // límite de requests
   });
   
   app.use('/api/', limiter);
   ```

4. **Valida y sanitiza inputs**
   ```bash
   npm install express-validator
   ```

5. **Usa servicios de secretos**
   - Azure Key Vault
   - AWS Secrets Manager
   - HashiCorp Vault

## 🧪 Testing

### Probar el Backend

```bash
# Health check
curl http://localhost:3001/api/health

# Enviar email de prueba
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test",
    "htmlContent": "<h1>Test</h1>"
  }'
```

### Logs

El backend muestra logs detallados:
```
📧 [Proxy] Procesando envío de email a: test@example.com
✅ [Proxy] Token obtenido exitosamente
✅ [Proxy] Email enviado exitosamente
```

## 🆘 Troubleshooting

### Error: "Cannot find module 'express'"

```bash
cd server
npm install
```

### Error: "EADDRINUSE: address already in use"

El puerto 3001 está ocupado. Cambia el puerto en `server/.env`:
```env
PORT=3002
```

Y actualiza `.env` del frontend:
```env
VITE_BACKEND_URL=http://localhost:3002
```

### Error: "Unauthorized" o "Invalid client"

Verifica las credenciales en `server/.env`:
- Client ID correcto
- Client Secret válido y sin espacios
- Tenant ID correcto

### Error: "Mailbox not found"

El email del remitente no existe. Verifica `MICROSOFT_USER_EMAIL` en `server/.env`.

### Backend corriendo pero frontend da 404

Verifica que `VITE_BACKEND_URL` en `.env` del frontend apunte al backend correcto.

## 📚 Siguientes Pasos

1. ✅ [Obtener credenciales de Azure](./API_INTEGRATION.md#microsoft-graph-api)
2. ✅ [Configurar permisos en Azure AD](./API_INTEGRATION.md#configurar-permisos-api)
3. ✅ [Desplegar en producción](./DEPLOYMENT.md)

## 🤝 Soporte

¿Problemas con el backend?
- Ver [DEVELOPMENT.md](./DEVELOPMENT.md) para troubleshooting
- Contactar: soporte@konrad.edu.co
