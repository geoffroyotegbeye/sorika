# 🎯 Spécification : Navigation Modulaire

## Objectif
Créer un système de navigation modulaire où chaque module (CRM, RH, Comptabilité, etc.) a sa propre sidebar avec ses menus spécifiques, et un dashboard général pour switcher entre modules.

## Architecture

### 1. Dashboard Général (Hub)
- **URL** : `/dashboard/[slug]`
- **Sidebar** : Réduite (icônes uniquement) ou masquée
- **Contenu** :
  - Grille des modules disponibles
  - Modules récemment visités
  - Recherche globale

### 2. Modules avec Sidebar Spécifique
- **CRM** : `/dashboard/[slug]/crm/*`
  - Dashboard CRM
  - Contacts
  - Entreprises
  - Opportunités
  - Activités

- **RH** : `/dashboard/[slug]/hr/*`
  - Dashboard RH
  - Employés
  - Départements
  - Postes
  - Organigramme
  - Présences
  - Congés
  - Notes de frais

### 3. Navbar Globale
- Bouton "Modules" (retour au dashboard)
- Nom du module actif
- Recherche globale (Cmd+K)
- Notifications
- Profil utilisateur

## Composants à Créer

### `ModuleSidebar.tsx`
Sidebar dynamique qui affiche les menus du module actif.

### `ModuleNavbar.tsx`
Navbar avec bouton modules et recherche globale.

### `GlobalSearch.tsx`
Recherche globale pour switcher entre modules (Cmd+K).

### `RecentModules.tsx`
Liste des modules récemment visités.

## Fichiers à Modifier

1. `frontend/app/dashboard/[slug]/layout.tsx` - Layout principal
2. `frontend/app/dashboard/[slug]/crm/layout.tsx` - Layout CRM
3. `frontend/app/dashboard/[slug]/hr/layout.tsx` - Layout RH
4. `frontend/app/dashboard/[slug]/page.tsx` - Dashboard général

## Tracking des Visites
- Utiliser localStorage pour enregistrer les modules visités
- Format : `sorika_recent_modules_{slug}`
- Stocker : `[{ moduleId, timestamp, path }]`
- Limiter à 5 derniers modules

## État Actuel
✅ Dashboard général existe
✅ Layouts CRM et RH existent (avec tabs)
❌ Sidebar dynamique par module
❌ Bouton "Modules" dans navbar
❌ Recherche globale
❌ Tracking amélioré

## Prochaines Étapes
1. Créer `ModuleSidebar` component
2. Créer configuration des menus par module
3. Modifier les layouts CRM/RH pour utiliser ModuleSidebar
4. Ajouter bouton "Modules" dans navbar
5. Créer recherche globale (Cmd+K)
6. Améliorer tracking des visites
