# Sorika - Plateforme No-Code

> 📚 **Documentation complète disponible dans le dossier [`docs/`](./docs/)**

## 🚀 Démarrage rapide

```bash
# 1. Démarrer PostgreSQL
docker-compose up -d

# 2. Backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# 3. Frontend
cd frontend
npm install
npm run dev
```

**Accès :**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📖 Documentation

Toute la documentation est organisée dans le dossier [`docs/`](./docs/) :

- [Guide d'installation](./docs/INSTALLATION.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Évolution du projet](./docs/EVOLUTION.md)
- [Système de pages](./docs/PAGES_SYSTEM.md)
- [Éléments globaux](./docs/GLOBAL_ELEMENTS.md)

## ✨ Fonctionnalités

- ✅ Éditeur no-code avec drag & drop
- ✅ Système multi-pages
- ✅ Éléments globaux (navbar, footer)
- ✅ Design responsive (desktop/tablet/mobile)
- ✅ Templates professionnels
- ✅ Système de verrouillage et visibilité
- ✅ Headers responsives avec menu hamburger

## 🛠️ Stack technique

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** NestJS, Prisma, PostgreSQL
- **Architecture:** Modulaire type Odoo

## 📝 Licence

MIT
