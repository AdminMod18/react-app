# ⚡ Inicio Rápido - BPMS Konrad Lorenz

## 🎯 El Sistema Está Listo con Gmail

El sistema está **100% configurado** con Gmail para envío de emails reales.

## 🚀 Iniciar el Sistema (2 Pasos)

### 1. Iniciar el Backend (servidor de emails)

```bash
cd server
npm install  # Solo la primera vez
npm start    # Inicia en puerto 3001
```

### 2. Iniciar el Frontend (en otra terminal)

```bash
npm install  # Solo la primera vez
npm run dev  # Inicia en puerto 5173
```

### 2. Abrir en el Navegador

```
http://localhost:5173
```

### 3. Iniciar Sesión

**Asesores**:
- Usuario: `admin`
- Contraseña: `admin123`

**Clientes**:
- Documento: Cualquier número de 6+ dígitos
- Contrato: Cualquier número

### 4. ¡Listo! 🎉

El sistema está completamente funcional:
- ✅ Dashboard con KPIs
- ✅ Nueva Venta (8 pasos)
- ✅ Lista de Casos
- ✅ Auditoría
- ✅ Portal de Cliente
- ✅ Emails simulados en consola

## 📧 Sistema de Emails

### ✅ Configuración Actual: Gmail SMTP

El sistema está **completamente configurado** con Gmail:

- **Email:** telcokonradtobetobe@gmail.com
- **Modo:** PRODUCTION (emails reales)
- **Backend:** Express con nodemailer
- **Puerto:** 3001

### 📝 Archivos .env Creados

✅ **/.env** (Frontend)
```env
VITE_BACKEND_URL=http://localhost:3001
```

✅ **/server/.env** (Backend)
```env
PORT=3001
GMAIL_USER=telcokonradtobetobe@gmail.com
GMAIL_APP_PASSWORD=mrbbnamsbeukwnf
GMAIL_FROM=Telecomunicaciones Konrad Lorenz <telcokonradtobetobe@gmail.com>
```

### 🔄 Cambiar a Modo DEMO (Opcional)

Si prefieres simular emails sin enviarlos:

1. Edita `/services/config.ts`
2. Cambia `API_MODE = "PRODUCTION"` a `API_MODE = "DEMO"`
3. Reinicia el frontend

En modo DEMO, los emails se simulan en la consola del navegador.

## 📱 Flujo Completo de Prueba

### Como Asesor

1. **Login** → Acceso Asesores → `admin` / `admin123`

2. **Nueva Venta** → Click en "Nueva Venta"

3. **8 Pasos**:
   - ✅ Validación de Identidad
   - ✅ Enrolamiento (foto con cámara)
   - ✅ Carga de Documentos
   - ✅ Validación Crediticia
   - ✅ Selección de Servicios
   - ✅ Generación de Contrato
   - ✅ Firma Digital
   - ✅ Cierre (email automático)

4. **Dashboard** → Ver KPIs actualizados

5. **Casos** → Ver el caso creado

6. **Auditoría** → Ver registro completo

### Como Cliente

1. **Login** → Consulta tu Caso
2. Ingresa documento y número de contrato
3. Ver estado del caso y documentos

## 🎓 Próximos Pasos

### Para Desarrollo

- ✅ El sistema está listo
- Desarrolla nuevas funcionalidades
- Prueba todos los flujos
- No te preocupes por emails (modo DEMO)

### Para Producción

1. 📖 Lee **[CAMBIOS_RECIENTES.md](./CAMBIOS_RECIENTES.md)**
2. 🔧 Configura el backend: **[docs/BACKEND_SETUP.md](./docs/BACKEND_SETUP.md)**
3. 🔑 Obtén credenciales: **[docs/API_INTEGRATION.md](./docs/API_INTEGRATION.md)**
4. 🚀 Despliega el sistema

## 📚 Documentación

| Documento | Para Qué |
|-----------|----------|
| **[README.md](./README.md)** | Vista general del proyecto |
| **[CAMBIOS_RECIENTES.md](./CAMBIOS_RECIENTES.md)** | Qué cambió y por qué |
| **[docs/SETUP.md](./docs/SETUP.md)** | Configuración detallada |
| **[docs/BACKEND_SETUP.md](./docs/BACKEND_SETUP.md)** | Backend para emails reales |
| **[docs/API_INTEGRATION.md](./docs/API_INTEGRATION.md)** | Integrar APIs externas |
| **[docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)** | Troubleshooting y desarrollo |

## ❓ Preguntas Frecuentes

### ¿Los emails se envían de verdad?

Sí, en modo PRODUCTION (actual) los emails se envían realmente a través de Gmail.

### ¿Necesito configurar algo para empezar?

Solo necesitas iniciar ambos servidores (backend y frontend). Los archivos `.env` ya están configurados.

### ¿Cómo veo los emails "enviados"?

Abre la consola del navegador (F12) y verás los logs de los emails simulados.

### ¿Puedo usar esto en producción?

Sí, pero necesitas configurar el backend proxy para enviar emails reales. Ver [docs/BACKEND_SETUP.md](./docs/BACKEND_SETUP.md).

### ¿Necesito credenciales de Gmail diferentes?

No. El sistema ya está configurado con las credenciales proporcionadas. Si quieres usar tu propia cuenta de Gmail, edita `/server/.env`.

## 🆘 ¿Problemas?

### Error: "Cannot read properties of undefined (reading 'VITE_BACKEND_URL')"

**Solución**: Los archivos `.env` ya están creados. Solo reinicia el servidor:
```bash
# Detén el servidor con Ctrl+C
# Vuelve a iniciar
npm run dev
```

### El backend no inicia

```bash
cd server
# Instala dependencias
npm install
# Intenta de nuevo
npm start
```

### Error "EADDRINUSE: puerto 3001 ya está en uso"

El backend ya está corriendo. Si quieres cambiarlo, edita `PORT=3001` en `/server/.env`.

### Los emails no se envían

Verifica que:
1. El backend esté corriendo (`cd server && npm start`)
2. La URL en `/.env` sea correcta: `VITE_BACKEND_URL=http://localhost:3001`
3. El modo esté en PRODUCTION en `/services/config.ts`

### Los datos no se guardan

Los datos se guardan en `localStorage`. Si limpias el navegador, se pierden. Esto es normal en modo desarrollo.

## 🎉 ¡Sistema Listo!

El sistema está 100% configurado con Gmail. Inicia ambos servidores y comienza a crear casos que enviarán emails reales.

---

**¿Necesitas ayuda?**
- Email: soporte@konrad.edu.co
- Ver documentación completa: [README.md](./README.md)
