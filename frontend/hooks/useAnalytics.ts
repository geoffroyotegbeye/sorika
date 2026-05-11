import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface DashboardData {
  period: string;
  sales: {
    total: number;
    count: number;
  };
  invoices: {
    total: number;
    paid: number;
    count: number;
  };
  crm: {
    contacts: number;
    opportunities: number;
    opportunitiesValue: number;
    opportunitiesWon: number;
  };
  inventory: {
    products: number;
    lowStockProducts: number;
  };
  hr: {
    employees: number;
  };
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  count: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export function useAnalytics(companyId: string) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrend[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = useCallback(
    async (period: string = 'month') => {
      setLoading(true);
      try {
        const data = await api.get<DashboardData>(
          `/companies/${companyId}/analytics/dashboard?period=${period}`,
        );
        setDashboard(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    },
    [companyId],
  );

  const fetchRevenueTrend = useCallback(
    async (period: string = 'month') => {
      try {
        const data = await api.get<RevenueTrend[]>(
          `/companies/${companyId}/analytics/revenue-trend?period=${period}`,
        );
        setRevenueTrend(data);
      } catch (error) {
        console.error('Error fetching revenue trend:', error);
      }
    },
    [companyId],
  );

  const fetchTopProducts = useCallback(
    async (limit: number = 10) => {
      try {
        const data = await api.get<TopProduct[]>(
          `/companies/${companyId}/analytics/top-products?limit=${limit}`,
        );
        setTopProducts(data);
      } catch (error) {
        console.error('Error fetching top products:', error);
      }
    },
    [companyId],
  );

  return {
    dashboard,
    revenueTrend,
    topProducts,
    loading,
    fetchDashboard,
    fetchRevenueTrend,
    fetchTopProducts,
  };
}
