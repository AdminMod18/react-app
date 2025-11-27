# BPMS Telecomunicaciones Konrad Lorenz

Sistema de Gestión de Procesos de Venta Digital para el sector de telecomunicaciones.

---

## 🎯 ¡Comienza en 30 Segundos!

**El sistema está listo para usar. No necesitas configurar nada.**

```bash
npm run dev
```

Luego abre http://localhost:5173 y usa:
- Usuario: `admin` / Contraseña: `admin123`

📖 **[Ver Guía de Inicio Rápido →](./INICIO_RAPIDO.md)**

---

## ⚡ Inicio Rápido

### ✅ Sistema en Modo DEMO

El sistema está configurado en **modo DEMO** para que funcione inmediatamente sin configuración adicional:
- ✅ Todos los flujos operativos
- ✅ Emails simulados en consola
- ✅ Sin necesidad de backend o credenciales
- ✅ Perfecto para desarrollo y demos

**Para emails reales**, ver [Configuración del Backend](#configuración-del-backend)

### Credenciales de Acceso

**Asesores:**
```
Usuario: admin
Contraseña: admin123
```

**Clientes (Portal):**
```
Documento: Cualquier número de 6+ dígitos
Número de Contrato: Cualquier número
```

### 🚀 Empezar a Usar

1. El sistema inicia automáticamente
2. Accede a la página principal (/)
3. Click en "Acceso Asesores" → Login
4. Usa las credenciales de asesor
5. Comienza a crear casos desde "Nueva Venta"

## 🎯 Descripción del Proyecto

BPMS completo que digitaliza y automatiza el flujo de ventas desde la validación de identidad hasta la entrega del contrato digital.

### Objetivos Clave

- ✅ 90% de casos sin papel
- ⚡ Tiempo de ciclo ≤15 minutos
- 📉 Reducción de reprocesos ≥60%
- 🔍 Trazabilidad 100% con auditoría completa

## 🚀 Características Principales

### MVP - 8 Etapas del Proceso

1. **Validación de Identidad** - Integración con ID-TRUE
2. **Enrolamiento** - Captura de foto con cámara
3. **Carga de Documentos** - Upload de documentación requerida
4. **Validación Crediticia** - Consulta a DataCrédito/TransUnion
5. **Selección de Servicios** - Catálogo de planes y servicios
6. **Generación de Contrato** - Contrato digital personalizado
7. **Firma Digital** - Firma electrónica con trazabilidad
8. **Cierre** - Confirmación y envío de documentos

### Dashboard de KPIs en Tiempo Real

- Métricas operativas (casos totales, completados, rechazos)
- Tiempo promedio de ciclo
- Tasa de conversión
- Análisis de rechazos por motivo
- Ventas por servicio

### Integraciones

- **Microsoft Graph API** - Envío de correos electrónicos
- **ID-TRUE** - Validación de identidad con Registraduría Nacional
- **DataCrédito/TransUnion** - Validación crediticia
- **Firma Digital** - Firma electrónica con trazabilidad legal

## 📁 Estructura del Proyecto

```
/
├── App.tsx                      # Configuración de rutas principales
├── api/
│   └── send-email.ts            # Backend proxy para Microsoft Graph
├── components/
│   ├── HomePage.tsx             # Landing page
│   ├── Login.tsx                # Autenticación
│   ├── Dashboard.tsx            # Panel de KPIs
│   ├── CasesList.tsx            # Lista de casos
│   ├── NewCase.tsx              # Flujo de nueva venta
│   ├── AuditLog.tsx             # Registro de auditoría
│   ├── ClientView.tsx           # Vista para clientes
│   ├── Layout/
│   │   └── AppLayout.tsx        # Layout principal
│   ├── ProtectedRoute.tsx       # HOC para rutas protegidas
│   ├── steps/                   # 8 pasos del proceso
│   └── ui/                      # Componentes UI (shadcn)
├── hooks/
│   └── useAuth.ts               # Hook de autenticación
├── services/
│   ├── api.ts                   # Integraciones externas
│   ├── config.ts                # Configuración de APIs
│   ├── documents.ts             # Gestión de documentos
│   └── microsoft-email.ts       # Servicio de email
└── styles/
    └── globals.css              # Estilos globales
```

## 📧 Sistema de Correo Electrónico

### Modo Actual: DEMO ✅

El sistema simula el envío de emails en la consola. Todos los flujos funcionan sin configuración adicional.

### Para Emails Reales (Producción)

El sistema usa **Microsoft Graph API** con un backend proxy:

- **Backend Server**: `/server/index.js`
- **Servicio**: `/services/microsoft-email.ts`
- **Remitente**: migueld.ruizs@konradlorenz.edu.co

**Configuración**: Ver [Configuración del Backend](#configuración-del-backend)

### Envío Automático al Cierre de Venta

Cuando se completa una venta (paso 8):
- ✅ Email enviado automáticamente al cliente
- ✅ Incluye contrato firmado digitalmente (PDF)
- ✅ Adjunta términos y condiciones (PDF)
- ✅ Incluye documentos de identidad y domicilio (PDF)
- ✅ Plantilla HTML profesional y responsive

## 🗺️ Sistema de Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Pública | Landing page |
| `/login` | Pública | Inicio de sesión |
| `/dashboard` | Asesor | Panel de KPIs |
| `/cases` | Asesor | Lista de casos |
| `/new-case` | Asesor | Nueva venta |
| `/audit` | Asesor | Auditoría |
| `/client` | Cliente | Vista de cliente |

## 📚 Documentación

- **[Configuración y Setup](./docs/SETUP.md)** - Guía completa de configuración
- **[Configuración del Backend](./docs/BACKEND_SETUP.md)** - Backend proxy para emails reales
- **[Integración de APIs](./docs/API_INTEGRATION.md)** - Microsoft Graph y otras APIs
- **[Desarrollo](./docs/DEVELOPMENT.md)** - Troubleshooting y buenas prácticas

## 🎨 Paleta de Colores

Colores institucionales de la Universidad Konrad Lorenz:

- **Primario**: Azul (#3b82f6)
- **Secundario**: Naranja (#ea580c)
- **Neutros**: Escala de grises slate
- **Estados**: Verde (éxito), Rojo (error), Amarillo (advertencia)

## 🔒 Seguridad

- ✅ Rutas protegidas con autenticación
- ✅ Validación de tipo de usuario
- ✅ Backend proxy para credenciales seguras
- ✅ Tokens OAuth2 para Microsoft Graph
- ✅ Trazabilidad completa de acciones
- ✅ Credenciales en variables de entorno

## 📊 KPIs Monitoreados

- Casos totales procesados
- Casos completados exitosamente
- Casos rechazados (con motivos)
- Tiempo promedio de ciclo
- Tasa de conversión
- Ventas por servicio
- Ingresos por categoría

## 🚦 Estado del Proyecto

- ✅ MVP completo y funcional
- ✅ 8 etapas del proceso implementadas
- ✅ Dashboard con KPIs en tiempo real
- ✅ Sistema de rutas con React Router
- ✅ Backend proxy para Microsoft Graph implementado
- ✅ Modo DEMO para desarrollo sin configuración
- ✅ HomePage moderna y responsive
- ✅ Vista de cliente implementada
- ✅ Sistema de auditoría completo

## 🔧 Configuración del Backend

Para enviar emails reales, necesitas configurar el backend proxy:

### Opción 1: Sin Backend (Modo DEMO - Actual) ⭐

Ya está configurado. El sistema funciona completamente con emails simulados.

### Opción 2: Con Backend (Emails Reales)

```bash
# 1. Instalar dependencias del backend
cd server
npm install

# 2. Configurar credenciales
cp .env.example .env
# Edita server/.env con tus credenciales de Azure

# 3. Iniciar backend
npm start

# 4. En otra terminal, iniciar frontend
cd ..
npm run dev

# 5. Cambiar a modo PRODUCTION en /services/config.ts
```

**Guía completa**: [docs/BACKEND_SETUP.md](./docs/BACKEND_SETUP.md)

## 🤝 Soporte

Para soporte técnico o consultas:
- Email: soporte@konrad.edu.co
- Teléfono: (601) 347 2311
- WhatsApp: +57 300 123 4567

---

**Desarrollado para:** Universidad Konrad Lorenz - Telecomunicaciones  
**Versión:** 1.0.0  
**Última actualización:** Noviembre 2024
