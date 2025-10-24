#!/bin/bash

# Script de setup initial pour US Renaudine Tennis de Table
# Usage: ./setup.sh

echo "🏓 Configuration initiale de US Renaudine Tennis de Table"
echo "========================================================"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm détecté: $(npm --version)"

# Installer les dépendances
echo ""
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f "server/.env" ]; then
    echo ""
    echo "⚙️  Configuration du serveur..."
    cp server/.env.sample server/.env
    echo "✅ Fichier server/.env créé depuis le template"
    echo "⚠️  N'oubliez pas de modifier server/.env avec vos vraies valeurs !"
else
    echo "✅ server/.env existe déjà"
fi

# Créer le dossier pour les images s'il n'existe pas
mkdir -p public/assets/images
echo "✅ Dossier images créé"

# Test de compilation
echo ""
echo "🔧 Test de compilation..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Warnings détectés, mais l'application devrait fonctionner"
fi

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "Pour démarrer l'application :"
echo "  npm start                 # Frontend + Backend"
echo "  npm run dev               # Frontend seul"
echo "  npm run server:dev        # Backend seul"
echo ""
echo "L'application sera accessible sur :"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:4000"
echo ""
echo "Compte admin par défaut :"
echo "  Utilisateur: admin"
echo "  Mot de passe: admin123"
echo "  (Modifiable dans server/.env)"