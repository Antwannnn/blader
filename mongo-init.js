// Script d'initialisation MongoDB
// Ce script s'exécute automatiquement au premier démarrage du conteneur

db = db.getSiblingDB('blader_db');

// Créer un utilisateur pour l'application
db.createUser({
  user: 'bladertyping',
  pwd: 'Gnqeu4BP9Ys3MLkl',
  roles: [
    {
      role: 'readWrite',
      db: 'blader_db'
    }
  ]
});

// Créer les collections principales
db.createCollection('users');
db.createCollection('accounts');
db.createCollection('sessions');
db.createCollection('verification_tokens');

// Créer des index utiles
db.users.createIndex({ email: 1 }, { unique: true });
db.accounts.createIndex({ userId: 1 });
db.sessions.createIndex({ sessionToken: 1 }, { unique: true });
db.sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

print('✅ Base de données blader_db initialisée avec succès !');

