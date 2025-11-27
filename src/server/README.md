# Backend Proxy Server - BPMS Konrad Lorenz

Servidor backend para manejar el envío de emails a través de Gmail SMTP usando nodemailer, evitando problemas de CORS y manteniendo credenciales seguras.

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Credenciales

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Gmail:

```env
PORT=3001
GMAIL_USER=telcokonradtobetobe@gmail.com
GMAIL_APP_PASSWORD=mrbbnamsbeukwnf
GMAIL_FROM=Telecomunicaciones Konrad Lorenz <telcokonradtobetobe@gmail.com>
```

### 3. Iniciar Servidor

```bash
npm start
```

Deberías ver:

```
🚀 Backend Proxy Server iniciado (Gmail SMTP)
📍 Escuchando en: http://localhost:3001
✅ Health check: http://localhost:3001/api/health
📧 Email endpoint: http://localhost:3001/api/send-email
```

## 📋 Endpoints

### GET /api/health

Health check del servidor.

**Respuesta**:
```json
{
  "status": "ok",
  "message": "Backend proxy is running (Gmail)",
  "timestamp": "2024-11-07T..."
}
```

### POST /api/send-email

Envía un email a través de Gmail SMTP.

**Request**:
```json
{
  "to": "destinatario@example.com",
  "subject": "Asunto del email",
  "htmlContent": "<h1>Contenido HTML</h1>",
  "attachments": [
    {
      "name": "documento.pdf",
      "contentType": "application/pdf",
      "contentBytes": "base64_content_here"
    }
  ]
}
```

**Respuesta Exitosa**:
```json
{
  "success": true,
  "messageId": "xxx@gmail.com",
  "message": "Email enviado exitosamente"
}
```

**Respuesta con Error**:
```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## 🔧 Configuración

### Variables de Entorno

Todas las variables se configuran en el archivo `.env`:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3001` |
| `GMAIL_USER` | Email de Gmail | `telcokonradtobetobe@gmail.com` |
| `GMAIL_APP_PASSWORD` | Contraseña de aplicación | `mrbbnamsbeukwnf` |
| `GMAIL_FROM` | Nombre y email del remitente | `Konrad <email@gmail.com>` |

### Obtener Contraseña de Aplicación de Gmail

1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. Habilita **Verificación en 2 pasos** (si no está habilitada)
3. Ve a **Contraseñas de aplicaciones**
4. Selecciona "Correo" como aplicación
5. Copia la contraseña de 16 caracteres (sin espacios)
6. Pégala en el archivo `.env` como `GMAIL_APP_PASSWORD`

**Nota**: NO uses tu contraseña normal de Gmail, solo contraseñas de aplicación.

## 🧪 Testing

### Usando cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Enviar email de prueba
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "htmlContent": "<h1>Este es un email de prueba</h1>"
  }'
```

### Usando Postman

1. **Método**: POST
2. **URL**: `http://localhost:3001/api/send-email`
3. **Headers**:
   - Content-Type: `application/json`
4. **Body** (raw JSON):
```json
{
  "to": "test@example.com",
  "subject": "Test",
  "htmlContent": "<h1>Test</h1>"
}
```

## 📊 Logs

El servidor muestra logs detallados:

```
📧 [Proxy] Procesando envío de email a: cliente@example.com
✅ Email enviado con Gmail: <xxx@gmail.com>
✅ [Proxy] Email enviado exitosamente
```

## ⚠️ Límites de Gmail

- **500 emails por día** para cuentas gratuitas
- **100 destinatarios por email**
- **25 MB de tamaño total** (incluyendo adjuntos)

Para volúmenes mayores, considera:
- Gmail Workspace (Google Workspace)
- Servicios SMTP profesionales (SendGrid, AWS SES, etc.)

## 🔒 Seguridad

### Producción

Para producción, sigue estas buenas prácticas:

1. **Usa HTTPS**:
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(443);
```

2. **Implementa Rate Limiting**:
```bash
npm install express-rate-limit
```

3. **Valida Inputs**:
```bash
npm install express-validator
```

4. **Usa Servicios de Secretos**:
   - AWS Secrets Manager
   - HashiCorp Vault
   - Google Cloud Secret Manager

## 🚀 Despliegue

### Docker

Crear `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
```

Construir y ejecutar:
```bash
docker build -t bpms-backend .
docker run -p 3001:3001 --env-file .env bpms-backend
```

### Heroku

```bash
heroku create bpms-backend
heroku config:set GMAIL_USER=telcokonradtobetobe@gmail.com
heroku config:set GMAIL_APP_PASSWORD=mrbbnamsbeukwnf
heroku config:set GMAIL_FROM="Konrad <telcokonradtobetobe@gmail.com>"
git push heroku main
```

### VPS (Ubuntu)

```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar proyecto
git clone <repo>
cd server

# Instalar dependencias
npm install

# Configurar .env
nano .env

# Usar PM2 para proceso persistente
npm install -g pm2
pm2 start index.js --name bpms-backend
pm2 save
pm2 startup
```

## 🆘 Troubleshooting

### Error: "Invalid login"

**Problema**: Credenciales de Gmail incorrectas

**Solución**:
1. Verifica que uses una **contraseña de aplicación**, no tu contraseña normal
2. Asegúrate de tener **verificación en 2 pasos** habilitada
3. Genera una nueva contraseña de aplicación
4. Verifica que no haya espacios en la contraseña

### Error: "EADDRINUSE"

**Problema**: Puerto 3001 ya está en uso

**Solución**: Cambia el puerto en `.env`:
```env
PORT=3002
```

Y actualiza el frontend en `/.env`:
```env
VITE_BACKEND_URL=http://localhost:3002
```

### Error: "Cannot find module 'nodemailer'"

**Problema**: Dependencias no instaladas

**Solución**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Daily sending quota exceeded"

**Problema**: Has excedido el límite de 500 emails diarios

**Solución**:
1. Espera 24 horas para que se restablezca el límite
2. Usa Gmail Workspace para límites mayores
3. Considera un servicio SMTP profesional

### Email no llega / va a spam

**Problema**: El email puede estar siendo filtrado

**Solución**:
1. Verifica la carpeta de spam del destinatario
2. Pide al destinatario que agregue el email a sus contactos
3. Configura SPF, DKIM y DMARC para tu dominio
4. Para producción, usa un dominio personalizado con Gmail Workspace

## 📚 Más Información

- [Configuración del Backend](../docs/BACKEND_SETUP.md)
- [Integración de APIs](../docs/API_INTEGRATION.md)
- [Desarrollo](../docs/DEVELOPMENT.md)

## 🤝 Soporte

¿Problemas con el backend?
- Email: soporte@konrad.edu.co
- Ver documentación principal: [../README.md](../README.md)
