# ÉTAPE 2B: PageManager Frontend - TERMINÉ

## Fichiers créés

### 1. Store Zustand (`lib/stores/pages-store.ts`)
- Interface Page complète
- État: pages[], currentPageSlug, isLoading
- Actions: setPages, setCurrentPage, addPage, updatePage, removePage, getCurrentPage

### 2. Composant PageManager (`components/editor/PageManager.tsx`)
- Liste des pages avec indicateur page d'accueil (icône Home)
- Bouton "+" pour créer une nouvelle page
- Menu contextuel par page:
  - Publier/Dépublier (icônes Eye/EyeOff)
  - Supprimer (protection page d'accueil)
- Dialog de création avec:
  - Titre (génère automatiquement le slug)
  - Slug (éditable)
  - Aperçu URL
- Highlight de la page active (fond bleu)

### 3. Intégration dans l'éditeur

#### Page Editor (`app/editor/[slug]/page.tsx`)
- Ajout du PageManager dans le layout (4 panneaux au lieu de 3)
- Chargement des éléments selon la page active
- useEffect pour charger les éléments quand currentPageSlug change
- Section par défaut si page vide

#### Toolbar (`components/editor/Toolbar.tsx`)
- Prop pageSlug ajoutée
- Sauvegarde vers l'endpoint de la page active
- PUT /companies/:companyId/pages/:pageSlug/elements

## Fonctionnalités

### Gestion des pages
- Créer une nouvelle page
- Générer automatiquement le slug depuis le titre
- Première page = page d'accueil automatiquement
- Supprimer une page (sauf page d'accueil)
- Publier/Dépublier une page
- Sélectionner la page à éditer

### Édition
- Les éléments sont chargés selon la page active
- Sauvegarde automatique sur la bonne page
- Changement de page = chargement des nouveaux éléments
- Section par défaut si page vide

### UI/UX
- Panneau latéral gauche pour les pages
- Icône Home pour la page d'accueil
- Highlight de la page active
- Menu contextuel avec actions rapides
- Dialog élégant pour créer une page
- Toast notifications

## Layout de l'éditeur

```
┌─────────────────────────────────────────────────────────┐
│                        Toolbar                           │
├──────────┬──────────┬─────────────────┬─────────────────┤
│  Pages   │ Elements │     Canvas      │   Properties    │
│          │          │                 │                 │
│ - Home   │ Section  │                 │   Layout        │
│ - About  │ Container│                 │   Spacing       │
│ + New    │ Heading  │                 │   Typography    │
│          │ ...      │                 │   ...           │
└──────────┴──────────┴─────────────────┴─────────────────┘
```

## API Endpoints utilisés

```
GET    /companies/:companyId/pages              - Liste des pages
POST   /companies/:companyId/pages              - Créer une page
GET    /companies/:companyId/pages/:slug        - Charger une page
PUT    /companies/:companyId/pages/:slug/elements - Sauvegarder éléments
POST   /companies/:companyId/pages/:slug/publish  - Publier
POST   /companies/:companyId/pages/:slug/unpublish - Dépublier
DELETE /companies/:companyId/pages/:slug        - Supprimer
```

## PROCHAINE ÉTAPE

ÉTAPE 2C: Routing dynamique
- Créer la route `/[companySlug]/[pageSlug]`
- Afficher les pages publiées
- Navigation entre pages
- Page d'accueil par défaut
