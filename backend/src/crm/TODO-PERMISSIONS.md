# 🔐 TODO : Activer les permissions CRM

## ⚠️ État actuel
Les permissions sont **DÉSACTIVÉES** pour le module CRM. Tous les utilisateurs authentifiés ont accès complet au CRM.

## 🎯 Quand activer ?
Activer les permissions quand le **système de paiement** sera en place et que l'accès au CRM deviendra **payant**.

---

## ✅ Checklist d'activation

### 1. Modifier le contrôleur (`crm.controller.ts`)

**Ligne 17** : Décommenter le `@UseGuards(PermissionGuard)`
```typescript
// AVANT
@Controller('companies/:companyId/crm')
// @UseGuards(PermissionGuard)  // ← DÉSACTIVÉ
export class CrmController {

// APRÈS
@Controller('companies/:companyId/crm')
@UseGuards(PermissionGuard)  // ← ACTIVÉ
export class CrmController {
```

### 2. Ajouter les imports nécessaires

**Ligne 1** : Ajouter `UseGuards` dans les imports
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
  UseGuards,  // ← Ajouter ceci
} from '@nestjs/common';
```

**Après les imports** : Ajouter l'import du guard
```typescript
import { PermissionGuard, RequirePermission } from '../common/guards/permission.guard';
```

### 3. Ajouter les décorateurs @RequirePermission

Pour **CHAQUE endpoint**, ajouter le décorateur approprié :

#### Contacts
```typescript
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
```

#### Entreprises clientes
```typescript
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
```

#### Opportunités
```typescript
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
```

#### Activités
```typescript
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
```

#### Dashboard
```typescript
@Get('stats')
@RequirePermission('CRM', 'READ')
async getCRMStats(...) { }
```

### 4. Gérer les permissions dans la base de données

**Option A** : Ajouter les permissions à toutes les organisations (phase de test)
```bash
cd backend
npx ts-node scripts/add-crm-permissions.ts
```

**Option B** : Ajouter uniquement aux organisations avec abonnement actif
```typescript
// Créer un script personnalisé basé sur votre système de paiement
const activeSubscriptions = await prisma.subscription.findMany({
  where: { 
    status: 'ACTIVE',
    modules: { has: 'CRM' }
  }
});

for (const sub of activeSubscriptions) {
  await addPermissionsToCompany(sub.companyId, 'CRM');
}
```

### 5. Tester

1. **Avec permissions** :
   - Créer un utilisateur avec permissions CRM
   - Tester tous les endpoints → doivent fonctionner

2. **Sans permissions** :
   - Créer un utilisateur sans permissions CRM
   - Tester les endpoints → doivent retourner 403 Forbidden

3. **Frontend** :
   - Vérifier que les erreurs 403 sont bien gérées
   - Afficher un message d'upgrade pour les modules payants

### 6. Mettre à jour le frontend

Ajouter la gestion des erreurs 403 dans les hooks CRM :

```typescript
// frontend/hooks/useCRMContacts.ts
try {
  const response = await fetch(url);
  
  if (response.status === 403) {
    setError('Accès au module CRM non autorisé. Veuillez souscrire à un abonnement.');
    // Rediriger vers la page d'upgrade
    return;
  }
  
  // ...
} catch (err) {
  // ...
}
```

---

## 📚 Référence

Pour plus de détails, consultez :
- `backend/PERMISSIONS.md` - Documentation complète du système de permissions
- `backend/src/hr/hr.controller.ts` - Exemple de module avec permissions activées
- `backend/src/common/guards/permission.guard.ts` - Implémentation du guard

---

## 🔗 Liens utiles

- Script d'ajout de permissions : `backend/scripts/add-crm-permissions.ts`
- Documentation Prisma : `backend/prisma/schema.prisma`
- Tests : À créer dans `backend/src/crm/crm.controller.spec.ts`

---

**Dernière mise à jour** : 9 mai 2026  
**Statut** : ⏸️ Permissions désactivées (accès libre)  
**Prochaine étape** : Attendre la mise en place du système de paiement
