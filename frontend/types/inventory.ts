// ============================================
// TYPES INVENTAIRE
// ============================================

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  parent?: ProductCategory;
  children?: ProductCategory[];
  products?: InventoryProduct[];
  _count?: {
    products: number;
  };
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryProduct {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  description?: string;
  categoryId?: string;
  category?: ProductCategory;
  salePrice: number;
  costPrice?: number;
  currency: string;
  stockQuantity: number;
  minStock?: number;
  maxStock?: number;
  unit: string;
  imageUrl?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  isActive: boolean;
  isSellable: boolean;
  isPurchasable: boolean;
  isAvailableOnline: boolean;
  ecommerceDescription?: string;
  ecommerceImages?: any;
  packagingInfo?: string;
  companyId: string;
  createdById: string | null;
  updatedById: string | null;
  movements?: StockMovement[];
  stockAlerts?: StockAlert[];
  _count?: {
    movements: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface StockMovement {
  id: string;
  type: MovementType;
  quantity: number;
  reason?: string;
  reference?: string;
  notes?: string;
  productId: string;
  product?: {
    name: string;
    sku?: string;
    unit: string;
  };
  stockBefore: number;
  stockAfter: number;
  unitCost?: number;
  totalCost?: number;
  createdById?: string;
  companyId: string;
  createdAt: string;
}

export type AlertType = 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK';

export interface StockAlert {
  id: string;
  type: AlertType;
  message: string;
  isResolved: boolean;
  resolvedAt?: string;
  productId: string;
  product?: {
    name: string;
    sku?: string;
    stockQuantity: number;
    minStock?: number;
  };
  companyId: string;
  createdAt: string;
}

export interface InventoryStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockValue: {
    costValue: number;
    saleValue: number;
  };
  categories: number;
  recentMovements: StockMovement[];
}

// DTOs
export interface CreateProductDto {
  name: string;
  sku?: string;
  barcode?: string;
  description?: string;
  categoryId?: string;
  salePrice: number;
  costPrice?: number;
  stockQuantity?: number;
  minStock?: number;
  maxStock?: number;
  unit?: string;
  imageUrl?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  isActive?: boolean;
  isSellable?: boolean;
  isPurchasable?: boolean;
  isAvailableOnline?: boolean;
  ecommerceDescription?: string;
  ecommerceImages?: any;
  packagingInfo?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CreateStockMovementDto {
  type: MovementType;
  quantity: number;
  reason?: string;
  reference?: string;
  notes?: string;
  unitCost?: number;
}
