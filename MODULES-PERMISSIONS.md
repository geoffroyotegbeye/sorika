# 🔐 Gestion des Permissions des Modules

## 📊 État actuel des modules

| Module | Permissions | Statut | Accès |
|--------|-------------|--------|-------|
| **Landing Page** | ❌ Non | Gratuit | Tous |
| **HR (RH)** | ✅ Oui | Payant | Avec permissions |
| **CRM** | ⏸️ Désactivées | Gratuit (temporaire) | Tous |
| **Comptabilité** | 🔜 À venir | Payant | - |
| **Inventaire** | 🔜 À venir | Payant | - |

---

## 🎯 Stratégie de monétisation

### Modules gratuits (toujours accessibles)
- ✅ **Landing Page** : Site vitrine de base
- ✅ **Gestion de base** : Profil entreprise, paramètres

### Modules payants (avec permissions)
- 💰 **HR (RH)** : Gestion des employés, départements, congés
- 💰 **CRM** : Gestion clients, opportunités, pipeline de ventes
- 💰 **Comptabilité** : Facturation, devis, suivi financier
- 💰 **Inventaire** : Gestion des stocks, produits, fournisseurs

---

## 🔧 Comment ça fonctionne ?

### 1. Sans permissions (accès libre)
```typescript
@Controller('companies/:companyId/module')
// Pas de @UseGuards(PermissionGuard)
export class ModuleController {
  @Get('data')
  getData() { } // ✅ Accessible à tous
}
```

### 2. Avec permissions (accès contrôlé)
```typescript
@Controller('companies/:companyId/module')
@UseGuards(PermissionGuard)  // ← Vérification activée
export class ModuleController {
  @Get('data')
  @RequirePermission('MODULE', 'READ')  // ← Permission requise
  getData() { } // ✅ Accessible uniquement avec permission
}
```

---

## 📋 Plan de migration

### Phase 1 : MVP (actuel)
- ✅ Système de permissions en place
- ✅ Module HR avec permissions (référence)
- ✅ Module CRM sans permissions (test gratuit)

### Phase 2 : Système de paiement
1. Intégrer un système de paiement (Stripe, PayPal, etc.)
2. Créer un modèle `Subscription` dans la base de données
3. Créer une interface d'administration des abonnements

### Phase 3 : Activation des permissions CRM
1. Activer `@UseGuards(PermissionGuard)` sur le contrôleur CRM
2. Ajouter `@RequirePermission` sur chaque endpoint
3. Migrer les permissions existantes
4. Tester avec des organisations payantes et gratuites

### Phase 4 : Nouveaux modules payants
1. Créer le module (Comptabilité, Inventaire, etc.)
2. Activer les permissions dès le début
3. Lier au système d'abonnement

---

## 🛠️ Scripts utiles

### Ajouter des permissions à toutes les organisations
```bash
cd backend
npx ts-node scripts/add-crm-permissions.ts
```

### Ajouter des permissions à une organisation spécifique
```typescript
// Dans un script personnalisé
await addPermissionsToCompany('company-slug', 'CRM');
```

### Retirer des permissions
```typescript
await removeModulePermissions('CRM');
```

---

## 📚 Documentation détaillée

- **Backend** : `backend/PERMISSIONS.md` - Documentation complète du système
- **CRM** : `backend/src/crm/TODO-PERMISSIONS.md` - Checklist d'activation CRM
- **Exemple** : `backend/src/hr/hr.controller.ts` - Module HR avec permissions

---

## 🔄 Workflow de développement

### Pour créer un nouveau module GRATUIT
1. Créer le module sans `@UseGuards(PermissionGuard)`
2. Pas besoin de `@RequirePermission`
3. Les données restent isolées par `organizationId`

### Pour créer un nouveau module PAYANT
1. Créer le module avec `@UseGuards(PermissionGuard)`
2. Ajouter `@RequirePermission('MODULE', 'ACTION')` sur chaque endpoint
3. Créer un script de gestion des permissions
4. Documenter les permissions requises

### Pour migrer un module GRATUIT → PAYANT
1. Suivre la checklist dans `backend/src/[module]/TODO-PERMISSIONS.md`
2. Activer le `PermissionGuard`
3. Ajouter les décorateurs `@RequirePermission`
4. Gérer les permissions existantes
5. Tester avec et sans permissions

---

## ⚠️ Points d'attention

### Sécurité
- ✅ Toujours isoler les données par `organizationId`
- ✅ Vérifier l'authentification (`x-user-id`)
- ✅ Vérifier le membership avant les permissions
- ❌ Ne jamais exposer les données d'autres organisations

### Performance
- ✅ Le `PermissionGuard` fait une requête DB par requête
- ✅ Envisager un cache Redis pour les permissions
- ✅ Optimiser les requêtes Prisma avec `include`

### UX Frontend
- ✅ Gérer les erreurs 403 avec des messages clairs
- ✅ Afficher un bouton "Upgrade" pour les modules payants
- ✅ Désactiver les fonctionnalités sans permissions
- ✅ Afficher un badge "Premium" sur les modules payants

---

## 🆘 Dépannage rapide

### Erreur 403 même avec les bonnes permissions
1. Vérifier que le membership existe
2. Vérifier le format JSON des permissions
3. Vérifier que le module est bien écrit (sensible à la casse)

### Le guard ne s'active pas
1. Vérifier `@UseGuards(PermissionGuard)` sur le contrôleur
2. Vérifier que le module est importé dans `app.module.ts`
3. Redémarrer le serveur backend

### Permissions non mises à jour
1. Vérifier la base de données directement
2. Relancer le script de migration
3. Vider le cache si utilisé

---

## 📞 Contact

Pour toute question :
- **Backend** : Voir `backend/PERMISSIONS.md`
- **CRM** : Voir `backend/src/crm/TODO-PERMISSIONS.md`
- **Support** : Contacter l'équipe technique

---

**Dernière mise à jour** : 9 mai 2026  
**Version** : 1.0.0
