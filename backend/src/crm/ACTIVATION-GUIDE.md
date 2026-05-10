# 🚀 Guide d'activation des permissions CRM

## ⏱️ Temps estimé : 15 minutes

Ce guide vous explique **étape par étape** comment activer les permissions pour le module CRM quand le système de paiement sera en place.

---

## 📋 Prérequis

- [ ] Le système de paiement est fonctionnel
- [ ] Le modèle `Subscription` existe dans Prisma
- [ ] Les abonnements sont liés aux organisations
- [ ] Vous avez accès à la base de données

---

## 🔧 Étape 1 : Modifier le contrôleur (5 min)

### 1.1 Ouvrir le fichier
```bash
code backend/src/crm/crm.controller.ts
```

### 1.2 Ajouter les imports (ligne 1-15)

**Trouver cette ligne** :
```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
```

**Remplacer par** :
```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,  // ← AJOUTER
} from '@nestjs/common';
```

**Ajouter après les imports** :
```typescript
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';
```

### 1.3 Activer le guard (ligne ~17)

**Trouver** :
```typescript
@Controller('companies/:companyId/crm')
// @UseGuards(PermissionGuard)  // ← DÉSACTIVÉ
export class CrmController {
```

**Remplacer par** :
```typescript
@Controller('companies/:companyId/crm')
@UseGuards(PermissionGuard)  // ← ACTIVÉ
export class CrmController {
```

### 1.4 Ajouter les décorateurs sur les endpoints

**Pour CHAQUE endpoint**, ajouter le décorateur approprié JUSTE AVANT la méthode.

#### Exemple pour les contacts :

**Avant** :
```typescript
@Get('contacts')
async listContacts(...) { }
```

**Après** :
```typescript
@Get('contacts')
@RequirePermission('CRM', 'READ')  // ← AJOUTER
async listContacts(...) { }
```

#### Liste complète des décorateurs à ajouter :

```typescript
// ============================================
// CONTACTS
// ============================================

@Get('contacts')
@RequirePermission('CRM', 'READ')
async listContacts(...) { }

@Get('contacts/:id')
@RequirePermission('CRM', 'READ')
async getContact(...) { }

@Post('contacts')
@RequirePermission('CRM', 'CREATE')
async createContact(...) { }

@Patch('contacts/:id')
@RequirePermission('CRM', 'UPDATE')
async updateContact(...) { }

@Delete('contacts/:id')
@RequirePermission('CRM', 'DELETE')
async deleteContact(...) { }

// ============================================
// ENTREPRISES CLIENTES
// ============================================

@Get('client-companies')
@RequirePermission('CRM', 'READ')
async listClientCompanies(...) { }

@Get('client-companies/:id')
@RequirePermission('CRM', 'READ')
async getClientCompany(...) { }

@Post('client-companies')
@RequirePermission('CRM', 'CREATE')
async createClientCompany(...) { }

@Patch('client-companies/:id')
@RequirePermission('CRM', 'UPDATE')
async updateClientCompany(...) { }

@Delete('client-companies/:id')
@RequirePermission('CRM', 'DELETE')
async deleteClientCompany(...) { }

// ============================================
// OPPORTUNITÉS
// ============================================

@Get('opportunities')
@RequirePermission('CRM', 'READ')
async listOpportunities(...) { }

@Get('opportunities/:id')
@RequirePermission('CRM', 'READ')
async getOpportunity(...) { }

@Post('opportunities')
@RequirePermission('CRM', 'CREATE')
async createOpportunity(...) { }

@Patch('opportunities/:id')
@RequirePermission('CRM', 'UPDATE')
async updateOpportunity(...) { }

@Patch('opportunities/:id/stage')
@RequirePermission('CRM', 'UPDATE')
async updateStage(...) { }

@Delete('opportunities/:id')
@RequirePermission('CRM', 'DELETE')
async deleteOpportunity(...) { }

// ============================================
// ACTIVITÉS
// ============================================

@Get('activities')
@RequirePermission('CRM', 'READ')
async listActivities(...) { }

@Get('activities/:id')
@RequirePermission('CRM', 'READ')
async getActivity(...) { }

@Post('activities')
@RequirePermission('CRM', 'CREATE')
async createActivity(...) { }

@Patch('activities/:id')
@RequirePermission('CRM', 'UPDATE')
async updateActivity(...) { }

@Patch('activities/:id/complete')
@RequirePermission('CRM', 'UPDATE')
async completeActivity(...) { }

@Delete('activities/:id')
@RequirePermission('CRM', 'DELETE')
async deleteActivity(...) { }

// ============================================
// DASHBOARD
// ============================================

@Get('stats')
@RequirePermission('CRM', 'READ')
async getCRMStats(...) { }
```

---

## 🗄️ Étape 2 : Gérer les permissions dans la base de données (5 min)

### Option A : Ajouter à toutes les organisations (phase de test)

```bash
cd backend
npx ts-node scripts/add-crm-permissions.ts
```

### Option B : Ajouter uniquement aux organisations avec abonnement actif

Créer un script `backend/scripts/sync-crm-permissions-with-subscriptions.ts` :

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncCRMPermissions() {
  console.log('🔄 Synchronisation des permissions CRM avec les abonnements...\n');

  // 1. Retirer les permissions CRM de tous les memberships
  const allMemberships = await prisma.membership.findMany();
  
  for (const membership of allMemberships) {
    const permissions = membership.permissions as Record<string, string[]>;
    delete permissions.CRM;
    
    await prisma.membership.update({
      where: { id: membership.id },
      data: { permissions },
    });
  }
  
  console.log('✅ Permissions CRM retirées de tous les memberships\n');

  // 2. Ajouter les permissions uniquement aux organisations avec abonnement actif
  const activeSubscriptions = await prisma.subscription.findMany({
    where: {
      status: 'ACTIVE',
      modules: { has: 'CRM' },
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  console.log(`📊 ${activeSubscriptions.length} abonnement(s) actif(s) avec CRM\n`);

  for (const subscription of activeSubscriptions) {
    const memberships = await prisma.membership.findMany({
      where: { companyId: subscription.companyId },
    });

    for (const membership of memberships) {
      const permissions = membership.permissions as Record<string, string[]>;
      permissions.CRM = ['READ', 'CREATE', 'UPDATE', 'DELETE'];

      await prisma.membership.update({
        where: { id: membership.id },
        data: { permissions },
      });
    }

    console.log(`✅ Permissions CRM ajoutées à ${subscription.company.name}`);
  }

  console.log('\n✨ Synchronisation terminée !');
  await prisma.$disconnect();
}

syncCRMPermissions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
```

**Exécuter** :
```bash
npx ts-node scripts/sync-crm-permissions-with-subscriptions.ts
```

---

## 🧪 Étape 3 : Tester (5 min)

### 3.1 Redémarrer le backend
```bash
cd backend
npm run start:dev
```

### 3.2 Tester avec une organisation qui a les permissions

**Dans Postman ou curl** :
```bash
curl -X GET \
  http://localhost:3001/companies/dos-service-y7ckr/crm/contacts \
  -H 'x-user-id: votre-user-id'
```

**Résultat attendu** : ✅ 200 OK avec la liste des contacts

### 3.3 Tester avec une organisation qui n'a PAS les permissions

**Retirer les permissions** :
```sql
UPDATE "Membership"
SET permissions = '{}'::jsonb
WHERE "companyId" = 'company-id-test';
```

**Tester** :
```bash
curl -X GET \
  http://localhost:3001/companies/company-id-test/crm/contacts \
  -H 'x-user-id: user-id-test'
```

**Résultat attendu** : ❌ 403 Forbidden

### 3.4 Vérifier les logs

Dans les logs du backend, vous devriez voir :
```
[PermissionGuard] Permission CRM:READ requise
```

---

## 🎨 Étape 4 : Mettre à jour le frontend (optionnel)

### 4.1 Gérer les erreurs 403

Dans chaque hook CRM (`useCRMContacts.ts`, `useCRMCompanies.ts`, etc.) :

```typescript
try {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': localStorage.getItem('userId') || '',
    },
  });

  if (response.status === 403) {
    setError('Accès au module CRM non autorisé. Veuillez souscrire à un abonnement Premium.');
    // Optionnel : Rediriger vers la page d'upgrade
    // window.location.href = '/upgrade?module=CRM';
    return;
  }

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données');
  }

  const data = await response.json();
  // ...
} catch (err: any) {
  setError(err.message);
}
```

### 4.2 Afficher un message d'upgrade

Créer un composant `UpgradePrompt.tsx` :

```typescript
export function UpgradePrompt({ module }: { module: string }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
      <h3 className="text-xl font-bold text-blue-900 mb-2">
        Module {module} Premium
      </h3>
      <p className="text-blue-700 mb-4">
        Ce module nécessite un abonnement Premium pour être utilisé.
      </p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Passer à Premium
      </button>
    </div>
  );
}
```

Utiliser dans les pages CRM :

```typescript
if (error && error.includes('non autorisé')) {
  return <UpgradePrompt module="CRM" />;
}
```

---

## ✅ Checklist finale

- [ ] `@UseGuards(PermissionGuard)` activé sur le contrôleur
- [ ] `@RequirePermission` ajouté sur tous les endpoints
- [ ] Permissions synchronisées avec les abonnements
- [ ] Tests réussis avec permissions
- [ ] Tests réussis sans permissions (403)
- [ ] Frontend gère les erreurs 403
- [ ] Message d'upgrade affiché
- [ ] Documentation mise à jour
- [ ] Équipe informée du changement

---

## 🔄 Rollback (en cas de problème)

Si vous devez revenir en arrière :

### 1. Désactiver le guard
```typescript
@Controller('companies/:companyId/crm')
// @UseGuards(PermissionGuard)  // ← Recommenter
export class CrmController {
```

### 2. Redémarrer le backend
```bash
npm run start:dev
```

### 3. Tout redevient accessible

---

## 📞 Support

En cas de problème :
1. Vérifier les logs du backend
2. Vérifier la base de données (permissions)
3. Consulter `backend/PERMISSIONS.md`
4. Contacter l'équipe backend

---

**Bonne chance ! 🚀**
