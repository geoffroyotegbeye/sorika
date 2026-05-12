'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type {
  InventoryProduct,
  ProductCategory,
  StockMovement,
  StockAlert,
  InventoryStats,
  CreateProductDto,
  UpdateProductDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateStockMovementDto,
} from '@/types/inventory';

const BASE = (companyId: string) => `/companies/${companyId}/inventory`;

export function useInventory(companyId: string) {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err: any) {
      setError(err.message || 'Erreur');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Stats ────────────────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    const data = await wrap(() => api.get<InventoryStats>(`${BASE(companyId)}/stats`));
    setStats(data);
  }, [companyId, wrap]);

  // ─── Catégories ───────────────────────────────────────────────────────────────

  const fetchCategories = useCallback(async () => {
    const data = await wrap(() => api.get<ProductCategory[]>(`${BASE(companyId)}/categories`));
    setCategories(data);
  }, [companyId, wrap]);

  const createCategory = useCallback(async (dto: CreateCategoryDto) => {
    await wrap(() => api.post(`${BASE(companyId)}/categories`, dto));
    await fetchCategories();
  }, [companyId, wrap, fetchCategories]);

  const updateCategory = useCallback(async (id: string, dto: UpdateCategoryDto) => {
    await wrap(() => api.patch(`${BASE(companyId)}/categories/${id}`, dto));
    await fetchCategories();
  }, [companyId, wrap, fetchCategories]);

  const deleteCategory = useCallback(async (id: string) => {
    await wrap(() => api.del(`${BASE(companyId)}/categories/${id}`));
    await fetchCategories();
  }, [companyId, wrap, fetchCategories]);

  // ─── Produits ─────────────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async (filters?: {
    categoryId?: string;
    isActive?: boolean;
    search?: string;
    lowStock?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.lowStock) params.append('lowStock', 'true');
    const qs = params.toString();
    const data = await wrap(() => api.get<InventoryProduct[]>(`${BASE(companyId)}/products${qs ? `?${qs}` : ''}`));
    setProducts(data);
  }, [companyId, wrap]);

  const getProduct = useCallback(async (id: string) => {
    return await wrap(() => api.get<InventoryProduct>(`${BASE(companyId)}/products/${id}`));
  }, [companyId, wrap]);

  const createProduct = useCallback(async (dto: CreateProductDto) => {
    const data = await wrap(() => api.post<InventoryProduct>(`${BASE(companyId)}/products`, dto));
    await fetchProducts();
    return data;
  }, [companyId, wrap, fetchProducts]);

  const updateProduct = useCallback(async (id: string, dto: UpdateProductDto) => {
    await wrap(() => api.patch(`${BASE(companyId)}/products/${id}`, dto));
    await fetchProducts();
  }, [companyId, wrap, fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    await wrap(() => api.del(`${BASE(companyId)}/products/${id}`));
    await fetchProducts();
  }, [companyId, wrap, fetchProducts]);

  // ─── Mouvements ───────────────────────────────────────────────────────────────

  const fetchMovements = useCallback(async (filters?: {
    productId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.productId) params.append('productId', filters.productId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    const qs = params.toString();
    const data = await wrap(() => api.get<StockMovement[]>(`${BASE(companyId)}/movements${qs ? `?${qs}` : ''}`));
    setMovements(data);
  }, [companyId, wrap]);

  const createMovement = useCallback(async (productId: string, dto: CreateStockMovementDto) => {
    await wrap(() => api.post(`${BASE(companyId)}/products/${productId}/movements`, dto));
    await fetchMovements();
    await fetchProducts();
  }, [companyId, wrap, fetchMovements, fetchProducts]);

  // ─── Alertes ──────────────────────────────────────────────────────────────────

  const fetchAlerts = useCallback(async (filters?: { isResolved?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.isResolved !== undefined) params.append('isResolved', String(filters.isResolved));
    const qs = params.toString();
    const data = await wrap(() => api.get<StockAlert[]>(`${BASE(companyId)}/alerts${qs ? `?${qs}` : ''}`));
    setAlerts(data);
  }, [companyId, wrap]);

  const resolveAlert = useCallback(async (id: string) => {
    await wrap(() => api.patch(`${BASE(companyId)}/alerts/${id}/resolve`, {}));
    await fetchAlerts();
  }, [companyId, wrap, fetchAlerts]);

  return {
    // State
    products,
    categories,
    movements,
    alerts,
    stats,
    loading,
    error,
    // Stats
    fetchStats,
    // Categories
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    // Products
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    // Movements
    fetchMovements,
    createMovement,
    // Alerts
    fetchAlerts,
    resolveAlert,
  };
}
