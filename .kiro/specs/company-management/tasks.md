# Plan d'implémentation — Company Management

## Vue d'ensemble

Implémentation du module de gestion d'entreprise sur Sorika : gestion des membres (invitations, rôles, permissions granulaires) et module RH (employés, départements). Le backend est en NestJS/Prisma/TypeScript, le frontend en Next.js 14 App Router/TypeScript/Tailwind/shadcn.

## Tâches

- [x] 1. Mise à jour du schéma Prisma et migration
  - [x] 1.1 Étendre le modèle `Membership` avec le champ `permissions Json @default("{}")` et `createdAt DateTime @default(now())`
    - Modifier `backend/prisma/schema.prisma` : ajouter `permissions Json @default("{}")` et `createdAt DateTime @default(now())` sur `Membership`
    - _Requirements: 3.1, 3.2_
  - [x] 1.2 Créer le modèle `Invitation` dans le schéma Prisma
    - Ajouter le modèle complet avec `id`, `email`, `token @unique @default(uuid())`, `role`, `permissions Json`, `companyId`, `expiresAt`, `usedAt?`, `createdAt`, index sur `token` et `companyId`
    - Ajouter la relation `invitations Invitation[]` sur `Company`
    - _Requirements: 1.1, 1.8_
  - [x] 1.3 Créer le modèle `Department` dans le schéma Prisma
    - Ajouter le modèle avec `id`, `name`, `description?`, `companyId`, relation `company`, relation `employees Employee[]`, `createdAt`, contrainte `@@unique([companyId, name])`, index sur `companyId`
    - Ajouter la relation `departments Department[]` sur `Company`
    - _Requirements: 7.1, 7.2_
  - [x] 1.4 Créer le modèle `Employee` dans le schéma Prisma
    - Ajouter le modèle avec `id`, `firstName`, `lastName`, `position`, `contractType?`, `salary?`, `hireDate DateTime`, `departmentId?`, relation `department Department?`, `companyId`, relation `company`, `userId? @unique`, relation `user User?`, `createdAt`, `updatedAt @updatedAt`, index sur `companyId` et `departmentId`
    - Ajouter la relation `employees Employee[]` sur `Company` et sur `User`
    - _Requirements: 6.1, 6.2, 8.1_
  - [x] 1.5 Générer et appliquer la migration Prisma
    - Exécuter `npx prisma migrate dev --name add_company_management` dans `backend/`
    - Vérifier que le client Prisma est régénéré (`npx prisma generate`)
    - _Requirements: 1.1, 3.1, 6.1, 7.1_

- [x] 2. Backend — PermissionGuard et décorateur RequirePermission
  - [x] 2.1 Créer `backend/src/common/guards/permission.guard.ts`
    - Implémenter le décorateur `RequirePermission(module: string, action: string)` avec `SetMetadata('requiredPermission', { module, action })`
    - Implémenter `PermissionGuard implements CanActivate` : lire `x-user-id` et `params.companyId`, chercher le `Membership` via Prisma, vérifier la cohérence cross-tenant avec `x-company-id`, lire la métadonnée `requiredPermission`, vérifier `permissions[module]?.includes(action)`, attacher `request.membership`
    - Retourner `401` si headers absents, `403` si membership introuvable ou permission manquante, logger les tentatives cross-tenant
    - _Requirements: 3.4, 3.5, 9.1, 9.3, 9.4_
  - [ ]* 2.2 Écrire les tests PBT pour le PermissionGuard
    - **Property 6 : Permission Guard — décision correcte**
    - **Validates: Requirements 3.4, 3.5**
    - Fichier : `backend/src/common/guards/permission.guard.spec.ts`
    - Utiliser `fast-check` : générer des `Membership` avec permissions arbitraires et des paires `(module, action)` aléatoires, vérifier que le guard autorise si et seulement si `permissions[module]` contient `action`
  - [ ]* 2.3 Écrire les tests PBT pour l'isolation multi-tenant (membres)
    - **Property 7 : Isolation multi-tenant — membres**
    - **Validates: Requirements 9.1, 9.3**
    - Fichier : `backend/src/common/guards/permission.guard.spec.ts`
    - Générer des paires `(companyId URL, x-company-id header)` différentes, vérifier que le guard retourne `403`

- [x] 3. Backend — MembersModule (service + controller + DTOs)
  - [x] 3.1 Créer les DTOs dans `backend/src/members/dto/`
    - `invite-member.dto.ts` : `email @IsEmail()`, `role @IsIn(['ADMIN','STAFF'])`, `permissions @IsObject() @IsOptional()`
    - `update-member.dto.ts` : `role @IsIn(['ADMIN','STAFF']) @IsOptional()`, `permissions @IsObject() @IsOptional()`
    - _Requirements: 1.1, 2.2, 3.2_
  - [x] 3.2 Créer `backend/src/members/members.service.ts`
    - Implémenter `listMembers(companyId)` : retourner membres avec `user { firstName, lastName, email }` + invitations en attente (`usedAt: null`, `expiresAt > now`)
    - Implémenter `updateMember(companyId, membershipId, dto, requesterId)` : vérifier que le requester est OWNER, interdire la modification de l'OWNER, mettre à jour rôle et/ou permissions, réinitialiser les permissions aux valeurs par défaut du nouveau rôle si le rôle change
    - Implémenter `removeMember(companyId, membershipId, requesterId)` : vérifier les droits (OWNER peut tout, ADMIN seulement les STAFF), interdire le retrait de l'OWNER
    - Implémenter `getDefaultPermissions(role, modules)` : OWNER → toutes actions, ADMIN → READ+CREATE, STAFF → READ
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.6, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3_
  - [ ]* 3.3 Écrire les tests PBT pour MembersService
    - **Property 4 : Unicité OWNER — invariant permanent**
    - **Validates: Requirements 2.5**
    - Fichier : `backend/src/members/members.service.spec.ts`
    - Générer des séquences d'opérations (ajout, modification de rôle, retrait) et vérifier qu'il reste exactement 1 OWNER après chaque séquence
  - [ ]* 3.4 Écrire les tests PBT pour reset des permissions sur changement de rôle
    - **Property 5 : Mise à jour de rôle — reset des permissions**
    - **Validates: Requirements 2.6**
    - Fichier : `backend/src/members/members.service.spec.ts`
    - Générer des membres avec rôle arbitraire, modifier le rôle, vérifier que les permissions correspondent exactement aux valeurs par défaut du nouveau rôle
  - [ ]* 3.5 Écrire les tests PBT pour l'isolation multi-tenant membres
    - **Property 7 : Isolation multi-tenant — membres**
    - **Validates: Requirements 9.1, 9.3**
    - Fichier : `backend/src/members/members.service.spec.ts`
    - Vérifier que toute requête avec un `companyId` ne correspondant pas au membership retourne une erreur 403
  - [x] 3.6 Créer `backend/src/members/members.controller.ts`
    - `GET /companies/:companyId/members` → `listMembers` (tout membre authentifié, `PermissionGuard` sans permission spécifique)
    - `PATCH /companies/:companyId/members/:membershipId` → `updateMember` (OWNER uniquement, vérifié dans le service)
    - `DELETE /companies/:companyId/members/:membershipId` → `removeMember` (OWNER ou ADMIN, vérifié dans le service)
    - Appliquer `PermissionGuard` sur toutes les routes
    - _Requirements: 2.2, 2.3, 4.1, 4.2, 4.3, 5.1_
  - [x] 3.7 Créer `backend/src/members/members.module.ts`
    - Déclarer `MembersService`, `MembersController`, importer `PrismaModule`
    - _Requirements: 2.1_

- [x] 4. Backend — InvitationsService (créer, accepter, annuler)
  - [x] 4.1 Créer `backend/src/members/invitations.service.ts`
    - Implémenter `createInvitation(companyId, dto, requesterId)` : vérifier que le requester est OWNER ou ADMIN, vérifier qu'aucun membre existant n'a cet email, vérifier qu'aucune invitation en attente n'existe pour cet email+company, créer l'invitation avec `expiresAt = now + 7 jours`, token UUID auto-généré par Prisma
    - Implémenter `acceptInvitation(token, userId)` : trouver l'invitation par token, vérifier `usedAt === null` et `expiresAt > now`, créer le `Membership` avec le rôle et les permissions de l'invitation dans une transaction Prisma, marquer `usedAt = now`
    - Implémenter `cancelInvitation(companyId, invitationId, requesterId)` : vérifier que le requester est OWNER ou ADMIN, supprimer l'invitation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_
  - [ ]* 4.2 Écrire les tests PBT pour InvitationsService — token unicité et expiry
    - **Property 1 : Invitation token unicité et expiry**
    - **Validates: Requirements 1.1**
    - Fichier : `backend/src/members/invitations.service.spec.ts`
    - Générer N invitations avec emails et rôles valides, vérifier que tous les tokens sont distincts et que `expiresAt = createdAt + 7 jours` (±1 seconde)
  - [ ]* 4.3 Écrire les tests PBT pour InvitationsService — round-trip rôle/permissions
    - **Property 2 : Acceptation d'invitation — round-trip rôle/permissions**
    - **Validates: Requirements 1.5**
    - Fichier : `backend/src/members/invitations.service.spec.ts`
    - Générer des invitations avec rôle et permissions arbitraires, accepter l'invitation, vérifier que le `Membership` créé a exactement le même rôle et les mêmes permissions
  - [ ]* 4.4 Écrire les tests PBT pour InvitationsService — rejet des invitations invalides
    - **Property 3 : Rejet des invitations invalides (expirées ou utilisées)**
    - **Validates: Requirements 1.6**
    - Fichier : `backend/src/members/invitations.service.spec.ts`
    - Générer des invitations avec `expiresAt < now` ou `usedAt != null`, tenter de les accepter, vérifier qu'une erreur est retournée et que l'invitation est inchangée
  - [x] 4.5 Ajouter les routes d'invitation dans `MembersController`
    - `POST /companies/:companyId/members/invite` → `createInvitation`
    - `DELETE /companies/:companyId/members/invitations/:invitationId` → `cancelInvitation`
    - `POST /invitations/:token/accept` → `acceptInvitation` (route publique, sans `PermissionGuard`)
    - _Requirements: 1.1, 1.5, 1.7_

- [x] 5. Backend — HRModule (service + controller + DTOs)
  - [x] 5.1 Créer les DTOs dans `backend/src/hr/dto/`
    - `create-employee.dto.ts` : `firstName`, `lastName`, `position` (`@IsString @IsNotEmpty`), `hireDate @IsDateString`, `departmentId @IsUUID @IsOptional`, `contractType @IsIn(['CDI','CDD','FREELANCE','STAGE','ALTERNANCE']) @IsOptional`, `salary @IsNumber @IsOptional`, `userId @IsUUID @IsOptional`
    - `update-employee.dto.ts` : tous les champs de `CreateEmployeeDto` avec `@IsOptional`
    - `create-department.dto.ts` : `name @IsString @IsNotEmpty`, `description @IsString @IsOptional`
    - `update-department.dto.ts` : tous les champs avec `@IsOptional`
    - _Requirements: 6.1, 6.3, 7.1_
  - [x] 5.2 Créer `backend/src/hr/hr.service.ts`
    - **Employees** : `listEmployees(companyId)` avec include `department`, `createEmployee(companyId, dto)` avec validation des champs obligatoires, `updateEmployee(companyId, employeeId, dto)` avec vérification `companyId`, `deleteEmployee(companyId, employeeId)`, `linkEmployeeToUser(companyId, employeeId, userId)` : vérifier que le User est membre de la Company, vérifier qu'aucun autre Employee dans la Company n'est déjà lié à ce User
    - **Departments** : `listDepartments(companyId)` avec `_count { employees }`, `createDepartment(companyId, dto)` avec gestion du conflit `@@unique([companyId, name])`, `updateDepartment(companyId, departmentId, dto)`, `deleteDepartment(companyId, departmentId)` : vérifier que `_count.employees === 0` avant suppression
    - Toutes les méthodes filtrent par `companyId`, retournent `404` si ressource introuvable dans la company
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.1, 8.2, 8.3, 8.4, 8.5_
  - [ ]* 5.3 Écrire les tests PBT pour HRService — validation champs Employee
    - **Property 9 : Validation des champs obligatoires Employee**
    - **Validates: Requirements 6.3**
    - Fichier : `backend/src/hr/hr.service.spec.ts`
    - Générer des sous-ensembles des champs obligatoires manquants, vérifier que le service retourne une erreur listant exactement les champs absents
  - [ ]* 5.4 Écrire les tests PBT pour HRService — unicité nom département
    - **Property 10 : Unicité du nom de département par Company**
    - **Validates: Requirements 7.3**
    - Fichier : `backend/src/hr/hr.service.spec.ts`
    - Générer des noms de département, tenter de créer deux départements avec le même nom dans la même Company (erreur attendue) et dans deux Companies différentes (succès attendu)
  - [ ]* 5.5 Écrire les tests PBT pour HRService — blocage suppression département
    - **Property 11 : Suppression de département bloquée si employés actifs**
    - **Validates: Requirements 7.4, 7.5**
    - Fichier : `backend/src/hr/hr.service.spec.ts`
    - Générer des départements avec N > 0 employés (erreur attendue) et N = 0 (succès attendu)
  - [ ]* 5.6 Écrire les tests PBT pour HRService — unicité lien User-Employee
    - **Property 12 : Unicité du lien User-Employee par Company**
    - **Validates: Requirements 8.4**
    - Fichier : `backend/src/hr/hr.service.spec.ts`
    - Générer un User déjà lié à un Employee dans une Company, tenter de le lier à un second Employee dans la même Company, vérifier l'erreur
  - [ ]* 5.7 Écrire les tests PBT pour HRService — isolation multi-tenant HR
    - **Property 8 : Isolation multi-tenant — HR**
    - **Validates: Requirements 9.2, 6.6, 6.7**
    - Fichier : `backend/src/hr/hr.service.spec.ts`
    - Vérifier que toute requête avec un `companyId` ne correspondant pas au membership retourne une erreur 403/404
  - [x] 5.8 Créer `backend/src/hr/hr.controller.ts`
    - Routes employees : `GET`, `POST /companies/:companyId/hr/employees`, `PATCH`, `DELETE /companies/:companyId/hr/employees/:id`, `PATCH /companies/:companyId/hr/employees/:id/link-user`
    - Routes departments : `GET`, `POST /companies/:companyId/hr/departments`, `PATCH`, `DELETE /companies/:companyId/hr/departments/:id`
    - Appliquer `@RequireModule('HR')` (ModuleGuard) et `@RequirePermission('HR', action)` (PermissionGuard) sur chaque route selon le tableau du design
    - _Requirements: 3.7, 6.8_
  - [x] 5.9 Créer `backend/src/hr/hr.module.ts`
    - Déclarer `HRService`, `HRController`, importer `PrismaModule`
    - _Requirements: 6.1_

- [x] 6. Backend — Enregistrer les nouveaux modules dans app.module.ts
  - [x] 6.1 Importer `MembersModule` et `HRModule` dans `backend/src/app.module.ts`
    - Ajouter les imports de `MembersModule` (depuis `./members/members.module`) et `HRModule` (depuis `./hr/hr.module`) dans le tableau `imports` de `AppModule`
    - _Requirements: 2.1, 6.1_

- [ ] 7. Checkpoint — Vérifier le backend
  - Assurer que `npm run build` passe sans erreur dans `backend/`
  - Assurer que les tests unitaires existants passent toujours (`npm run test`)
  - Demander à l'utilisateur si des ajustements sont nécessaires avant de passer au frontend

- [ ] 8. Frontend — lib/api.ts (client HTTP avec headers auth)
  - [ ] 8.1 Créer `frontend/lib/api.ts`
    - Implémenter une fonction `getAuthHeaders(): Record<string, string>` qui lit `localStorage.getItem('user')`, extrait `user.id` et le `companyId` correspondant au slug courant (via `window.location.pathname`), et retourne `{ 'x-user-id': userId, 'x-company-id': companyId }`
    - Implémenter une fonction `apiClient(path: string, options?: RequestInit)` qui préfixe l'URL avec `process.env.NEXT_PUBLIC_API_URL`, injecte les headers auth, et lève une erreur typée si la réponse n'est pas `ok` (avec le message JSON de l'API)
    - Exporter des helpers typés : `get<T>`, `post<T>`, `patch<T>`, `del` utilisant `apiClient`
    - _Requirements: 9.1, 9.2_

- [ ] 9. Frontend — types/members.ts et types/hr.ts
  - [ ] 9.1 Créer `frontend/types/members.ts`
    - Exporter `Role`, `ModuleAction`, `ModuleName`, `Permissions`, `Member`, `Invitation`, `MembersListResponse` exactement comme défini dans le design
    - _Requirements: 2.1, 3.1, 5.1_
  - [x] 9.2 Créer `frontend/types/hr.ts`
    - Exporter `ContractType`, `Department`, `Employee` exactement comme défini dans le design
    - _Requirements: 6.1, 7.1_

- [ ] 10. Frontend — hooks/useMembers.ts et hooks/useHR.ts
  - [ ] 10.1 Créer `frontend/hooks/useMembers.ts`
    - Implémenter `useMembers(companyId: string)` : state `{ members, invitations, loading, error }`, `fetchMembers()` via `GET /companies/:companyId/members`, mutations `inviteMember(dto)`, `updateMember(membershipId, dto)`, `removeMember(membershipId)`, `cancelInvitation(invitationId)` — chaque mutation appelle l'API puis re-fetch, les erreurs sont catchées et exposées dans le state
    - _Requirements: 1.1, 2.2, 4.1, 5.1_
  - [x] 10.2 Créer `frontend/hooks/useHR.ts`
    - Implémenter `useHR(companyId: string)` : state `{ employees, departments, loading, error }`, `fetchEmployees()`, `fetchDepartments()`, mutations CRUD pour employees et departments, `linkEmployeeToUser(employeeId, userId)`
    - _Requirements: 6.1, 7.1, 8.2_

- [ ] 11. Frontend — Page /dashboard/[slug]/members
  - [ ] 11.1 Créer `frontend/components/members/MembersList.tsx`
    - Afficher un tableau des membres avec colonnes : nom/email, rôle (badge coloré), permissions (résumé), actions (modifier, retirer)
    - Utiliser `Card`, `CardHeader`, `CardContent`, `CardTitle`, `Button`, `Separator`
    - Désactiver les actions sur l'OWNER et sur soi-même
    - _Requirements: 5.1, 5.2_
  - [ ] 11.2 Créer `frontend/components/members/InvitationsList.tsx`
    - Afficher les invitations en attente avec email, rôle, date d'expiration, bouton "Annuler"
    - Utiliser `Card`, `CardContent`, `Button`
    - _Requirements: 5.3_
  - [ ] 11.3 Créer `frontend/components/members/InviteMemberDialog.tsx`
    - Formulaire avec `Input` (email), `Select` (rôle : ADMIN/STAFF), `Switch` par module pour les permissions
    - Utiliser `Dialog`, `DialogContent`, `DialogHeader`, `Label`, `Input`, `Select`, `Switch`, `Button`
    - Validation côté client avec zod : email valide, rôle requis
    - Appeler `inviteMember(dto)` du hook, afficher `toast.success` ou `toast.error`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ] 11.4 Créer `frontend/components/members/EditPermissionsDialog.tsx`
    - Afficher le rôle actuel avec `Select`, et une grille de `Switch` par module × action (READ, CREATE, UPDATE, DELETE)
    - Utiliser `Dialog`, `DialogContent`, `DialogHeader`, `Select`, `Switch`, `Label`, `Button`, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
    - Appeler `updateMember(membershipId, dto)`, afficher `toast.success` ou `toast.error`
    - _Requirements: 2.2, 3.2_
  - [ ] 11.5 Créer `frontend/app/dashboard/[slug]/members/page.tsx`
    - Page client avec `useMembers(company.id)`, afficher `MembersList` + `InvitationsList` + bouton "Inviter un membre" ouvrant `InviteMemberDialog`
    - Utiliser `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Button`
    - Gérer le loading state et les erreurs via `toast.error`
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 12. Frontend — Page /dashboard/[slug]/hr/employees
  - [x] 12.1 Créer `frontend/components/hr/EmployeesList.tsx`
    - Tableau des employés avec colonnes : nom, poste, département, type de contrat, date d'embauche, actions (modifier, supprimer)
    - Utiliser `Card`, `CardHeader`, `CardContent`, `CardTitle`, `Button`
    - _Requirements: 6.7_
  - [x] 12.2 Créer `frontend/components/hr/EmployeeFormDialog.tsx`
    - Formulaire création/édition : `Input` pour prénom, nom, poste ; `Select` pour département et type de contrat ; `Input` type date pour date d'embauche ; `Input` type number pour salaire
    - Utiliser `Dialog`, `DialogContent`, `DialogHeader`, `Label`, `Input`, `Select`, `Button`
    - Validation zod : champs obligatoires (firstName, lastName, position, hireDate)
    - Appeler `createEmployee` ou `updateEmployee` selon le mode, afficher `toast.success` ou `toast.error`
    - _Requirements: 6.1, 6.3, 6.4_
  - [x] 12.3 Créer `frontend/app/dashboard/[slug]/hr/employees/page.tsx`
    - Page client avec `useHR(company.id)`, afficher `EmployeesList` + bouton "Ajouter un employé" ouvrant `EmployeeFormDialog`
    - Utiliser `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Button`
    - _Requirements: 6.7_

- [ ] 13. Frontend — Page /dashboard/[slug]/hr/departments
  - [x] 13.1 Créer `frontend/components/hr/DepartmentsList.tsx`
    - Tableau des départements avec colonnes : nom, description, nombre d'employés, actions (modifier, supprimer)
    - Utiliser `Card`, `CardHeader`, `CardContent`, `CardTitle`, `Button`
    - Désactiver le bouton supprimer si `_count.employees > 0` avec tooltip explicatif
    - _Requirements: 7.6, 7.4, 7.5_
  - [x] 13.2 Créer `frontend/components/hr/DepartmentFormDialog.tsx`
    - Formulaire création/édition : `Input` pour nom, `Input` (ou `Textarea`) pour description
    - Utiliser `Dialog`, `DialogContent`, `DialogHeader`, `Label`, `Input`, `Button`
    - Validation zod : nom requis
    - Appeler `createDepartment` ou `updateDepartment`, afficher `toast.success` ou `toast.error`
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 13.3 Créer `frontend/app/dashboard/[slug]/hr/departments/page.tsx`
    - Page client avec `useHR(company.id)`, afficher `DepartmentsList` + bouton "Ajouter un département" ouvrant `DepartmentFormDialog`
    - Utiliser `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Button`
    - _Requirements: 7.6_

- [ ] 14. Frontend — Ajouter le module HR dans ALL_MODULES du dashboard
  - [x] 14.1 Modifier `frontend/app/dashboard/[slug]/page.tsx`
    - Ajouter l'entrée HR dans le tableau `ALL_MODULES` :
      ```typescript
      {
        id: 'HR',
        name: 'Ressources Humaines',
        description: 'Employés et départements',
        icon: Users2, // ou BriefcaseBusiness depuis lucide-react
        color: 'teal',
        href: (slug: string) => `/dashboard/${slug}/hr/employees`,
      }
      ```
    - Ajouter la couleur `teal` dans l'objet `COLORS`
    - _Requirements: 6.8_
  - [x] 14.2 Ajouter le lien "Membres" dans la sidebar du layout dashboard
    - Modifier `frontend/app/dashboard/[slug]/layout.tsx` : ajouter un lien `<a href="/dashboard/${slug}/members">` avec icône `Users` dans la `<nav>` de la sidebar
    - _Requirements: 5.1_

- [x] 15. Checkpoint final — Vérifier l'intégration complète
  - Assurer que `npm run build` passe sans erreur dans `frontend/`
  - Vérifier que les types TypeScript sont cohérents entre hooks, composants et types
  - Assurer que tous les tests backend passent (`npm run test` dans `backend/`)
  - Demander à l'utilisateur si des ajustements sont nécessaires

## Notes

- Les tâches marquées `*` sont optionnelles et peuvent être sautées pour un MVP plus rapide
- Chaque tâche référence les requirements spécifiques pour la traçabilité
- Les tests PBT utilisent `fast-check` (à installer : `npm install --save-dev fast-check` dans `backend/`)
- Les composants UI utilisent exclusivement les composants shadcn existants : `Card`, `CardHeader`, `CardContent`, `CardTitle`, `Button`, `Input`, `Label`, `Dialog`, `DialogContent`, `DialogHeader`, `Select`, `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `Switch`, `Separator`, `toast` (sonner)
- Le `PermissionGuard` s'appuie sur les headers `x-user-id` et `x-company-id` injectés par `lib/api.ts`, cohérent avec l'architecture existante sans JWT
- Les checkpoints (tâches 7 et 15) permettent de valider chaque couche avant de passer à la suivante
