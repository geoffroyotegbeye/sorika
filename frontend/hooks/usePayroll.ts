import { useState, useEffect, useCallback } from 'react';
import {
  PayrollPeriod,
  PayrollEntry,
  PayrollVariable,
  CreatePayrollPeriodDto,
  CreatePayrollVariableDto,
  UpdatePayrollVariableDto,
} from '@/types/hr';

export function usePayroll(companySlug: string) {
  const [companyUuid, setCompanyUuid] = useState<string>('');
  const [payrollPeriods, setPayrollPeriods] = useState<any[]>([]);
  const [payrollVariables, setPayrollVariables] = useState<any[]>([]);
  const [payrollEntries, setPayrollEntries] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer l'UUID de l'entreprise à partir du slug
  const fetchCompanyUuid = useCallback(async () => {
    if (!companySlug) return;
    
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/slug/${companySlug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          setCompanyUuid(data.id);
        }
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'UUID de l\'entreprise', err);
    }
  }, [companySlug]);

  const fetchPayrollPeriods = useCallback(async () => {
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-periods`, {
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
  }, [companyUuid]);

  const fetchPayrollVariables = useCallback(async () => {
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-variables`, {
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
  }, [companyUuid]);

  const fetchPayrollEntries = useCallback(async (periodId?: string) => {
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const url = periodId 
        ? `http://localhost:3001/companies/${companyUuid}/hr/payroll-entries?periodId=${periodId}`
        : `http://localhost:3001/companies/${companyUuid}/hr/payroll-entries`;

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
  }, [companyUuid]);

  const fetchEmployees = useCallback(async () => {
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-calculate`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-user-id': parsed.user.id,
        },
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des employés');
      const data = await response.json();
      setEmployees(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [companyUuid]);

  const createPayrollPeriod = async (dto: CreatePayrollPeriodDto) => {
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-periods`, {
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
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-periods/${id}`, {
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
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-periods/${id}`, {
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
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-variables`, {
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
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-variables/${id}`, {
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
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-variables/${id}`, {
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
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-periods/${periodId}/calculate`, {
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
    if (!companyUuid) return;
    
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const parsed = JSON.parse(userData);

      const response = await fetch(`http://localhost:3001/companies/${companyUuid}/hr/payroll-periods/${periodId}/validate`, {
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
    fetchCompanyUuid();
  }, [companySlug]);

  useEffect(() => {
    if (companyUuid) {
      fetchPayrollPeriods();
      fetchPayrollVariables();
      fetchEmployees();
    }
  }, [companyUuid]);

  return {
    payrollPeriods,
    payrollEntries,
    payrollVariables,
    employees,
    loading,
    error,
    fetchPayrollPeriods,
    fetchPayrollEntries,
    fetchPayrollVariables,
    fetchEmployees,
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
