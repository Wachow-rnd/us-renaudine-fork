#!/bin/bash

# Script de démarrage pour hébergement local
echo "🚀 Démarrage du site US Renaudine en mode production"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier si npm est installé  
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Créer le dossier de base de données s'il n'existe pas
mkdir -p data

# Démarrer l'application
echo "🌐 Démarrage du serveur..."
echo "📍 Site accessible sur:"
echo "   - Local: http://localhost:3000"
echo "   - Réseau: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "⏹️  Appuyez sur Ctrl+C pour arrêter"

# Lancer l'application
npm run start