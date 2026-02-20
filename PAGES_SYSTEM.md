# Système de Pages Multi-Pages

## ✅ Modifications effectuées

### 1. **Page d'accueil par défaut sur `/`**
- Lors de l'inscription, une page d'accueil est automatiquement créée avec `slug: ''` (route `/`)
- Cette page est marquée comme `isHomePage: true`
- Plus besoin de publier séparément

### 2. **Architecture**
```
Une page = {
  slug: '',           // '' pour la page d'accueil (/)
  title: 'Accueil',
  elements: [...],    // Collection d'éléments
  isHomePage: true,
  isPublished: false
}
```

### 3. **Sauvegarde**
- Chaque page sauvegarde ses éléments indépendamment
- Route: `PUT /companies/:companyId/pages/:slug/elements`
- Auto-save toutes les 30 secondes (si implémenté)

### 4. **Publication**
- **Publier tout** : `POST /companies/:companyId/pages/publish-all`
- Publie toutes les pages en même temps
- Toutes les pages deviennent visibles publiquement

### 5. **Backend - Nouvelles routes**
```typescript
// Pages Controller
POST   /companies/:companyId/pages/publish-all   // Publier toutes les pages
POST   /companies/:companyId/pages/unpublish-all // Dépublier toutes
PUT    /companies/:companyId/pages/:slug/elements // Sauvegarder éléments
```

### 6. **Frontend - Modifications**
- `Toolbar.tsx` : Bouton "Publier" publie toutes les pages
- `PageManager.tsx` : Gestion des pages multiples
- `auth.service.ts` : Création automatique de la page d'accueil

## 🎯 Workflow utilisateur

1. **Inscription** → Page d'accueil `/` créée automatiquement
2. **Édition** → Ajouter des éléments sur la page
3. **Créer d'autres pages** → `/about`, `/contact`, etc.
4. **Sauvegarder** → Ctrl+S sauvegarde la page actuelle
5. **Publier** → Bouton "Publier" publie TOUTES les pages en même temps

## 📝 Exemple de structure

```
Site: foodirect.sorika.bj
├── / (Accueil)           → slug: ''
├── /menu                 → slug: 'menu'
├── /contact              → slug: 'contact'
└── /about                → slug: 'about'
```

## 🔄 Migration

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## ⚠️ Important

- La page d'accueil (`isHomePage: true`) ne peut pas être supprimée
- Le slug vide `''` est réservé pour la page d'accueil
- Toutes les pages sont publiées ensemble (pas de publication individuelle)
