# 🐳 Guide MongoDB avec Docker

## 📋 Configuration

Votre projet est maintenant configuré pour utiliser MongoDB dans un conteneur Docker au lieu de MongoDB Atlas.

## 🚀 Démarrage

### Option 1 : Démarrer tout (Frontend + MongoDB)
```bash
docker-compose up -d
```

### Option 2 : Démarrer seulement MongoDB
```bash
docker-compose up -d mongodb
```

Ensuite, lancez votre application en local :
```bash
npm run dev
```

## 🔍 Commandes utiles

### Voir les logs MongoDB
```bash
docker-compose logs -f mongodb
```

### Voir les logs du frontend
```bash
docker-compose logs -f frontend
```

### Arrêter les services
```bash
docker-compose down
```

### Arrêter et supprimer les volumes (⚠️ efface toutes les données)
```bash
docker-compose down -v
```

## 🔧 Accès à MongoDB

### Via MongoDB Compass (GUI)
**URL de connexion :**
```
mongodb://bladertyping:Gnqeu4BP9Ys3MLkl@localhost:27017/blader_db?authSource=admin
```

### Via mongosh (CLI dans le conteneur)
```bash
docker exec -it blader-mongodb mongosh -u bladertyping -p Gnqeu4BP9Ys3MLkl --authenticationDatabase admin
```

Puis :
```javascript
use blader_db
show collections
db.users.find()
```

## 📊 Structure de la base de données

Les collections suivantes sont créées automatiquement :
- `users` - Utilisateurs de l'application
- `accounts` - Comptes liés (Google, Discord, etc.)
- `sessions` - Sessions NextAuth
- `verification_tokens` - Tokens de vérification

## 🔄 Variables d'environnement

### Pour le développement local (sans Docker)
`.env.development`
```env
MONGODB_URI=mongodb://bladertyping:Gnqeu4BP9Ys3MLkl@localhost:27017/blader_db?authSource=admin
```

### Pour le frontend dans Docker
La variable `MONGODB_URI` est définie dans `docker-compose.yml` avec l'hôte `mongodb` au lieu de `localhost`.

## 🛠️ Dépannage

### MongoDB ne démarre pas
```bash
# Vérifier les logs
docker-compose logs mongodb

# Redémarrer le conteneur
docker-compose restart mongodb
```

### L'application ne se connecte pas
1. Vérifiez que MongoDB est bien démarré :
   ```bash
   docker ps | grep mongodb
   ```

2. Testez la connexion :
   ```bash
   docker exec blader-mongodb mongosh -u bladertyping -p Gnqeu4BP9Ys3MLkl --authenticationDatabase admin --eval "db.adminCommand('ping')"
   ```

### Réinitialiser complètement MongoDB
```bash
docker-compose down -v
docker-compose up -d mongodb
```

## 📝 Notes

- Les données sont persistées dans un volume Docker nommé `mongodb_data`
- Le script `mongo-init.js` s'exécute uniquement au premier démarrage
- Le healthcheck vérifie que MongoDB est prêt avant de démarrer le frontend
- Pour la production, utilisez MongoDB Atlas ou un cluster dédié

