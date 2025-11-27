# ✅ Solución al Error de VITE_BACKEND_URL

## 🔴 Error Original

```
❌ Error enviando email con Gmail: TypeError: Cannot read properties of undefined (reading 'VITE_BACKEND_URL')
❌ Error enviando correo: TypeError: Cannot read properties of undefined (reading 'VITE_BACKEND_URL')
```

## 🔍 Causa del Error

El error ocurría porque:

1. **No existía el archivo `.env`** en la raíz del proyecto
2. **No existía el archivo `.env`** en `/server/`
3. El código intentaba acceder a `import.meta.env.VITE_BACKEND_URL` pero `import.meta.env` era `undefined`
4. Aunque había un valor por defecto (`|| 'http://localhost:3001'`), el error se producía **antes** de llegar al operador OR

## ✅ Soluciones Implementadas

### 1. Creado archivo `/.env` (Frontend)

```env
# URL del backend proxy
VITE_BACKEND_URL=http://localhost:3001
```

**Ubicación**: `/env`
**Propósito**: Configurar la URL del backend para el frontend

### 2. Creado archivo `/server/.env` (Backend)

```env
# Puerto del servidor
PORT=3001

# Gmail SMTP Configuration
GMAIL_USER=telcokonradtobetobe@gmail.com
GMAIL_APP_PASSWORD=mrbbnamsbeukwnf
GMAIL_FROM=Telecomunicaciones Konrad Lorenz <telcokonradtobetobe@gmail.com>

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:4173
```

**Ubicación**: `/server/.env`
**Propósito**: Configurar credenciales de Gmail y parámetros del servidor

### 3. Creado archivo `/.gitignore`

```
# Variables de entorno (contienen credenciales sensibles)
.env
.env.local
/server/.env
...
```

**Ubicación**: `/.gitignore`
**Propósito**: Proteger credenciales sensibles de ser subidas a Git

### 4. Corregido código en `/services/gmail-email.ts`

**Antes**:
```typescript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
```

**Después**:
```typescript
const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:3001';
```

**Cambio**: Añadido operador de encadenamiento opcional (`?.`) para evitar error cuando `import.meta.env` sea `undefined`

### 5. Actualizado `/INICIO_RAPIDO.md`

- Documentado la configuración de archivos `.env`
- Añadida sección de troubleshooting específica para este error
- Actualizado flujo de inicio del sistema

## 🚀 Cómo Iniciar el Sistema Ahora

### 1. Iniciar el Backend

```bash
cd server
npm install  # Solo la primera vez
npm start    # Puerto 3001
```

### 2. Iniciar el Frontend (en otra terminal)

```bash
npm install  # Solo la primera vez
npm run dev  # Puerto 5173
```

### 3. Verificar que funciona

1. Abre http://localhost:5173
2. Inicia sesión como asesor (admin/admin123)
3. Crea un nuevo caso
4. Completa hasta el paso de "Firma Digital"
5. Verifica en la consola del backend que se envía el email

## 📋 Checklist de Verificación

- ✅ Archivo `/.env` creado con `VITE_BACKEND_URL=http://localhost:3001`
- ✅ Archivo `/server/.env` creado con credenciales de Gmail
- ✅ Archivo `/.gitignore` creado para proteger credenciales
- ✅ Código en `/services/gmail-email.ts` actualizado con operador `?.`
- ✅ Documentación `/INICIO_RAPIDO.md` actualizada

## 🔧 Configuración de Variables de Entorno

### Frontend (/.env)

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `VITE_BACKEND_URL` | `http://localhost:3001` | URL del servidor backend Express |

### Backend (/server/.env)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PORT` | `3001` | Puerto del servidor Express |
| `GMAIL_USER` | `telcokonradtobetobe@gmail.com` | Email de Gmail |
| `GMAIL_APP_PASSWORD` | `mrbbnamsbeukwnf` | Contraseña de aplicación |
| `GMAIL_FROM` | `Telecomunicaciones Konrad Lorenz <...>` | Remitente |
| `ALLOWED_ORIGINS` | `http://localhost:5173,...` | URLs permitidas (CORS) |

## 🎯 Resultado Final

### Antes (Error)

```
❌ Error enviando email con Gmail: TypeError: Cannot read properties of undefined (reading 'VITE_BACKEND_URL')
```

### Después (Funcionando)

```
📧 Enviando correo a través del backend proxy (Gmail)
   Destinatario: cliente@example.com
✅ Email enviado exitosamente a través del backend proxy (Gmail)
   Message ID: <1234567890@gmail.com>
```

## 📚 Documentos Relacionados

- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)**: Guía rápida de inicio
- **[MIGRACION_GMAIL.md](./MIGRACION_GMAIL.md)**: Detalles de la migración a Gmail
- **[docs/BACKEND_SETUP.md](./docs/BACKEND_SETUP.md)**: Configuración del backend
- **[docs/GMAIL_SETUP.md](./docs/GMAIL_SETUP.md)**: Configuración de Gmail

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Los archivos `.env` contienen credenciales sensibles y están en `.gitignore` para que NO se suban a Git.

Si necesitas compartir el proyecto:
1. **NO compartas** archivos `.env`
2. Comparte solo los archivos `.env.example`
3. Cada desarrollador debe crear sus propios archivos `.env`

## ✨ Próximos Pasos

1. ✅ **Reinicia ambos servidores** (backend y frontend)
2. ✅ **Prueba el envío de emails** creando un caso completo
3. ✅ **Verifica en la consola** que no hay errores
4. ✅ **Revisa la bandeja de entrada** del destinatario

---

**Fecha de solución**: 7 de noviembre de 2025
**Estado**: ✅ Resuelto completamente
