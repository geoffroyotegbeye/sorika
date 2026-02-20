# Architecture Modulaire type Odoo

## Concept

Comme Odoo, chaque entreprise peut activer/désactiver des modules. Les configurations sont stockées en JSON pour éviter de créer 200 tables.

## Modules disponibles

- `LANDING_PAGE` : Site vitrine no-code
- `CRM` : Gestion clients
- `ANALYTICS` : Statistiques
- `ECOMMERCE` : Boutique en ligne
- etc.

## Comment ça marche ?

### 1. Inscription avec transaction Prisma

```typescript
// backend/src/auth/auth.service.ts
await this.prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ ... });
  const company = await tx.company.create({
    modules: ['LANDING_PAGE'], // Modules activés
  });
  await tx.membership.create({ ... });
  
  // Si LANDING_PAGE activé, créer la config
  if (company.modules.includes('LANDING_PAGE')) {
    await tx.landingPage.create({
      sections: { /* JSON flexible */ }
    });
  }
});
```

### 2. Guard pour protéger les routes

```typescript
// backend/src/common/guards/module.guard.ts
@Injectable()
export class ModuleGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const company = await this.prisma.company.findUnique({ ... });
    
    if (!company.modules.includes(requiredModule)) {
      throw new ForbiddenException('Module non activé');
    }
    
    return true;
  }
}
```

### 3. Utilisation dans les contrôleurs

```typescript
@Controller('companies/:companyId/landing-page')
@UseGuards(ModuleGuard)
export class LandingPageController {
  
  @Get()
  @RequireModule('LANDING_PAGE') // ← Vérifie que l'entreprise a ce module
  async getLandingPage() { ... }
}
```

### 4. Formulaire Next.js avec Zod

```typescript
// frontend/src/lib/validations/auth.ts
export const registerSchema = z.object({
  email: z.string().email(),
  companyName: z.string().min(2),
  companySlug: z.string().regex(/^[a-z0-9-]+$/),
  modules: z.array(z.string()).optional(),
});
```

## Flux d'inscription

1. Utilisateur remplit le formulaire → Validation Zod
2. POST `/auth/register` → Transaction Prisma
3. Création User + Company + Membership + LandingPage (si module activé)
4. Redirection vers `/dashboard/{slug}`

## Ajouter un nouveau module

1. Ajouter le module dans `Company.modules[]`
2. Créer le contrôleur avec `@RequireModule('MON_MODULE')`
3. Créer la table de config si nécessaire (ou utiliser JSON)

## Exemple : Activer le module CRM

```typescript
// L'entreprise n'a que LANDING_PAGE
company.modules = ['LANDING_PAGE'];

// Tentative d'accès au CRM
GET /companies/123/crm/customers
→ 403 Forbidden: "Votre entreprise n'a pas accès au module CRM"

// Activer le module
await prisma.company.update({
  where: { id: '123' },
  data: { modules: { push: 'CRM' } }
});

// Maintenant ça fonctionne
GET /companies/123/crm/customers
→ 200 OK
```

## Avantages

✅ Pas de tables inutiles (JSON pour les configs)  
✅ Activation/désactivation facile des modules  
✅ Protection automatique des routes  
✅ Scalable comme Odoo  
