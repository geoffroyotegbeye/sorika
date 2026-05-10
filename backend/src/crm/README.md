# 📊 Module CRM (Customer Relationship Management)

## 📋 Vue d'ensemble

Le module CRM permet de gérer :
- 📇 **Contacts** : Prospects, clients, partenaires
- 🏢 **Entreprises clientes** : Organisations avec qui vous travaillez
- 💰 **Opportunités** : Pipeline de ventes avec suivi des deals
- 📅 **Activités** : Appels, emails, réunions, tâches

---

## 🔐 Statut des permissions

### ⚠️ État actuel : PERMISSIONS DÉSACTIVÉES

Les permissions sont **temporairement désactivées** pour permettre un accès libre pendant la phase MVP.

**Raison** : Le système de paiement n'est pas encore en place.

**Conséquence** : Tous les utilisateurs authentifiés peuvent accéder au CRM.

### 🔜 Futur : PERMISSIONS ACTIVÉES

Quand le système de paiement sera opérationnel, le CRM deviendra un **module payant** avec contrôle d'accès.

---

## 📁 Structure du module

```
backend/src/crm/
├── crm.module.ts              # Module NestJS
├── crm.controller.ts          # Contrôleur (endpoints API)
├── crm.service.ts             # Logique métier
├── dto/                       # Data Transfer Objects
│   ├── contacts/
│   │   ├── create-contact.dto.ts
│   │   └── update-contact.dto.ts
│   ├── companies/
│   │   ├── create-company.dto.ts
│   │   └── update-company.dto.ts
│   ├── opportunities/
│   │   ├── create-opportunity.dto.ts
│   │   ├── update-opportunity.dto.ts
│   │   └── update-stage.dto.ts
│   └── activities/
│       ├── create-activity.dto.ts
│       └── update-activity.dto.ts
├── README.md                  # Ce fichier
├── TODO-PERMISSIONS.md        # Checklist d'activation des permissions
└── ACTIVATION-GUIDE.md        # Guide détaillé d'activation
```

---

## 🚀 API Endpoints

### Base URL
```
/companies/:companyId/crm
```

### Contacts

| Méthode | Endpoint | Description | Permission future |
|---------|----------|-------------|-------------------|
| GET | `/contacts` | Liste des contacts | `CRM:READ` |
| GET | `/contacts/:id` | Détails d'un contact | `CRM:READ` |
| POST | `/contacts` | Créer un contact | `CRM:CREATE` |
| PATCH | `/contacts/:id` | Modifier un contact | `CRM:UPDATE` |
| DELETE | `/contacts/:id` | Supprimer un contact | `CRM:DELETE` |

### Entreprises clientes

| Méthode | Endpoint | Description | Permission future |
|---------|----------|-------------|-------------------|
| GET | `/client-companies` | Liste des entreprises | `CRM:READ` |
| GET | `/client-companies/:id` | Détails d'une entreprise | `CRM:READ` |
| POST | `/client-companies` | Créer une entreprise | `CRM:CREATE` |
| PATCH | `/client-companies/:id` | Modifier une entreprise | `CRM:UPDATE` |
| DELETE | `/client-companies/:id` | Supprimer une entreprise | `CRM:DELETE` |

### Opportunités

| Méthode | Endpoint | Description | Permission future |
|---------|----------|-------------|-------------------|
| GET | `/opportunities` | Liste des opportunités | `CRM:READ` |
| GET | `/opportunities/:id` | Détails d'une opportunité | `CRM:READ` |
| POST | `/opportunities` | Créer une opportunité | `CRM:CREATE` |
| PATCH | `/opportunities/:id` | Modifier une opportunité | `CRM:UPDATE` |
| PATCH | `/opportunities/:id/stage` | Changer l'étape | `CRM:UPDATE` |
| DELETE | `/opportunities/:id` | Supprimer une opportunité | `CRM:DELETE` |

### Activités

| Méthode | Endpoint | Description | Permission future |
|---------|----------|-------------|-------------------|
| GET | `/activities` | Liste des activités | `CRM:READ` |
| GET | `/activities/:id` | Détails d'une activité | `CRM:READ` |
| POST | `/activities` | Créer une activité | `CRM:CREATE` |
| PATCH | `/activities/:id` | Modifier une activité | `CRM:UPDATE` |
| PATCH | `/activities/:id/complete` | Marquer comme complétée | `CRM:UPDATE` |
| DELETE | `/activities/:id` | Supprimer une activité | `CRM:DELETE` |

### Dashboard

| Méthode | Endpoint | Description | Permission future |
|---------|----------|-------------|-------------------|
| GET | `/stats` | Statistiques CRM | `CRM:READ` |

---

## 🗄️ Modèles de données

### Contact
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'LEAD' | 'PROSPECT' | 'CLIENT' | 'PARTNER';
  source?: 'WEBSITE' | 'REFERRAL' | 'SOCIAL_MEDIA' | 'EVENT' | 'OTHER';
  tags: string[];
  notes?: string;
  companyId?: string;
  ownerId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
}
```

### ClientCompany (Entreprise cliente)
```typescript
{
  id: string;
  name: string;
  industry?: string;
  size?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  website?: string;
  address?: string;
  phone?: string;
  notes?: string;
  ownerId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Opportunity (Opportunité)
```typescript
{
  id: string;
  title: string;
  amount: number;
  currency: string;
  probability: number; // 0-100
  stage: 'LEAD' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  lostReason?: string;
  notes?: string;
  contactId?: string;
  companyId?: string;
  ownerId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Activity (Activité)
```typescript
{
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE';
  subject: string;
  description?: string;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
  dueDate?: Date;
  completedAt?: Date;
  duration?: number; // en minutes
  contactId?: string;
  companyId?: string;
  opportunityId?: string;
  ownerId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔒 Sécurité

### Isolation des données
Toutes les requêtes filtrent par `organizationId` pour garantir l'isolation des données entre organisations.

### Authentification
Chaque requête doit inclure le header `x-user-id` pour identifier l'utilisateur.

### Permissions (futures)
Quand activées, les permissions seront vérifiées via le `PermissionGuard`.

---

## 📚 Documentation

### Pour les développeurs
- **Checklist d'activation** : `TODO-PERMISSIONS.md`
- **Guide détaillé** : `ACTIVATION-GUIDE.md`
- **Système de permissions** : `../../PERMISSIONS.md`

### Pour l'équipe
- **Vue d'ensemble** : `/MODULES-PERMISSIONS.md` (racine du projet)
- **Spécifications** : `.kiro/specs/crm/` (requirements, design, tasks)

---

## 🧪 Tests

### Tester les endpoints (avec Postman ou curl)

```bash
# Liste des contacts
curl -X GET \
  http://localhost:3001/companies/dos-service-y7ckr/crm/contacts \
  -H 'x-user-id: votre-user-id'

# Créer un contact
curl -X POST \
  http://localhost:3001/companies/dos-service-y7ckr/crm/contacts \
  -H 'Content-Type: application/json' \
  -H 'x-user-id: votre-user-id' \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@example.com",
    "status": "LEAD"
  }'
```

---

## 🔄 Roadmap

### ✅ Phase 1 : MVP (actuel)
- [x] Modèles de données (Prisma)
- [x] API complète (23 endpoints)
- [x] Service avec logique métier
- [x] Validation des DTOs
- [x] Isolation par organizationId
- [x] Frontend complet (hooks, composants, pages)

### ⏸️ Phase 2 : Permissions (en attente)
- [ ] Activer le PermissionGuard
- [ ] Ajouter les décorateurs @RequirePermission
- [ ] Synchroniser avec le système de paiement
- [ ] Gérer les erreurs 403 dans le frontend

### 🔜 Phase 3 : Fonctionnalités avancées
- [ ] Import/Export CSV
- [ ] Synchronisation emails
- [ ] Intégration calendrier
- [ ] Webhooks pour automatisation
- [ ] Rapports avancés
- [ ] Vue calendrier des activités

---

## 🆘 Support

### Problèmes courants

**Erreur 403 Forbidden**
- Vérifier que les permissions sont bien désactivées (commentaire sur `@UseGuards`)
- Vérifier que l'utilisateur a un membership dans l'organisation

**Données vides**
- Vérifier que `organizationId` correspond bien au `companyId` dans l'URL
- Vérifier que des données existent dans la base de données

**Erreur de validation**
- Vérifier que les DTOs sont correctement remplis
- Consulter les logs du backend pour plus de détails

### Contact
Pour toute question, consulter :
1. La documentation dans ce dossier
2. `backend/PERMISSIONS.md` pour le système de permissions
3. L'équipe backend

---

**Dernière mise à jour** : 9 mai 2026  
**Version** : 1.0.0  
**Statut** : ✅ Fonctionnel (permissions désactivées)
