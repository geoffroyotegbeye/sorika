// ============================================
// TYPES COMPTABILITÉ
// ============================================

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'PARTIAL';
export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REFUSED' | 'EXPIRED' | 'CONVERTED';
export type BillStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHECK' | 'MOBILE_MONEY' | 'CARD';

export interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
  companyId: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  notes?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRateId?: string;
  taxRate?: TaxRate;
  taxAmount: number;
  total: number;
  position: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  reference?: string;
  paidAt: string;
  notes?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate?: string;
  paidAt?: string;
  notes?: string;
  termsAndConditions?: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  clientId?: string;
  client?: { id: string; name: string };
  clientName?: string;
  clientEmail?: string;
  clientAddress?: string;
  quoteId?: string;
  items: InvoiceItem[];
  payments: Payment[];
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRateId?: string;
  taxRate?: TaxRate;
  taxAmount: number;
  total: number;
  position: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  status: QuoteStatus;
  issueDate: string;
  expiryDate?: string;
  notes?: string;
  termsAndConditions?: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  clientId?: string;
  client?: { id: string; name: string };
  clientName?: string;
  clientEmail?: string;
  clientAddress?: string;
  convertedToInvoiceId?: string;
  convertedAt?: string;
  items: QuoteItem[];
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRateId?: string;
  taxRate?: TaxRate;
  taxAmount: number;
  total: number;
  position: number;
}

export interface Bill {
  id: string;
  billNumber?: string;
  status: BillStatus;
  issueDate: string;
  dueDate?: string;
  paidAt?: string;
  notes?: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  supplierId?: string;
  supplier?: { id: string; name: string };
  supplierName?: string;
  items: BillItem[];
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountingLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRateId?: string;
  position?: number;
}

export interface CreateInvoiceDto {
  issueDate?: string;
  dueDate?: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientAddress?: string;
  notes?: string;
  termsAndConditions?: string;
  quoteId?: string;
  items: AccountingLineItem[];
}

export interface CreateQuoteDto {
  issueDate?: string;
  expiryDate?: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientAddress?: string;
  notes?: string;
  termsAndConditions?: string;
  items: AccountingLineItem[];
}

export interface CreateBillDto {
  billNumber?: string;
  issueDate?: string;
  dueDate?: string;
  supplierId?: string;
  supplierName?: string;
  notes?: string;
  items: AccountingLineItem[];
}

export interface CreatePaymentDto {
  amount: number;
  method?: PaymentMethod;
  reference?: string;
  paidAt?: string;
  notes?: string;
}

export interface AccountingStats {
  monthRevenue: number;
  yearRevenue: number;
  totalReceivable: number;
  totalPayable: number;
  overdueInvoices: number;
  pendingBills: number;
}
