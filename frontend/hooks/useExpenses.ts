'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Expense, CreateExpenseDto, UpdateExpenseStatusDto } from '@/types/hr-extended';

interface UseExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

export function useExpenses(companyId: string) {
  const [state, setState] = useState<UseExpensesState>({
    expenses: [],
    loading: false,
    error: null,
  });

  const fetchExpenses = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.get<Expense[]>(`/companies/${companyId}/hr/expenses`);
      setState({ expenses: data, loading: false, error: null });
    } catch (err: any) {
      setState((prev) => ({ ...prev, loading: false, error: err.message || 'Erreur lors du chargement' }));
    }
  }, [companyId]);

  const createExpense = useCallback(async (employeeId: string, dto: CreateExpenseDto) => {
    await api.post(`/companies/${companyId}/hr/employees/${employeeId}/expenses`, dto);
    await fetchExpenses();
  }, [companyId, fetchExpenses]);

  const updateExpenseStatus = useCallback(async (expenseId: string, dto: UpdateExpenseStatusDto) => {
    await api.patch(`/companies/${companyId}/hr/expenses/${expenseId}/status`, dto);
    await fetchExpenses();
  }, [companyId, fetchExpenses]);

  const deleteExpense = useCallback(async (expenseId: string) => {
    await api.del(`/companies/${companyId}/hr/expenses/${expenseId}`);
    await fetchExpenses();
  }, [companyId, fetchExpenses]);

  return {
    ...state,
    fetchExpenses,
    createExpense,
    updateExpenseStatus,
    deleteExpense,
  };
}
