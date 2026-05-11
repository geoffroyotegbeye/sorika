# 🛒 Module Point de Vente (POS) - Spécification Complète

## 📋 Vue d'ensemble

Le module POS permet de gérer les ventes en boutique physique avec une interface de caisse rapide et intuitive, intégrée aux modules Inventaire, Comptabilité et CRM.

---

## 🎯 Objectifs

1. **Interface de caisse rapide** pour les ventes en magasin
2. **Gestion multi-caisses** avec ouverture/fermeture
3. **Intégration automatique** avec Inventaire (stock) et Comptabilité (factures)
4. **Modes de paiement multiples** (Cash, Carte, Mobile Money)
5. **Rapports et statistiques** en temps réel
6. **Impression de tickets** de caisse

---

## 🗄️ Modèles de données (Prisma)

### 1. **CashRegister** (Caisse)
```prisma
model CashRegister {
  id          String   @id @default(cuid())
  name        String   // "Caisse 1", "Caisse principale"
  code        String   @unique // "CASH-001"
  location    String?  // "Magasin principal", "Succursale Nord"
  isActive    Boolean  @default(true)
  
  companyId   String
  company     Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  sessions    CashSession[]
  sales       Sale[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([companyId])
}
```

### 2. **CashSession** (Session de caisse)
```prisma
model CashSession {
  id              String    @id @default(cuid())
  
  registerId      String
  register        CashRegister @relation(fields: [registerId], references: [id], onDelete: Cascade)
  
  cashierId       String
  cashier         Employee  @relation(fields: [cashierId], references: [id])
  
  openingAmount   Float     // Fonds de départ
  closingAmount   Float?    // Fonds de fin (null si session ouverte)
  expectedAmount  Float?    // Montant attendu (calculé)
  difference      Float?    // Écart (closingAmount - expectedAmount)
  
  openedAt        DateTime  @default(now())
  closedAt        DateTime?
  
  status          String    @default("OPEN") // OPEN, CLOSED
  notes           String?   // Notes de fermeture
  
  sales           Sale[]
  
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([companyId])
  @@index([registerId])
  @@index([cashierId])
}
```

### 3. **Sale** (Vente)
```prisma
model Sale {
  id              String    @id @default(cuid())
  saleNumber      String    @unique // "POS-2026-00001"
  
  registerId      String
  register        CashRegister @relation(fields: [registerId], references: [id])
  
  sessionId       String
  session         CashSession @relation(fields: [sessionId], references: [id])
  
  cashierId       String
  cashier         Employee  @relation(fields: [cashierId], references: [id])
  
  customerId      String?   // Optionnel (lien CRM)
  customer        Contact?  @relation(fields: [customerId], references: [id])
  
  // Montants
  subtotal        Float     // Sous-total HT
  discountAmount  Float     @default(0)
  discountPercent Float     @default(0)
  taxAmount       Float     @default(0)
  taxPercent      Float     @default(18) // TVA 18%
  total           Float     // Total TTC
  
  // Paiement
  paymentMethod   String    // CASH, CARD, MOBILE_MONEY, MIXED
  amountPaid      Float
  changeAmount    Float     @default(0)
  
  // Statut
  status          String    @default("COMPLETED") // COMPLETED, CANCELLED, REFUNDED
  
  // Facture liée (Comptabilité)
  invoiceId       String?   @unique
  invoice         Invoice?  @relation(fields: [invoiceId], references: [id])
  
  items           SaleItem[]
  payments        SalePayment[]
  
  notes           String?
  
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([companyId])
  @@index([registerId])
  @@index([sessionId])
  @@index([cashierId])
  @@index([customerId])
}
```

### 4. **SaleItem** (Ligne de vente)
```prisma
model SaleItem {
  id          String  @id @default(cuid())
  
  saleId      String
  sale        Sale    @relation(fields: [saleId], references: [id], onDelete: Cascade)
  
  productId   String
  product     InventoryProduct @relation(fields: [productId], references: [id])
  
  productName String  // Nom au moment de la vente
  productSku  String  // SKU au moment de la vente
  
  quantity    Int
  unitPrice   Float   // Prix unitaire HT
  discount    Float   @default(0)
  taxPercent  Float   @default(18)
  subtotal    Float   // (quantity * unitPrice) - discount
  total       Float   // subtotal + tax
  
  createdAt   DateTime @default(now())
  
  @@index([saleId])
  @@index([productId])
}
```

### 5. **SalePayment** (Paiement - pour paiements mixtes)
```prisma
model SalePayment {
  id          String   @id @default(cuid())
  
  saleId      String
  sale        Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)
  
  method      String   // CASH, CARD, MOBILE_MONEY
  amount      Float
  reference   String?  // Référence transaction (pour carte/mobile money)
  
  createdAt   DateTime @default(now())
  
  @@index([saleId])
}
```

---

## 🔌 API Backend (NestJS)

### Endpoints

#### **Caisses (Cash Registers)**
```typescript
GET    /api/companies/:companyId/pos/registers          // Liste des caisses
POST   /api/companies/:companyId/pos/registers          // Créer une caisse
GET    /api/companies/:companyId/pos/registers/:id      // Détails caisse
PATCH  /api/companies/:companyId/pos/registers/:id      // Modifier caisse
DELETE /api/companies/:companyId/pos/registers/:id      // Supprimer caisse
```

#### **Sessions de caisse**
```typescript
GET    /api/companies/:companyId/pos/sessions           // Liste des sessions
POST   /api/companies/:companyId/pos/sessions/open      // Ouvrir session
POST   /api/companies/:companyId/pos/sessions/:id/close // Fermer session
GET    /api/companies/:companyId/pos/sessions/:id       // Détails session
GET    /api/companies/:companyId/pos/sessions/current   // Session active
```

#### **Ventes**
```typescript
GET    /api/companies/:companyId/pos/sales              // Liste des ventes
POST   /api/companies/:companyId/pos/sales              // Créer vente
GET    /api/companies/:companyId/pos/sales/:id          // Détails vente
POST   /api/companies/:companyId/pos/sales/:id/refund   // Rembourser vente
POST   /api/companies/:companyId/pos/sales/:id/cancel   // Annuler vente
GET    /api/companies/:companyId/pos/sales/:id/receipt  // Ticket de caisse
```

#### **Rapports**
```typescript
GET    /api/companies/:companyId/pos/reports/dashboard  // Dashboard POS
GET    /api/companies/:companyId/pos/reports/sales      // Rapport ventes
GET    /api/companies/:companyId/pos/reports/cashiers   // Performance caissiers
GET    /api/companies/:companyId/pos/reports/products   // Top produits
```

---

## 🎨 Interface Frontend (Next.js)

### Pages

```
/dashboard/[slug]/pos/
├── layout.tsx                    # Layout avec sidebar POS
├── page.tsx                      # Dashboard POS
├── cashier/
│   └── page.tsx                  # Interface de caisse (principale)
├── registers/
│   └── page.tsx                  # Gestion des caisses
├── sessions/
│   ├── page.tsx                  # Liste des sessions
│   └── [id]/page.tsx             # Détails session
├── sales/
│   ├── page.tsx                  # Liste des ventes
│   └── [id]/page.tsx             # Détails vente
└── reports/
    └── page.tsx                  # Rapports et statistiques
```

### Composants

```
components/pos/
├── CashierInterface.tsx          # Interface de caisse complète
├── ProductSearch.tsx             # Recherche de produits
├── Cart.tsx                      # Panier de vente
├── CartItem.tsx                  # Ligne du panier
├── PaymentDialog.tsx             # Modal de paiement
├── OpenSessionDialog.tsx         # Modal ouverture caisse
├── CloseSessionDialog.tsx        # Modal fermeture caisse
├── RegisterFormDialog.tsx        # Formulaire caisse
├── SalesList.tsx                 # Liste des ventes
├── SaleDetails.tsx               # Détails d'une vente
├── ReceiptPreview.tsx            # Aperçu ticket
└── POSStats.tsx                  # Statistiques POS
```

---

## 🔄 Flux de travail

### 1. **Ouverture de caisse**
```typescript
1. Caissier arrive le matin
2. Sélectionne sa caisse (ex: "Caisse 1")
3. Entre le fonds de départ (ex: 50,000 XOF)
4. Clique "Ouvrir la caisse"
→ Session créée (status: OPEN)
→ Interface de vente accessible
```

### 2. **Vente**
```typescript
1. Rechercher produit (SKU, nom, scan)
2. Ajouter au panier (quantité, prix)
3. Appliquer remise (optionnel)
4. Sélectionner client CRM (optionnel)
5. Cliquer "Payer"
6. Choisir mode de paiement
7. Valider la vente

→ Stock déduit automatiquement (Inventaire)
→ Mouvement de stock créé (type: OUT)
→ Facture créée automatiquement (Comptabilité)
→ Ticket imprimé
```

### 3. **Fermeture de caisse**
```typescript
1. Fin de journée
2. Cliquer "Fermer la caisse"
3. Compter l'argent physique
4. Enter le montant compté
5. Système calcule l'écart
6. Ajouter notes (si écart)
7. Valider la fermeture

→ Session fermée (status: CLOSED)
→ Rapport de caisse généré
```

---

## 🎯 Fonctionnalités clés

### ✅ Phase 1 (MVP)
- [x] Modèles de données (Prisma)
- [ ] API Backend (NestJS)
  - [ ] CRUD Caisses
  - [ ] Gestion sessions
  - [ ] Création ventes
  - [ ] Intégration Inventaire
  - [ ] Intégration Comptabilité
- [ ] Interface Frontend
  - [ ] Dashboard POS
  - [ ] Interface de caisse
  - [ ] Recherche produits
  - [ ] Panier
  - [ ] Paiement
  - [ ] Ouverture/Fermeture caisse
- [ ] Permissions (POS module)
- [ ] Tests

### 🚀 Phase 2 (Améliorations)
- [ ] Scan code-barres
- [ ] Impression tickets (PDF)
- [ ] Paiements mixtes (Cash + Carte)
- [ ] Remboursements
- [ ] Rapports avancés
- [ ] Multi-devises
- [ ] Programme fidélité
- [ ] Promotions automatiques

---

## 🔐 Permissions

```json
{
  "POS": ["READ", "CREATE", "UPDATE", "DELETE"]
}
```

**Rôles suggérés :**
- **Caissier** : READ, CREATE (ventes uniquement)
- **Manager** : READ, CREATE, UPDATE (+ gestion caisses)
- **Admin** : Toutes permissions

---

## 📊 Intégrations

### Avec Inventaire
```typescript
// Lors d'une vente
1. Vérifier stock disponible
2. Créer StockMovement (type: OUT, reason: "Vente POS #XXX")
3. Déduire quantité du stock
4. Déclencher alertes si nécessaire
```

### Avec Comptabilité
```typescript
// Lors d'une vente
1. Créer Invoice automatiquement
2. Status: PAID
3. Lier à la vente POS (invoiceId)
4. Créer Payment record
```

### Avec CRM
```typescript
// Si client sélectionné
1. Lier vente au Contact
2. Historique d'achats
3. Statistiques client
```

### Avec RH
```typescript
// Suivi des performances
1. Ventes par caissier (Employee)
2. CA par employé
3. Commissions (futur)
```

---

## 🎨 Design de l'interface de caisse

### Layout principal
```
┌─────────────────────────────────────────────────────────────┐
│ 🛒 Caisse 1 - Session #123 - Jean Dupont    [Fermer caisse] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────┐  ┌─────────────────────────┐ │
│  │ RECHERCHE PRODUIT        │  │ PANIER                  │ │
│  │                          │  │                         │ │
│  │ [SKU ou nom...] [📷]    │  │ T-shirt Blanc           │ │
│  │                          │  │ 5,000 x 2    10,000 XOF │ │
│  │ Résultats:               │  │                         │ │
│  │ ┌──────────────────────┐ │  │ Pantalon Jean           │ │
│  │ │ T-shirt Blanc        │ │  │ 15,000 x 1   15,000 XOF │ │
│  │ │ 5,000 XOF            │ │  │                         │ │
│  │ │ Stock: 48            │ │  │ ─────────────────────── │ │
│  │ │ [Ajouter]            │ │  │ Sous-total:  25,000 XOF │ │
│  │ └──────────────────────┘ │  │ Remise:      -2,500 XOF │ │
│  │                          │  │ TVA (18%):    4,050 XOF │ │
│  │ ┌──────────────────────┐ │  │ ─────────────────────── │ │
│  │ │ Pantalon Jean        │ │  │ TOTAL:       26,550 XOF │ │
│  │ │ 15,000 XOF           │ │  │                         │ │
│  │ │ Stock: 29            │ │  │ Client: [Sélectionner]  │ │
│  │ │ [Ajouter]            │ │  │                         │ │
│  │ └──────────────────────┘ │  │ [Annuler] [💰 Payer]   │ │
│  └──────────────────────────┘  └─────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 DTOs (Data Transfer Objects)

### CreateCashRegisterDto
```typescript
{
  name: string;
  code: string;
  location?: string;
}
```

### OpenSessionDto
```typescript
{
  registerId: string;
  cashierId: string;
  openingAmount: number;
}
```

### CloseSessionDto
```typescript
{
  closingAmount: number;
  notes?: string;
}
```

### CreateSaleDto
```typescript
{
  registerId: string;
  sessionId: string;
  cashierId: string;
  customerId?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
  discountPercent?: number;
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'MIXED';
  amountPaid: number;
  payments?: {
    method: string;
    amount: number;
    reference?: string;
  }[];
}
```

---

## 🚀 Prochaines étapes

1. **Créer la migration Prisma** (modèles)
2. **Backend NestJS** (module, controller, service, DTOs)
3. **Frontend** (pages, composants, hooks)
4. **Configuration** (modules.config.ts, sidebar, recherche globale)
5. **Tests** (vente complète, intégrations)
6. **Documentation**

---

**Prêt à commencer ?** 🎯
