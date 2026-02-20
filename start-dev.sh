#!/bin/bash

echo "🚀 Démarrage de Sorika..."
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Pour arrêter: Ctrl+C"
echo ""

# Utiliser npx concurrently pour afficher les logs des deux
npx concurrently \
  --names "BACKEND,FRONTEND" \
  --prefix-colors "blue,magenta" \
  --kill-others \
  "cd backend && npm run start:dev" \
  "cd frontend && npm run dev"
