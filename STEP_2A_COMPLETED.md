# ÉTAPE 2A: Modèle Page - TERMINÉ

## Base de données

### Modèle Page créé dans Prisma
```prisma
model Page {
  id              String   @id @default(uuid())
  slug            String
  title           String
  description     String?
  elements        Json     @default("[]")
  metaTitle       String?
  metaDescription String?
  ogImage         String?
  isHomePage      Boolean  @default(false)
  isPublished     Boolean  @default(false)
  publishedAt     DateTime?
  companyId       String
  company         Company  @relation(...)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([companyId, slug])
}
```

### Migration appliquée
- Migration: `20260220163041_add_pages_model`
- Status: Appliquée avec succès

## Backend API

### Endpoints créés
```
POST   /companies/:companyId/pages              - Créer une page
GET    /companies/:companyId/pages              - Liste des pages
GET    /companies/:companyId/pages/home         - Page d'accueil
GET    /companies/:companyId/pages/:slug        - Une page
PUT    /companies/:companyId/pages/:slug        - Modifier une page
PUT    /companies/:companyId/pages/:slug/elements - Modifier les éléments
POST   /companies/:companyId/pages/:slug/publish  - Publier
POST   /companies/:companyId/pages/:slug/unpublish - Dépublier
DELETE /companies/:companyId/pages/:slug        - Supprimer
```

### Fichiers créés
- `src/pages/dto/create-page.dto.ts`
- `src/pages/dto/update-page.dto.ts`
- `src/pages/pages.service.ts`
- `src/pages/pages.controller.ts`
- `src/pages/pages.module.ts`
- `src/app.module.ts` (modifié)

## Fonctionnalités

- Création de pages avec slug unique par company
- Une seule page d'accueil par company
- Système de publication/dépublication
- Protection: impossible de supprimer la page d'accueil
- Gestion des éléments (JSON)
- SEO: metaTitle, metaDescription, ogImage

## PROCHAINE ÉTAPE

ÉTAPE 2B: Créer le PageManager dans le frontend
- Store Zustand pour les pages
- Interface de gestion des pages
- Sélecteur de page active dans l'éditeur
