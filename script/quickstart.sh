#!/bin/bash
# Quick Start Script para PolySolver App

echo "🚀 PolySolver App - Quick Start"
echo "===================================="
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org"
    exit 1
fi

# Verificar si Yarn está instalado
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn no está instalado. Por favor instálalo con 'npm install -g yarn'"
    exit 1
fi

echo "✅ Node.js detectado: $(node --version)"
echo "✅ Yarn detectado: $(yarn --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias con Yarn..."
yarn install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias con Yarn"
    exit 1
fi

echo "✅ Dependencias instaladas"
echo ""

# Instalar Pods (solo iOS)
if [ "$1" == "ios" ] || [ -z "$1" ]; then
    echo "📱 iOS seleccionado. Instalando Pods..."
    cd ios
    pod install
    cd ..
    
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar Pods"
        exit 1
    fi
    echo "✅ Pods instalados"
    echo ""
fi

echo ""
echo "✨ ¡Aplicación lista!"
echo ""
echo "Para ejecutar la aplicación:"
echo "  Android: yarn android"
echo "  iOS:     yarn ios"
echo ""
echo "Para más información, consulta README.md"