# Plan: Header Responsive + Système de Routing

## ÉTAPE 1: Menu contextuel (TERMINÉ)
- [x] Correction texte: "Monter" / "Descendre"
- [x] Suppression des emojis

## ÉTAPE 2: Header avec propriétés avancées

### 2.1 Propriétés du Header
```typescript
interface HeaderProperties {
  // Position
  position: 'static' | 'sticky' | 'fixed';
  top: string;
  zIndex: number;
  
  // Layout
  layout: 'horizontal' | 'centered' | 'split';
  
  // Responsive
  mobileMenu: 'burger' | 'drawer' | 'dropdown';
  breakpoint: number; // px pour passer en mode mobile
  
  // Style
  backgroundColor: string;
  borderBottom: string;
  boxShadow: string;
  
  // Animation
  scrollBehavior: 'none' | 'hide' | 'shrink' | 'transparent';
}
```

### 2.2 Composants du Header
- Logo (image ou texte)
- Navigation (liens avec sous-menus)
- CTA Buttons
- Mobile Menu Toggle

### 2.3 Interactions
- Hover states
- Active link highlighting
- Smooth scroll to anchors
- Mobile menu animation

## ÉTAPE 3: Système de Navigation

### 3.1 Types de liens
```typescript
interface NavLink {
  id: string;
  label: string;
  type: 'anchor' | 'page' | 'external';
  target: string; // #section-id, /page-slug, https://...
  children?: NavLink[]; // Sous-menus
}
```

### 3.2 Comportements
- Anchor links: Scroll smooth vers section
- Page links: Navigation SPA
- External links: Nouvel onglet

## ÉTAPE 4: Système de Pages (SPA)

### 4.1 Structure de données
```typescript
interface Page {
  id: string;
  slug: string; // URL: /slug
  title: string;
  metaDescription: string;
  elements: Element[]; // Contenu de la page
  isHomePage: boolean;
}
```

### 4.2 Routing
- Client-side routing avec Next.js App Router
- Route dynamique: `/[companySlug]/[pageSlug]`
- Page par défaut: `/[companySlug]` (home)

### 4.3 Base de données
```prisma
model Page {
  id          String   @id @default(cuid())
  slug        String
  title       String
  description String?
  elements    Json     // Array d'éléments
  isHomePage  Boolean  @default(false)
  companyId   String
  company     Company  @relation(fields: [companyId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([companyId, slug])
}
```

## ÉTAPE 5: Éditeur de Pages

### 5.1 Interface
- Liste des pages (sidebar)
- Bouton "Nouvelle page"
- Sélecteur de page active
- Duplication de page

### 5.2 Gestion
- Créer page
- Renommer page
- Supprimer page
- Définir page d'accueil

## ORDRE D'IMPLÉMENTATION

1. Corriger menu contextuel (FAIT)
2. Créer HeaderPropertiesPanel avec toutes les options
3. Améliorer Canvas pour supporter header sticky
4. Créer modèle Page en base de données
5. Créer API endpoints pour pages
6. Créer PageManager dans l'éditeur
7. Implémenter routing dynamique
8. Créer système de navigation avec anchors
9. Ajouter animations et interactions

## FICHIERS À CRÉER/MODIFIER

### Backend
- `prisma/schema.prisma` - Ajouter model Page
- `src/pages/` - Module pages (CRUD)
- `src/pages/pages.controller.ts`
- `src/pages/pages.service.ts`
- `src/pages/dto/`

### Frontend
- `components/editor/properties/HeaderPropertiesPanel.tsx`
- `components/editor/PageManager.tsx`
- `lib/stores/pages-store.ts`
- `app/[companySlug]/[pageSlug]/page.tsx`
- `components/site/Header.tsx` - Rendu final du header
- `components/site/Navigation.tsx`

## PROCHAINE ÉTAPE
Commencer par ÉTAPE 2: Créer HeaderPropertiesPanel
