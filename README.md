# Sorika - Plateforme No-Code

Architecture modulaire type Odoo avec Next.js + NestJS + Prisma.

## 🚀 Démarrage rapide

### Prérequis
- Node.js v24+
- Docker (pour PostgreSQL)
- npm

### Installation

1. **Démarrer la base de données**
   ```bash
   # Lancer PostgreSQL avec Docker
   docker-compose up -d
   
   # Vérifier que la base tourne
   docker ps | grep sorika-db
   ```

2. **Configurer les variables d'environnement**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Modifier backend/.env si nécessaire (par défaut ça fonctionne)
   
   # Frontend (optionnel)
   cp frontend/.env.example frontend/.env.local
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

### Authentification & Dashboard
- ✅ Inscription en 2 onglets avec validation Zod
- ✅ Auto-génération du slug d'URL
- ✅ Connexion avec localStorage
- ✅ Dashboard protégé avec sidebar responsive
- ✅ Logging HTTP des requêtes backend

### Studio de Design Professionnel 🎨
- ✅ **5 templates de design** prêts à l'emploi (Modern, Élégant, Vibrant, Minimal, Créatif)
- ✅ **Éditeur de thème en temps réel** (couleurs, typographies)
- ✅ **Bibliothèque de sections** (Hero, Features, CTA, etc.)
- ✅ **Prévisualisation live** (desktop/tablet/mobile)
- ✅ **Système de design complet** (palette de 6 couleurs, fonts personnalisées)
- ✅ **CSS/JS personnalisé** pour les utilisateurs avancés
- ✅ **SEO intégré** (title, description, keywords)

### Site Public
- ✅ Rendu dynamique avec le design system
- ✅ Support des gradients et images de fond
- ✅ Bouton WhatsApp intégré
- ✅ Responsive et performant
- ✅ Mode maintenance

### Architecture
- ✅ Système de modules type Odoo (LANDING_PAGE, CRM, etc.)
- ✅ Guards NestJS pour protéger les routes
- ✅ Transaction Prisma atomique (User + Company + Membership)
- ✅ Stockage JSON flexible pour éviter 200 tables

## 🎯 Prochaines étapes

1. ✅ ~~Ajouter l'authentification~~ (Complété)
2. ✅ ~~Créer le dashboard~~ (Complété)
3. ✅ ~~Implémenter l'éditeur no-code~~ (Studio de Design complété)
4. ✅ ~~Drag & drop pour ajouter des éléments~~ (Complété)
5. 🚧 Upload d'images (Cloudinary/S3)
6. 🚧 Drag & drop pour réorganiser les sections
7. 🚧 Plus de sections (pricing, team, FAQ, testimonials, gallery)
8. 🚧 Templates complets (Restaurant, Agence, E-commerce)
9. 🚧 Modules additionnels (CRM, Analytics, Blog)

## ⚠️ Compatibilité Navigateurs

**Recommandé** : Chrome, Firefox, Edge  
**Limité** : Safari (drag & drop fonctionne mais sans indicateur visuel)

Voir [BROWSER_COMPATIBILITY.md](./BROWSER_COMPATIBILITY.md) pour plus de détails.

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture modulaire type Odoo
- [EVOLUTION.md](./EVOLUTION.md) - Historique complet du projet

## 🎨 Captures d'écran

### Studio de Design
- Interface split-screen avec éditeur et preview
- 5 templates professionnels
- Éditeur de palette de couleurs
- Bibliothèque de sections

### Dashboard
- Sidebar responsive avec navigation
- Aperçu du site et statistiques
- Checklist de démarrage

### Site Public
- Rendu avec design system personnalisé
- Sections modulaires et réutilisables
- Bouton WhatsApp intégré
