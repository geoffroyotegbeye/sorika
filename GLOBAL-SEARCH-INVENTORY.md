# ✅ Ajout du Module Inventaire à la Recherche Globale

## 🎯 Objectif

Rendre le module Inventaire accessible via la recherche globale (Cmd+K / Ctrl+K) dans la navbar.

## 🔍 Fonctionnement de la Recherche Globale

### Principe
Le composant `GlobalSearch` affiche **uniquement les éléments des modules activés** pour l'organisation.

```typescript
// Exemple : CRM n'apparaît que si le module est activé
...(modules.includes('CRM') ? [
  { id: 'crm', label: 'CRM — Vue d\'ensemble', ... },
  { id: 'crm-contacts', label: 'CRM — Contacts', ... },
] : [])
```

### Paramètres
- `slug` : Slug de l'organisation (ex: "sion-plus-nshgg")
- `modules` : Liste des modules activés (ex: `['CRM', 'HR', 'ACCOUNTING', 'INVENTORY']`)

### Déclenchement
- **Raccourci clavier** : `Cmd+K` (Mac) ou `Ctrl+K` (Windows/Linux)
- **Clic** : Sur le champ de recherche dans la navbar

## 🔧 Modifications effectuées

### 1. **Imports des icônes** (`GlobalSearch.tsx`)

✅ Ajouté les icônes du module Inventaire :

```typescript
import {
  // ... autres icônes
  Package,        // Icône principale + Produits
  FolderTree,     // Catégories
  ArrowUpDown,    // Mouvements
  AlertTriangle,  // Alertes
} from 'lucide-react';
```

### 2. **Items de recherche** (`GlobalSearch.tsx`)

✅ Ajouté 5 items pour le module Inventaire :

```typescript
// Inventaire
...(modules.includes('INVENTORY') ? [
  { 
    id: 'inv', 
    label: 'Inventaire — Vue d\'ensemble', 
    icon: Package, 
    href: d('/inventory'), 
    group: 'Inventaire' 
  },
  { 
    id: 'inv-products', 
    label: 'Inventaire — Produits', 
    icon: Package, 
    href: d('/inventory/products'), 
    group: 'Inventaire' 
  },
  { 
    id: 'inv-categories', 
    label: 'Inventaire — Catégories', 
    icon: FolderTree, 
    href: d('/inventory/categories'), 
    group: 'Inventaire' 
  },
  { 
    id: 'inv-movements', 
    label: 'Inventaire — Mouvements', 
    icon: ArrowUpDown, 
    href: d('/inventory/movements'), 
    group: 'Inventaire' 
  },
  { 
    id: 'inv-alerts', 
    label: 'Inventaire — Alertes', 
    icon: AlertTriangle, 
    href: d('/inventory/alerts'), 
    group: 'Inventaire' 
  },
] : []),
```

## 📊 Structure des items

Chaque item de recherche contient :

| Propriété | Description | Exemple |
|-----------|-------------|---------|
| `id` | Identifiant unique | `'inv-products'` |
| `label` | Texte affiché | `'Inventaire — Produits'` |
| `icon` | Composant d'icône Lucide | `Package` |
| `href` | URL de destination | `'/dashboard/[slug]/inventory/products'` |
| `group` | Groupe de regroupement | `'Inventaire'` |

## 🎨 Groupes de recherche

Les items sont automatiquement regroupés par `group` :

- **Général** : Tableau de bord, Membres, Paramètres
- **Site Vitrine** : Site Vitrine
- **Médias** : Médiathèque
- **CRM** : Vue d'ensemble, Contacts, Entreprises, Opportunités, Activités
- **RH** : Vue d'ensemble, Employés, Départements, Postes, Congés, Présences, Notes de frais, Organigramme
- **Comptabilité** : Vue d'ensemble, Factures, Devis, Charges, Fournisseurs, Paiements
- **Inventaire** ✨ : Vue d'ensemble, Produits, Catégories, Mouvements, Alertes

## 🔐 Filtrage par modules activés

### Exemple 1 : Organisation avec INVENTORY activé
```typescript
modules = ['CRM', 'HR', 'ACCOUNTING', 'INVENTORY']
```
✅ La recherche affiche : CRM, RH, Comptabilité, **Inventaire**

### Exemple 2 : Organisation sans INVENTORY
```typescript
modules = ['CRM', 'HR']
```
❌ La recherche affiche : CRM, RH (pas d'Inventaire)

## 🚀 Utilisation

### 1. Ouvrir la recherche
- Appuyer sur `Cmd+K` (Mac) ou `Ctrl+K` (Windows/Linux)
- Ou cliquer sur le champ "Rechercher..." dans la navbar

### 2. Taper une requête
- Minimum **2 caractères** requis
- Exemples de recherche :
  - `"inv"` → Affiche tous les items Inventaire
  - `"produits"` → Affiche "Inventaire — Produits"
  - `"alertes"` → Affiche "Inventaire — Alertes"
  - `"mouv"` → Affiche "Inventaire — Mouvements"
  - `"catég"` → Affiche "Inventaire — Catégories"

### 3. Naviguer
- Utiliser les flèches ↑↓ pour naviguer
- Appuyer sur `Enter` pour accéder à la page
- Ou cliquer directement sur un item

## 📝 Exemples de recherche

| Requête | Résultats affichés |
|---------|-------------------|
| `"inv"` | Tous les items du groupe Inventaire |
| `"produits"` | Inventaire — Produits |
| `"stock"` | *(aucun résultat, car "stock" n'est pas dans les labels)* |
| `"alertes"` | Inventaire — Alertes |
| `"vue"` | Tous les "Vue d'ensemble" (CRM, RH, Comptabilité, Inventaire) |

## 🔄 Pour ajouter un nouveau module à la recherche

### Étape 1 : Importer les icônes
```typescript
import { MonIcone } from 'lucide-react';
```

### Étape 2 : Ajouter les items
```typescript
// Mon Module
...(modules.includes('MON_MODULE') ? [
  { 
    id: 'mon-module', 
    label: 'Mon Module — Vue d\'ensemble', 
    icon: MonIcone, 
    href: d('/mon-module'), 
    group: 'Mon Module' 
  },
  { 
    id: 'mon-module-item', 
    label: 'Mon Module — Item', 
    icon: MonIcone, 
    href: d('/mon-module/item'), 
    group: 'Mon Module' 
  },
] : []),
```

### Étape 3 : Activer le module
```bash
# Exécuter le script de setup pour activer le module dans la DB
npx ts-node scripts/setup-mon-module.ts
```

## ✅ Checklist de vérification

- [x] Icônes importées (Package, FolderTree, ArrowUpDown, AlertTriangle)
- [x] 5 items ajoutés (Vue d'ensemble, Produits, Catégories, Mouvements, Alertes)
- [x] Condition `modules.includes('INVENTORY')` ajoutée
- [x] Groupe "Inventaire" créé
- [x] URLs correctes (`/dashboard/[slug]/inventory/...`)
- [x] Module activé dans la base de données
- [x] Serveur Next.js fonctionne sans erreur

## 🎉 Résultat

Le module Inventaire est maintenant **100% intégré** à la recherche globale :

✅ Accessible via `Cmd+K` / `Ctrl+K`  
✅ Affiché uniquement si le module est activé pour l'organisation  
✅ 5 pages accessibles : Dashboard, Produits, Catégories, Mouvements, Alertes  
✅ Icônes cohérentes avec le reste de l'application  
✅ Groupé dans la section "Inventaire"  

---

**Date** : 11 mai 2026  
**Statut** : ✅ Terminé et fonctionnel  
**Fichier modifié** : `/Users/macbookpro/Documents/www/sorika/frontend/components/GlobalSearch.tsx`
