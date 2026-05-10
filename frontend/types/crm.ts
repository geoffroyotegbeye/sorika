// ============================================
// TYPES CRM
// ============================================

// User (pour les relations)
export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

// ============================================
// CONTACTS
// ============================================

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

export interface CreateContactDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status?: ContactStatus;
  source?: ContactSource;
  tags?: string[];
  notes?: string;
  companyId?: string;
  ownerId?: string;
}

export interface UpdateContactDto extends Partial<CreateContactDto> {}

// ============================================
// ENTREPRISES CLIENTES
// ============================================

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
  opportunities?: Opportunity[];
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    contacts: number;
    opportunities: number;
  };
}

export interface CreateClientCompanyDto {
  name: string;
  industry?: string;
  size?: CompanySize;
  website?: string;
  address?: string;
  phone?: string;
  notes?: string;
  ownerId?: string;
}

export interface UpdateClientCompanyDto extends Partial<CreateClientCompanyDto> {}

// ============================================
// OPPORTUNITÉS
// ============================================

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

export interface CreateOpportunityDto {
  title: string;
  amount: number;
  currency?: string;
  probability?: number;
  stage?: OpportunityStage;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  lostReason?: string;
  notes?: string;
  contactId?: string;
  companyId?: string;
  ownerId?: string;
}

export interface UpdateOpportunityDto extends Partial<CreateOpportunityDto> {}

export interface UpdateStageDto {
  stage: OpportunityStage;
  actualCloseDate?: string;
  lostReason?: string;
}

// ============================================
// ACTIVITÉS
// ============================================

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

export interface CreateActivityDto {
  type: ActivityType;
  subject: string;
  description?: string;
  status?: ActivityStatus;
  dueDate?: string;
  completedAt?: string;
  duration?: number;
  contactId?: string;
  companyId?: string;
  opportunityId?: string;
  ownerId?: string;
}

export interface UpdateActivityDto extends Partial<CreateActivityDto> {}

// ============================================
// STATISTIQUES CRM
// ============================================

export interface CRMStats {
  contacts: {
    total: number;
    byStatus: Record<string, number>;
  };
  companies: {
    total: number;
  };
  pipeline: {
    totalValue: number;
    byStage: Array<{
      stage: string;
      count: number;
      value: number;
    }>;
    conversionRate: number;
    wonDeals: {
      count: number;
      value: number;
    };
  };
  activities: {
    today: number;
    thisWeek: number;
    overdue: number;
  };
  topSalespeople: Array<{
    user: User;
    revenue: number;
    dealsWon: number;
  }>;
}
