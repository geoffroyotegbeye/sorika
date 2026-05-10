# 🔐 Système de Permissions et Contrôle d'Accès aux Modules

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture actuelle](#architecture-actuelle)
3. [Comment fonctionne le système](#comment-fonctionne-le-système)
4. [Activer les permissions pour un module](#activer-les-permissions-pour-un-module)
5. [Gestion des permissions](#gestion-des-permissions)
6. [Exemples pratiques](#exemples-pratiques)

---

## 🎯 Vue d'ensemble

Le système de permissions permet de **contrôler l'accès aux modules** en fonction des abonnements payants des organisations. 

### État actuel (Phase MVP)
- ✅ **Module HR** : Permissions activées (exemple de référence)
- ⏸️ **Module CRM** : Permissions désactivées temporairement (accès libre)
- 🔜 **Futurs modules** : Permissions à activer lors de la mise en place du système de paiement

### Objectif futur
Quand le système de facturation sera en place, seules les organisations qui paient auront accès aux modules premium (CRM, Comptabilité, Inventaire, etc.).

---

## 🏗️ Architecture actuelle

### 1. Modèle de données (Prisma)

```prisma
model Membership {
  id          String   @id @default(uuid())
  role        String   @default("OWNER") // OWNER, ADMIN, STAFF
  permissions Json     @default("{}") // Structure des permissions
  userId      String
  companyId   String
  user        User     @relation(fields: [userId], references: [id])
  company     Company  @relation(fields: [companyId], references: [id])
  
  @@unique([userId, companyId])
}
```

### 2. Structure des permissions (JSON)

```json
{
  "HR": ["READ", "CREATE", "UPDATE", "DELETE"],
  "CRM": ["READ", "CREATE", "UPDATE", "DELETE"],
  "ACCOUNTING": ["READ", "CREATE"],
  "INVENTORY": ["READ"]
}
```

**Explication** :
- Chaque **module** (HR, CRM, etc.) a une liste d'**actions** autorisées
- Actions possibles : `READ`, `CREATE`, `UPDATE`, `DELETE`, `MANAGE`
- Si un module n'est pas dans la liste → accès refusé

### 3. Le PermissionGuard

Fichier : `backend/src/common/guards/permission.guard.ts`

```typescript
@Injectable()
export class PermissionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Récupérer userId et companyId
    const userId = request.headers['x-user-id'];
    const companyId = request.params?.companyId;
    
    // 2. Vérifier que l'utilisateur est membre de l'organisation
    const membership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId, companyId } }
    });
    
    // 3. Vérifier les permissions requises
    const required = this.reflector.get('requiredPermission', context.getHandler());
    
    if (required) {
      const permissions = membership.permissions;
      const allowed = permissions[required.module]?.includes(required.action);
      
      if (!allowed) {
        throw new ForbiddenException('Permission requise');
      }
    }
    
    return true;
  }
}
```

---

## 🔧 Comment fonctionne le système

### Flux d'une requête avec permissions

```
1. Client envoie une requête
   ↓
2. PermissionGuard intercepte
   ↓
3. Vérifie l'authentification (userId + companyId)
   ↓
4. Récupère le Membership
   ↓
5. Vérifie la permission requise (@RequirePermission)
   ↓
6. Autorise ou refuse l'accès
   ↓
7. Exécute le contrôleur si autorisé
```

### Exemple concret

**Requête** :
```http
GET /companies/abc-123/hr/employees
Headers:
  x-user-id: user-456
```

**Vérifications** :
1. ✅ L'utilisateur `user-456` est-il membre de l'organisation `abc-123` ?
2. ✅ Le membership a-t-il la permission `HR:READ` ?
3. ✅ Si oui → accès autorisé
4. ❌ Si non → 403 Forbidden

---

## 🚀 Activer les permissions pour un module

### Étape 1 : Activer le PermissionGuard sur le contrôleur

**Avant (accès libre - état actuel du CRM)** :
```typescript
@Controller('companies/:companyId/crm')
// @UseGuards(PermissionGuard)  // ← DÉSACTIVÉ
export class CrmController {
  // Pas de vérification de permissions
}
```

**Après (avec permissions)** :
```typescript
@Controller('companies/:companyId/crm')
@UseGuards(PermissionGuard)  // ← ACTIVÉ
export class CrmController {
  // Vérification des permissions sur chaque endpoint
}
```

### Étape 2 : Ajouter les décorateurs @RequirePermission

```typescript
import { RequirePermission } from '../common/guards/permission.guard';

@Controller('companies/:companyId/crm')
@UseGuards(PermissionGuard)
export class CrmController {
  
  // ============================================
  // CONTACTS
  // ============================================
  
  @Get('contacts')
  @RequirePermission('CRM', 'READ')  // ← Permission requise
  async listContacts(@Param('companyId') companyId: string) {
    return this.crmService.listContacts(companyId);
  }
  
  @Post('contacts')
  @RequirePermission('CRM', 'CREATE')  // ← Permission requise
  async createContact(
    @Param('companyId') companyId: string,
    @Body() dto: CreateContactDto,
  ) {
    return this.crmService.createContact(companyId, dto);
  }
  
  @Patch('contacts/:id')
  @RequirePermission('CRM', 'UPDATE')  // ← Permission requise
  async updateContact(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.crmService.updateContact(id, companyId, dto);
  }
  
  @Delete('contacts/:id')
  @RequirePermission('CRM', 'DELETE')  // ← Permission requise
  async deleteContact(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.deleteContact(id, companyId);
  }
  
  // Répéter pour tous les endpoints...
}
```

### Étape 3 : Règles de mapping des permissions

| Méthode HTTP | Action | Permission requise |
|--------------|--------|-------------------|
| `GET` | Lire | `READ` |
| `POST` | Créer | `CREATE` |
| `PATCH` / `PUT` | Modifier | `UPDATE` |
| `DELETE` | Supprimer | `DELETE` |
| Endpoints admin | Gérer | `MANAGE` |

---

## 🛠️ Gestion des permissions

### Script 1 : Ajouter des permissions à tous les memberships

Fichier : `backend/scripts/add-module-permissions.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addModulePermissions(moduleName: string) {
  console.log(`🔧 Ajout des permissions ${moduleName}...\n`);

  const memberships = await prisma.membership.findMany({
    include: {
      user: { select: { email: true } },
      company: { select: { name: true } },
    },
  });

  let updated = 0;

  for (const membership of memberships) {
    const permissions = membership.permissions as Record<string, string[]>;

    if (!permissions[moduleName]) {
      permissions[moduleName] = ['READ', 'CREATE', 'UPDATE', 'DELETE'];

      await prisma.membership.update({
        where: { id: membership.id },
        data: { permissions },
      });

      console.log(`✅ ${membership.user.email} → ${membership.company.name}`);
      updated++;
    }
  }

  console.log(`\n✨ ${updated} membership(s) mis à jour !`);
  await prisma.$disconnect();
}

// Utilisation
addModulePermissions('CRM').then(() => process.exit(0));
```

**Exécution** :
```bash
cd backend
npx ts-node scripts/add-module-permissions.ts
```

### Script 2 : Ajouter des permissions à une organisation spécifique

```typescript
async function addPermissionsToCompany(companySlug: string, moduleName: string) {
  const company = await prisma.company.findUnique({
    where: { slug: companySlug },
  });

  if (!company) {
    throw new Error(`Entreprise ${companySlug} introuvable`);
  }

  const memberships = await prisma.membership.findMany({
    where: { companyId: company.id },
  });

  for (const membership of memberships) {
    const permissions = membership.permissions as Record<string, string[]>;
    permissions[moduleName] = ['READ', 'CREATE', 'UPDATE', 'DELETE'];

    await prisma.membership.update({
      where: { id: membership.id },
      data: { permissions },
    });
  }

  console.log(`✅ Permissions ${moduleName} ajoutées à ${company.name}`);
}

// Utilisation
addPermissionsToCompany('dos-service-y7ckr', 'CRM');
```

### Script 3 : Retirer des permissions

```typescript
async function removeModulePermissions(moduleName: string) {
  const memberships = await prisma.membership.findMany();

  for (const membership of memberships) {
    const permissions = membership.permissions as Record<string, string[]>;
    
    if (permissions[moduleName]) {
      delete permissions[moduleName];

      await prisma.membership.update({
        where: { id: membership.id },
        data: { permissions },
      });
    }
  }

  console.log(`✅ Permissions ${moduleName} retirées de tous les memberships`);
}
```

---

## 📚 Exemples pratiques

### Exemple 1 : Module HR (avec permissions activées)

```typescript
@Controller('companies/:companyId/hr')
@UseGuards(PermissionGuard)  // ✅ Activé
export class HRController {
  
  @Get('employees')
  @RequirePermission('HR', 'READ')  // ✅ Permission requise
  listEmployees(@Param('companyId') companyId: string) {
    return this.hrService.listEmployees(companyId);
  }
  
  @Post('employees')
  @RequirePermission('HR', 'CREATE')  // ✅ Permission requise
  createEmployee(@Param('companyId') companyId: string, @Body() dto: any) {
    return this.hrService.createEmployee(companyId, dto);
  }
}
```

**Résultat** :
- ✅ Seuls les utilisateurs avec `HR:READ` peuvent lister les employés
- ✅ Seuls les utilisateurs avec `HR:CREATE` peuvent créer des employés
- ❌ Sans permissions → 403 Forbidden

### Exemple 2 : Module CRM (permissions désactivées temporairement)

```typescript
@Controller('companies/:companyId/crm')
// @UseGuards(PermissionGuard)  // ⏸️ DÉSACTIVÉ temporairement
export class CrmController {
  
  @Get('contacts')
  // Pas de @RequirePermission  // ⏸️ Pas de vérification
  async listContacts(@Param('companyId') companyId: string) {
    return this.crmService.listContacts(companyId);
  }
}
```

**Résultat** :
- ✅ Tous les utilisateurs authentifiés peuvent accéder au CRM
- ✅ Les données restent isolées par `organizationId`
- 🔜 À activer quand le système de paiement sera en place

---

## 🔄 Plan de migration vers les permissions payantes

### Phase 1 : Préparation (maintenant)
- ✅ Système de permissions en place
- ✅ Module HR avec permissions activées (référence)
- ✅ Module CRM avec permissions désactivées (accès libre)

### Phase 2 : Système de paiement
1. Créer un modèle `Subscription` dans Prisma
2. Lier les abonnements aux organisations
3. Créer un service de gestion des abonnements

### Phase 3 : Activation des permissions
1. **Pour chaque module payant** :
   - Décommenter `@UseGuards(PermissionGuard)`
   - Ajouter `@RequirePermission` sur chaque endpoint
   
2. **Script de migration** :
   ```typescript
   // Retirer les permissions CRM de toutes les organisations
   await removeModulePermissions('CRM');
   
   // Ajouter uniquement aux organisations avec abonnement actif
   const activeSubscriptions = await prisma.subscription.findMany({
     where: { status: 'ACTIVE', modules: { has: 'CRM' } }
   });
   
   for (const sub of activeSubscriptions) {
     await addPermissionsToCompany(sub.companyId, 'CRM');
   }
   ```

3. **Webhook de paiement** :
   ```typescript
   // Quand un paiement est reçu
   async function onPaymentSuccess(companyId: string, modules: string[]) {
     for (const module of modules) {
       await addPermissionsToCompany(companyId, module);
     }
   }
   ```

### Phase 4 : Gestion des expirations
```typescript
// Cron job quotidien
async function checkExpiredSubscriptions() {
  const expired = await prisma.subscription.findMany({
    where: { 
      status: 'ACTIVE',
      expiresAt: { lt: new Date() }
    }
  });
  
  for (const sub of expired) {
    // Retirer les permissions
    for (const module of sub.modules) {
      await removePermissionsFromCompany(sub.companyId, module);
    }
    
    // Marquer comme expiré
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: 'EXPIRED' }
    });
  }
}
```

---

## ✅ Checklist pour activer les permissions d'un module

- [ ] 1. Décommenter `@UseGuards(PermissionGuard)` sur le contrôleur
- [ ] 2. Ajouter `@RequirePermission('MODULE', 'ACTION')` sur chaque endpoint
- [ ] 3. Tester avec un utilisateur qui a les permissions
- [ ] 4. Tester avec un utilisateur qui n'a PAS les permissions (doit recevoir 403)
- [ ] 5. Créer un script de migration pour gérer les permissions existantes
- [ ] 6. Documenter les permissions requises dans le README du module
- [ ] 7. Mettre à jour le frontend pour gérer les erreurs 403
- [ ] 8. Ajouter un message d'upgrade dans le frontend pour les modules payants

---

## 🆘 Dépannage

### Problème : 403 Forbidden même avec les bonnes permissions

**Vérifications** :
1. Le membership existe-t-il ?
   ```sql
   SELECT * FROM "Membership" WHERE "userId" = 'xxx' AND "companyId" = 'yyy';
   ```

2. Les permissions sont-elles correctes ?
   ```sql
   SELECT permissions FROM "Membership" WHERE id = 'membership-id';
   ```

3. Le format JSON est-il valide ?
   ```json
   {
     "CRM": ["READ", "CREATE", "UPDATE", "DELETE"]
   }
   ```

### Problème : Le guard ne s'active pas

**Vérifications** :
1. `@UseGuards(PermissionGuard)` est-il présent sur le contrôleur ?
2. Le module est-il importé dans `app.module.ts` ?
3. Le `PrismaService` est-il disponible ?

---

## 📞 Contact

Pour toute question sur le système de permissions, contactez l'équipe backend.

**Dernière mise à jour** : 9 mai 2026
