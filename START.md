# 🚀 Guide de Démarrage Complet - Sorika

Ce guide vous explique **étape par étape** comment démarrer le projet Sorika (frontend + backend) depuis zéro.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé:

- ✅ **Node.js v24+** ([Télécharger](https://nodejs.org/))
- ✅ **Docker Desktop** ([Télécharger](https://www.docker.com/products/docker-desktop/))
- ✅ **npm** (inclus avec Node.js)
- ✅ **Git** (pour cloner le projet)

Vérifiez les versions:
```bash
node --version    # Doit afficher v24.x.x ou supérieur
npm --version     # Doit afficher 10.x.x ou supérieur
docker --version  # Doit afficher Docker version 20.x.x ou supérieur
```

---

## 🎯 Démarrage Rapide (5 minutes)

Si vous êtes pressé, voici les commandes essentielles:

```bash
# 1. Démarrer PostgreSQL
docker-compose up -d

# 2. Configurer les variables d'environnement
cp backend/.env.example backend/.env

# 3. Installer les dépendances
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 4. Appliquer les migrations
cd backend && npx prisma migrate deploy && npx prisma generate && cd ..

# 5. Démarrer l'application
./start-dev.sh
```

Puis ouvrez: http://localhost:3000

---

## 📖 Démarrage Détaillé (Étape par Étape)

### Étape 1: Cloner le projet

```bash
# Cloner le repository
git clone <url-du-repo> sorika
cd sorika

# Vérifier la structure
ls -la
# Vous devriez voir: backend/, frontend/, docker-compose.yml, etc.
```

---

### Étape 2: Démarrer la base de données PostgreSQL

```bash
# Démarrer PostgreSQL avec Docker
docker-compose up -d

# Vérifier que le conteneur tourne
docker ps

# Vous devriez voir:
# CONTAINER ID   IMAGE                PORTS                    NAMES
# xxxxxxxxxxxx   postgres:15-alpine   0.0.0.0:5433->5432/tcp   sorika-db

# Voir les logs (optionnel)
docker-compose logs -f postgres
```

**Configuration de la base de données:**
- Host: `localhost`
- Port: `5433` (pas 5432 pour éviter les conflits)
- Database: `sorika`
- User: `sorika`
- Password: `sorika123`

---

### Étape 3: Configurer les variables d'environnement

#### Backend

```bash
# Copier le fichier d'exemple
cp backend/.env.example backend/.env

# Vérifier le contenu
cat backend/.env
```

Le fichier `backend/.env` doit contenir:
```env
DATABASE_URL="postgresql://sorika:sorika123@localhost:5433/sorika?schema=public"
JWT_SECRET="votre-secret-jwt-super-securise-changez-moi-en-production"
PORT=3001
NODE_ENV=development
```

**⚠️ Important:** Ne modifiez pas `DATABASE_URL` sauf si vous avez changé la configuration Docker.

#### Frontend (Optionnel)

```bash
# Copier le fichier d'exemple (optionnel)
cp frontend/.env.example frontend/.env.local

# Le frontend fonctionne sans .env.local par défaut
```

---

### Étape 4: Installer les dépendances

#### Backend

```bash
cd backend

# Installer les packages npm
npm install

# Cela peut prendre 1-2 minutes
# Vous devriez voir: "added XXX packages"

cd ..
```

#### Frontend

```bash
cd frontend

# Installer les packages npm
npm install

# Cela peut prendre 1-2 minutes
# Vous devriez voir: "added XXX packages"

cd ..
```

---

### Étape 5: Configurer la base de données (Migrations Prisma)

```bash
cd backend

# Vérifier l'état des migrations
npx prisma migrate status

# Appliquer toutes les migrations
npx prisma migrate deploy

# Vous devriez voir:
# ✔ All migrations have been successfully applied.

# Générer le Prisma Client
npx prisma generate

# Vous devriez voir:
# ✔ Generated Prisma Client

cd ..
```

**Que font ces commandes?**
- `migrate deploy`: Applique toutes les migrations SQL à la base de données
- `generate`: Génère le client TypeScript pour accéder à la base de données

**Migrations appliquées:**
1. `init` - Tables de base (User, Company, Membership, Product)
2. `add_design_system` - Système de thème et sections
3. `webflow_editor` - Éditeur d'éléments
4. `add_pages_model` - Système multi-pages
5. `add_home_page_system` - Page d'accueil
6. `add_super_admin` - Rôle super admin
7. `restore_design_system` - Restauration du système de design

---

### Étape 6: Démarrer l'application

#### Option A: Script automatique (Recommandé)

```bash
# Depuis la racine du projet
./start-dev.sh
```

Ce script démarre automatiquement:
- ✅ Backend sur http://localhost:3001
- ✅ Frontend sur http://localhost:3000

Les logs des deux serveurs s'affichent dans le même terminal avec des couleurs différentes.

**Pour arrêter:** Appuyez sur `Ctrl+C`

#### Option B: Démarrage manuel (2 terminaux)

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev

# Vous devriez voir:
# [Nest] LOG [NestApplication] Nest application successfully started
# [Nest] LOG Application is running on: http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Vous devriez voir:
# ▲ Next.js 15.x.x
# - Local:        http://localhost:3000
# ✓ Ready in 2.5s
```

---

### Étape 7: Tester l'application

1. **Ouvrir le navigateur:** http://localhost:3000

2. **Créer un compte:**
   - Aller sur: http://localhost:3000/register
   - Remplir le formulaire (2 onglets)
   - Cliquer sur "Créer mon compte"

3. **Se connecter:**
   - Aller sur: http://localhost:3000/login
   - Entrer email et mot de passe
   - Vous serez redirigé vers le dashboard

4. **Tester le Studio de Design:**
   - Dans le dashboard, cliquer sur "Mon Site"
   - Choisir un template de design
   - Personnaliser les couleurs
   - Ajouter des sections
   - Cliquer sur "Enregistrer"

5. **Voir le site public:**
   - Cliquer sur "Prévisualiser"
   - Ou aller sur: http://localhost:3000/[votre-slug]

---

## 🔧 Commandes Utiles

### Base de données

```bash
cd backend

# Voir les données dans une interface graphique
npx prisma studio
# Ouvre http://localhost:5555

# Créer une nouvelle migration
npx prisma migrate dev --name ma_migration

# Réinitialiser la base de données (⚠️ efface toutes les données)
npx prisma migrate reset

# Vérifier l'état des migrations
npx prisma migrate status

# Scripts de maintenance
npx ts-node scripts/fix-landing-pages.ts          # Créer les landing pages manquantes
npx ts-node scripts/update-empty-landing-pages.ts # Ajouter sections par défaut
```

### Backend

```bash
cd backend

# Mode développement (avec hot reload)
npm run start:dev

# Build pour production
npm run build

# Démarrer en production
npm run start:prod

# Linter
npm run lint

# Tests
npm run test
```

### Frontend

```bash
cd frontend

# Mode développement
npm run dev

# Build pour production
npm run build

# Démarrer le build de production
npm run start

# Linter
npm run lint
```

### Docker

```bash
# Démarrer PostgreSQL
docker-compose up -d

# Arrêter PostgreSQL
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Supprimer tout (⚠️ efface les données)
docker-compose down -v
```

---

## 🐛 Résolution de Problèmes

### Erreur: "DATABASE_URL not found"

**Cause:** Le fichier `.env` n'existe pas ou n'est pas chargé.

**Solution:**
```bash
# Vérifier que le fichier existe
ls -la backend/.env

# Si absent, le créer
cp backend/.env.example backend/.env

# Redémarrer le backend
```

---

### Erreur: "Port 5433 already in use"

**Cause:** Un autre processus utilise le port 5433.

**Solution:**
```bash
# Arrêter le conteneur existant
docker stop sorika-db
docker rm sorika-db

# Relancer
docker-compose up -d
```

---

### Erreur: "Prisma Client outdated"

**Cause:** Le Prisma Client n'est pas à jour après une migration.

**Solution:**
```bash
cd backend
npx prisma generate

# Redémarrer le backend
```

---

### Erreur: "Cannot find module '@prisma/client'"

**Cause:** Les dépendances ne sont pas installées.

**Solution:**
```bash
cd backend
npm install
npx prisma generate
```

---

### Le backend ne démarre pas

**Vérifications:**
```bash
# 1. Docker tourne?
docker ps | grep sorika-db

# 2. Le .env existe?
cat backend/.env

# 3. Les dépendances sont installées?
ls backend/node_modules/@prisma/client

# 4. Prisma est généré?
cd backend && npx prisma generate

# 5. Tester la connexion DB
cd backend && npx prisma db push
```

---

### Le frontend ne démarre pas

**Solution:**
```bash
cd frontend

# Supprimer le cache
rm -rf .next

# Réinstaller les dépendances
rm -rf node_modules
npm install

# Redémarrer
npm run dev
```

---

### Erreur: "Migration already applied"

**Cause:** Vous essayez d'appliquer une migration déjà appliquée.

**Solution:**
```bash
cd backend

# Vérifier l'état
npx prisma migrate status

# Si tout est OK, juste régénérer le client
npx prisma generate
```

---

## 📊 Structure du Projet

```
sorika/
├── backend/                    # API NestJS
│   ├── prisma/
│   │   ├── schema.prisma      # Schéma de base de données
│   │   └── migrations/        # Migrations SQL
│   ├── src/
│   │   ├── auth/              # Authentification
│   │   ├── companies/         # API entreprises
│   │   ├── landing-page/      # API landing pages
│   │   ├── pages/             # API pages
│   │   ├── admin/             # API admin
│   │   ├── common/            # Guards, middleware
│   │   └── prisma/            # Service Prisma
│   ├── .env                   # Variables d'environnement (à créer)
│   ├── .env.example           # Exemple de .env
│   └── package.json
│
├── frontend/                   # Application Next.js
│   ├── app/
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── login/             # Connexion
│   │   ├── register/          # Inscription
│   │   ├── dashboard/[slug]/  # Dashboard
│   │   │   ├── layout.tsx     # Layout avec sidebar
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   └── site/
│   │   │       └── page.tsx   # Studio de design
│   │   └── [slug]/
│   │       └── page.tsx       # Site public
│   ├── components/ui/         # Composants shadcn/ui
│   ├── lib/                   # Utilitaires
│   ├── .env.local             # Variables d'environnement (optionnel)
│   ├── .env.example           # Exemple de .env
│   └── package.json
│
├── docker-compose.yml         # Configuration PostgreSQL
├── start-dev.sh               # Script de démarrage
├── .gitignore                 # Fichiers à ignorer
├── START.md                   # Ce fichier
├── README.md                  # Vue d'ensemble
├── QUICKSTART.md              # Guide rapide
├── ARCHITECTURE.md            # Architecture modulaire
└── EVOLUTION.md               # Historique du projet
```

---

## 🎯 Prochaines Étapes

Une fois l'application démarrée:

1. ✅ Créer un compte utilisateur
2. ✅ Explorer le dashboard
3. ✅ Tester le Studio de Design
4. ✅ Personnaliser votre site
5. ✅ Voir le rendu public

**Fonctionnalités à explorer:**
- 🎨 5 templates de design professionnels
- 🎨 Éditeur de palette de couleurs
- 📐 Bibliothèque de sections
- 👁️ Prévisualisation responsive (desktop/tablet/mobile)
- 💾 Sauvegarde en temps réel
- 🌐 Site public avec design personnalisé

---

## 📚 Documentation Complète

- **[README.md](./README.md)** - Vue d'ensemble du projet
- **[QUICKSTART.md](./QUICKSTART.md)** - Guide de dépannage
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture modulaire type Odoo
- **[EVOLUTION.md](./EVOLUTION.md)** - Historique complet du projet

---

## 🆘 Besoin d'Aide?

**Checklist avant de demander de l'aide:**

1. ✅ Docker tourne (`docker ps`)
2. ✅ Le fichier `backend/.env` existe
3. ✅ Les dépendances sont installées (`node_modules/` existe)
4. ✅ Prisma est généré (`npx prisma generate`)
5. ✅ Les migrations sont appliquées (`npx prisma migrate status`)
6. ✅ Vous lancez depuis le bon répertoire

**Commande de diagnostic:**
```bash
# Vérifier tout d'un coup
echo "=== Docker ===" && docker ps | grep sorika-db && \
echo "=== Backend .env ===" && ls -la backend/.env && \
echo "=== Backend node_modules ===" && ls backend/node_modules/@prisma/client && \
echo "=== Frontend node_modules ===" && ls frontend/node_modules/next && \
echo "=== Migrations ===" && cd backend && npx prisma migrate status
```

---

## 🎉 Félicitations!

Vous avez maintenant Sorika qui tourne en local! 🚀

**URLs importantes:**
- 🏠 Frontend: http://localhost:3000
- 🔧 Backend API: http://localhost:3001
- 📝 Inscription: http://localhost:3000/register
- 🔐 Connexion: http://localhost:3000/login
- 💾 Prisma Studio: http://localhost:5555 (après `npx prisma studio`)

**Bon développement! 💻✨**
