# 🚀 Guide de Démarrage Rapide - Sorika

## ⚠️ Problème courant: DATABASE_URL not found

Si tu vois cette erreur:
```
PrismaClientInitializationError: error: Environment variable not found: DATABASE_URL
```

**Solution**: Le fichier `.env` n'est pas chargé. Voici comment résoudre:

### Option 1: Utiliser le script de démarrage (Recommandé)

```bash
# Depuis la racine du projet
./start-dev.sh
```

### Option 2: Démarrage manuel

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Option 3: Créer le fichier .env depuis l'exemple

```bash
# Copier le fichier d'exemple
cp backend/.env.example backend/.env

# Vérifier que le fichier existe
cat backend/.env

# Si besoin, modifier les valeurs:
# - DATABASE_URL: connexion PostgreSQL
# - JWT_SECRET: secret pour les tokens (générer avec: openssl rand -base64 32)
# - PORT: port du backend (par défaut 3001)
```

---

## 📋 Checklist de démarrage

### 1. Vérifier Docker
```bash
# Démarrer PostgreSQL
docker-compose up -d

# Vérifier que ça tourne
docker ps | grep sorika-db
```

### 2. Vérifier le fichier .env
```bash
# Doit afficher le contenu du .env
cat backend/.env
```

### 3. Installer les dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Appliquer les migrations
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 5. Démarrer l'application
```bash
# Depuis la racine
./start-dev.sh
```

---

## 🎯 URLs importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Inscription**: http://localhost:3000/register
- **Connexion**: http://localhost:3000/login

---

## 🐛 Dépannage

### Erreur: "port 5433 already in use"
```bash
# Arrêter le conteneur existant
docker stop sorika-db
docker rm sorika-db

# Relancer
docker-compose up -d
```

### Erreur: "Prisma Client outdated"
```bash
cd backend
npx prisma generate
# Puis redémarrer le backend
```

### Erreur: "Cannot find module '@prisma/client'"
```bash
cd backend
npm install
npx prisma generate
```

### Le backend ne démarre pas
```bash
# Vérifier les logs
cd backend
npm run start:dev

# Si erreur DATABASE_URL:
# 1. Vérifier que backend/.env existe
# 2. Vérifier que Docker tourne (docker ps)
# 3. Tester la connexion:
npx prisma db push
```

### Le frontend ne démarre pas
```bash
cd frontend
rm -rf .next
npm run dev
```

---

## 📊 Commandes utiles

### Base de données
```bash
# Voir les données
cd backend
npx prisma studio

# Réinitialiser la DB
npx prisma migrate reset

# Créer une nouvelle migration
npx prisma migrate dev --name ma_migration
```

### Backend
```bash
cd backend

# Mode développement (avec hot reload)
npm run start:dev

# Mode production
npm run build
npm run start:prod

# Tests
npm run test
```

### Frontend
```bash
cd frontend

# Mode développement
npm run dev

# Build production
npm run build
npm run start

# Linter
npm run lint
```

### Docker
```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f

# Supprimer tout (⚠️ efface les données)
docker-compose down -v
```

---

## 🎨 Tester le Studio de Design

1. Créer un compte: http://localhost:3000/register
2. Se connecter: http://localhost:3000/login
3. Aller dans "Mon Site" depuis le dashboard
4. Choisir un template de design
5. Personnaliser les couleurs et sections
6. Sauvegarder
7. Prévisualiser le site public: http://localhost:3000/[votre-slug]

---

## 📚 Documentation complète

- [README.md](./README.md) - Vue d'ensemble
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture modulaire
- [EVOLUTION.md](./EVOLUTION.md) - Historique du projet

---

**Besoin d'aide?** Vérifie que:
1. ✅ Docker tourne (`docker ps`)
2. ✅ Le fichier `backend/.env` existe
3. ✅ Les dépendances sont installées (`npm install`)
4. ✅ Prisma est généré (`npx prisma generate`)
5. ✅ Tu lances depuis le bon répertoire
