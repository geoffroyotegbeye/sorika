# 📦 Module Inventaire - Documentation

## 🎯 Vue d'ensemble

Le module **Inventaire** permet de gérer les stocks de produits, les catégories, les mouvements de stock et les alertes.

---

## ✅ Fonctionnalités implémentées

### 📊 **Dashboard**
- Statistiques globales (total produits, valeur du stock, alertes)
- Mouvements récents
- Indicateurs de performance

### 📦 **Produits**
- CRUD complet (Créer, Lire, Modifier, Supprimer)
- Gestion des informations :
  - Nom, SKU, code-barres
  - Description
  - Catégorie
  - Prix de vente et prix d'achat
  - Stock actuel, minimum, maximum
  - Unité de mesure (pièce, kg, litre, etc.)
  - Image
  - Poids et dimensions
  - Statuts (actif, vendable, achetable)
- Recherche et filtres
- Alertes de stock bas/rupture

### 🗂️ **Catégories**
- CRUD complet
- Hiérarchie (catégories parentes/enfants)
- Compteur de produits par catégorie

### 📈 **Mouvements de stock**
- 3 types de mouvements :
  - **IN** (Entrée) : Réception de marchandises
  - **OUT** (Sortie) : Vente ou utilisation
  - **ADJUSTMENT** (Ajustement) : Inventaire physique
- Historique complet avec :
  - Quantité
  - Stock avant/après
  - Raison et référence
  - Coût unitaire (pour les entrées)
  - Notes
- Filtres par produit, type, date

### 🚨 **Alertes**
- 3 types d'alertes automatiques :
  - **OUT_OF_STOCK** : Rupture de stock
  - **LOW_STOCK** : Stock bas (≤ seuil minimum)
  - **OVERSTOCK** : Surstock (> seuil maximum)
- Résolution manuelle des alertes
- Affichage des alertes actives/résolues

---

## 🗄️ **Base de données**

### Modèles Prisma

```prisma
ProductCategory      // Catégories de produits
InventoryProduct     // Produits en stock
StockMovement        // Mouvements de stock
StockAlert           // Alertes de stock
```

### Relations
- `Company` → `ProductCategory[]`
- `Company` → `InventoryProduct[]`
- `Company` → `StockMovement[]`
- `Company` → `StockAlert[]`
- `ProductCategory` → `ProductCategory` (parent/enfants)
- `InventoryProduct` → `ProductCategory`
- `InventoryProduct` → `StockMovement[]`
- `InventoryProduct` → `StockAlert[]`

---

## 🔧 **Installation et Configuration**

### 1. Migration de la base de données

```bash
cd backend
npx prisma migrate dev
```

### 2. Configuration complète (modules + permissions)

**Option recommandée** - Script tout-en-un :
```bash
cd backend
npx ts-node scripts/setup-inventory-module.ts
```

Ce script va :
- ✅ Activer les modules ACCOUNTING et INVENTORY
- ✅ Ajouter les permissions pour tous les membres
- ✅ Configurer toutes les organisations

**OU** - Scripts séparés :
```bash
# Activer les modules
npx ts-node scripts/activate-modules.ts

# Ajouter les permissions INVENTORY
npx ts-node scripts/add-inventory-permissions.ts
```

### 3. Démarrer le backend

```bash
cd backend
npm run start:dev
```

### 4. Démarrer le frontend

```bash
cd frontend
npm run dev
```

### 5. Accéder au module

1. Aller sur le dashboard : `http://localhost:3000/dashboard/[slug]`
2. Cliquer sur la carte **Inventaire**
3. Ou accéder directement : `http://localhost:3000/dashboard/[slug]/inventory`

---

## 📡 **API Endpoints**

### Base URL
```
/companies/:companyId/inventory
```

### Stats
- `GET /stats` - Statistiques globales

### Catégories
- `GET /categories` - Liste des catégories
- `POST /categories` - Créer une catégorie
- `PATCH /categories/:id` - Modifier une catégorie
- `DELETE /categories/:id` - Supprimer une catégorie

### Produits
- `GET /products` - Liste des produits (avec filtres)
- `GET /products/:id` - Détails d'un produit
- `POST /products` - Créer un produit
- `PATCH /products/:id` - Modifier un produit
- `DELETE /products/:id` - Supprimer un produit

### Mouvements
- `GET /movements` - Liste des mouvements (avec filtres)
- `POST /products/:productId/movements` - Créer un mouvement

### Alertes
- `GET /alerts` - Liste des alertes (avec filtres)
- `PATCH /alerts/:id/resolve` - Résoudre une alerte

---

## 🔐 **Permissions**

Le module utilise le système de permissions avec le module `INVENTORY` :

```json
{
  "INVENTORY": ["READ", "CREATE", "UPDATE", "DELETE"]
}
```

- **READ** : Voir les produits, catégories, mouvements, alertes
- **CREATE** : Créer des produits, catégories, mouvements
- **UPDATE** : Modifier des produits, catégories, résoudre des alertes
- **DELETE** : Supprimer des produits, catégories

---

## 🎨 **Frontend**

### Structure des fichiers

```
frontend/
├── app/dashboard/[slug]/inventory/
│   ├── layout.tsx                    # Layout avec navigation
│   ├── page.tsx                      # Dashboard
│   ├── products/page.tsx             # Liste des produits
│   ├── categories/page.tsx           # Liste des catégories
│   ├── movements/page.tsx            # Historique des mouvements
│   └── alerts/page.tsx               # Alertes de stock
├── components/inventory/
│   ├── ProductFormDialog.tsx         # Formulaire produit
│   ├── StockMovementDialog.tsx       # Formulaire mouvement
│   ├── CategoriesList.tsx            # Liste des catégories
│   └── CategoryFormDialog.tsx        # Formulaire catégorie
├── hooks/
│   └── useInventory.ts               # Hook personnalisé
└── types/
    └── inventory.ts                  # Types TypeScript
```

### Navigation

```
/dashboard/[slug]/inventory           → Dashboard
/dashboard/[slug]/inventory/products  → Produits
/dashboard/[slug]/inventory/categories → Catégories
/dashboard/[slug]/inventory/movements → Mouvements
/dashboard/[slug]/inventory/alerts    → Alertes
```

---

## 🚀 **Utilisation**

### Créer un produit

1. Aller sur **Produits**
2. Cliquer sur **Nouveau produit**
3. Remplir le formulaire :
   - Nom, SKU, code-barres
   - Catégorie
   - Prix de vente et d'achat
   - Stock initial
   - Seuils d'alerte
4. Enregistrer

### Enregistrer un mouvement de stock

1. Aller sur **Produits**
2. Cliquer sur **Mouvement** pour un produit
3. Choisir le type :
   - **Entrée** : Réception de marchandises
   - **Sortie** : Vente ou utilisation
   - **Ajustement** : Correction d'inventaire
4. Indiquer la quantité et les détails
5. Enregistrer

### Gérer les alertes

1. Aller sur **Alertes**
2. Voir les alertes actives (stock bas, rupture, surstock)
3. Cliquer sur **Résoudre** une fois le problème traité

---

## 🔄 **Intégrations futures**

### Avec Comptabilité
- Lier les produits aux lignes de factures/devis
- Déduire automatiquement le stock lors d'une vente
- Créer des mouvements depuis les factures

### Avec Point de Vente (POS)
- Scan de code-barres
- Déduction automatique du stock
- Alertes en temps réel

### Avec Achats
- Commandes fournisseurs
- Réception automatique (mouvement IN)
- Gestion des bons de livraison

---

## 📊 **Statistiques disponibles**

- Total de produits (actifs/inactifs)
- Valeur totale du stock (coût et vente)
- Nombre de produits en stock bas
- Nombre de produits en rupture
- Nombre de catégories
- Mouvements récents (10 derniers)

---

## ⚠️ **Points d'attention**

### Unicité
- Le **SKU** doit être unique par organisation
- Le **code-barres** doit être unique par organisation

### Validation
- Le stock ne peut pas être négatif lors d'une sortie
- Les catégories avec des produits ne peuvent pas être supprimées

### Alertes automatiques
- Les alertes sont créées/résolues automatiquement lors des mouvements
- Une alerte est créée si :
  - Stock = 0 (OUT_OF_STOCK)
  - Stock ≤ minStock (LOW_STOCK)
  - Stock > maxStock (OVERSTOCK)

---

## 🐛 **Dépannage**

### Erreur 403 (Forbidden)
→ Vérifier que les permissions INVENTORY sont bien ajoutées :
```bash
npx ts-node scripts/add-inventory-permissions.ts
```

### Les alertes ne s'affichent pas
→ Vérifier que les seuils min/max sont définis sur les produits

### Le stock ne se met pas à jour
→ Vérifier que le mouvement a bien été enregistré dans l'historique

---

## 📝 **TODO / Améliorations futures**

- [ ] Import/Export CSV des produits
- [ ] Codes-barres générés automatiquement
- [ ] Scan de code-barres (mobile)
- [ ] Inventaire physique (comptage)
- [ ] Valorisation du stock (FIFO, LIFO, PMP)
- [ ] Réservations de stock
- [ ] Lots et numéros de série
- [ ] Dates de péremption
- [ ] Emplacements de stockage
- [ ] Rapports avancés (rotation, valorisation)
- [ ] Prévisions de stock
- [ ] Intégration avec balance/scanner

---

**Version** : 1.0.0  
**Date** : 11 mai 2026  
**Statut** : ✅ MVP Fonctionnel
