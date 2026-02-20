# Sorika - Plateforme No-Code

Architecture modulaire type Odoo avec Next.js + NestJS + Prisma.

## 🚀 Démarrage rapide

### Prérequis
- Node.js v24+
- PostgreSQL
- npm

### Installation

1. **Configurer la base de données**
   ```bash
   # Créer la base de données PostgreSQL
   createdb sorika
   
   # Ou modifier le DATABASE_URL dans backend/.env
   ```

2. **Installer les dépendances**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Migrer la base de données**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Démarrer l'application**
   ```bash
   # Option 1: Script automatique (recommandé)
   ./start-dev.sh
   
   # Option 2: Manuellement
   # Terminal 1 - Backend
   cd backend && npm run start:dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

5. **Accéder à l'application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Inscription: http://localhost:3000/register

## 📁 Structure du projet

```
sorika/
├── backend/          # NestJS API
│   ├── prisma/       # Schéma de base de données
│   └── src/
│       ├── auth/     # Authentification
│       ├── landing-page/  # Module Landing Page
│       ├── common/guards/ # Guards (vérification modules)
│       └── prisma/   # Service Prisma
├── frontend/         # Next.js App
│   ├── app/          # Pages
│   ├── components/   # Composants shadcn/ui
│   └── lib/          # Validations Zod
└── ARCHITECTURE.md   # Documentation architecture
```

## ✨ Fonctionnalités

- ✅ Inscription avec transaction Prisma (User + Company + Membership)
- ✅ Formulaire élégant avec shadcn/ui + React Hook Form + Zod
- ✅ Système de modules type Odoo (LANDING_PAGE, CRM, etc.)
- ✅ Guards NestJS pour protéger les routes par module
- ✅ Toast notifications (Sonner)
- ✅ Modal de confirmation
- ✅ Validation en temps réel
- ✅ Auto-génération du slug d'URL

## 🎯 Prochaines étapes

1. Ajouter l'authentification JWT
2. Créer le dashboard
3. Implémenter l'éditeur no-code de landing page
4. Ajouter d'autres modules (CRM, Analytics, etc.)

## 📚 Documentation

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour comprendre l'architecture modulaire.
