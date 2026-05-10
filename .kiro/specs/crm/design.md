# Module CRM - Design Technique

## Architecture

### Backend (NestJS + Prisma)

#### Modèles de données (Prisma)

```prisma
// Contact (Personne)
model Contact {
  id              String    @id @default(uuid())
  firstName       String
  lastName        String
  email           String
  phone           String?
  status          String    @default("LEAD") // LEAD, PROSPECT, CLIENT, PARTNER
  source          String?   // WEBSITE, REFERRAL, SOCIAL_MEDIA, EVENT, OTHER
  tags            String[]  @default([])
  notes           String?   @db.Text
  
  // Relations
  companyId       String?
  company         ClientCompany? @relation(fields: [companyId], references: [id], onDelete: SetNull)
  ownerId         String    // Commercial responsable
  owner           User      @relation(fields: [ownerId], references: [id])
  
  opportunities   Opportunity[]
  activities      Activity[]
  
  organizationId  String
  organization    Company   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  lastContactedAt DateTime?
  
  @@unique([email, organizationId])
  @@index([organizationId])
  @@index([ownerId])
  @@index([status])
}

// Entreprise cliente
model ClientCompany {
  id              String    @id @default(uuid())
  name            String
  industry        String?   // Secteur d'activité
  size            String?   // SMALL, MEDIUM, LARGE, ENTERPRISE
  website         String?
  address         String?   @db.Text
  phone           String?
  notes           String?   @db.Text
  
  // Relations
  ownerId         String    // Commercial responsable
  owner           User      @relation(fields: [ownerId], references: [id])
  
  contacts        Contact[]
  opportunities   Opportunity[]
  activities      Activity[]
  
  organizationId  String
  organization    Company   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@unique([name, organizationId])
  @@index([organizationId])
  @@index([ownerId])
}

// Opportunité de vente
model Opportunity {
  id              String    @id @default(uuid())
  title           String
  amount          Float
  currency        String    @default("XOF")
  probability     Int       @default(50) // 0-100%
  stage           String    @default("LEAD") // LEAD, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST
  
  expectedCloseDate DateTime?
  actualCloseDate   DateTime?
  lostReason        String?   @db.Text
  notes             String?   @db.Text
  
  // Relations
  contactId       String?
  contact         Contact?  @relation(fields: [contactId], references: [id], onDelete: SetNull)
  
  companyId       String?
  company         ClientCompany? @relation(fields: [companyId], references: [id], onDelete: SetNull)
  
  ownerId         String    // Commercial responsable
  owner           User      @relation(fields: [ownerId], references: [id])
  
  activities      Activity[]
  
  organizationId  String
  organization    Company   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([organizationId])
  @@index([ownerId])
  @@index([stage])
}

// Activité (Appel, Email, Réunion, Tâche)
model Activity {
  id              String    @id @default(uuid())
  type            String    // CALL, EMAIL, MEETING, TASK, NOTE
  subject         String
  description     String?   @db.Text
  status          String    @default("PLANNED") // PLANNED, COMPLETED, CANCELLED
  
  dueDate         DateTime?
  completedAt     DateTime?
  duration        Int?      // En minutes
  
  // Relations
  contactId       String?
  contact         Contact?  @relation(fields: [contactId], references: [id], onDelete: SetNull)
  
  companyId       String?
  company         ClientCompany? @relation(fields: [companyId], references: [id], onDelete: SetNull)
  
  opportunityId   String?
  opportunity     Opportunity? @relation(fields: [opportunityId], references: [id], onDelete: SetNull)
  
  ownerId         String    // Qui doit faire l'activité
  owner           User      @relation(fields: [ownerId], references: [id])
  
  organizationId  String
  organization    Company   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([organizationId])
  @@index([ownerId])
  @@index([type])
  @@index([status])
}
```

#### Structure des dossiers

```
backend/src/crm/
├── crm.module.ts
├── crm.controller.ts
├── crm.service.ts
├── dto/
│   ├── contacts/
│   │   ├── create-contact.dto.ts
│   │   └── update-contact.dto.ts
│   ├── companies/
│   │   ├── create-company.dto.ts
│   │   └── update-company.dto.ts
│   ├── opportunities/
│   │   ├── create-opportunity.dto.ts
│   │   └── update-opportunity.dto.ts
│   └── activities/
│       ├── create-activity.dto.ts
│       └── update-activity.dto.ts
```

#### Endpoints API

**Contacts**
- `GET /companies/:companyId/crm/contacts` - Liste des contacts
- `POST /companies/:companyId/crm/contacts` - Créer un contact
- `GET /companies/:companyId/crm/contacts/:id` - Détails d'un contact
- `PATCH /companies/:companyId/crm/contacts/:id` - Modifier un contact
- `DELETE /companies/:companyId/crm/contacts/:id` - Supprimer un contact

**Entreprises clientes**
- `GET /companies/:companyId/crm/client-companies` - Liste des entreprises
- `POST /companies/:companyId/crm/client-companies` - Créer une entreprise
- `GET /companies/:companyId/crm/client-companies/:id` - Détails
- `PATCH /companies/:companyId/crm/client-companies/:id` - Modifier
- `DELETE /companies/:companyId/crm/client-companies/:id` - Supprimer

**Opportunités**
- `GET /companies/:companyId/crm/opportunities` - Liste des opportunités
- `POST /companies/:companyId/crm/opportunities` - Créer une opportunité
- `GET /companies/:companyId/crm/opportunities/:id` - Détails
- `PATCH /companies/:companyId/crm/opportunities/:id` - Modifier
- `PATCH /companies/:companyId/crm/opportunities/:id/stage` - Changer l'étape
- `DELETE /companies/:companyId/crm/opportunities/:id` - Supprimer

**Activités**
- `GET /companies/:companyId/crm/activities` - Liste des activités
- `POST /companies/:companyId/crm/activities` - Créer une activité
- `PATCH /companies/:companyId/crm/activities/:id` - Modifier
- `PATCH /companies/:companyId/crm/activities/:id/complete` - Marquer comme complétée
- `DELETE /companies/:companyId/crm/activities/:id` - Supprimer

**Dashboard**
- `GET /companies/:companyId/crm/stats` - Statistiques CRM

### Frontend (Next.js + React)

#### Structure des dossiers

```
frontend/
├── app/dashboard/[slug]/crm/
│   ├── page.tsx                    # Dashboard CRM
│   ├── layout.tsx                  # Layout avec tabs
│   ├── contacts/
│   │   ├── page.tsx                # Liste des contacts
│   │   └── [id]/page.tsx           # Détails d'un contact
│   ├── companies/
│   │   ├── page.tsx                # Liste des entreprises
│   │   └── [id]/page.tsx           # Détails d'une entreprise
│   ├── opportunities/
│   │   ├── page.tsx                # Pipeline (kanban)
│   │   └── [id]/page.tsx           # Détails d'une opportunité
│   └── activities/
│       └── page.tsx                # Liste/Calendrier des activités
├── components/crm/
│   ├── ContactsList.tsx
│   ├── ContactFormDialog.tsx
│   ├── ContactCard.tsx
│   ├── CompaniesList.tsx
│   ├── CompanyFormDialog.tsx
│   ├── CompanyCard.tsx
│   ├── OpportunitiesKanban.tsx
│   ├── OpportunityFormDialog.tsx
│   ├── OpportunityCard.tsx
│   ├── ActivitiesList.tsx
│   ├── ActivityFormDialog.tsx
│   ├── ActivityCard.tsx
│   └── CRMStats.tsx
├── hooks/
│   ├── useCRMContacts.ts
│   ├── useCRMCompanies.ts
│   ├── useCRMOpportunities.ts
│   └── useCRMActivities.ts
└── types/
    └── crm.ts
```

#### Types TypeScript

```typescript
// Contacts
export type ContactStatus = 'LEAD' | 'PROSPECT' | 'CLIENT' | 'PARTNER';
export type ContactSource = 'WEBSITE' | 'REFERRAL' | 'SOCIAL_MEDIA' | 'EVENT' | 'OTHER';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: ContactStatus;
  source?: ContactSource;
  tags: string[];
  notes?: string;
  companyId?: string;
  company?: ClientCompany;
  ownerId: string;
  owner?: User;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

// Entreprises
export type CompanySize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';

export interface ClientCompany {
  id: string;
  name: string;
  industry?: string;
  size?: CompanySize;
  website?: string;
  address?: string;
  phone?: string;
  notes?: string;
  ownerId: string;
  owner?: User;
  contacts?: Contact[];
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

// Opportunités
export type OpportunityStage = 'LEAD' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface Opportunity {
  id: string;
  title: string;
  amount: number;
  currency: string;
  probability: number;
  stage: OpportunityStage;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  lostReason?: string;
  notes?: string;
  contactId?: string;
  contact?: Contact;
  companyId?: string;
  company?: ClientCompany;
  ownerId: string;
  owner?: User;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

// Activités
export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE';
export type ActivityStatus = 'PLANNED' | 'COMPLETED' | 'CANCELLED';

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  status: ActivityStatus;
  dueDate?: string;
  completedAt?: string;
  duration?: number;
  contactId?: string;
  contact?: Contact;
  companyId?: string;
  company?: ClientCompany;
  opportunityId?: string;
  opportunity?: Opportunity;
  ownerId: string;
  owner?: User;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
```

## UI/UX

### Pages principales

1. **Dashboard CRM** : Cards avec stats + graphiques
2. **Contacts** : Table avec filtres + dialog de création
3. **Entreprises** : Table avec filtres + dialog de création
4. **Opportunités** : Kanban board (drag & drop entre étapes)
5. **Activités** : Liste avec filtres par type/statut

### Composants réutilisables

- **ContactCard** : Affichage compact d'un contact
- **CompanyCard** : Affichage compact d'une entreprise
- **OpportunityCard** : Card draggable pour le kanban
- **ActivityCard** : Card d'activité avec actions rapides
- **StatusBadge** : Badge coloré selon le statut
- **StageBadge** : Badge coloré selon l'étape du pipeline

## Sécurité

- Toutes les routes protégées par `PermissionGuard`
- Permissions CRM : READ, CREATE, UPDATE, DELETE, MANAGE
- Isolation des données par `organizationId`
- Validation des DTOs avec `class-validator`

## Performance

- Pagination sur les listes (20 items par page)
- Index sur les champs fréquemment filtrés
- Eager loading des relations nécessaires
- Cache des stats du dashboard (5 minutes)
