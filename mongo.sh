#!/bin/bash

# Script de gestion MongoDB pour Blader

case "$1" in
  start)
    echo "🚀 Démarrage de MongoDB..."
    docker-compose up -d mongodb
    echo "✅ MongoDB démarré sur localhost:27017"
    ;;
  
  stop)
    echo "🛑 Arrêt de MongoDB..."
    docker-compose stop mongodb
    echo "✅ MongoDB arrêté"
    ;;
  
  restart)
    echo "🔄 Redémarrage de MongoDB..."
    docker-compose restart mongodb
    echo "✅ MongoDB redémarré"
    ;;
  
  logs)
    echo "📋 Logs de MongoDB (Ctrl+C pour quitter)..."
    docker-compose logs -f mongodb
    ;;
  
  shell)
    echo "🐚 Connexion à MongoDB Shell..."
    docker exec -it blader-mongodb mongosh -u bladertyping -p Gnqeu4BP9Ys3MLkl --authenticationDatabase admin blader_db
    ;;
  
  status)
    echo "📊 Statut de MongoDB..."
    docker ps --filter "name=blader-mongodb" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    ;;
  
  reset)
    echo "⚠️  ATTENTION : Cette action va supprimer TOUTES les données !"
    read -p "Êtes-vous sûr ? (oui/non) : " confirm
    if [ "$confirm" = "oui" ]; then
      echo "🗑️  Suppression des données..."
      docker-compose down mongodb
      docker volume rm blader_mongodb_data 2>/dev/null || true
      echo "🚀 Redémarrage de MongoDB..."
      docker-compose up -d mongodb
      echo "✅ MongoDB réinitialisé"
    else
      echo "❌ Opération annulée"
    fi
    ;;
  
  *)
    echo "🐳 Script de gestion MongoDB pour Blader"
    echo ""
    echo "Usage: ./mongo.sh [commande]"
    echo ""
    echo "Commandes disponibles:"
    echo "  start    - Démarre MongoDB"
    echo "  stop     - Arrête MongoDB"
    echo "  restart  - Redémarre MongoDB"
    echo "  logs     - Affiche les logs de MongoDB"
    echo "  shell    - Ouvre un shell MongoDB"
    echo "  status   - Affiche le statut de MongoDB"
    echo "  reset    - Réinitialise MongoDB (SUPPRIME TOUTES LES DONNÉES)"
    echo ""
    echo "Exemples:"
    echo "  ./mongo.sh start"
    echo "  ./mongo.sh logs"
    echo "  ./mongo.sh shell"
    ;;
esac

