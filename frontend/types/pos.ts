// Types pour le module POS (Point de Vente)

export interface CashRegister {
  id: string;
  name: string;
  code: string;
  location?: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    sessions: number;
    sales: number;
  };
}

export interface CashSession {
  id: string;
  registerId: string;
  register?: CashRegister;
  cashierId: string;
  cashier?: {
    firstName: string;
    lastName: string;
  };
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  difference?: number;
  openedAt: string;
  closedAt?: string;
  status: 'OPEN' | 'CLOSED';
  notes?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  sales?: Sale[];
  _count?: {
    sales: number;
  };
}

export interface Sale {
  id: string;
  saleNumber: string;
  registerId: string;
  register?: {
    name: string;
  };
  sessionId: string;
  session?: CashSession;
  cashierId: string;
  cashier?: {
    firstName: string;
    lastName: string;
  };
  customerId?: string;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  taxPercent: number;
  total: number;
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'MIXED';
  amountPaid: number;
  changeAmount: number;
  status: 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  invoiceId?: string;
  items?: SaleItem[];
  payments?: SalePayment[];
  notes?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    items: number;
  };
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product?: {
    name: string;
    sku?: string;
    imageUrl?: string;
  };
  productName: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxPercent: number;
  subtotal: number;
  total: number;
  createdAt: string;
}

export interface SalePayment {
  id: string;
  saleId: string;
  method: 'CASH' | 'CARD' | 'MOBILE_MONEY';
  amount: number;
  reference?: string;
  createdAt: string;
}

export interface POSDashboard {
  today: {
    revenue: number;
    transactions: number;
    averageBasket: number;
  };
  openSessions: CashSession[];
  topProducts: {
    product: {
      id: string;
      name: string;
      sku?: string;
      imageUrl?: string;
    };
    quantitySold: number;
    revenue: number;
  }[];
}

// DTOs pour les requêtes API

export interface CreateRegisterDto {
  name: string;
  code: string;
  location?: string;
  isActive?: boolean;
}

export interface OpenSessionDto {
  registerId: string;
  cashierId?: string;
  openingAmount: number;
}

export interface CloseSessionDto {
  closingAmount: number;
  notes?: string;
}

export interface SaleItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
}

export interface SalePaymentDto {
  method: 'CASH' | 'CARD' | 'MOBILE_MONEY';
  amount: number;
  reference?: string;
}

export interface CreateSaleDto {
  registerId: string;
  sessionId: string;
  cashierId: string;
  customerId?: string;
  items: SaleItemDto[];
  discountPercent?: number;
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY' | 'MIXED';
  amountPaid: number;
  payments?: SalePaymentDto[];
  notes?: string;
}

// Types pour l'interface de caisse

export interface CartItem {
  productId: string;
  productName: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  imageUrl?: string;
  stockAvailable: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
}
