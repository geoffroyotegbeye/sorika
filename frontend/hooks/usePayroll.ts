import { useState, useEffect, useCallback } from 'react';
import {
  PayrollPeriod,
  PayrollEntry,
  PayrollVariable,
  CreatePayrollPeriodDto,
  CreatePayrollVariableDto,
  UpdatePayrollVariableDto,
} from '@/types/hr';

export function usePayroll(companyId: string) {
  const [payrollPeriods, setPayrollPeriods] = useState<any[]>([]);
  const [payrollVariables, setPayrollVariables] = useState<any[]>([]);
  const [payrollEntries, setPayrollEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayrollPeriods = useCallback(async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-periods`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des périodes de paie');
      const data = await response.json();
      setPayrollPeriods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const fetchPayrollVariables = useCallback(async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-variables`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des variables de paie');
      const data = await response.json();
      setPayrollVariables(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const fetchPayrollEntries = useCallback(async (periodId?: string) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const url = periodId 
        ? `http://localhost:3001/companies/${companyId}/hr/payroll-entries?periodId=${periodId}`
        : `http://localhost:3001/companies/${companyId}/hr/payroll-entries`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des entrées de paie');
      const data = await response.json();
      setPayrollEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const createPayrollPeriod = async (dto: CreatePayrollPeriodDto) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-periods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      await fetchPayrollPeriods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updatePayrollPeriod = async (id: string, dto: Partial<CreatePayrollPeriodDto>) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-periods/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      await fetchPayrollPeriods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const deletePayrollPeriod = async (id: string) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-periods/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      await fetchPayrollPeriods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const createPayrollVariable = async (dto: CreatePayrollVariableDto) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-variables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      await fetchPayrollVariables();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updatePayrollVariable = async (id: string, dto: UpdatePayrollVariableDto) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-variables/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
        body: JSON.stringify(dto),
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      await fetchPayrollVariables();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const deletePayrollVariable = async (id: string) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-variables/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      await fetchPayrollVariables();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const calculatePayroll = async (periodId: string) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-periods/${periodId}/calculate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      if (!response.ok) throw new Error('Erreur lors du calcul');
      await fetchPayrollPeriods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const validatePayroll = async (periodId: string) => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyId}/hr/payroll-periods/${periodId}/validate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      if (!response.ok) throw new Error('Erreur lors de la validation');
      await fetchPayrollPeriods();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollPeriods();
    fetchPayrollVariables();
  }, [companyId]);

  return {
    payrollPeriods,
    payrollEntries,
    payrollVariables,
    loading,
    error,
    fetchPayrollPeriods,
    fetchPayrollEntries,
    fetchPayrollVariables,
    createPayrollPeriod,
    updatePayrollPeriod,
    deletePayrollPeriod,
    calculatePayroll,
    validatePayroll,
    createPayrollVariable,
    updatePayrollVariable,
    deletePayrollVariable,
  };
}
