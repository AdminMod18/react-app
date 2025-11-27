#!/bin/bash

# Script para iniciar el sistema completo (Frontend + Backend)
# BPMS Telecomunicaciones Konrad Lorenz

echo "🚀 Iniciando BPMS - Sistema Completo"
echo "======================================"
echo ""

# Verificar si el backend está configurado
if [ ! -d "server/node_modules" ]; then
    echo "⚠️  Backend no está instalado"
    echo "📦 Instalando dependencias del backend..."
    cd server
    npm install
    cd ..
    echo "✅ Dependencias del backend instaladas"
    echo ""
fi

# Verificar si existe .env en el backend
if [ ! -f "server/.env" ]; then
    echo "⚠️  No se encontró server/.env"
    echo "💡 Creando desde ejemplo..."
    cp server/.env.example server/.env
    echo "⚙️  Por favor, edita server/.env con tus credenciales de Azure"
    echo "📖 Ver docs/BACKEND_SETUP.md para más información"
    echo ""
fi

# Verificar si existe .env en el frontend
if [ ! -f ".env" ]; then
    echo "⚠️  No se encontró .env"
    echo "💡 Creando desde ejemplo..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
    echo ""
fi

echo "🎯 Modo de operación:"
echo "   - DEMO: Emails simulados (sin backend necesario)"
echo "   - PRODUCTION: Emails reales (requiere backend)"
echo ""
echo "📝 Configurar en: services/config.ts"
echo ""

# Preguntar al usuario qué modo quiere
read -p "¿Iniciar backend también? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🔧 Iniciando backend en puerto 3001..."
    cd server
    npm start &
    BACKEND_PID=$!
    cd ..
    sleep 2
    echo "✅ Backend iniciado (PID: $BACKEND_PID)"
    echo ""
    
    echo "💡 Para usar el backend, asegúrate de:"
    echo "   1. Configurar credenciales en server/.env"
    echo "   2. Cambiar API_MODE a 'PRODUCTION' en services/config.ts"
    echo ""
else
    echo "⏭️  Solo frontend (modo DEMO)"
    echo ""
fi

echo "🌐 Iniciando frontend en puerto 5173..."
npm run dev

# Si se inició el backend, matarlo cuando se cierre el frontend
if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null
fi
