import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type {
  CashRegister,
  CashSession,
  Sale,
  POSDashboard,
  CreateRegisterDto,
  OpenSessionDto,
  CloseSessionDto,
  CreateSaleDto,
} from '@/types/pos';

const BASE = (companyId: string) => `/companies/${companyId}/pos`;

export function usePOS(companyId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Une erreur est survenue';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CAISSES (Cash Registers)
  // ============================================

  const getRegisters = useCallback(async () => {
    return wrap(() => api.get<CashRegister[]>(`${BASE(companyId)}/registers`));
  }, [companyId]);

  const getRegister = useCallback(async (id: string) => {
    return wrap(() => api.get<CashRegister>(`${BASE(companyId)}/registers/${id}`));
  }, [companyId]);

  const createRegister = useCallback(async (data: CreateRegisterDto) => {
    return wrap(() => api.post<CashRegister>(`${BASE(companyId)}/registers`, data));
  }, [companyId]);

  const updateRegister = useCallback(async (id: string, data: Partial<CreateRegisterDto>) => {
    return wrap(() => api.patch<CashRegister>(`${BASE(companyId)}/registers/${id}`, data));
  }, [companyId]);

  const deleteRegister = useCallback(async (id: string) => {
    return wrap(() => api.del(`${BASE(companyId)}/registers/${id}`));
  }, [companyId]);

  // ============================================
  // SESSIONS DE CAISSE
  // ============================================

  const getSessions = useCallback(async () => {
    return wrap(() => api.get<CashSession[]>(`${BASE(companyId)}/sessions`));
  }, [companyId]);

  const getSession = useCallback(async (id: string) => {
    return wrap(() => api.get<CashSession>(`${BASE(companyId)}/sessions/${id}`));
  }, [companyId]);

  const getCurrentSession = useCallback(async (registerId: string) => {
    return wrap(() => api.get<CashSession | null>(`${BASE(companyId)}/sessions/current?registerId=${registerId}`));
  }, [companyId]);

  const openSession = useCallback(async (data: OpenSessionDto) => {
    return wrap(() => api.post<CashSession>(`${BASE(companyId)}/sessions/open`, data));
  }, [companyId]);

  const closeSession = useCallback(async (sessionId: string, data: CloseSessionDto) => {
    return wrap(() => api.post<CashSession>(`${BASE(companyId)}/sessions/${sessionId}/close`, data));
  }, [companyId]);

  // ============================================
  // VENTES
  // ============================================

  const getSales = useCallback(async (filters?: {
    registerId?: string;
    sessionId?: string;
    cashierId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString();
    return wrap(() => api.get<Sale[]>(`${BASE(companyId)}/sales${query ? `?${query}` : ''}`));
  }, [companyId]);

  const getSale = useCallback(async (id: string) => {
    return wrap(() => api.get<Sale>(`${BASE(companyId)}/sales/${id}`));
  }, [companyId]);

  const createSale = useCallback(async (data: CreateSaleDto) => {
    return wrap(() => api.post<Sale>(`${BASE(companyId)}/sales`, data));
  }, [companyId]);

  // ============================================
  // RAPPORTS
  // ============================================

  const getDashboard = useCallback(async () => {
    return wrap(() => api.get<POSDashboard>(`${BASE(companyId)}/reports/dashboard`));
  }, [companyId]);

  return {
    loading,
    error,
    // Caisses
    getRegisters,
    getRegister,
    createRegister,
    updateRegister,
    deleteRegister,
    // Sessions
    getSessions,
    getSession,
    getCurrentSession,
    openSession,
    closeSession,
    // Ventes
    getSales,
    getSale,
    createSale,
    // Rapports
    getDashboard,
  };
}
