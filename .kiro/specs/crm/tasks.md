# Module CRM - Tâches d'implémentation

## Phase 1 : Backend - Modèles et API de base

### ✅ Tâche 1.1 : Modèles Prisma
- [x] Ajouter les modèles au schema.prisma :
  - Contact
  - ClientCompany
  - Opportunity
  - Activity
- [x] Créer et appliquer la migration
- [x] Régénérer le client Prisma

### ✅ Tâche 1.2 : Module CRM (Backend)
- [x] Créer `crm.module.ts`
- [x] Créer `crm.controller.ts`
- [x] Créer `crm.service.ts`
- [x] Enregistrer le module dans `app.module.ts`

### ✅ Tâche 1.3 : DTOs - Contacts
- [x] `create-contact.dto.ts`
- [x] `update-contact.dto.ts`
- [x] Validation avec class-validator

### ✅ Tâche 1.4 : Service - Contacts
- [x] `listContacts(organizationId, filters?)`
- [x] `getContact(id, organizationId)`
- [x] `createContact(organizationId, dto, ownerId)`
- [x] `updateContact(id, organizationId, dto)`
- [x] `deleteContact(id, organizationId)`

### ✅ Tâche 1.5 : Controller - Contacts
- [x] GET `/companies/:companyId/crm/contacts`
- [x] POST `/companies/:companyId/crm/contacts`
- [x] GET `/companies/:companyId/crm/contacts/:id`
- [x] PATCH `/companies/:companyId/crm/contacts/:id`
- [x] DELETE `/companies/:companyId/crm/contacts/:id`
- [x] Ajouter PermissionGuard avec permissions CRM

## Phase 2 : Backend - Entreprises clientes

### ✅ Tâche 2.1 : DTOs - Entreprises
- [x] `create-company.dto.ts`
- [x] `update-company.dto.ts`

### ✅ Tâche 2.2 : Service - Entreprises
- [x] `listClientCompanies(organizationId, filters?)`
- [x] `getClientCompany(id, organizationId)`
- [x] `createClientCompany(organizationId, dto, ownerId)`
- [x] `updateClientCompany(id, organizationId, dto)`
- [x] `deleteClientCompany(id, organizationId)`

### ✅ Tâche 2.3 : Controller - Entreprises
- [x] GET `/companies/:companyId/crm/client-companies`
- [x] POST `/companies/:companyId/crm/client-companies`
- [x] GET `/companies/:companyId/crm/client-companies/:id`
- [x] PATCH `/companies/:companyId/crm/client-companies/:id`
- [x] DELETE `/companies/:companyId/crm/client-companies/:id`

## Phase 3 : Backend - Opportunités

### ✅ Tâche 3.1 : DTOs - Opportunités
- [x] `create-opportunity.dto.ts`
- [x] `update-opportunity.dto.ts`
- [x] `update-stage.dto.ts`

### ✅ Tâche 3.2 : Service - Opportunités
- [x] `listOpportunities(organizationId, filters?)`
- [x] `getOpportunity(id, organizationId)`
- [x] `createOpportunity(organizationId, dto, ownerId)`
- [x] `updateOpportunity(id, organizationId, dto)`
- [x] `updateStage(id, organizationId, stage)`
- [x] `deleteOpportunity(id, organizationId)`

### ✅ Tâche 3.3 : Controller - Opportunités
- [x] GET `/companies/:companyId/crm/opportunities`
- [x] POST `/companies/:companyId/crm/opportunities`
- [x] GET `/companies/:companyId/crm/opportunities/:id`
- [x] PATCH `/companies/:companyId/crm/opportunities/:id`
- [x] PATCH `/companies/:companyId/crm/opportunities/:id/stage`
- [x] DELETE `/companies/:companyId/crm/opportunities/:id`

## Phase 4 : Backend - Activités

### ✅ Tâche 4.1 : DTOs - Activités
- [x] `create-activity.dto.ts`
- [x] `update-activity.dto.ts`

### ✅ Tâche 4.2 : Service - Activités
- [x] `listActivities(organizationId, filters?)`
- [x] `getActivity(id, organizationId)`
- [x] `createActivity(organizationId, dto, ownerId)`
- [x] `updateActivity(id, organizationId, dto)`
- [x] `completeActivity(id, organizationId)`
- [x] `deleteActivity(id, organizationId)`

### ✅ Tâche 4.3 : Controller - Activités
- [x] GET `/companies/:companyId/crm/activities`
- [x] POST `/companies/:companyId/crm/activities`
- [x] PATCH `/companies/:companyId/crm/activities/:id`
- [x] PATCH `/companies/:companyId/crm/activities/:id/complete`
- [x] DELETE `/companies/:companyId/crm/activities/:id`

## Phase 5 : Backend - Dashboard et Stats

### ✅ Tâche 5.1 : Service - Stats
- [x] `getCRMStats(organizationId)`
  - Nombre de contacts par statut
  - Nombre d'entreprises
  - Pipeline : valeur totale, opportunités par étape
  - Activités à venir et en retard

### ✅ Tâche 5.2 : Controller - Stats
- [x] GET `/companies/:companyId/crm/stats`

## Phase 6 : Frontend - Types et Hooks

### ✅ Tâche 6.1 : Types TypeScript
- [x] Créer `frontend/types/crm.ts`
- [x] Définir tous les types et interfaces

### ✅ Tâche 6.2 : Hooks - Contacts
- [x] `useCRMContacts.ts`
  - fetchContacts, createContact, updateContact, deleteContact

### ✅ Tâche 6.3 : Hooks - Entreprises
- [x] `useCRMCompanies.ts`
  - fetchCompanies, createCompany, updateCompany, deleteCompany

### ✅ Tâche 6.4 : Hooks - Opportunités
- [x] `useCRMOpportunities.ts`
  - fetchOpportunities, createOpportunity, updateOpportunity, updateStage, deleteOpportunity

### ✅ Tâche 6.5 : Hooks - Activités
- [x] `useCRMActivities.ts`
  - fetchActivities, createActivity, updateActivity, completeActivity, deleteActivity

## Phase 7 : Frontend - Composants UI

### ✅ Tâche 7.1 : Composants - Contacts
- [x] `ContactsList.tsx` - Table avec filtres
- [x] `ContactFormDialog.tsx` - Formulaire création/édition
- [x] `ContactCard.tsx` - Card compact

### ✅ Tâche 7.2 : Composants - Entreprises
- [x] `CompaniesList.tsx` - Table avec filtres
- [x] `CompanyFormDialog.tsx` - Formulaire création/édition
- [x] `CompanyCard.tsx` - Card compact

### ✅ Tâche 7.3 : Composants - Opportunités
- [x] `OpportunitiesKanban.tsx` - Board avec drag & drop
- [x] `OpportunityFormDialog.tsx` - Formulaire création/édition
- [x] `OpportunityCard.tsx` - Card draggable

### ✅ Tâche 7.4 : Composants - Activités
- [x] `ActivitiesList.tsx` - Liste avec filtres
- [x] `ActivityFormDialog.tsx` - Formulaire création/édition
- [x] `ActivityCard.tsx` - Card avec actions

### ✅ Tâche 7.5 : Composants - Dashboard
- [x] `CRMStats.tsx` - Cards de statistiques
- [x] `PipelineChart.tsx` - Graphique du pipeline

## Phase 8 : Frontend - Pages

### ✅ Tâche 8.1 : Layout CRM
- [x] `app/dashboard/[slug]/crm/layout.tsx`
- [x] Tabs : Dashboard, Contacts, Entreprises, Opportunités, Activités

### ✅ Tâche 8.2 : Page Dashboard
- [x] `app/dashboard/[slug]/crm/page.tsx`
- [x] Afficher les stats et graphiques

### ✅ Tâche 8.3 : Page Contacts
- [x] `app/dashboard/[slug]/crm/contacts/page.tsx`
- [x] Liste + bouton création + filtres

### ✅ Tâche 8.4 : Page Entreprises
- [x] `app/dashboard/[slug]/crm/companies/page.tsx`
- [x] Liste + bouton création + filtres

### ✅ Tâche 8.5 : Page Opportunités
- [x] `app/dashboard/[slug]/crm/opportunities/page.tsx`
- [x] Kanban board avec drag & drop

### ✅ Tâche 8.6 : Page Activités
- [x] `app/dashboard/[slug]/crm/activities/page.tsx`
- [x] Liste + filtres par type/statut

## Phase 9 : Navigation et Intégration

### ✅ Tâche 9.1 : Navigation
- [x] Ajouter "CRM" dans le sidebar du dashboard
- [x] Icône et lien vers `/dashboard/[slug]/crm`

### ✅ Tâche 9.2 : Tests
- [x] Tester la création de contacts
- [x] Tester la création d'entreprises
- [x] Tester le pipeline d'opportunités
- [x] Tester les activités

## Phase 10 : Fonctionnalités avancées (Optionnel)

### ⏳ Tâche 10.1 : Import/Export CSV
- [ ] Export contacts en CSV
- [ ] Import contacts depuis CSV
- [ ] Export entreprises en CSV

### ⏳ Tâche 10.2 : Vue calendrier
- [ ] Calendrier des activités
- [ ] Drag & drop pour reprogrammer

### ⏳ Tâche 10.3 : Rapports
- [ ] Rapport de performance par commercial
- [ ] Rapport d'évolution du pipeline
- [ ] Export PDF

## Ordre d'exécution recommandé

1. **Phase 1** : Modèles + API Contacts (base)
2. **Phase 2** : API Entreprises
3. **Phase 3** : API Opportunités
4. **Phase 4** : API Activités
5. **Phase 5** : Dashboard Stats
6. **Phase 6** : Types et Hooks frontend
7. **Phase 7** : Composants UI
8. **Phase 8** : Pages
9. **Phase 9** : Navigation et tests
10. **Phase 10** : Fonctionnalités avancées (si temps)

## Estimation

- **Backend** : ~4-5 heures
- **Frontend** : ~5-6 heures
- **Tests et ajustements** : ~1-2 heures
- **Total** : ~10-13 heures de développement
