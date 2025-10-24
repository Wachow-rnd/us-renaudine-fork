#!/bin/bash

# Script de démarrage complet pour l'application US Renaudine
echo "🚀 Démarrage de l'application US Renaudine..."

# Fonction pour nettoyer à l'arrêt
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    kill $SERVER_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services arrêtés proprement"
    exit 0
}

# Capturer Ctrl+C pour nettoyer
trap cleanup SIGINT

# Démarrer le serveur backend en arrière-plan
echo "🔧 Démarrage du serveur backend..."
cd /home/wachow/us-renaudine
node server/stable-server.js &
SERVER_PID=$!

# Attendre un peu que le serveur démarre
sleep 2

# Vérifier si le serveur backend fonctionne
if curl -s http://localhost:4000/api/test > /dev/null; then
    echo "✅ Serveur backend opérationnel"
else
    echo "⚠️  Serveur backend non accessible, mode simulation activé"
fi

# Démarrer le frontend
echo "🎨 Démarrage du frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🌟 Application démarrée !"
echo "📱 Frontend: http://localhost:5173 (ou port alternatif affiché)"
echo "🔧 Backend: http://localhost:4000"
echo "👤 Connexion: admin / admin123"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services"

# Attendre indéfiniment
wait