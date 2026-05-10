# Document de Requirements — Gestion d'Entreprise (Company Management)

## Introduction

Ce document décrit les exigences fonctionnelles pour le module de gestion d'entreprise de la plateforme **Sorika**, un SaaS multi-tenant de type Odoo. Le module couvre deux phases :

- **Phase 1 — Gestion des membres** : invitation, rôles, permissions granulaires par module, retrait et modification des membres.
- **Phase 2 — Module RH (Employés)** : gestion des fiches employés, des départements, et des contrats, indépendamment des comptes utilisateurs.

Toutes les données sont scopées à une `Company` via `companyId`. Le créateur d'une organisation est automatiquement `OWNER` avec tous les droits.

---

## Glossaire

- **Company** : L'organisation (tenant) à laquelle appartiennent toutes les données. Identifiée par un `companyId` unique.
- **User** : Un compte utilisateur authentifié sur la plateforme Sorika.
- **Member** : Un `User` lié à une `Company` via un `Membership`. Possède un rôle et des permissions.
- **Membership** : La relation entre un `User` et une `Company`, portant le rôle et les permissions granulaires.
- **OWNER** : Rôle de propriétaire de l'organisation. Droits complets et non révocables sur la `Company`.
- **ADMIN** : Rôle d'administrateur. Peut gérer les membres et les données selon ses permissions.
- **STAFF** : Rôle de collaborateur. Accès limité selon les permissions qui lui sont attribuées.
- **Permission** : Droit d'accès granulaire sur un module et une action (ex : `CRM:READ`, `CRM:DELETE`).
- **Module** : Fonctionnalité activée sur une `Company` (ex : `CRM`, `HR`, `LANDING_PAGE`).
- **Invitation** : Lien ou email envoyé à un `User` pour rejoindre une `Company`.
- **Employee** : Fiche d'un employé de l'entreprise. Distinct d'un `User` — peut ne pas avoir de compte Sorika.
- **Department** : Unité organisationnelle regroupant des `Employee`s au sein d'une `Company`.
- **Invitation_Service** : Composant backend responsable de la création et validation des invitations.
- **Membership_Service** : Composant backend responsable de la gestion des membres et permissions.
- **HR_Service** : Composant backend responsable de la gestion des employés et départements.
- **Permission_Guard** : Garde NestJS vérifiant les permissions granulaires d'un `Member` sur un module.

---

## Requirements

---

### Requirement 1 : Invitation d'un membre

**User Story :** En tant qu'OWNER ou ADMIN, je veux inviter un utilisateur dans mon organisation, afin qu'il puisse accéder aux modules selon son rôle.

#### Acceptance Criteria

1. WHEN un OWNER ou ADMIN soumet une invitation avec un email et un rôle valides, THE Invitation_Service SHALL créer une invitation avec un token unique et une date d'expiration de 7 jours.
2. WHEN une invitation est créée, THE Invitation_Service SHALL envoyer un email à l'adresse cible contenant le lien d'invitation.
3. IF l'email cible correspond à un `User` déjà membre de la `Company`, THEN THE Invitation_Service SHALL retourner une erreur indiquant que l'utilisateur est déjà membre.
4. IF l'email cible correspond à une invitation en attente pour la même `Company`, THEN THE Invitation_Service SHALL retourner une erreur indiquant qu'une invitation est déjà en cours.
5. WHEN un `User` accepte une invitation valide, THE Invitation_Service SHALL créer un `Membership` avec le rôle et les permissions définis dans l'invitation.
6. IF un `User` tente d'accepter une invitation expirée ou déjà utilisée, THEN THE Invitation_Service SHALL retourner une erreur et invalider le token.
7. WHEN un OWNER ou ADMIN annule une invitation en attente, THE Invitation_Service SHALL supprimer l'invitation et invalider le token associé.
8. THE Invitation_Service SHALL associer chaque invitation au `companyId` de l'organisation émettrice.

---

### Requirement 2 : Gestion des rôles

**User Story :** En tant qu'OWNER, je veux attribuer et modifier les rôles des membres, afin de contrôler leur niveau d'accès à l'organisation.

#### Acceptance Criteria

1. THE Membership_Service SHALL supporter exactement trois rôles : `OWNER`, `ADMIN`, et `STAFF`.
2. WHEN un OWNER modifie le rôle d'un `Member`, THE Membership_Service SHALL mettre à jour le rôle dans le `Membership` correspondant.
3. IF un ADMIN tente de modifier le rôle d'un autre `Member`, THEN THE Membership_Service SHALL retourner une erreur d'autorisation.
4. IF un utilisateur tente de modifier le rôle de l'OWNER de la `Company`, THEN THE Membership_Service SHALL retourner une erreur indiquant que le rôle OWNER ne peut pas être modifié.
5. THE Membership_Service SHALL garantir qu'une `Company` possède en permanence exactement un `Member` avec le rôle `OWNER`.
6. WHEN le rôle d'un `Member` est modifié, THE Membership_Service SHALL réinitialiser ses permissions granulaires aux valeurs par défaut du nouveau rôle.

---

### Requirement 3 : Permissions granulaires par module

**User Story :** En tant qu'OWNER ou ADMIN, je veux définir des permissions précises par module pour chaque membre, afin de contrôler finement ce que chaque collaborateur peut faire.

#### Acceptance Criteria

1. THE Membership_Service SHALL stocker les permissions d'un `Member` sous la forme d'une liste d'actions par module (ex : `{ "CRM": ["READ", "CREATE"], "HR": ["READ"] }`).
2. WHEN un OWNER ou ADMIN met à jour les permissions d'un `Member`, THE Membership_Service SHALL persister les nouvelles permissions dans le `Membership`.
3. IF un ADMIN tente de modifier les permissions d'un `Member` ayant le rôle `OWNER`, THEN THE Membership_Service SHALL retourner une erreur d'autorisation.
4. WHEN une requête est reçue sur un endpoint protégé, THE Permission_Guard SHALL vérifier que le `Member` possède la permission requise pour le module et l'action concernés.
5. IF un `Member` ne possède pas la permission requise, THEN THE Permission_Guard SHALL retourner une erreur HTTP 403 avec un message descriptif.
6. THE Membership_Service SHALL définir des permissions par défaut selon le rôle : `OWNER` reçoit toutes les permissions, `ADMIN` reçoit `READ` et `CREATE` sur tous les modules actifs, `STAFF` reçoit uniquement `READ` sur tous les modules actifs.
7. WHERE le module `HR` est activé sur la `Company`, THE Permission_Guard SHALL vérifier les permissions `HR` pour tout accès aux données RH.

---

### Requirement 4 : Retrait d'un membre

**User Story :** En tant qu'OWNER ou ADMIN, je veux retirer un membre de mon organisation, afin de révoquer son accès à toutes les données de la Company.

#### Acceptance Criteria

1. WHEN un OWNER retire un `Member`, THE Membership_Service SHALL supprimer le `Membership` correspondant.
2. WHEN un ADMIN retire un `Member` ayant le rôle `STAFF`, THE Membership_Service SHALL supprimer le `Membership` correspondant.
3. IF un ADMIN tente de retirer un `Member` ayant le rôle `ADMIN` ou `OWNER`, THEN THE Membership_Service SHALL retourner une erreur d'autorisation.
4. IF un utilisateur tente de retirer l'OWNER de la `Company`, THEN THE Membership_Service SHALL retourner une erreur indiquant que l'OWNER ne peut pas être retiré.
5. WHEN un `Member` est retiré, THE Membership_Service SHALL révoquer immédiatement tous ses accès aux données de la `Company`.
6. THE Membership_Service SHALL associer chaque opération de retrait au `companyId` pour garantir l'isolation des données entre tenants.

---

### Requirement 5 : Consultation de la liste des membres

**User Story :** En tant que membre d'une organisation, je veux consulter la liste des membres et leurs rôles, afin de savoir qui a accès à l'organisation.

#### Acceptance Criteria

1. WHEN un `Member` authentifié demande la liste des membres de sa `Company`, THE Membership_Service SHALL retourner la liste des `Membership`s avec le prénom, nom, email, rôle et permissions de chaque membre.
2. THE Membership_Service SHALL filtrer les résultats par `companyId` pour garantir qu'un `Member` ne voit que les membres de sa propre `Company`.
3. WHEN la liste est retournée, THE Membership_Service SHALL inclure le statut des invitations en attente pour la `Company`.

---

### Requirement 6 : Gestion des employés (Module RH)

**User Story :** En tant qu'OWNER ou ADMIN avec permission `HR:CREATE`, je veux créer et gérer des fiches employés, afin de centraliser les informations RH de mon organisation.

#### Acceptance Criteria

1. THE HR_Service SHALL stocker pour chaque `Employee` : prénom, nom, poste, département, type de contrat, salaire, et date d'embauche.
2. WHEN un utilisateur autorisé crée un `Employee`, THE HR_Service SHALL associer la fiche au `companyId` de l'organisation.
3. IF un champ obligatoire (prénom, nom, poste, date d'embauche) est absent lors de la création d'un `Employee`, THEN THE HR_Service SHALL retourner une erreur de validation avec la liste des champs manquants.
4. WHEN un utilisateur autorisé met à jour un `Employee`, THE HR_Service SHALL persister les modifications et mettre à jour le champ `updatedAt`.
5. WHEN un utilisateur autorisé supprime un `Employee`, THE HR_Service SHALL supprimer la fiche et toutes ses données associées dans la `Company`.
6. IF un utilisateur tente d'accéder à un `Employee` appartenant à une autre `Company`, THEN THE HR_Service SHALL retourner une erreur HTTP 404.
7. WHEN un utilisateur autorisé demande la liste des employés, THE HR_Service SHALL retourner uniquement les `Employee`s liés au `companyId` de l'utilisateur.
8. WHERE le module `HR` n'est pas activé sur la `Company`, THE HR_Service SHALL retourner une erreur HTTP 403 pour toute requête sur les endpoints RH.

---

### Requirement 7 : Gestion des départements

**User Story :** En tant qu'OWNER ou ADMIN avec permission `HR:CREATE`, je veux créer et gérer des départements, afin d'organiser les employés par unité fonctionnelle.

#### Acceptance Criteria

1. THE HR_Service SHALL stocker pour chaque `Department` : nom, description optionnelle, et `companyId`.
2. WHEN un utilisateur autorisé crée un `Department`, THE HR_Service SHALL associer le département au `companyId` de l'organisation.
3. IF un `Department` avec le même nom existe déjà dans la `Company`, THEN THE HR_Service SHALL retourner une erreur indiquant que le nom est déjà utilisé.
4. WHEN un utilisateur autorisé supprime un `Department`, THE HR_Service SHALL vérifier qu'aucun `Employee` actif n'y est rattaché avant de procéder à la suppression.
5. IF un `Department` contient des `Employee`s actifs lors d'une tentative de suppression, THEN THE HR_Service SHALL retourner une erreur listant le nombre d'employés concernés.
6. WHEN un utilisateur autorisé demande la liste des départements, THE HR_Service SHALL retourner uniquement les `Department`s liés au `companyId` de l'utilisateur.
7. THE HR_Service SHALL filtrer tous les accès aux `Department`s par `companyId` pour garantir l'isolation des données entre tenants.

---

### Requirement 8 : Lien optionnel entre Employee et User

**User Story :** En tant qu'OWNER, je veux pouvoir lier une fiche employé à un compte utilisateur Sorika existant, afin de permettre à cet employé d'accéder à la plateforme avec ses données RH.

#### Acceptance Criteria

1. THE HR_Service SHALL permettre la création d'un `Employee` sans lien vers un `User` (employé sans compte Sorika).
2. WHEN un OWNER lie un `Employee` à un `User` existant, THE HR_Service SHALL vérifier que le `User` est membre de la même `Company` avant d'établir le lien.
3. IF le `User` cible n'est pas membre de la `Company`, THEN THE HR_Service SHALL retourner une erreur indiquant que l'utilisateur doit d'abord être invité dans l'organisation.
4. THE HR_Service SHALL garantir qu'un `User` ne peut être lié qu'à une seule fiche `Employee` par `Company`.
5. IF un `User` est déjà lié à une fiche `Employee` dans la même `Company`, THEN THE HR_Service SHALL retourner une erreur indiquant que ce compte est déjà associé à un employé.

---

### Requirement 9 : Isolation des données multi-tenant

**User Story :** En tant qu'opérateur de la plateforme Sorika, je veux garantir que les données de chaque organisation sont strictement isolées, afin d'assurer la confidentialité et la sécurité des données de chaque tenant.

#### Acceptance Criteria

1. THE Membership_Service SHALL rejeter toute requête dont le `companyId` ne correspond pas au `companyId` du `Member` authentifié.
2. THE HR_Service SHALL rejeter toute requête dont le `companyId` ne correspond pas au `companyId` du `Member` authentifié.
3. WHEN une requête est reçue sans `companyId` valide dans le contexte d'authentification, THE Permission_Guard SHALL retourner une erreur HTTP 401.
4. THE Membership_Service SHALL enregistrer dans les logs toute tentative d'accès à des données d'une `Company` tierce, avec l'identifiant du `User` et le `companyId` cible.
